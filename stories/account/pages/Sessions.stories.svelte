<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'sessions.ftl' };
  const { Story } = defineMeta({
    title: 'account/sessions.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story
  name="Default"
  args={{
    ...args,
    kcContext: {
      sessions: {
        sessions: [
          {
            expires: '2024-04-26T18:14:19Z',
            clients: ['account'],
            ipAddress: '172.20.0.1',
            started: '2024-04-26T08:14:19Z',
            lastAccess: '2024-04-26T08:30:54Z',
            id: 'af835e30-4821-43b1-b4f7-e732d3cc15d2',
          },
          {
            expires: '2024-04-26T18:14:09Z',
            clients: ['security-admin-console', 'account'],
            ipAddress: '172.20.0.1',
            started: '2024-04-26T08:14:09Z',
            lastAccess: '2024-04-26T08:15:14Z',
            id: '60a9d8b8-617d-441e-8643-08c3fe30e231',
          },
        ],
      },
      stateChecker: 'xQ7EOgFrLi4EvnJ8dbXKhwFGWk_bkOp0X89mhilt1os',
    },
  }}
/>

<!--  -->
<Story
  name="WithError"
  args={{
    ...args,
    kcContext: {
      url: { passwordUrl: '/auth/realms/keycloakify/account/password' },
      stateChecker: 'xQ7EOgFrLi4EvnJ8dbXKhwFGWk_bkOp0X89mhilt1os',
      message: {
        summary: 'Invalid existing password.',
        type: 'error',
      },
    },
  }}
/>

<!-- /**
 * No active sessions scenario:
 * - Simulates the scenario where no sessions are active for the user.
 */ -->
<Story
  name="NoActiveSessions"
  args={{
    ...args,
    kcContext: {
      sessions: {
        sessions: [],
      },
      stateChecker: 'randomStateCheckerValue',
    },
  }}
/>

<!-- /**
 * Single session scenario:
 * - Displays only one active session with session details.
 */ -->
<Story
  name="SingleSession"
  args={{
    ...args,
    kcContext: {
      sessions: {
        sessions: [
          {
            expires: '2024-04-26T18:14:19Z',
            clients: ['account'],
            ipAddress: '172.20.0.1',
            started: '2024-04-26T08:14:19Z',
            lastAccess: '2024-04-26T08:30:54Z',
            id: 'single-session-id',
          },
        ],
      },
      stateChecker: 'anotherStateChecker',
    },
  }}
/>

<!-- /**
 * Multiple clients per session scenario:
 * - Displays sessions where each session has multiple associated clients.
 */ -->
<Story
  name="MultipleClientsSession"
  args={{
    ...args,
    kcContext: {
      sessions: {
        sessions: [
          {
            expires: '2024-04-26T18:14:19Z',
            clients: ['account', 'admin-console', 'another-client'],
            ipAddress: '172.20.0.1',
            started: '2024-04-26T08:14:19Z',
            lastAccess: '2024-04-26T08:30:54Z',
            id: 'multiple-clients-session',
          },
        ],
      },
      stateChecker: 'multiClientsStateChecker',
    },
  }}
/>

<!-- /**
 * Session without client details scenario:
 * - Simulates a session where no client information is provided.
 */ -->
<Story
  name="SessionWithoutClients"
  args={{
    ...args,
    kcContext: {
      sessions: {
        sessions: [
          {
            expires: '2024-04-26T18:14:19Z',
            clients: [], // No clients information
            ipAddress: '172.20.0.1',
            started: '2024-04-26T08:14:19Z',
            lastAccess: '2024-04-26T08:30:54Z',
            id: 'no-clients-session',
          },
        ],
      },
      stateChecker: 'noClientsStateChecker',
    },
  }}
/>
