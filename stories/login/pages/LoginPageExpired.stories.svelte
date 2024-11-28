<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'login-page-expired.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-page-expired.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithErrorMessage:
 * - Purpose: Tests behavior when an error message is displayed along with the page expiration message.
 * - Scenario: Simulates a case where the session expired due to an error, and an error message is displayed alongside the expiration message.
 * - Key Aspect: Ensures that error messages are displayed correctly in addition to the page expiration notice.
 */ -->
<Story
  name="WithErrorMessage"
  args={{
    ...args,
    kcContext: {
      url: {
        loginRestartFlowUrl: '/mock-restart-flow',
        loginAction: '/mock-continue-login',
      },
      message: {
        type: 'error',
        summary: 'An error occurred while processing your session.',
      },
    },
  }}
/>
