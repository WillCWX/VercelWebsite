import { BulletCard } from "@/components/cards/BulletCard";
import { KakiCard } from "@/components/cards/KakiCard";
import { Chessboard } from "@/components/chess-components/chess-board/Chessboard";
import { Navbar } from "@/components/custom-ui/Navbar";

export default function ChessPage() {
  return (
    <div className="flex flex-col md:flex-row">
      <Chessboard />
    </div>
  );
}
