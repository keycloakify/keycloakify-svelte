<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'login-x509-info.ftl' };
  const { Story } = defineMeta({
    title: 'login/login-x509-info.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!-- /**
 * WithoutUserEnabled:
 * - Purpose: Tests when the user is not enabled to log in via x509.
 * - Scenario: The component renders the certificate details but does not provide the option to log in or cancel.
 * - Key Aspect: Ensures that the login buttons are not displayed when the user is not enabled.
 */ -->
<Story
  name="WithoutUserEnabled"
  args={{
    ...args,
    kcContext: {
      url: {
        loginAction: '/mock-login-action',
      },
      x509: {
        formData: {
          subjectDN: 'CN=John Doe, OU=Example Org, O=Example Inc, C=US',
          username: 'johndoe',
          isUserEnabled: false, // User not enabled for login
        },
      },
    },
  }}
/>
