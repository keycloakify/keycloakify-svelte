export type ThemeName = 'keycloakify-starter-svelte';

export const themeNames: ThemeName[] = ['keycloakify-starter-svelte'];

export type KcEnvName = never;

export const kcEnvNames: KcEnvName[] = [];

export const kcEnvDefaults: Record<KcEnvName, string> = {};

export type KcContext = import('./login/KcContext').KcContext;

declare global {
  interface Window {
    kcContext?: KcContext;
  }
}
