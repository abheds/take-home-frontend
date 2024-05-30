import React, { HTMLAttributes } from "react";
import { classes } from "../utils";

export function Button({
  onClick,
  children,
  ...rest
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={classes(
        "p-[10px] bg-white text-black rounded-xl",
        rest.className
      )}>
      {children}
    </button>
  );
}
