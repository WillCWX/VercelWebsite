"use client";

import { Card } from "@/components/Card";
import { Navbar } from "@/components/custom-ui/Navbar";

export default function HomePage() {
  return (
    <div className="flex flex-col w-screen items-center justify-center">
      <p className="md:text-4xl text-3xl p-5">WilliamCWX</p>
      <Navbar />
      <br />
      <GameFrame />
    </div>
  );
}

function GameFrame() {
  return (
    <>
      <script src="/coi-serviceworker.js" async />
      <Card
        title={"Bullet Hell made in Godot"}
        Left={() => (
          <iframe
            title="Bullet Hell"
            src="/games/bullet-hell/Bullet Hell.html"
            width={240}
            height={360}
          />
        )}
        Right={() => (
          <>
            <p>My first godot game made in two days.</p>
            <p>Background music and art drawn by me.</p>
            <p>Font and gameover music by godot 2D tutorial asset pack.</p>
          </>
        )}
      />
    </>
  );
}
