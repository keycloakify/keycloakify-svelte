<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'login-config-totp.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-config-totp.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!--  -->
<Story
  name="WithManualSetUp"
  args={{
    ...args,
    kcContext: {
      mode: 'manual',
    },
  }}
/>

<!--  -->
<Story
  name="WithError"
  args={{
    ...args,
    kcContext: {
      messagesPerField: {
        get: (fieldName: string) => (fieldName === 'totp' ? 'Invalid TOTP' : undefined),
        exists: (fieldName: string) => fieldName === 'totp',
        existsError: (fieldName: string) => fieldName === 'totp',
        printIfExists: <T,>(fieldName: string, x: T) => (fieldName === 'totp' ? x : undefined),
      },
    },
  }}
/>

<!--  -->
<Story
  name="WithAppInitiatedAction"
  args={{
    ...args,
    kcContext: {
      isAppInitiatedAction: true,
    },
  }}
/>

<!--  -->
<Story
  name="WithPreFilledUserLabel"
  args={{
    ...args,
    kcContext: {
      totp: {
        otpCredentials: [{ userLabel: 'MyDevice' }],
      },
    },
  }}
/>
