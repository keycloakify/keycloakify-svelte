<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'login-reset-password.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-reset-password.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!--  -->
<Story
  name="WithEmailAsUsername"
  args={{
    ...args,
    kcContext: {
      realm: {
        loginWithEmailAllowed: true,
        registrationEmailAsUsername: true,
      },
    },
  }}
/>

<!-- /**
 * WithUsernameError:
 * - Purpose: Tests behavior when an error occurs with the username input (e.g., invalid username).
 * - Scenario: The component displays an error message next to the username input field.
 * - Key Aspect: Ensures the username input shows error messages when validation fails.
 */ -->
<Story
  name="WithUsernameError"
  args={{
    ...args,
    kcContext: {
      realm: {
        loginWithEmailAllowed: false,
        registrationEmailAsUsername: false,
        duplicateEmailsAllowed: false,
      },
      url: {
        loginAction: '/mock-login-action',
        loginUrl: '/mock-login-url',
      },
      messagesPerField: {
        existsError: (field: string) => field === 'username',
        get: () => 'Invalid username',
      },
      auth: {
        attemptedUsername: 'invalid_user',
      },
    },
  }}
/>
