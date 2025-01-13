import React from "react";

type CardProps = {
  title: String;
  Left: React.FunctionComponent;
  Right: React.FunctionComponent;
};

export function Card({ title, Left, Right }: CardProps) {
  return (
    <div className="flex flex-col justify-center items-center rounded-lg border-2	p-5 border-double">
      <h1 className="text-center text-2xl md:text-3xl text pb-5"> {title} </h1>

      <div className="flex flex-col md:flex-row">
        {
          // eslint-disable-next-line
        }
        <div className="flex items-center justify-center">
          <Left />
        </div>
        <div className="text-justify flex md:pl-5 pt-5">
          <div className="self-center">
            <Right />
          </div>
        </div>
      </div>
    </div>
  );
}
