<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'login-username.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-username.ft',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!--  -->
<Story
  name="WithEmailAsUsername"
  args={{
    ...args,
    kcContext: {
      realm: {
        loginWithEmailAllowed: true,
        registrationEmailAsUsername: true,
      },
    },
  }}
/>
