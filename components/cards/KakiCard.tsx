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
          width={300}
          height={300}
          className="h-full w-full object-cover dark:backdrop-brightness-200 dark:grayscale"
        />
      )}
      Description={"Social Site to organize and display gatherings and events"}
      Note={"Made as a two man team effort for NUS Orbital"}
    />
  );
}
