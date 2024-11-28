<script
  context="module"
  lang="ts"
>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { KcPageStoryProps } from '../KcPageStory';
  import KcPageStory from '../KcPageStory.svelte';

  const args: KcPageStoryProps = { pageId: 'terms.ftl' };
  const { Story } = defineMeta({
    title: 'login/terms.ftl',
    component: KcPageStory,
    args: args,
  });
</script>

<Story
  name="Default"
  args={{
    ...args,
    kcContext: {
      'x-keycloakify': {
        messages: {
          termsText: '<p>My terms in <strong>English</strong></p>',
        },
      },
    },
  }}
/>

<!--  -->
<Story
  name="French"
  args={{
    ...args,
    kcContext: {
      locale: {
        currentLanguageTag: 'fr',
      },
      'x-keycloakify': {
        // cSpell: disable
        messages: {
          termsText: '<p>Mes terme en <strong>Français</strong></p>',
        },
        // cSpell: enable
      },
    },
  }}
/>

<!--  -->
<Story
  name="Spanish"
  args={{
    ...args,
    kcContext: {
      locale: {
        currentLanguageTag: 'es',
      },
      'x-keycloakify': {
        messages: {
          termsText: '<p>Mis términos en <strong>Español</strong></p>',
        },
      },
    },
  }}
/>

<!--  -->
<Story
  name="LongMessage"
  args={{
    ...args,
    kcContext: {
      'x-keycloakify': {
        messages: {
          termsText: `
              <p>These are the terms and conditions. Please read them carefully.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
              <p>Cras vehicula diam vel metus faucibus, at scelerisque lacus pretium. Donec ac consectetur justo. Morbi in sollicitudin nulla.</p>
              <p>Suspendisse potenti. Phasellus pharetra consequat ante, at dictum ligula volutpat a. Quisque ultricies velit nec nulla gravida accumsan.</p>
              <p>Curabitur tristique, magna id hendrerit tristique, enim nunc laoreet erat, non accumsan lacus arcu et nulla.</p>
              <p>Fusce feugiat nisi orci, in placerat dui luctus ut. Suspendisse in velit eu urna auctor consequat a euismod enim.</p>
              <p>Etiam et massa a sapien pharetra mollis. In lacinia quam id libero tincidunt, at egestas felis viverra.</p>
              <p>Nunc pulvinar imperdiet facilisis. Curabitur ultricies dictum lectus, nec consectetur metus fringilla id.</p>
              <p><strong>Please accept the terms to proceed.</strong></p>
          `,
        },
      },
    },
  }}
/>
