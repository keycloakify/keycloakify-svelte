<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'delete-account-confirm.ftl' };
  const { Story } = defineMeta({
    title: 'login/delete-account-confirm.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!--  -->
<Story
  name="WithAIAFlow"
  args={{
    ...args,
    kcContext: {
      triggered_from_aia: true,
      url: { loginAction: '/login-action' },
    },
  }}
/>

<!--  -->
<Story
  name="WithoutAIAFlow"
  args={{
    ...args,
    kcContext: {
      triggered_from_aia: false,
      url: { loginAction: '/login-action' },
    },
  }}
/>

<!--  -->
<Story
  name="WithCustomButtonStyle"
  args={{
    ...args,
    kcContext: {
      triggered_from_aia: true,
      url: { loginAction: '/login-action' },
    },
  }}
/>
