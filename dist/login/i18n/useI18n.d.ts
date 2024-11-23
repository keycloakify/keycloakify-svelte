import { type LanguageTag as LanguageTag_defaultSet, type MessageKey as MessageKey_defaultSet } from 'keycloakify/login/i18n/messages_defaultSet/types';
import { type KcContextLike } from 'keycloakify/login/i18n/noJsx/getI18n';
import type { Readable } from 'svelte/store';
import type { GenericI18n_svelte } from './i18n';
export type ReturnTypeOfCreateUseI18n<MessageKey_themeDefined extends string, LanguageTag_notInDefaultSet extends string> = {
    useI18n: (params: {
        kcContext: KcContextLike;
    }) => {
        i18n: Readable<GenericI18n_svelte<MessageKey_defaultSet | MessageKey_themeDefined, LanguageTag_defaultSet | LanguageTag_notInDefaultSet>>;
    };
    ofTypeI18n: GenericI18n_svelte<MessageKey_defaultSet | MessageKey_themeDefined, LanguageTag_defaultSet | LanguageTag_notInDefaultSet>;
};
export type { KcContextLike };
export declare function createUseI18n<ThemeName extends string = string, MessageKey_themeDefined extends string = never, LanguageTag_notInDefaultSet extends string = never>(params: {
    extraLanguageTranslations: {
        [languageTag in LanguageTag_notInDefaultSet]: {
            label: string;
            getMessages: () => Promise<{
                default: Record<MessageKey_defaultSet, string>;
            }>;
        };
    };
    messagesByLanguageTag_themeDefined: Partial<{
        [languageTag in LanguageTag_defaultSet | LanguageTag_notInDefaultSet]: {
            [key in MessageKey_themeDefined]: string | Record<ThemeName, string>;
        };
    }>;
}): ReturnTypeOfCreateUseI18n<MessageKey_themeDefined, LanguageTag_notInDefaultSet>;
