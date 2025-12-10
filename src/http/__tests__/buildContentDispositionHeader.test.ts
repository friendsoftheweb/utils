import { buildContentDispositionHeader } from '../buildContentDispositionHeader';

describe('buildContentDispositionHeader', () => {
  describe('basic functionality', () => {
    it('should create an attachment header for simple filename', () => {
      const result = buildContentDispositionHeader('document.pdf');
      expect(result).toBe(
        'attachment; filename="document.pdf"; filename*=UTF-8\'\'document.pdf',
      );
    });

    it('should create an inline header when inline option is true', () => {
      const result = buildContentDispositionHeader('image.jpg', {
        inline: true,
      });
      expect(result).toBe(
        'inline; filename="image.jpg"; filename*=UTF-8\'\'image.jpg',
      );
    });

    it('should create an attachment header when inline option is false', () => {
      const result = buildContentDispositionHeader('file.txt', {
        inline: false,
      });
      expect(result).toBe(
        'attachment; filename="file.txt"; filename*=UTF-8\'\'file.txt',
      );
    });

    it('should default to attachment when no options provided', () => {
      const result = buildContentDispositionHeader('file.txt');
      expect(result).toBe(
        'attachment; filename="file.txt"; filename*=UTF-8\'\'file.txt',
      );
    });

    it('should default to attachment when empty options provided', () => {
      const result = buildContentDispositionHeader('file.txt', {});
      expect(result).toBe(
        'attachment; filename="file.txt"; filename*=UTF-8\'\'file.txt',
      );
    });
  });

  describe('filename sanitization', () => {
    it('should sanitize double quotes in filename', () => {
      const result = buildContentDispositionHeader('my"file".txt');
      expect(result).toBe(
        'attachment; filename="my_file_.txt"; filename*=UTF-8\'\'my%22file%22.txt',
      );
    });

    it('should sanitize backslashes in filename', () => {
      const result = buildContentDispositionHeader('folder\\file.txt');
      expect(result).toBe(
        'attachment; filename="folder_file.txt"; filename*=UTF-8\'\'folder%5Cfile.txt',
      );
    });

    it('should sanitize newlines in filename', () => {
      const result = buildContentDispositionHeader('file\nwith\nnewlines.txt');
      expect(result).toBe(
        'attachment; filename="file_with_newlines.txt"; filename*=UTF-8\'\'file%0Awith%0Anewlines.txt',
      );
    });

    it('should sanitize carriage returns in filename', () => {
      const result = buildContentDispositionHeader('file\rwith\rreturns.txt');
      expect(result).toBe(
        'attachment; filename="file_with_returns.txt"; filename*=UTF-8\'\'file%0Dwith%0Dreturns.txt',
      );
    });

    it('should sanitize semicolons in filename', () => {
      const result = buildContentDispositionHeader('file;with;semicolons.txt');
      expect(result).toBe(
        'attachment; filename="file_with_semicolons.txt"; filename*=UTF-8\'\'file%3Bwith%3Bsemicolons.txt',
      );
    });

    it('should sanitize multiple problematic characters', () => {
      const result = buildContentDispositionHeader('bad"file\\name;\r\n.txt');
      expect(result).toBe(
        'attachment; filename="bad_file_name___.txt"; filename*=UTF-8\'\'bad%22file%5Cname%3B%0D%0A.txt',
      );
    });
  });

  describe('Unicode and special characters', () => {
    it('should handle Unicode characters correctly', () => {
      const result = buildContentDispositionHeader('файл.txt');
      expect(result).toBe(
        'attachment; filename="файл.txt"; filename*=UTF-8\'\'%D1%84%D0%B0%D0%B9%D0%BB.txt',
      );
    });

    it('should handle emojis in filename', () => {
      const result = buildContentDispositionHeader('📄document.pdf');
      expect(result).toBe(
        'attachment; filename="📄document.pdf"; filename*=UTF-8\'\'%F0%9F%93%84document.pdf',
      );
    });

    it('should handle Chinese characters', () => {
      const result = buildContentDispositionHeader('文档.pdf');
      expect(result).toBe(
        'attachment; filename="文档.pdf"; filename*=UTF-8\'\'%E6%96%87%E6%A1%A3.pdf',
      );
    });

    it('should handle accented characters', () => {
      const result = buildContentDispositionHeader('résumé.pdf');
      expect(result).toBe(
        'attachment; filename="résumé.pdf"; filename*=UTF-8\'\'r%C3%A9sum%C3%A9.pdf',
      );
    });

    it('should properly encode single quotes in filename*', () => {
      const result = buildContentDispositionHeader("user's-file.txt");
      expect(result).toBe(
        "attachment; filename=\"user's-file.txt\"; filename*=UTF-8''user%27s-file.txt",
      );
    });
  });

  describe('RFC compliance', () => {
    it('should follow RFC 6266 format for Content-Disposition header', () => {
      const result = buildContentDispositionHeader('test.txt');

      // Should contain disposition type
      expect(result).toMatch(/^(attachment|inline);/);

      // Should contain filename parameter
      expect(result).toMatch(/filename="[^"]*"/);

      // Should contain filename* parameter with UTF-8 encoding
      expect(result).toMatch(/filename\*=UTF-8''[^;]*$/);
    });

    it('should provide both filename and filename* for browser compatibility', () => {
      const result = buildContentDispositionHeader('tëst.txt');

      // Legacy filename parameter for older browsers
      expect(result).toContain('filename="tëst.txt"');

      // RFC 5987 encoded filename* for modern browsers
      expect(result).toContain("filename*=UTF-8''t%C3%ABst.txt");
    });
  });
});
