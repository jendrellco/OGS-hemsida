"use client";

import { useEffect, useMemo, useState } from "react";
import BoxCastPlayer from "./BoxCastPlayer";

type LiveEvent = {
  id: string;
  start: string;
  end: string;
  subtitle: string;
};

type LiveCountdownProps = {
  events: LiveEvent[];
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Stockholm",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Stockholm",
    timeZoneName: "short",
  }).format(new Date(value));
}

export default function LiveCountdown({ events }: LiveCountdownProps) {
  const [now, setNow] = useState<number | null>(null);
  const orderedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()),
    [events],
  );

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const currentEvent = now === null ? null : orderedEvents.find(
    (event) => now >= new Date(event.start).getTime() && now <= new Date(event.end).getTime(),
  );
  const nextEvent = now === null ? orderedEvents[0] : orderedEvents.find(
    (event) => new Date(event.start).getTime() > now,
  );
  const event = currentEvent ?? nextEvent ?? orderedEvents[orderedEvents.length - 1];
  const isLive = Boolean(currentEvent);
  const hasEnded = now !== null && !currentEvent && !nextEvent;
  const startTime = event ? new Date(event.start).getTime() : 0;
  const timeLeft = now === null || !event ? emptyTime : getTimeLeft(startTime, now);

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
        </nav>
      </header>

      <section className="live-stage" aria-live="polite">
        <div className="live-stage-copy">
          <p className="live-status"><i aria-hidden="true" />{isLive ? "Live now" : hasEnded ? "Broadcast complete" : "Next broadcast"}</p>
          <p className="live-discipline">FIS Roller Ski World Cup</p>

          {isLive ? (
            <>
              <h1>The race is<br /><span>live now.</span></h1>
              <p className="live-summary">{event.subtitle} · Live from Trollhättan</p>
            </>
          ) : hasEnded ? (
            <>
              <h1>Thanks for<br /><span>watching.</span></h1>
              <p className="live-summary">New broadcasts will appear here when they are scheduled.</p>
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
              <p className="live-summary"><strong>{event.subtitle}</strong><br />{formatDate(event.start)} · {formatTime(event.start)} · Trollhättan</p>
            </>
          )}

          <BoxCastPlayer />
        </div>
      </section>

      <footer className="live-footer">
        <p>International sport, open to everyone.</p>
        <p>© 2026 Open Global Sports</p>
      </footer>
    </main>
  );
}
