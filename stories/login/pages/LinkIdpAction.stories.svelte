<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'link-idp-action.ftl' };
  const { Story } = defineMeta({
    title: 'login/link-idp-action.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story
  name="Default"
  args={{
    ...args,
    kcContext: {
      idpDisplayName: 'GitHub',
      url: { loginAction: '/mock-login-action' },
    },
  }}
/>

<Story
  name="DifferentProvider"
  args={{
    ...args,
    kcContext: {
      idpDisplayName: 'Google',
      url: { loginAction: '/custom-login-action' },
    },
  }}
/>
