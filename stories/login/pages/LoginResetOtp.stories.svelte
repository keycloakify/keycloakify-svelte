<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'login-reset-otp.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-reset-otp.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithoutOtpCredentials:
 * - Purpose: Tests the behavior when no OTP credentials are available.
 * - Scenario: The component renders without any OTP credentials, showing only the submit button.
 * - Key Aspect: Ensures that the component handles the absence of OTP credentials correctly.
 */ -->
<Story
  name="WithoutOtpCredentials"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login',
      },
      configuredOtpCredentials: {
        userOtpCredentials: [],
        selectedCredentialId: undefined,
      },
      messagesPerField: {
        existsError: () => false,
      },
    },
  }}
/>

<!-- /**
 * WithOtpError:
 * - Purpose: Tests the behavior when an error occurs with the OTP selection.
 * - Scenario: Simulates a scenario where an error occurs (e.g., no OTP selected), and an error message is displayed.
 * - Key Aspect: Ensures that error messages are displayed correctly for OTP-related errors.
 */ -->
<Story
  name="WithOtpError"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login',
      },
      configuredOtpCredentials: {
        userOtpCredentials: [
          { id: 'otp1', userLabel: 'Device 1' },
          { id: 'otp2', userLabel: 'Device 2' },
        ],
        selectedCredentialId: 'otp1',
      },
      messagesPerField: {
        existsError: (field: string) => field === 'totp',
        get: () => 'Invalid OTP selection',
      },
    },
  }}
/>

<!-- /**
 * WithOnlyOneOtpCredential:
 * - Purpose: Tests the behavior when there is only one OTP credential available.
 * - Scenario: Simulates the case where the user has only one OTP credential, and it is pre-selected by default.
 * - Key Aspect: Ensures that the component renders correctly with only one OTP credential pre-selected.
 */ -->
<Story
  name="WithOnlyOneOtpCredential"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login',
      },
      configuredOtpCredentials: {
        userOtpCredentials: [{ id: 'otp1', userLabel: 'Device 1' }],
        selectedCredentialId: 'otp1',
      },
      messagesPerField: {
        existsError: () => false,
      },
    },
  }}
/>
