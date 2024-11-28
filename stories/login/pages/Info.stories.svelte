<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'info.ftl' };
  const { Story } = defineMeta({
    title: 'login/info.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story
  name="Default"
  args={{
    ...args,
    kcContext: {
      messageHeader: 'Message header',
      message: {
        summary: 'Server info message',
      },
    },
  }}
/>

<!--  -->
<Story
  name="WithLinkBack"
  args={{
    ...args,
    kcContext: {
      messageHeader: 'Message header',
      message: {
        summary: 'Server message',
      },
      actionUri: undefined,
    },
  }}
/>

<!--  -->
<Story
  name="WithRequiredActions"
  args={{
    ...args,
    kcContext: {
      messageHeader: 'Message header',
      message: {
        summary: 'Required actions: ',
      },
      requiredActions: ['CONFIGURE_TOTP', 'UPDATE_PROFILE', 'VERIFY_EMAIL', 'CUSTOM_ACTION'],
      'x-keycloakify': {
        messages: {
          'requiredAction.CUSTOM_ACTION': 'Custom action',
        },
      },
    },
  }}
/>
