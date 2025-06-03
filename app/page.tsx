"use client";

import { Navbar } from "@/components/custom-ui/Navbar";
import React from "react";
import { BulletCard } from "@/components/cards/BulletCard";
import { KakiCard } from "@/components/cards/KakiCard";
import { ChessCard } from "@/components/cards/ChessCard";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row">
      <BulletCard />
      <KakiCard />
      <ChessCard />
    </div>
  );
}
