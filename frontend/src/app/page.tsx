import { Feed } from "@/components/Feed";
import { ListView } from "@/components/ListView";
import { PunctuationMark } from "@/components/PunctuationMark";

export default function Home() {
  return (
    <main className="page grid-12 grid-rows flex-1">
      <PunctuationMark />
      <h1 className="wordmark">Agnostic</h1>
      <ListView />
      <Feed />
    </main>
  );
}
