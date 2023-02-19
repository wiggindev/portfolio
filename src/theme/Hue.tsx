"use client";

import { setCookie } from "cookies-next";
import React from "react";
import { DEFAULT_HUE, Hue, HueSchema } from "utils/theme/color";
import { createHueStyles } from "utils/theme/style";

export interface HueContext {
  hue: Hue;
  setHue: (hue: Hue) => void;
}

export const HueContext = React.createContext<HueContext>({
  hue: DEFAULT_HUE,
  setHue: () => null,
});

const hueStyleExists = (hue: number) =>
  document.getElementById(`hue-${hue}`) !== null;

const createHue = (hue: number) => {
  if (hueStyleExists(hue)) return;
  const styleEl = document.createElement("style");
  styleEl.id = `hue-${hue}`;
  styleEl.innerHTML = createHueStyles(hue);
  document.head.appendChild(styleEl);
};

const recolor = () => {
  const bodyHue = document.body.getAttribute("data-hue");
  if (bodyHue) {
    setCookie("hue", bodyHue, { maxAge: 2_592_000 });
  }
  const coloredElements = document.querySelectorAll("[data-hue]");
  coloredElements.forEach((element) => {
    const hueAttr = element.getAttribute("data-hue")!;
    const parsedHue = HueSchema.safeParse(parseInt(hueAttr));
    if (!parsedHue.success || hueStyleExists(parsedHue.data)) {
      return;
    }
    const hue = parsedHue.data;
    const styleEl = document.createElement("style");
    styleEl.id = `hue-${hue}`;
    styleEl.innerHTML = createHueStyles(hue);
    document.head.appendChild(styleEl);
  });
};

export const HueProvider = ({
  initialHue,
  children,
}: {
  initialHue: Hue;
  children: React.ReactNode;
}) => {
  const [hue, setHueRaw] = React.useState<Hue>(initialHue);

  React.useEffect(() => {
    recolor();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        recolor();
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-hue"],
    });
    return () => observer.disconnect();
  }, []);

  const setHue = React.useCallback(
    (newHue: number) => {
      if (newHue === hue) return;
      createHue(newHue);
      document.body.setAttribute("data-hue", newHue.toString());
      setHueRaw(newHue);
    },
    [hue]
  );

  return (
    <HueContext.Provider value={{ hue, setHue }}>
      {children}
    </HueContext.Provider>
  );
};
