import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Live - Open Global Sports",
  description: "Watch Open Global Sports broadcasts on YouTube.",
};

export default function LivePage() {
  redirect("https://www.youtube.com/@OpenGlobalSports");
}
