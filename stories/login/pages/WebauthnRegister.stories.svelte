<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'webauthn-register.ftl' };
  const { Story } = defineMeta({
    title: 'login/webauthn-register.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithRetryAvailable:
 * - Purpose: Tests when the user is allowed to retry WebAuthn registration after a failure.
 * - Scenario: The component renders the form with a retry option.
 * - Key Aspect: Ensures the retry functionality is available and the form allows the user to retry.
 */ -->
<Story
  name="WithRetryAvailable"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      isSetRetry: true,
      isAppInitiatedAction: false,
    },
  }}
/>

<!-- /**
 * WithErrorDuringRegistration:
 * - Purpose: Tests when an error occurs during WebAuthn registration.
 * - Scenario: The component displays an error message related to WebAuthn registration failure.
 * - Key Aspect: Ensures the error message is displayed correctly, informing the user of the registration failure.
 */ -->
<Story
  name="WithErrorDuringRegistration"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      isSetRetry: false,
      isAppInitiatedAction: false,
      message: {
        summary: 'An error occurred during WebAuthn registration. Please try again.',
        type: 'error',
      },
    },
  }}
/>
