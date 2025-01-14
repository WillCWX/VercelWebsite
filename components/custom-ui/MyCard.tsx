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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription> {Note} </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-center">
        <Item />
      </CardContent>
      <CardFooter className="justify-center">{Description}</CardFooter>
    </Card>
  );
}
