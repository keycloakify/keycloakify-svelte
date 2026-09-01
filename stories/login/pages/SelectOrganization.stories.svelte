<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'select-organization.ftl' };
  const { Story } = defineMeta({
    title: 'login/select-organization.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!--  -->
<Story
  name="WithManyOrganizations"
  args={{
    ...args,
    kcContext: {
      user: {
        organizations: [
          { alias: 'acme-corp', name: 'Acme Corp' },
          { alias: 'globex', name: 'Globex' },
          { alias: 'initech', name: 'Initech' },
          { alias: 'umbrella', name: 'Umbrella Corp' },
          { alias: 'wayne-enterprises', name: 'Wayne Enterprises' },
        ],
      },
    },
  }}
/>

<!--  -->
<Story
  name="WithoutDisplayName"
  args={{
    ...args,
    kcContext: {
      user: {
        organizations: [{ alias: 'acme-corp' }, { alias: 'globex' }],
      },
    },
  }}
/>
