import React from "react";
import { MyCard } from "../custom-ui/MyCard";
import Image from "next/image";
import Link from "next/link";
export function BulletCard() {
  return (
    <Link href="/bullet-hell">
      <MyCard
        title={"Bullet Hell made in Godot"}
        Item={() => (
          <Image
            fill
            src="/Game.PNG"
            alt="A bullet hell game"
            className="object-contain"
            sizes="(min-width: 1024px) 480px, (min-width: 768px) 400px"
            priority
          />
        )}
        Description={"My first godot game made in two days"}
        Note={"Font and gameover music by godot 2D tutorial asset pack"}
      />
    </Link>
  );
}
