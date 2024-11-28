<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'code.ftl' };
  const { Story } = defineMeta({
    title: 'KcPageStory',
    component: KcPageStory,
    args: args,
  });
</script>

<Story name="Default" />

<!--  -->
<Story
  name="WithErrorCode"
  args={{
    ...args,
    kcContext: {
      code: {
        success: false,
        error: 'Failed to generate code',
      },
    },
  }}
/>

<!--  -->
<Story
  name="WithFrenchLanguage"
  args={{
    ...args,
    kcContext: {
      locale: {
        currentLanguageTag: 'fr',
      },
      code: {
        success: true,
        code: 'XYZ789',
      },
    },
  }}
/>

<!--  -->
<Story
  name="WithHtmlErrorMessage"
  args={{
    ...args,
    kcContext: {
      code: {
        success: false,
        error: "Something went wrong. <a href='https://example.com'>Try again</a>",
      },
    },
  }}
/>
