"use client";

import { useCallback, useState } from "react";
import { useChesterLog } from "../chess-hook/ChesterLogContext";
import { useChess } from "../chess-hook/ChessContext";
import { Skeleton } from "@/components/ui/skeleton";

export function ChesterReader() {
  const chesterLog = useChesterLog();
  const myChess = useChess();
  const DisplayLog = useCallback(() => {
    if (myChess.chess.turn() == "b") {
      return (
        <div className="space-y-2 pt-1 pb-1">
          <Skeleton className="h-2 md:h-4 w-[80px] md:w-[150px]" />
          <Skeleton className="h-2 md:h-4 w-[128px] md:w-[400px]" />
        </div>
      );
    } else {
      return (
        <>
          {chesterLog.map((log, i) => {
            return <p key={i}> {log} </p>;
          })}
        </>
      );
    }
  }, [chesterLog, myChess.chess.turn()]);

  return (
    <div
      className="w-[256px] h-max-[64px] text-[4px] 
    md:w-[800px] md:max-h-[120px] md:text-sm 
    overflow-y-auto text-left m-4 md:m-6 pt-1 pb-1 pl-3
    font-mono bg-card text-card-foreground rounded-xl border shadow-sm"
    >
      <DisplayLog />
    </div>
  );
}
