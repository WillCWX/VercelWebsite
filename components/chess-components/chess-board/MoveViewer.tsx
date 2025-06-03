"use client";

import { useEffect, useRef, useState } from "react";
import { useChess } from "../chess-hook/ChessContext";

const orderedList = (moveHistory: string[]) => {
  const moveset = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    moveset.push(
      <li key={i + moveHistory[i]} className="grid grid-cols-2">
        <div>
          {i / 2 + 1}. {moveHistory[i]}
        </div>
        {i + 1 < moveHistory.length && <div>{moveHistory[i + 1]}</div>}
      </li>,
    );
  }
  return moveset;
};

export function MoveViewer({ size }: { size: number }) {
  const myChess = useChess();
  const listRef = useRef(null as unknown as HTMLOListElement);
  const [movesHistory, setMoveHistory] = useState([] as string[]);

  useEffect(() => {
    setMoveHistory(myChess.chess.history());
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [myChess]);

  return (
    <ol
      ref={listRef}
      className="flex flex-col items-right p-4 min-w-3x overflow-y-auto"
      style={{ maxHeight: size * 8, minWidth: size * 4 }}
    >
      {orderedList(movesHistory)}
    </ol>
  );
}
