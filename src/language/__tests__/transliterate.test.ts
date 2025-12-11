import { transliterate } from '../transliterate';

describe('transliterate', () => {
  describe('Latin-1 Supplement', () => {
    it('all relevant characters are handled', () => {
      const exceptions = [0x00d7, 0x00de, 0x00f7, 0x00fe];

      for (let code = 0x00c0; code <= 0x00ff; code++) {
        if (exceptions.includes(code)) {
          continue;
        }

        const character = String.fromCharCode(code);

        expect(transliterate(character)).not.toBe(character);
      }
    });
  });

  describe('Latin Extended-A', () => {
    it('all relevant characters are handled', () => {
      const exceptions = [0x0138];

      for (let code = 0x0100; code <= 0x017f; code++) {
        if (exceptions.includes(code)) {
          continue;
        }

        const character = String.fromCharCode(code);

        expect(transliterate(character)).not.toBe(character);
      }
    });
  });

  describe('Latin Extended-B', () => {
    it('all relevant characters are handled', () => {
      const exceptions = [
        0x01dd, 0x01e4, 0x01e5, 0x01ee, 0x01ef, 0x01f6, 0x01f7, 0x021c, 0x021d,
        0x0220, 0x0221, 0x0222, 0x0223, 0x0224, 0x0225,
      ];

      for (let code = 0x01c4; code <= 0x0233; code++) {
        if (exceptions.includes(code)) {
          continue;
        }

        const character = String.fromCharCode(code);

        expect(transliterate(character)).not.toBe(character);
      }
    });
  });

  describe('Latin Extended Additional', () => {
    it('all relevant characters are handled', () => {
      const exceptions = [0x1e9c, 0x1e9d, 0x1e9f];

      for (let i = 0x1e00; i <= 0x1ef9; i++) {
        if (exceptions.includes(i)) {
          continue;
        }

        const character = String.fromCharCode(i);

        expect(transliterate(character)).not.toBe(character);
      }
    });
  });

  describe('uppercase letters', () => {
    it('should remove diacritics from A variants', () => {
      expect(transliterate('À')).toBe('A');
      expect(transliterate('Á')).toBe('A');
      expect(transliterate('Â')).toBe('A');
      expect(transliterate('Ä')).toBe('A');
      expect(transliterate('Ã')).toBe('A');
      expect(transliterate('Å')).toBe('A');
      expect(transliterate('Ā')).toBe('A');
      expect(transliterate('Ă')).toBe('A');
      expect(transliterate('Ą')).toBe('A');
    });

    it('should handle special A variants', () => {
      expect(transliterate('Æ')).toBe('AE');
    });

    it('should remove diacritics from C variants', () => {
      expect(transliterate('Ç')).toBe('C');
      expect(transliterate('Ć')).toBe('C');
      expect(transliterate('Č')).toBe('C');
      expect(transliterate('Ĉ')).toBe('C');
      expect(transliterate('Ċ')).toBe('C');
    });

    it('should remove diacritics from E variants', () => {
      expect(transliterate('É')).toBe('E');
      expect(transliterate('È')).toBe('E');
      expect(transliterate('Ê')).toBe('E');
      expect(transliterate('Ë')).toBe('E');
      expect(transliterate('Ē')).toBe('E');
      expect(transliterate('Ė')).toBe('E');
      expect(transliterate('Ę')).toBe('E');
    });

    it('should remove diacritics from G variants', () => {
      expect(transliterate('Ĝ')).toBe('G');
    });

    it('should remove diacritics from H variants', () => {
      expect(transliterate('Ĥ')).toBe('H');
      expect(transliterate('Ħ')).toBe('H');
    });

    it('should remove diacritics from I variants', () => {
      expect(transliterate('Í')).toBe('I');
      expect(transliterate('Ì')).toBe('I');
      expect(transliterate('Ï')).toBe('I');
      expect(transliterate('Î')).toBe('I');
      expect(transliterate('Ī')).toBe('I');
      expect(transliterate('Į')).toBe('I');
      expect(transliterate('İ')).toBe('I');
    });

    it('should remove diacritics from J variants', () => {
      expect(transliterate('Ĵ')).toBe('J');
    });

    it('should remove diacritics from K variants', () => {
      expect(transliterate('Ķ')).toBe('K');
    });

    it('should remove diacritics from L variants', () => {
      expect(transliterate('Ĺ')).toBe('L');
      expect(transliterate('Ł')).toBe('L');
    });

    it('should remove diacritics from N variants', () => {
      expect(transliterate('Ñ')).toBe('N');
      expect(transliterate('Ń')).toBe('N');
      expect(transliterate('Ň')).toBe('N');
      expect(transliterate('Ņ')).toBe('N');
      expect(transliterate('Ŋ')).toBe('N');
    });

    it('should remove diacritics from O variants', () => {
      expect(transliterate('Ó')).toBe('O');
      expect(transliterate('Ò')).toBe('O');
      expect(transliterate('Ö')).toBe('O');
      expect(transliterate('Ô')).toBe('O');
      expect(transliterate('Õ')).toBe('O');
      expect(transliterate('Ø')).toBe('O');
      expect(transliterate('Ō')).toBe('O');
      expect(transliterate('Ő')).toBe('O');
    });

    it('should remove diacritics from R variants', () => {
      expect(transliterate('Ŕ')).toBe('R');
      expect(transliterate('Ř')).toBe('R');
    });

    it('should remove diacritics from S variants', () => {
      expect(transliterate('Š')).toBe('S');
      expect(transliterate('Ś')).toBe('S');
      expect(transliterate('Ş')).toBe('S');
      expect(transliterate('Ŝ')).toBe('S');
    });

    it('should remove diacritics from T variants', () => {
      expect(transliterate('Ţ')).toBe('T');
    });

    it('should remove diacritics from U variants', () => {
      expect(transliterate('Ú')).toBe('U');
      expect(transliterate('Ù')).toBe('U');
      expect(transliterate('Ü')).toBe('U');
      expect(transliterate('Û')).toBe('U');
      expect(transliterate('Ū')).toBe('U');
      expect(transliterate('Ů')).toBe('U');
      expect(transliterate('Ű')).toBe('U');
    });

    it('should remove diacritics from W variants', () => {
      expect(transliterate('Ŵ')).toBe('W');
    });

    it('should remove diacritics from Y variants', () => {
      expect(transliterate('Ý')).toBe('Y');
      expect(transliterate('Ÿ')).toBe('Y');
    });

    it('should remove diacritics from Z variants', () => {
      expect(transliterate('Ž')).toBe('Z');
      expect(transliterate('Ź')).toBe('Z');
      expect(transliterate('Ż')).toBe('Z');
    });
  });

  describe('lowercase letters', () => {
    it('should remove diacritics from a variants', () => {
      expect(transliterate('á')).toBe('a');
      expect(transliterate('å')).toBe('a');
      expect(transliterate('ä')).toBe('a');
      expect(transliterate('â')).toBe('a');
      expect(transliterate('ã')).toBe('a');
      expect(transliterate('à')).toBe('a');
      expect(transliterate('ā')).toBe('a');
      expect(transliterate('ă')).toBe('a');
      expect(transliterate('ą')).toBe('a');
    });

    it('should handle special a variants', () => {
      expect(transliterate('æ')).toBe('ae');
    });

    it('should remove diacritics from c variants', () => {
      expect(transliterate('ç')).toBe('c');
      expect(transliterate('ć')).toBe('c');
      expect(transliterate('č')).toBe('c');
      expect(transliterate('ĉ')).toBe('c');
      expect(transliterate('ċ')).toBe('c');
    });

    it('should remove diacritics from d variants', () => {
      expect(transliterate('đ')).toBe('d');
    });

    it('should remove diacritics from e variants', () => {
      expect(transliterate('é')).toBe('e');
      expect(transliterate('è')).toBe('e');
      expect(transliterate('ë')).toBe('e');
      expect(transliterate('ê')).toBe('e');
      expect(transliterate('ē')).toBe('e');
      expect(transliterate('ė')).toBe('e');
      expect(transliterate('ę')).toBe('e');
    });

    it('should remove diacritics from g variants', () => {
      expect(transliterate('ğ')).toBe('g');
      expect(transliterate('ĝ')).toBe('g');
    });

    it('should remove diacritics from h variants', () => {
      expect(transliterate('ĥ')).toBe('h');
      expect(transliterate('ħ')).toBe('h');
    });

    it('should remove diacritics from i variants', () => {
      expect(transliterate('í')).toBe('i');
      expect(transliterate('ì')).toBe('i');
      expect(transliterate('ï')).toBe('i');
      expect(transliterate('î')).toBe('i');
      expect(transliterate('ī')).toBe('i');
      expect(transliterate('į')).toBe('i');
      expect(transliterate('ı')).toBe('i');
    });

    it('should remove diacritics from j variants', () => {
      expect(transliterate('ĵ')).toBe('j');
    });

    it('should remove diacritics from k variants', () => {
      expect(transliterate('ķ')).toBe('k');
    });

    it('should remove diacritics from l variants', () => {
      expect(transliterate('ĺ')).toBe('l');
      expect(transliterate('ł')).toBe('l');
    });

    it('should remove diacritics from n variants', () => {
      expect(transliterate('ñ')).toBe('n');
      expect(transliterate('ń')).toBe('n');
      expect(transliterate('ň')).toBe('n');
      expect(transliterate('ņ')).toBe('n');
      expect(transliterate('ŋ')).toBe('n');
    });

    it('should remove diacritics from o variants', () => {
      expect(transliterate('ó')).toBe('o');
      expect(transliterate('ò')).toBe('o');
      expect(transliterate('ö')).toBe('o');
      expect(transliterate('ô')).toBe('o');
      expect(transliterate('õ')).toBe('o');
      expect(transliterate('ø')).toBe('o');
      expect(transliterate('ō')).toBe('o');
      expect(transliterate('ő')).toBe('o');
    });

    it('should remove diacritics from r variants', () => {
      expect(transliterate('ŕ')).toBe('r');
      expect(transliterate('ř')).toBe('r');
    });

    it('should remove diacritics from s variants', () => {
      expect(transliterate('š')).toBe('s');
      expect(transliterate('ś')).toBe('s');
      expect(transliterate('ş')).toBe('s');
      expect(transliterate('ŝ')).toBe('s');
    });

    it('should handle special s variants', () => {
      expect(transliterate('ß')).toBe('ss');
    });

    it('should remove diacritics from t variants', () => {
      expect(transliterate('ţ')).toBe('t');
    });

    it('should remove diacritics from u variants', () => {
      expect(transliterate('ú')).toBe('u');
      expect(transliterate('ù')).toBe('u');
      expect(transliterate('ü')).toBe('u');
      expect(transliterate('û')).toBe('u');
      expect(transliterate('ū')).toBe('u');
      expect(transliterate('ů')).toBe('u');
      expect(transliterate('ű')).toBe('u');
    });

    it('should remove diacritics from w variants', () => {
      expect(transliterate('ŵ')).toBe('w');
    });

    it('should remove diacritics from y variants', () => {
      expect(transliterate('ÿ')).toBe('y');
      expect(transliterate('ý')).toBe('y');
    });

    it('should remove diacritics from z variants', () => {
      expect(transliterate('ž')).toBe('z');
      expect(transliterate('ź')).toBe('z');
      expect(transliterate('ż')).toBe('z');
    });
  });

  describe('mixed text', () => {
    it('should handle words with multiple diacritics', () => {
      expect(transliterate('café')).toBe('cafe');
      expect(transliterate('naïve')).toBe('naive');
      expect(transliterate('résumé')).toBe('resume');
      expect(transliterate('piñata')).toBe('pinata');
      expect(transliterate('façade')).toBe('facade');
    });

    it('should handle sentences with diacritics', () => {
      expect(transliterate('The café serves excellent crêpes')).toBe(
        'The cafe serves excellent crepes',
      );
      expect(transliterate('José lives in São Paulo')).toBe(
        'Jose lives in Sao Paulo',
      );
      expect(transliterate('Zürich is in Österreich')).toBe(
        'Zurich is in Osterreich',
      );
    });

    it('should preserve spaces and punctuation', () => {
      expect(transliterate('Hola, ¿cómo estás?')).toBe('Hola, ¿como estas?');
      expect(transliterate('À bientôt!')).toBe('A bientot!');
      expect(transliterate('Señor García, ¡buenos días!')).toBe(
        'Senor Garcia, ¡buenos dias!',
      );
    });

    it('should handle mixed case', () => {
      expect(transliterate('CAFÉ')).toBe('CAFE');
      expect(transliterate('Café')).toBe('Cafe');
      expect(transliterate('cAfÉ')).toBe('cAfE');
    });
  });

  describe('language-specific examples', () => {
    it('should handle French text', () => {
      expect(transliterate('français')).toBe('francais');
      expect(transliterate('très bien')).toBe('tres bien');
      expect(transliterate('hôtel')).toBe('hotel');
      expect(transliterate('coûter')).toBe('couter');
      expect(transliterate('élève')).toBe('eleve');
    });

    it('should handle German text', () => {
      expect(transliterate('Mädchen')).toBe('Madchen');
      expect(transliterate('München')).toBe('Munchen');
      expect(transliterate('Größe')).toBe('Grosse');
      expect(transliterate('Straße')).toBe('Strasse');
    });

    it('should handle Spanish text', () => {
      expect(transliterate('niño')).toBe('nino');
      expect(transliterate('mañana')).toBe('manana');
      expect(transliterate('José María')).toBe('Jose Maria');
      expect(transliterate('corazón')).toBe('corazon');
    });

    it('should handle Italian text', () => {
      expect(transliterate('così')).toBe('cosi');
      expect(transliterate('perché')).toBe('perche');
      expect(transliterate('più')).toBe('piu');
      expect(transliterate('città')).toBe('citta');
    });

    it('should handle Portuguese text', () => {
      expect(transliterate('ação')).toBe('acao');
      expect(transliterate('coração')).toBe('coracao');
      expect(transliterate('São Paulo')).toBe('Sao Paulo');
      expect(transliterate('não')).toBe('nao');
    });

    it('should handle Polish text', () => {
      expect(transliterate('łóżko')).toBe('lozko');
      expect(transliterate('ćwiczenie')).toBe('cwiczenie');
      expect(transliterate('świat')).toBe('swiat');
      expect(transliterate('żółć')).toBe('zolc');
    });

    it('should handle Czech text', () => {
      expect(transliterate('škola')).toBe('skola');
      expect(transliterate('děkuji')).toBe('dekuji');
      expect(transliterate('český')).toBe('cesky');
      expect(transliterate('řeka')).toBe('reka');
    });

    it('should handle Turkish text', () => {
      expect(transliterate('Türkçe')).toBe('Turkce');
      expect(transliterate('şehir')).toBe('sehir');
      expect(transliterate('Gümüş')).toBe('Gumus');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(transliterate('')).toBe('');
    });

    it('should handle strings without diacritics', () => {
      expect(transliterate('hello world')).toBe('hello world');
      expect(transliterate('12345')).toBe('12345');
      expect(transliterate('ABC123xyz')).toBe('ABC123xyz');
    });

    it('should handle strings with only diacritics', () => {
      expect(transliterate('áéíóú')).toBe('aeiou');
      expect(transliterate('ÀÈÌÒÙ')).toBe('AEIOU');
      expect(transliterate('ñçß')).toBe('ncss');
    });

    it('should handle special characters and symbols', () => {
      expect(transliterate('café@email.com')).toBe('cafe@email.com');
      expect(transliterate('résumé.pdf')).toBe('resume.pdf');
      expect(transliterate('$100 für etwas')).toBe('$100 fur etwas');
    });

    it('should handle numbers mixed with diacritics', () => {
      expect(transliterate('2023 año')).toBe('2023 ano');
      expect(transliterate('café #1')).toBe('cafe #1');
      expect(transliterate('50% más')).toBe('50% mas');
    });
  });

  describe('real-world use cases', () => {
    it('should normalize names for search', () => {
      expect(transliterate('José María García')).toBe('Jose Maria Garcia');
      expect(transliterate('François Müller')).toBe('Francois Muller');
      expect(transliterate('Øyvind Åse')).toBe('Oyvind Ase');
    });

    it('should normalize addresses', () => {
      expect(transliterate('Rua São João, 123')).toBe('Rua Sao Joao, 123');
      expect(transliterate('Straße der Einheit')).toBe('Strasse der Einheit');
      expect(transliterate("Château d'If")).toBe("Chateau d'If");
    });

    it('should normalize file names', () => {
      expect(transliterate('résumé.pdf')).toBe('resume.pdf');
      expect(transliterate('présentation.ppt')).toBe('presentation.ppt');
      expect(transliterate('español_básico.doc')).toBe('espanol_basico.doc');
    });

    it('should normalize URLs/slugs', () => {
      expect(transliterate('artículo-sobre-programación')).toBe(
        'articulo-sobre-programacion',
      );

      expect(transliterate('café-près-de-chez-nous')).toBe(
        'cafe-pres-de-chez-nous',
      );

      expect(transliterate('tschüss-und-danke')).toBe('tschuss-und-danke');
    });

    it('should normalize email addresses', () => {
      expect(transliterate('josé.garcía@email.com')).toBe(
        'jose.garcia@email.com',
      );
      expect(transliterate('françois@café.fr')).toBe('francois@cafe.fr');
    });

    it('should preserve non-diacritic Unicode characters', () => {
      // Should not affect characters not covered by the function
      expect(transliterate('hello 世界')).toBe('hello 世界');
      expect(transliterate('café مرحبا')).toBe('cafe مرحبا');
      expect(transliterate('résumé русский')).toBe('resume русский');
    });
  });

  describe('performance and consistency', () => {
    it('should be idempotent', () => {
      const text = 'café résumé naïve';
      const once = transliterate(text);
      const twice = transliterate(once);
      expect(once).toBe(twice);
    });

    it('should handle all supported characters consistently', () => {
      // Test that uppercase and lowercase variants map to the same base letter
      const uppercases = 'ÀÁÂÄÆÃÅĀĂĄ';
      const lowercases = 'àáâäæãåāăą';

      const upperResult = transliterate(uppercases);
      const lowerResult = transliterate(lowercases);

      expect(upperResult.toLowerCase()).toBe(lowerResult);
    });
  });
});
