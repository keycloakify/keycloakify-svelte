import { onMount } from 'svelte';

export function useSetClassName(params: { qualifiedName: 'html' | 'body'; className: string | undefined }) {
  const { qualifiedName, className } = params;
  onMount(() => {
    if (className && className !== '') {
      const htmlClassList = document.getElementsByTagName(qualifiedName)[0].classList;

      const tokens = className.split(' ');
      htmlClassList.add(...tokens);

      // Clean up when the component is destroyed
      return () => {
        htmlClassList.remove(...tokens);
      };
    }
  });
}
