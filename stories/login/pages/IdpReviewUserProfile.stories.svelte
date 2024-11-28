<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'idp-review-user-profile.ftl' };
  const { Story } = defineMeta({
    title: 'login/idp-review-user-profile.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!--  -->
<Story
  name="WithFormValidationErrors"
  args={{
    ...args,
    kcContext: {
      messagesPerField: {
        existsError: (fieldName: string) => ['email', 'firstName'].includes(fieldName),
        get: (fieldName: string) => {
          if (fieldName === 'email') return 'Invalid email format.';
          if (fieldName === 'firstName') return 'First name is required.';
        },
      },
    },
  }}
/>

<!--  -->
<Story
  name="WithReadOnlyFields"
  args={{
    ...args,
    kcContext: {
      profile: {
        attributesByName: {
          email: { value: 'jane.doe@example.com', readOnly: true },
          firstName: { value: 'Jane', readOnly: false },
        },
      },
    },
  }}
/>

<!--  -->
<Story
  name="WithPrefilledFormFields"
  args={{
    ...args,
    kcContext: {
      profile: {
        attributesByName: {
          firstName: { value: 'Jane' },
          lastName: { value: 'Doe' },
          email: { value: 'jane.doe@example.com' },
        },
      },
    },
  }}
/>
