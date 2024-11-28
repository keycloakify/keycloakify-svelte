<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'error.ftl' };
  const { Story } = defineMeta({
    title: 'login/error.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!--  -->
<Story
  name="WithAnotherMessage"
  args={{
    ...args,
    kcContext: {
      message: { summary: 'With another error message' },
    },
  }}
/>

<!--  -->
<Story
  name="WithHtmlErrorMessage"
  args={{
    ...args,
    kcContext: {
      message: {
        summary: "<strong>Error:</strong> Something went wrong. <a href='https://example.com'>Go back</a>",
      },
    },
  }}
/>

<!--  -->
<Story
  name="FrenchError"
  args={{
    ...args,
    kcContext: {
      locale: { currentLanguageTag: 'fr' },
      message: { summary: "Une erreur s'est produite" },
    },
  }}
/>

<!--  -->
<Story
  name="WithSkipLink"
  args={{
    ...args,
    kcContext: {
      message: { summary: 'An error occurred' },
      skipLink: true,
      client: {
        baseUrl: 'https://example.com',
      },
    },
  }}
/>
