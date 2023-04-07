import { Partytown } from "@builder.io/partytown/react";
import { type Metadata } from "next";
import { cookies as nextCookies } from "next/headers";
import { notFound } from "next/navigation";
import Script from "next/script";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";

import { ReactWrapProvider } from "client/ReactWrapProvider";
import { Provider as TooltipProvider } from "client/radix/Tooltip";
import { ActionBar } from "components/ActionBar";
import { Analytics } from "components/Analytics";
import { env } from "constants/env";
import { host, url } from "constants/url";
import { hyenaSunrise } from "fonts/hyena";
import { type Locale } from "i18n/constants";
import { StorageKey } from "store/constants";
import { createStyles } from "theme";
import { DEFAULT_MODE } from "theme/constants";
import { hueId, getHexForColor } from "theme/utils";
import { getId } from "utils/getId";
import { getServerHue } from "utils/getServerHue";

import "./globals.scss";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: {
      default: host,
      template: `${host}/%s`,
    },
    description: t("description"),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
    metadataBase: url,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const locale = useLocale();

  if (params.locale !== locale) {
    notFound();
  }

  const cookies = nextCookies();
  const hue = getServerHue(cookies);
  const isAndrew = Boolean(cookies.get(StorageKey.IS_ANDREW)?.value);

  return (
    <html lang={locale}>
      <head>
        <Partytown debug={!env.isProduction} forward={["dataLayer.push"]} />
        <Script id={getId()} type="text/partytown">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NM2JLN5');`}
        </Script>
        <style
          id={hueId(hue)}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: createStyles(hue) }}
        />
        <meta
          name="theme-color"
          content={getHexForColor(hue, DEFAULT_MODE, "primary")}
        />
      </head>
      <body className={hyenaSunrise.className} data-hue={hue}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NM2JLN5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <TooltipProvider>
          <ReactWrapProvider>{children}</ReactWrapProvider>
        </TooltipProvider>
        <ActionBar />
        {!isAndrew && <Analytics locale={locale} />}
      </body>
    </html>
  );
}
