import { datadogRum } from "@datadog/browser-rum";
import va from "@vercel/analytics";

import { type ActionMap, type ActionName } from "analytics/constants";
import { env } from "constants/env";
import { host } from "constants/url";
import { mutate } from "utils/mutate";

import packageJson from "../../package.json";

function makeMockDatadogApi(): typeof datadogRum {
  const globalContext: Record<string, unknown> = {};
  const log = (message: unknown, context?: object) => {
    console.log(
      `%c[rum]%c ${message}\n`,
      "color: rgb(120, 120, 120)",
      "color: inherit",
      {
        ...globalContext,
        ...context,
      }
    );
  };
  const mock = mutate(datadogRum, () => {
    return () => null;
  }) as unknown as typeof datadogRum;
  return {
    ...mock,
    addAction: (name: string, context?: object) => log(name, context),
    addError: (error: unknown, context?: object) => log(error, context),
    setRumGlobalContext: (context: object) => {
      Object.assign(globalContext, context);
    },
  };
}

export const datadog = env.isDevelopment ? makeMockDatadogApi() : datadogRum;

export const init = () => {
  const ddAppId = process.env.NEXT_PUBLIC_DD_APP_ID;
  const ddClientToken = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN;
  if (!ddAppId || !ddClientToken || navigator.userAgent.includes("Headless")) {
    return;
  }
  datadog.init({
    applicationId: ddAppId,
    clientToken: ddClientToken,
    site: "datadoghq.com",
    service: host,
    env: env.value,
    version: packageJson.version,
    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: true,
    trackFrustrations: true,
    silentMultipleInit: true,
  });
};

export function trackAction<Name extends ActionName>(
  ...[name, props]: ActionMap[Name] extends never
    ? [Name]
    : [Name, ActionMap[Name]]
) {
  va.track(name, props);
  datadog.addAction(name, props);
}
