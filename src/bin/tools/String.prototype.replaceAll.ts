/* eslint-disable @typescript-eslint/no-explicit-any */
export function replaceAll(string: string, searchValue: string | RegExp, replaceValue: string): string {
  if ((string as any).replaceAll !== undefined) {
    return (string as any).replaceAll(searchValue, replaceValue);
  }

  // If the searchValue is a string
  if (typeof searchValue === 'string') {
    // Escape special characters in the string to be used in a regex
    const escapedSearchValue = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSearchValue, 'g');

    return string.replace(regex, replaceValue);
  }

  // If the searchValue is a global RegExp, use it directly
  if (searchValue instanceof RegExp && searchValue.global) {
    return string.replace(searchValue, replaceValue);
  }

  // If the searchValue is a non-global RegExp, throw an error
  if (searchValue instanceof RegExp) {
    throw new TypeError('replaceAll must be called with a global RegExp');
  }

  // Convert searchValue to string if it's not a string or RegExp
  const searchString = String(searchValue);
  const regexFromString = new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

  return string.replace(regexFromString, replaceValue);
}
