<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'login-recovery-authn-code-config.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-recovery-authn-code-config.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithErrorDuringCodeGeneration:
 * - Purpose: Tests when an error occurs while generating recovery authentication codes.
 * - Scenario: The component renders an error message to inform the user of the failure during code generation.
 * - Key Aspect: Ensures that error messages are properly displayed when recovery code generation fails.
 */ -->
<Story
  name="WithErrorDuringCodeGeneration"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      message: {
        summary: 'An error occurred during recovery code generation. Please try again.',
        type: 'error',
      },
    },
  }}
/>
