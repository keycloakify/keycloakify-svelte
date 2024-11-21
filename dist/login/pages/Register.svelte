<script lang="ts">
  import type { PageProps } from './PageProps';
  import type { UserProfileFormFieldsProps } from '../UserProfileFormFieldsProps';
  import type { Component } from 'svelte';
  import type { I18n } from '../i18n';
  import type { KcContext } from '../KcContext';

  type RegisterProps = PageProps<Extract<KcContext, { pageId: 'register.ftl' }>, I18n> & {
    UserProfileFormFields: Component<UserProfileFormFieldsProps>;
    doMakeUserConfirmPassword: boolean;
  };
  const props: RegisterProps = $props();
  const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } =
    props;
</script>
