"use client";

import { useCallback, useState } from "react";
import { useChesterLog } from "../chess-hook/ChesterLogContext";
import { useChess } from "../chess-hook/ChessContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  }, [chesterLog, myChess.chess]);

  return (
    <ScrollArea
      className="w-[256px] h-max-[64px] text-[4px] 
    md:w-[800px] md:max-h-[120px] md:text-sm
    overflow-y-auto text-left m-1 md:m-2 p-2
    font-mono bg-card text-card-foreground rounded-sm border shadow-sm"
      type="always"
    >
      <DisplayLog />
    </ScrollArea>
  );
}
