<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'webauthn-error.ftl' };
  const { Story } = defineMeta({
    title: 'login/webauthn-error.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithRetryAvailable:
 * - Purpose: Tests when the user can retry the WebAuthn authentication after an error.
 * - Scenario: The component renders with a "Try Again" button to allow retrying the authentication process.
 * - Key Aspect: Ensures the retry button functionality is visible and the user can retry authentication.
 */ -->
<Story
  name="WithRetryAvailable"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      isAppInitiatedAction: false,
      message: {
        summary: 'WebAuthn authentication failed. Please try again.',
        type: 'error',
      },
    },
  }}
/>

<!-- /**
 * WithAppInitiatedAction:
 * - Purpose: Tests when the WebAuthn error form is part of an application-initiated action.
 * - Scenario: The component renders with both a "Try Again" button and a "Cancel" button for app-initiated actions.
 * - Key Aspect: Ensures the form renders correctly with both "Try Again" and "Cancel" options.
 */ -->
<Story
  name="WithAppInitiatedAction"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      isAppInitiatedAction: true,
      message: {
        summary: 'WebAuthn authentication failed. You can try again or cancel.',
        type: 'error',
      },
    },
  }}
/>

<!-- /**
 * WithJavaScriptDisabled:
 * - Purpose: Tests the behavior when JavaScript is disabled or not functioning.
 * - Scenario: The component renders with a message prompting the user to retry manually without JavaScript.
 * - Key Aspect: Ensures the retry mechanism works properly when JavaScript is disabled or unavailable.
 */ -->
<Story
  name="WithJavaScriptDisabled"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      isAppInitiatedAction: false,
      message: {
        summary: 'JavaScript is disabled or not working. Please retry manually.',
        type: 'warning',
      },
    },
  }}
/>
