<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'federatedIdentity.ftl' };
  const { Story } = defineMeta({
    title: 'account/federatedIdentity.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!--  -->
<Story
  name="NotConnected"
  args={{
    ...args,
    kcContext: {
      pageId: 'federatedIdentity.ftl',
      federatedIdentity: {
        identities: [
          {
            providerId: 'google',
            displayName: 'keycloak-oidc',
            connected: false,
          },
        ],
        removeLinkPossible: true,
      },
    },
  }}
/>

<!-- /**
 * RemoveLinkNotPossible:
 * - Federated identities are connected, but the user cannot remove them due to restrictions.
 */ -->
<Story
  name="RemoveLinkNotPossible"
  args={{
    ...args,
    kcContext: {
      pageId: 'federatedIdentity.ftl',
      federatedIdentity: {
        identities: [
          {
            providerId: 'google',
            displayName: 'Google',
            userName: 'john.doe@gmail.com',
            connected: true,
          },
        ],
        removeLinkPossible: false,
      },
      stateChecker: '1234',
      url: {
        socialUrl: '/social',
      },
    },
  }}
/>

<!-- /**
 * AddLinkForUnconnectedIdentity:
 * - The user has an identity that is not connected and can add it.
 */ -->
<Story
  name="AddLinkForUnconnectedIdentity"
  args={{
    ...args,
    kcContext: {
      pageId: 'federatedIdentity.ftl',
      federatedIdentity: {
        identities: [
          {
            providerId: 'github',
            displayName: 'GitHub',
            userName: '',
            connected: false,
          },
        ],
        removeLinkPossible: true,
      },
      stateChecker: '1234',
      url: {
        socialUrl: '/social',
      },
    },
  }}
/>
