<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'login-update-profile.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-update-profile.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithProfileError:
 * - Purpose: Tests when an error occurs in one or more profile fields (e.g., invalid email format).
 * - Scenario: The component displays error messages next to the affected fields.
 * - Key Aspect: Ensures the profile fields show error messages when validation fails.
 */ -->
<Story
  name="Demo"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      messagesPerField: {
        existsError: (field: string) => field === 'email',
        get: () => 'Invalid email format',
      },
      isAppInitiatedAction: false,
    },
  }}
/>
