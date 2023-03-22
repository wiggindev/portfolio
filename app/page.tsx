import c from "classnames";
import { AnimatedPath } from "components/AnimatedPath";
import { ExternalLink, InternalLink } from "components/Link";
import { Logo } from "components/Logo";
import { tragedyDisplay } from "fonts/tragedy";
import { type Metadata } from "next";
import React from "react";
import { Balancer } from "client/Balancer";
import { Separator } from "client/radix/Separator";
import { HueSelectButton } from "./HueSelectButton";
import styles from "./page.module.scss";

const generateBlurb = (prefix: string) =>
  `${prefix} a brooklyn based design engineer passionate about design systems, motion design and accessibility.`;

export const metadata: Metadata = {
  description: generateBlurb("Andrew Wiggin is"),
};

export default async function Page() {
  const sectionTwoId = "oaigfnv";
  const sectionThreeId = "o4evnfd";

  return (
    <main className={c(styles.page, tragedyDisplay.className)}>
      <section className={styles.hero}>
        <h1>
          Hi, I&apos;m Andrew
          <Logo className={styles.icon} aria-hidden focusable={false} />
        </h1>
        <Balancer>{generateBlurb("I'm")}</Balancer>
        <AnimatedPath
          className={styles.scribbleOne}
          viewBox="0 0 862.83 1809.95"
          targetId={sectionTwoId}
          d="m99.85,165.84c60.38-58.96,123.18-119.5,202.17-149.21,78.99-29.72,179.19-20.35,232.88,44.77,47.42,57.51,46.46,142.68,20.14,212.42-36.01,95.43-115.9,173.27-212.23,206.8-59.08,20.56-144.51,10.74-157.51-50.44-10.33-48.61,36.04-91.59,82.88-108.19,52.93-18.75,113.83-18.1,163.5,8.08,49.67,26.18,85.73,79.49,85.09,135.64-.73,64.15-46.03,119.43-96.66,158.83-50.63,39.4-109.02,69.11-154.43,114.42-45.42,45.31-76.51,113.69-54.06,173.79,30.91,82.76,152.64,100.73,223.5,47.96,43.41-32.33,71.59-93.55,46.83-141.68-20.51-39.87-71-57.07-115.39-50.75-44.39,6.32-83.71,31.46-119.55,58.41C116.99,924.42,7.1,1066.77.78,1229.33c-7.45,191.79,133.72,364.44,304.25,452.53,170.53,88.08,366.76,108.59,557.75,127.6"
          animatedPathRatio={2}
        />
      </section>
      <Separator
        orientation="horizontal"
        decorative
        className={styles.separator}
      />
      <section className={styles.neutral} id={sectionTwoId}>
        <Balancer>
          I spent my childhood playing with JavaScript and love using CSS and
          WebAssembly to create performant animations. Check out my{" "}
          <InternalLink href="/resume">resume</InternalLink> or reach out via{" "}
          <ExternalLink href="mailto:andrew@wiggin.dev">email</ExternalLink>.
        </Balancer>
        <AnimatedPath
          className={styles.scribbleTwo}
          viewBox="0 0 1764.67 627.04"
          targetId={sectionThreeId}
          d="m.02,483.23c176-7.34,349.15-71.9,486.99-181.58,52.24-41.56,102.01-94.15,112.2-160.12C609.41,75.56,561.69-1.73,494.97.55c-34.58,1.18-66.27,23.24-84.96,52.36-18.69,29.12-25.71,64.43-26.42,99.02-1.94,94.78,43.56,189.37,118.84,247,120.6,92.33,290.23,81.72,437.92,46.25,147.69-35.47,295.46-91.78,446.56-76.29,157.99,16.2,304.86,116.59,377.32,257.92"
          animatedPathRatio={5}
          startVisible={false}
        />
      </section>
      <Separator
        orientation="horizontal"
        decorative
        className={styles.separator}
      />
      <section className={styles.neutral} id={sectionThreeId}>
        <Balancer>
          These colors use oklch to create an accessible color palette with{" "}
          <HueSelectButton>any hue</HueSelectButton>. Interesed in how it works?
          Check out{" "}
          <ExternalLink href="https://github.com/wiggindev/wiggin.dev#readme">
            the docs
          </ExternalLink>
          .
        </Balancer>
      </section>
    </main>
  );
}
