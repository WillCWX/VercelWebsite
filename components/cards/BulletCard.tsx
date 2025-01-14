import React from "react";
import { MyCard } from "../custom-ui/MyCard";

export function BulletCard() {
  return (
    <>
      <script src="/coi-serviceworker.js" async />
      <MyCard
        title={"Bullet Hell made in Godot"}
        Item={() => (
          <iframe
            title="Bullet Hell"
            src="/games/bullet-hell/Bullet Hell.html"
            width={240}
            height={240}
          />
        )}
        Description={"My first godot game made in two days"}
        Note={"Font and gameover music by godot 2D tutorial asset pack"}
      />
    </>
  );
}
