import type { GenericI18n_noJsx } from 'keycloakify/login/i18n/noJsx/GenericI18n_noJsx';
import { type MessageKey as MessageKey_defaultSet } from 'keycloakify/login/i18n/messages_defaultSet/types';
import type { Snippet } from 'svelte';
/** INTERNAL: DO NOT IMPORT THIS */
export type GenericI18n_svelte<MessageKey extends string, LanguageTag extends string> = GenericI18n_noJsx<
  MessageKey,
  LanguageTag
> & {
  /**
   * Same as msgStr but returns a Snippet with the html string rendered as html.
   */
  msg: (key: MessageKey_defaultSet, ...args: (string | undefined)[]) => Snippet;
  /**
   * Same as advancedMsgStr but returns a Snippet with the html string rendered as html.
   */
  advancedMsg: (key: string, ...args: (string | undefined)[]) => Snippet;
};
export type I18n = GenericI18n_svelte<MessageKey_defaultSet, string>;
