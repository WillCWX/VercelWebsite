import { Chessboard } from "@/components/chess-components/chess-board/Chessboard";

export default function ChessPage() {
  return (
    <div className="flex flex-col md:flex-row">
      <Chessboard />
    </div>
  );
}
