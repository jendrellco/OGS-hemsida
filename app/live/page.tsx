import type { Metadata } from "next";
import scheduleData from "../../content/schedule.json";
import LiveCountdown from "./LiveCountdown";

export const metadata: Metadata = {
  title: "Live - Open Global Sports",
  description: "Watch the FIS Roller Ski World Cup live from Trollhättan on Open Global Sports.",
};

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

export default function LivePage() {
  const event = scheduleData.events.find((item) => item.id === scheduleData.featuredEventId) ?? scheduleData.events[0];

  return (
    <LiveCountdown
      start={event.start}
      end={event.end}
      title={event.subtitle}
      dateLabel={formatDate(event.start)}
      timeLabel={formatTime(event.start)}
      channelUrl={scheduleData.channelUrl}
    />
  );
}
