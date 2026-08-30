import { Feed } from "@/components/Feed";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <main className="page grid-12 grid-rows flex-1">
      <Header />
      <Feed />
    </main>
  );
}
