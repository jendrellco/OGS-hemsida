import type { Metadata } from "next";
import scheduleData from "../../content/schedule.json";
import LiveCountdown from "./LiveCountdown";

export const metadata: Metadata = {
  title: "Live - Open Global Sports",
  description: "Watch the FIS Roller Ski World Cup live from Trollhättan on Open Global Sports.",
};

export default function LivePage() {
  return (
    <LiveCountdown
      events={scheduleData.events}
      channelUrl={scheduleData.channelUrl}
    />
  );
}
