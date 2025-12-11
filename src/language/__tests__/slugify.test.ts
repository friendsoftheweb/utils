import { slugify } from '../slugify';

describe('slugify', () => {
  describe('basic functionality', () => {
    it('should convert simple strings to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('TEST STRING')).toBe('test-string');
      expect(slugify('MixedCase')).toBe('mixedcase');
    });

    it('should replace spaces with hyphens', () => {
      expect(slugify('hello world')).toBe('hello-world');
      expect(slugify('multiple   spaces   here')).toBe('multiple-spaces-here');
      expect(slugify('single space')).toBe('single-space');
    });

    it('should preserve numbers and letters', () => {
      expect(slugify('hello123world')).toBe('hello123world');
      expect(slugify('test 123 abc')).toBe('test-123-abc');
      expect(slugify('version 2.0')).toBe('version-2-dot-0');
    });
  });

  describe('special character replacement', () => {
    it('should replace ampersands with "and"', () => {
      expect(slugify('cats & dogs')).toBe('cats-and-dogs');
      expect(slugify('rock & roll')).toBe('rock-and-roll');
      expect(slugify('A&B&C')).toBe('a-and-b-and-c');
    });

    it('should replace plus signs with "plus"', () => {
      expect(slugify('C++')).toBe('c-plus-plus');
      expect(slugify('1+1=2')).toBe('1-plus-1-equals-2');
      expect(slugify('Google+')).toBe('google-plus');
    });

    it('should handle both ampersands and plus signs together', () => {
      expect(slugify('A & B + C')).toBe('a-and-b-plus-c');
      expect(slugify('cats&dogs+fun')).toBe('cats-and-dogs-plus-fun');
    });
  });

  describe('special character removal and replacement', () => {
    it('should replace punctuation with hyphens', () => {
      expect(slugify('hello, world!')).toBe('hello-world');
      expect(slugify('What? How?')).toBe('what-how');
      expect(slugify('Yes/No')).toBe('yes-slash-no');
      expect(slugify('file.txt')).toBe('file-dot-txt');
    });

    it('should replace symbols with hyphens', () => {
      expect(slugify('@username')).toBe('username');
      expect(slugify('#hashtag')).toBe('hashtag');
      expect(slugify('$money$')).toBe('money');
      expect(slugify('100%')).toBe('100-percent');
    });

    it('should handle quotes and apostrophes', () => {
      expect(slugify("it's working")).toBe('it-s-working');
      expect(slugify('"quoted text"')).toBe('quoted-text');
      expect(slugify("user's guide")).toBe('user-s-guide');
    });
  });

  describe('whitespace handling', () => {
    it('should trim leading and trailing whitespace', () => {
      expect(slugify('  hello world  ')).toBe('hello-world');
      expect(slugify('\ttest\t')).toBe('test');
      expect(slugify('\n  spaced  \n')).toBe('spaced');
    });

    it('should handle multiple consecutive whitespace characters', () => {
      expect(slugify('hello    world')).toBe('hello-world');
      expect(slugify('test\t\tvalue')).toBe('test-value');
      expect(slugify('line1\n\nline2')).toBe('line1-line2');
    });

    it('should handle mixed whitespace types', () => {
      expect(slugify('hello \t\n world')).toBe('hello-world');
      expect(slugify(' \t test \n ')).toBe('test');
    });
  });

  describe('hyphen normalization', () => {
    it('should remove leading hyphens', () => {
      expect(slugify('-hello')).toBe('hello');
      expect(slugify('--test')).toBe('test');
      expect(slugify('---multiple')).toBe('multiple');
    });

    it('should remove trailing hyphens', () => {
      expect(slugify('hello-')).toBe('hello');
      expect(slugify('test--')).toBe('test');
      expect(slugify('multiple---')).toBe('multiple');
    });

    it('should remove both leading and trailing hyphens', () => {
      expect(slugify('-hello-')).toBe('hello');
      expect(slugify('--test--')).toBe('test');
      expect(slugify('---both---')).toBe('both');
    });

    it('should collapse multiple consecutive hyphens', () => {
      expect(slugify('hello---world')).toBe('hello-world');
      expect(slugify('test!!value')).toBe('test-value');
      expect(slugify('a???b')).toBe('a-b');
    });
  });

  describe('Unicode and international characters', () => {
    it('should handle accented characters', () => {
      expect(slugify('café')).toBe('cafe');
      expect(slugify('résumé')).toBe('resume');
      expect(slugify('naïve')).toBe('naive');
    });

    it('should handle Cyrillic characters', () => {
      expect(slugify('привет')).toBe('');
      expect(slugify('hello привет world')).toBe('hello-world');
    });

    it('should handle Chinese characters', () => {
      expect(slugify('你好')).toBe('');
      expect(slugify('hello 你好 world')).toBe('hello-world');
    });

    it('should handle mixed Unicode', () => {
      expect(slugify('test ñoño test')).toBe('test-nono-test');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
      expect(slugify('\t\n')).toBe('');
    });

    it('should handle single characters', () => {
      expect(slugify('a')).toBe('a');
      expect(slugify('A')).toBe('a');
      expect(slugify('1')).toBe('1');
      expect(slugify('&')).toBe('and');
      expect(slugify('+')).toBe('plus');
    });
  });

  describe('real-world examples', () => {
    it('should handle blog post titles', () => {
      expect(slugify('How to Build Amazing Web Apps')).toBe(
        'how-to-build-amazing-web-apps',
      );

      expect(slugify('10 Tips & Tricks for JavaScript')).toBe(
        '10-tips-and-tricks-for-javascript',
      );

      expect(slugify('React vs Vue: Which is Better?')).toBe(
        'react-vs-vue-which-is-better',
      );
    });

    it('should handle product names', () => {
      expect(slugify('iPhone 15 Pro Max')).toBe('iphone-15-pro-max');

      expect(slugify('MacBook Pro (M3)')).toBe('macbook-pro-m3');

      expect(slugify('PlayStation 5')).toBe('playstation-5');
    });

    it('should handle file names', () => {
      expect(slugify('my_document.pdf')).toBe('my-document-dot-pdf');

      expect(slugify('backup-2024-01-15.zip')).toBe(
        'backup-2024-01-15-dot-zip',
      );

      expect(slugify('IMG_20240115_143022.jpg')).toBe(
        'img-20240115-143022-dot-jpg',
      );
    });

    it('should handle programming terms', () => {
      expect(slugify('JavaScript & TypeScript')).toBe(
        'javascript-and-typescript',
      );

      expect(slugify('C++ Programming')).toBe('c-plus-plus-programming');

      expect(slugify('Node.js API')).toBe('node-dot-js-api');

      expect(slugify('React.createElement()')).toBe('react-dot-createelement');
    });

    it('should handle company names', () => {
      expect(slugify('Johnson & Johnson')).toBe('johnson-and-johnson');

      expect(slugify('AT&T')).toBe('at-and-t');

      expect(slugify('H&M')).toBe('h-and-m');
    });

    it('should handle social media content', () => {
      expect(slugify('#JavaScript is awesome!')).toBe('javascript-is-awesome');

      expect(slugify('@username replied')).toBe('username-replied');

      expect(slugify('Check this out: https://example.com')).toBe(
        'check-this-out-https-slash-slash-example-dot-com',
      );
    });
  });

  describe('URL-safe output', () => {
    it('should produce URL-safe slugs', () => {
      const testCases = [
        'Hello World!',
        'Special @#$% Characters',
        'Números & Símbolos + Más',
        '   Leading and trailing spaces   ',
      ];

      testCases.forEach((testCase) => {
        const result = slugify(testCase);

        // Should not start or end with hyphen
        expect(result).not.toMatch(/^-|-$/);

        // Should only contain lowercase letters, numbers, and hyphens
        expect(result).toMatch(/^[a-z0-9-]*$/);

        // Should not have consecutive hyphens
        expect(result).not.toMatch(/--/);
      });
    });

    it('should be suitable for URLs', () => {
      const titles = [
        'How to Learn Programming in 2024',
        'Top 10 JavaScript Frameworks & Libraries',
        'Building APIs with Node.js + Express',
      ];

      titles.forEach((title) => {
        const slug = slugify(title);
        const url = `https://example.com/blog/${slug}`;

        // Should be a valid URL component
        expect(slug).toBe(encodeURIComponent(slug));
        expect(url).toMatch(/^https:\/\/example\.com\/blog\/[a-z0-9-]+$/);
      });
    });
  });
});
