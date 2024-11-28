<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'login-update-password.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-update-password.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithPasswordError:
 * - Purpose: Tests when there is an error in the password input (e.g., invalid password).
 * - Scenario: Simulates the case where the user enters an invalid password, and an error message is displayed.
 * - Key Aspect: Ensures the password input field shows an error message when validation fails.
 */ -->
<Story
  name="WithPasswordError"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      messagesPerField: {
        existsError: (field: string) => field === 'password',
        get: () => 'Password must be at least 8 characters long.',
      },
      isAppInitiatedAction: false,
    },
  }}
/>

<!-- /**
 * WithPasswordConfirmError:
 * - Purpose: Tests when there is an error in the password confirmation input (e.g., passwords do not match).
 * - Scenario: Simulates the case where the user enters mismatching passwords, and an error message is displayed in the confirmation field.
 * - Key Aspect: Ensures that the password confirmation field shows an error when passwords do not match.
 */ -->
<Story
  name="WithPasswordConfirmError"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      messagesPerField: {
        existsError: (field: string) => field === 'password-confirm',
        get: () => 'Passwords do not match.',
      },
      isAppInitiatedAction: false,
    },
  }}
/>
