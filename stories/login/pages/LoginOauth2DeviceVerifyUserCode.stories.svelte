<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'login-oauth2-device-verify-user-code.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-oauth2-device-verify-user-code.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithErrorMessage:
 * - Purpose: Tests when there is an error with the OAuth2 device user code entry.
 * - Scenario: The component renders with an error message displayed to the user.
 * - Key Aspect: Ensures the error message is properly shown when the user enters an invalid code.
 */ -->
<Story
  name="WithErrorMessage"
  args={{
    ...args,
    kcContext: {
      url: {
        oauth2DeviceVerificationAction: '/mock-oauth2-device-verification',
      },
      message: {
        summary: 'The user code you entered is invalid. Please try again.',
        type: 'error',
      },
    },
  }}
/>

<!-- /**
 * WithEmptyInputField:
 * - Purpose: Tests when the user code field is left empty.
 * - Scenario: The component renders the form, and the user tries to submit without entering any code.
 * - Key Aspect: Ensures the form displays validation errors when the field is left empty.
 */ -->
<Story
  name="WithEmptyInputField"
  args={{
    ...args,
    kcContext: {
      url: {
        oauth2DeviceVerificationAction: '/mock-oauth2-device-verification',
      },
      message: {
        summary: 'User code cannot be empty. Please enter a valid code.',
        type: 'error',
      },
    },
  }}
/>
