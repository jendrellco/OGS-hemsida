"use client";

import { useEffect, useMemo, useState } from "react";
import scheduleData from "../content/schedule.json";

type Mode = "live" | "upcoming" | "offline";
type Event = { id: string; title: string; subtitle: string; start: string; end: string; timeLabel?: string; youtubeUrl: string };

const events = [...scheduleData.events].sort(
  (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
) as Event[];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { month: "long", day: "numeric", timeZone: "Europe/Stockholm" }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Stockholm", timeZoneName: "short" }).format(new Date(value));
}

function eventTime(event: Event) {
  return event.timeLabel ?? formatTime(event.start);
}

export default function Home() {
  const [now, setNow] = useState(0);
  const [previewMode, setPreviewMode] = useState<Mode | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(Date.now());
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    const preview = new URLSearchParams(window.location.search).get("preview");
    if (preview === "live" || preview === "upcoming" || preview === "offline") setPreviewMode(preview);
    return () => window.clearInterval(timer);
  }, []);

  const view = useMemo(() => {
    const current = events.find((event) => now >= new Date(event.start).getTime() && now <= new Date(event.end).getTime());
    const next = events.find((event) => new Date(event.start).getTime() > now);
    const latest = [...events].reverse().find((event) => new Date(event.end).getTime() < now);
    const featured = events.find((event) => event.id === scheduleData.featuredEventId) ?? events[0];
    const requested = previewMode ?? scheduleData.statusOverride;

    let mode: Mode;
    if (requested === "live") mode = "live";
    else if (requested === "upcoming") mode = "upcoming";
    else if (requested === "offline") mode = "offline";
    else if (current) mode = "live";
    else if (next) mode = "upcoming";
    else mode = "offline";

    const event = mode === "live" ? current ?? featured : mode === "upcoming" ? next ?? featured : latest ?? featured;
    return { mode, event };
  }, [now, previewMode]);

  const { mode, event } = view;
  const actionUrl = event.youtubeUrl || scheduleData.channelUrl;
  const actionLabel = mode === "live" ? "Watch on YouTube" : mode === "upcoming" ? "View schedule" : "Watch on demand";

  return (
    <main className={`site state-${mode}`}>
      <section className="masthead">
        <div className="signal-rings" aria-hidden="true" />
        <header className="site-header">
          <a href="#top" aria-label="Open Global Sports home">
            <img className="wordmark" src="/brand/ogs-wordmark-cream.png" alt="Open Global Sports" />
          </a>
          <nav aria-label="Main navigation">
            <a href="#schedule">Schedule</a>
            <a href="#about">About</a>
            <a href={scheduleData.channelUrl} target="_blank" rel="noopener noreferrer">YouTube <span aria-hidden="true">↗</span></a>
          </nav>
        </header>

        <div className="hero" id="top" aria-live="polite">
          <div className="hero-copy">
            <p className="status"><i aria-hidden="true" />{mode === "live" ? "Live now" : mode === "upcoming" ? "Next broadcast" : "On demand"}</p>
            <p className="eyebrow">{event.title}</p>
            <h1 key={`${mode}-${event.id}`}>
              {mode === "live" && <>The world cup<br />is <span>live now.</span></>}
              {mode === "upcoming" && <>The next race<br />starts <span>{formatDate(event.start)}.</span></>}
              {mode === "offline" && <>Great sport<br />keeps <span>moving.</span></>}
            </h1>
            <p className="event-detail">{event.subtitle} · {formatDate(event.start)} · {eventTime(event)}</p>
            <a className="primary-action" href={actionUrl}><b>{actionLabel}</b><span className="play" aria-hidden="true">▶</span></a>
          </div>

          <aside className="event-card" aria-label="Featured broadcast">
            <p>{mode === "live" ? "On air" : mode === "upcoming" ? "First start" : "Latest event"}</p>
            <strong>{mode === "live" ? "LIVE" : formatDate(event.start)}</strong>
            <small>{mode === "offline" ? "Available on demand" : eventTime(event)}</small>
          </aside>
        </div>
      </section>

      <section className="schedule-section" id="schedule">
        <div className="section-intro">
          <p className="eyebrow">Broadcast schedule</p>
          <h2>Live schedule.<br /><span>Every start.</span></h2>
        </div>
        <div className="schedule-list">
          {events.map((item) => {
            const isLive = now >= new Date(item.start).getTime() && now <= new Date(item.end).getTime();
            return (
              <article className="schedule-item" key={item.id}>
                <time dateTime={item.start}>{formatDate(item.start)}</time>
                <div><h3>{item.subtitle}</h3><p>{eventTime(item)}</p></div>
                {item.youtubeUrl ? <a href={item.youtubeUrl}>{isLive ? "Watch live" : "Open on YouTube"} <span aria-hidden="true">↗</span></a> : <span className="link-pending">YouTube link coming soon</span>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="about-section" id="about">
        <p className="eyebrow">Open Global Sports</p>
        <p className="about-copy">International sport, open to everyone. Live and on demand on YouTube.</p>
        <p className="brand-line">All sport. <span>One place.</span></p>
      </section>

      <section className="partner-section" aria-labelledby="partner-heading">
        <div>
          <p className="eyebrow">Rights holders and partners</p>
          <h2 id="partner-heading">Want to team up<br />with <span>us?</span></h2>
        </div>
        <a href="mailto:info@openglobalsports.com">
          <span>Email us</span>
        </a>
      </section>

      <footer className="site-footer">
        <img src="/brand/ogs-wordmark-cream.png" alt="Open Global Sports" />
        <p>© 2026 Open Global Sports</p>
      </footer>
    </main>
  );
}
