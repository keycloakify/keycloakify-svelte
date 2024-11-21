type DefaultPageProps = PageProps<KcContext, I18n> & {
    UserProfileFormFields?: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
};
import type { PageProps } from './pages/PageProps';
import type { UserProfileFormFieldsProps } from './UserProfileFormFieldsProps';
import type { Component } from 'svelte';
import type { I18n } from './i18n';
import type { KcContext } from './KcContext';
declare const DefaultPage: Component<DefaultPageProps, {}, "">;
type DefaultPage = ReturnType<typeof DefaultPage>;
export default DefaultPage;
