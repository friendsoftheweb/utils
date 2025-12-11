import { transliterate } from './transliterate';

export function slugify(value: string): string {
  return transliterate(value)
    .toLowerCase()
    .trim()
    .replace(/\&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/\=/g, ' equals ')
    .replace(/\//g, ' slash ')
    .replace(/%/g, ' percent ')
    .replace(/(\w)\.(\w)/g, '$1 dot $2')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
