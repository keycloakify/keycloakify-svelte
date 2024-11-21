import type { PageProps } from './PageProps';
import type { UserProfileFormFieldsProps } from '../UserProfileFormFieldsProps';
import type { Component } from 'svelte';
import type { I18n } from '../i18n';
import type { KcContext } from '../KcContext';
declare const Register: Component<PageProps<KcContext.Register, I18n> & {
    UserProfileFormFields: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
}, {}, "">;
type Register = ReturnType<typeof Register>;
export default Register;
