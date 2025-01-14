"use client";

import { Navbar } from "@/components/custom-ui/Navbar";
import React from "react";
import { BulletCard } from "@/components/cards/BulletCard";
import { KakiCard } from "@/components/cards/KakiCard";

export default function HomePage() {
  return (
    <div className="flex flex-col w-screen items-center justify-center">
      <p className="md:text-4xl text-3xl pt-5">WilliamCWX</p>
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <BulletCard />
        <KakiCard />
      </div>
    </div>
  );
}
