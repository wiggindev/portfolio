"use client";

import React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type ActionName } from "analytics/constants";
import { useAction } from "analytics/useAction";

export interface Action {
  name: ActionName;
  [key: string]: unknown;
}

export const Action = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<Action>
>(({ children, ...props }, ref) => {
  const trigger = useAction(props);

  return (
    <Slot ref={ref} onClick={trigger}>
      {children}
    </Slot>
  );
});
Action.displayName = "Action";
