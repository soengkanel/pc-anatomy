import type { Metadata } from "next";
import { LeaderboardPage } from "@/components/live/LeaderboardPage";

export const metadata: Metadata = {
  title: "Leaderboard — IDIC",
  description: "Live student scores from IDIC chapter quizzes and live games.",
};

export default function Leaderboard() {
  return <LeaderboardPage />;
}
