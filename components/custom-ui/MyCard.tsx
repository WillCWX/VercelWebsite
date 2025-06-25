import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

type CardProps = {
  title: String;
  Item: React.FunctionComponent;
  Description: String;
  Note: String;
};

export function MyCard({ title, Item, Description, Note }: CardProps) {
  return (
    <Card className="md:size-[480px]">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
        <CardDescription className="text-sm"> {Note} </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-center w-full h-[300px] relative">
        <Item />
      </CardContent>
      <CardFooter className="justify-center text-sm md:text-xl mt-2">
        {Description}
      </CardFooter>
    </Card>
  );
}
