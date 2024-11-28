<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'applications.ftl' };
  const { Story } = defineMeta({
    title: 'account/applications.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story
  name="Default"
  args={{
    ...args,
    kcContext: {
      pageId: 'applications.ftl',
      applications: {
        applications: [
          {
            realmRolesAvailable: [
              {
                name: 'realmRoleName1',
                description: 'realm role description 1',
              },
              {
                name: 'realmRoleName2',
                description: 'realm role description 2',
              },
            ],
            resourceRolesAvailable: {
              resource1: [
                {
                  roleName: 'Resource Role Name 1',
                  roleDescription: 'Resource role 1 description',
                  clientName: 'Client Name 1',
                  clientId: 'client1',
                },
              ],
              resource2: [
                {
                  roleName: 'Resource Role Name 2',
                  clientName: 'Client Name 1',
                  clientId: 'client1',
                },
              ],
            },
            additionalGrants: ['grant1', 'grant2'],
            clientScopesGranted: ['scope1', 'scope2'],
            effectiveUrl: '#',
            client: {
              clientId: 'application1',
              name: 'Application 1',
              consentRequired: true,
            },
          },
          {
            realmRolesAvailable: [
              {
                name: 'Realm Role Name 1',
              },
            ],
            resourceRolesAvailable: {},
            additionalGrants: [],
            clientScopesGranted: [],
            effectiveUrl: '#',
            client: {
              clientId: 'application2',
              name: 'Application 2',
            },
          },
        ],
      },
    },
  }}
/>

<!-- No Available Roles or Grants Scenario -->
<Story
  name="WithErrorCode"
  args={{
    ...args,
    kcContext: {
      pageId: 'applications.ftl',
      applications: {
        applications: [
          {
            realmRolesAvailable: [],
            resourceRolesAvailable: {},
            additionalGrants: [],
            clientScopesGranted: [],
            effectiveUrl: '#',
            client: {
              clientId: 'application1',
              name: 'Application 1',
              consentRequired: true,
            },
          },
        ],
      },
    },
  }}
/>

<!-- Consent Not Required Scenario -->
<Story
  name="ConsentNotRequired"
  args={{
    ...args,
    kcContext: {
      pageId: 'applications.ftl',
      applications: {
        applications: [
          {
            realmRolesAvailable: [],
            resourceRolesAvailable: {},
            additionalGrants: [],
            clientScopesGranted: [],
            effectiveUrl: '#',
            client: {
              clientId: 'application1',
              name: 'Application 1',
              consentRequired: false, // No consent required
            },
          },
        ],
      },
    },
  }}
/>

<!-- No Roles Available but Consent Required Scenario -->
<Story
  name="NoRolesButConsentRequired"
  args={{
    ...args,
    kcContext: {
      pageId: 'applications.ftl',
      applications: {
        applications: [
          {
            realmRolesAvailable: [],
            resourceRolesAvailable: {},
            additionalGrants: [],
            clientScopesGranted: ['scope1', 'scope2'], // Consent required but no roles
            effectiveUrl: '#',
            client: {
              clientId: 'application1',
              name: 'Application 1',
              consentRequired: true,
            },
          },
        ],
      },
    },
  }}
/>

<!-- Only Resource Roles Available Scenario -->
<Story
  name="OnlyResourceRolesAvailable"
  args={{
    ...args,
    kcContext: {
      pageId: 'applications.ftl',
      applications: {
        applications: [
          {
            realmRolesAvailable: [], // No realm roles
            resourceRolesAvailable: {
              resource1: [
                {
                  roleName: 'Resource Role Name 1',
                  roleDescription: 'Resource role 1 description',
                  clientName: 'Client Name 1',
                  clientId: 'client1',
                },
              ],
            },
            additionalGrants: [],
            clientScopesGranted: [],
            effectiveUrl: '#',
            client: {
              clientId: 'application1',
              name: 'Application 1',
              consentRequired: true,
            },
          },
        ],
      },
    },
  }}
/>

<!-- No Additional Grants Scenario -->
<Story
  name="NoAdditionalGrants"
  args={{
    ...args,
    kcContext: {
      pageId: 'applications.ftl',
      applications: {
        applications: [
          {
            realmRolesAvailable: [
              {
                name: 'Realm Role Name 1',
              },
            ],
            resourceRolesAvailable: {},
            additionalGrants: [], // No additional grants
            clientScopesGranted: [],
            effectiveUrl: '#',
            client: {
              clientId: 'application1',
              name: 'Application 1',
              consentRequired: true,
            },
          },
        ],
      },
    },
  }}
/>
