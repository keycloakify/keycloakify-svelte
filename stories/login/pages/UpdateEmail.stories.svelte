<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'update-email.ftl' };
  const { Story } = defineMeta({
    title: 'login/update-email.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithAppInitiatedAction:
 * - Purpose: Tests when the form is displayed as part of an application-initiated action.
 * - Scenario: The component renders the form with additional buttons like "Cancel."
 * - Key Aspect: Ensures the "Cancel" button is visible and functional during app-initiated actions.
 */ -->
<Story
  name="WithAppInitiatedAction"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      messagesPerField: {
        exists: () => false,
      },
      isAppInitiatedAction: true,
    },
  }}
/>
