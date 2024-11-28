<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'logout-confirm.ftl' };
  const { Story } = defineMeta({
    title: 'login/logout-confirm.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithCustomLogoutMessage:
 * - Purpose: Tests when a custom message is displayed for the logout confirmation.
 * - Scenario: The component renders with a custom logout confirmation message instead of the default one.
 * - Key Aspect: Ensures the custom logout message is displayed correctly.
 */ -->
<Story
  name="WithCustomLogoutMessage"
  args={{
    ...args,
    kcContext: {
      url: {
        logoutConfirmAction: '/mock-logout-action',
      },
      client: {
        baseUrl: '/mock-client-url',
      },
      logoutConfirm: {
        code: 'mock-session-code',
        skipLink: false,
      },
      message: {
        summary: 'Are you sure you want to log out from all sessions?',
        type: 'warning',
      },
    },
  }}
/>
