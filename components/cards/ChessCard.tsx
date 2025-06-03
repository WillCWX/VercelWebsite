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
            width={220}
            height={220}
            className="object-cover"
            unoptimized={true}
          />
        )}
        Description={"Chess game against an AI opponent"}
        Note={"Made with cburnett chess set and Chess.js"}
      />
    </Link>
  );
}
