import React from "react";
import { MyCard } from "../custom-ui/MyCard";
import Image from "next/image";
import Link from "next/link";

export function ChessCard() {
  return (
    <Link href="/chess">
      <MyCard
        title={"Chess & AI"}
        Item={() => (
          <Image
            src="/chess-card.gif"
            alt="Chess board"
            fill
            sizes="(min-width: 1024px) 480px, (min-width: 768px) 400px"
            className="object-contain"
            unoptimized={true}
            priority
          />
        )}
        Description={"Chess game against an AI opponent"}
        Note={"Made with cburnett chess set and Chess.js"}
      />
    </Link>
  );
}
