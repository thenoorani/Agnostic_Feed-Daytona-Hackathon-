import { Feed } from "@/components/Feed";
import { PunctuationMark } from "@/components/PunctuationMark";
import { TopPanels } from "@/components/TopPanels";
import { Wordmark } from "@/components/Wordmark";

export default function Home() {
  return (
    <main className="page grid-12 grid-rows flex-1">
      <PunctuationMark />
      <Wordmark />
      <TopPanels />
      <Feed />
    </main>
  );
}
