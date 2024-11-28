<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'delete-credential.ftl' };
  const { Story } = defineMeta({
    title: 'login/delete-credential.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!--  -->
<Story
  name="WithCustomCredentialLabel"
  args={{
    ...args,
    kcContext: {
      credentialLabel: 'Test Credential',
      url: { loginAction: '/login-action' },
    },
  }}
/>
