"use client";

import { Navbar } from "@/components/custom-ui/Navbar";

export default function HomePage() {
  return (
    <div className="flex flex-col w-screen items-center justify-center">
      <p className="text-[5vw]">WilliamCWX</p>
      <Navbar />
      <br />
      <GameFrame />
    </div>
  );
}

function GameFrame() {
  return (
    <div className="flex flex-col justify-center items-center">
      <script src="/coi-serviceworker.js" async />
      <p className="text-center"> Bullet Hell made in Godot </p>
      {
        // eslint-disable-next-line
      }
      <iframe
        title="Bullet Hell"
        src="/games/bullet-hell/Bullet Hell.html"
        width={240}
        height={360}
      />
      <br />
      <div className="text-justify">
        <p> My first godot game made in two days.</p>
        <p> Background music and art drawn by me (badly).</p>
        <p> Font and gameover music by godot 2D tutorial asset pack.</p>
        <p> Some frame skips occurs on website so bugs may occur :P</p>
      </div>
    </div>
  );
}
