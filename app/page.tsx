import Balancer from "react-wrap-balancer";
import styles from "./page.module.scss";
import Link from "components/Link";
import Icon from "../src/components/Icon";
import VisuallyHidden from "components/VisuallyHidden";

export default function Page() {
  return (
    <main className={styles.main}>
      <h1>
        Hi, I&apos;m Andrew
        <Icon
          iconName="smile"
          className={styles.smile}
          aria-hidden
          focusable={false}
        />
      </h1>
      <Balancer as="p" aria-hidden>
        I&apos;m an <abbr title="New York City">nyc</abbr> based design engineer
        excited by design systems, motion design and accessibility. Check out my{" "}
        <Link href="/resume.pdf" type="internal">
          resume
        </Link>{" "}
        or send me an{" "}
        <Link href="mailto:andrew@wiggin.dev" type="external">
          email
        </Link>
        .
      </Balancer>
      <VisuallyHidden
        asChild
        aria-label="I'm a New York City based design engineer excited by design systems, motion design and accessibility. Check out my resume or send me an email."
      >
        <p>
          <Link href="/resume.pdf" type="internal" srOnly>
            resume
          </Link>
          <Link href="mailto:andrew@wiggin.dev" type="external" srOnly>
            email
          </Link>
        </p>
      </VisuallyHidden>
    </main>
  );
}
