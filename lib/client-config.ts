export type ClientConfig = {
  showDefaultCredentialsHint: boolean;
};

export function clientConfig(): ClientConfig {
  return {
    showDefaultCredentialsHint: process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS === "true"
  };
}
