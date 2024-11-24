import type { Attribute, PasswordPolicies, Validators } from 'keycloakify/login/KcContext';
import * as reactlessApi from 'keycloakify/login/lib/getUserProfileApi';
import { type EventDispatcher, type Snippet } from 'svelte';
import { type Readable } from 'svelte/store';
import type { I18n } from '../i18n';
export { getButtonToDisplayForMultivaluedAttributeField } from 'keycloakify/login/lib/getUserProfileApi';
export type FormFieldError = {
    errorMessage: Snippet;
    errorMessageStr: string;
    source: FormFieldError.Source;
    fieldIndex: number | undefined;
};
export declare namespace FormFieldError {
    type Source = Source.Validator | Source.PasswordPolicy | Source.Server | Source.Other;
    namespace Source {
        type Validator = {
            type: 'validator';
            name: keyof Validators;
        };
        type PasswordPolicy = {
            type: 'passwordPolicy';
            name: keyof PasswordPolicies;
        };
        type Server = {
            type: 'server';
        };
        type Other = {
            type: 'other';
            rule: 'passwordConfirmMatchesPassword' | 'requiredField';
        };
    }
}
export type FormFieldState = {
    attribute: Attribute;
    displayableErrors: FormFieldError[];
    valueOrValues: string | string[];
};
export type FormState = {
    isFormSubmittable: boolean;
    formFieldStates: FormFieldState[];
};
export type FormAction = {
    action: 'update';
    name: string;
    valueOrValues: string | string[];
    /** Default false */
    displayErrorsImmediately?: boolean;
} | {
    action: 'focus lost';
    name: string;
    fieldIndex: number | undefined;
};
export type KcContextLike = reactlessApi.KcContextLike;
export type I18nLike = Pick<I18n, 'advancedMsg' | 'advancedMsgStr'>;
export type ParamsOfUseUserProfileForm = {
    kcContext: KcContextLike;
    doMakeUserConfirmPassword: boolean;
    i18n: I18nLike;
};
export type ReturnTypeOfUseUserProfileForm = {
    formState: Readable<FormState>;
    dispatchFormAction: EventDispatcher<{
        formAction: FormAction;
    }>;
};
export declare function useUserProfileForm(params: ParamsOfUseUserProfileForm): ReturnTypeOfUseUserProfileForm;
