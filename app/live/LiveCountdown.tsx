"use client";

import { useEffect, useMemo, useState } from "react";

type LiveCountdownProps = {
  start: string;
  end: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  channelUrl: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const emptyTime: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getTimeLeft(start: number, now: number): TimeLeft {
  const totalSeconds = Math.max(0, Math.floor((start - now) / 1000));

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function LiveCountdown({
  start,
  end,
  title,
  dateLabel,
  timeLabel,
  channelUrl,
}: LiveCountdownProps) {
  const [now, setNow] = useState<number | null>(null);
  const startTime = useMemo(() => new Date(start).getTime(), [start]);
  const endTime = useMemo(() => new Date(end).getTime(), [end]);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const isLive = now !== null && now >= startTime && now <= endTime;
  const hasEnded = now !== null && now > endTime;
  const timeLeft = now === null ? emptyTime : getTimeLeft(startTime, now);

  return (
    <main className={`live-page${isLive ? " is-live" : ""}`}>
      <div className="live-signal-rings" aria-hidden="true" />

      <header className="live-header">
        <a href="/" aria-label="Open Global Sports home">
          <img src="/brand/ogs-wordmark-cream.png" alt="Open Global Sports" />
        </a>
        <nav aria-label="Live page navigation">
          <a href="/">Home</a>
          <a href="/#schedule">Schedule</a>
          <a href={channelUrl} target="_blank" rel="noopener noreferrer">
            YouTube <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="live-stage" aria-live="polite">
        <div className="live-stage-copy">
          <p className="live-status"><i aria-hidden="true" />{isLive ? "Live now" : hasEnded ? "Broadcast complete" : "Next broadcast"}</p>
          <p className="live-discipline">FIS Roller Ski World Cup</p>

          {isLive ? (
            <>
              <h1>The race is<br /><span>live now.</span></h1>
              <p className="live-summary">{title} · Live from Trollhättan</p>
              <div className="player-placeholder">
                <p>The live player will appear here.</p>
                <a href={channelUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube <span aria-hidden="true">↗</span></a>
              </div>
            </>
          ) : hasEnded ? (
            <>
              <h1>Thanks for<br /><span>watching.</span></h1>
              <p className="live-summary">Find the latest broadcasts on Open Global Sports.</p>
              <a className="live-channel-link" href={channelUrl} target="_blank" rel="noopener noreferrer">Visit our YouTube channel <span aria-hidden="true">↗</span></a>
            </>
          ) : (
            <>
              <h1>Live in</h1>
              <div className="countdown" role="timer" aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes and ${timeLeft.seconds} seconds until the broadcast`}>
                {([
                  [timeLeft.days, "Days"],
                  [timeLeft.hours, "Hours"],
                  [timeLeft.minutes, "Minutes"],
                  [timeLeft.seconds, "Seconds"],
                ] as const).map(([value, label]) => (
                  <div className="countdown-unit" key={label}>
                    <strong>{String(value).padStart(2, "0")}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <p className="live-summary"><strong>{title}</strong><br />{dateLabel} · {timeLabel} · Trollhättan</p>
            </>
          )}
        </div>
      </section>

      <footer className="live-footer">
        <p>International sport, open to everyone.</p>
        <p>© 2026 Open Global Sports</p>
      </footer>
    </main>
  );
}
