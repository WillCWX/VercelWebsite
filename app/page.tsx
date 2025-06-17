import { BulletCard } from "@/components/cards/BulletCard";
import { KakiCard } from "@/components/cards/KakiCard";
import { ChessCard } from "@/components/cards/ChessCard";

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row">
      <BulletCard />
      <KakiCard />
      <ChessCard />
    </div>
  );
}
