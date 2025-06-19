"use client";

import { useEffect, useRef, useState } from "react";
import { useChess } from "../chess-hook/ChessContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const orderedList = (moveHistory: string[]) => {
  const moveset = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    moveset.push(
      <li key={i + moveHistory[i]} className="grid grid-cols-2 ">
        <div>
          {i / 2 + 1}. {moveHistory[i]}
        </div>

        {i + 1 < moveHistory.length && (
          <div className="pl-2">{moveHistory[i + 1]}</div>
        )}
      </li>,
    );
  }
  return moveset;
};

export function MoveViewer() {
  const myChess = useChess();
  const listRef = useRef(null as unknown as HTMLOListElement);
  const [movesHistory, setMoveHistory] = useState([] as string[]);

  useEffect(() => {
    setMoveHistory(myChess.chess.history());
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [myChess]);

  return (
    <ScrollArea
      type="always"
      className="w-[62px] h-[128px] text-[4px] ml-[2px]
          md:text-sm md:w-[195px] md:h-[400px] md:ml-[5px]
          bg-card text-card-foreground rounded-sm border shadow-sm"
    >
      <ol
        ref={listRef}
        className="flex flex-col 
          items-right p-1 md:p-3 
          "
      >
        {orderedList(movesHistory)}
      </ol>
    </ScrollArea>
  );
}
