<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  // Mock kcContext to avoid the TS2304 error
  const mockKcContext = {
    url: {
      loginAction: '/login-action',
    },
    idpAlias: 'mockIdpAlias',
  };

  const args: KcPageStoryProps = { pageId: 'login-idp-link-confirm.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-idp-link-confirm.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<!-- /**
 * Default:
 * - Purpose: Tests standard behavior with mock data.
 * - Scenario: The component renders with a mocked identity provider alias (`mockIdpAlias`) and a login action URL (`/login-action`).
 * - Key Aspect: Ensures the default behavior of the component with standard values for kcContext.
 */ -->
<Story
  name="Default"
  args={{
    ...args,
    kcContext: mockKcContext,
  }}
/>

<!-- /**
 * WithFormSubmissionError:
 * - Purpose: Tests how the component handles form submission errors.
 * - Scenario: Simulates a form submission error by setting the login action URL to `/error` and displays an error message.
 * - Key Aspect: Verifies that the component can display error messages during form submission failure, ensuring proper error handling.
 */ -->
<Story
  name="WithFormSubmissionError"
  args={{
    ...args,
    kcContext: {
      ...mockKcContext,
      url: {
        loginAction: '/error',
      },
      message: {
        type: 'error',
        summary: 'An error occurred during form submission.',
      },
    },
  }}
/>
