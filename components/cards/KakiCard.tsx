import React from "react";
import { MyCard } from "../custom-ui/MyCard";
import Image from "next/image";

export function KakiCard() {
  return (
    <MyCard
      title={"MERN Social site"}
      Item={() => (
        <Image
          src="/Kakilang.png"
          alt="Kakilang"
          fill
          sizes="(min-width: 1024px) 480px, (min-width: 768px) 400px"
          className="h-full w-full object-contain dark:backdrop-brightness-200 dark:grayscale"
          priority
        />
      )}
      Description={"Social Site to organize and display gatherings and events"}
      Note={"Made as a two man team effort for NUS Orbital"}
    />
  );
}
