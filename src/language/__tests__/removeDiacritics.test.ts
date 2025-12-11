import { removeDiacritics } from '../removeDiacritics';

describe('removeDiacritics', () => {
  describe('uppercase letters', () => {
    it('should remove diacritics from A variants', () => {
      expect(removeDiacritics('À')).toBe('A');
      expect(removeDiacritics('Á')).toBe('A');
      expect(removeDiacritics('Â')).toBe('A');
      expect(removeDiacritics('Ä')).toBe('A');
      expect(removeDiacritics('Ã')).toBe('A');
      expect(removeDiacritics('Å')).toBe('A');
      expect(removeDiacritics('Ā')).toBe('A');
      expect(removeDiacritics('Ă')).toBe('A');
      expect(removeDiacritics('Ą')).toBe('A');
    });

    it('should handle special A variants', () => {
      expect(removeDiacritics('Æ')).toBe('AE');
    });

    it('should remove diacritics from C variants', () => {
      expect(removeDiacritics('Ç')).toBe('C');
      expect(removeDiacritics('Ć')).toBe('C');
      expect(removeDiacritics('Č')).toBe('C');
      expect(removeDiacritics('Ĉ')).toBe('C');
      expect(removeDiacritics('Ċ')).toBe('C');
    });

    it('should remove diacritics from E variants', () => {
      expect(removeDiacritics('É')).toBe('E');
      expect(removeDiacritics('È')).toBe('E');
      expect(removeDiacritics('Ê')).toBe('E');
      expect(removeDiacritics('Ë')).toBe('E');
      expect(removeDiacritics('Ē')).toBe('E');
      expect(removeDiacritics('Ė')).toBe('E');
      expect(removeDiacritics('Ę')).toBe('E');
    });

    it('should remove diacritics from G variants', () => {
      expect(removeDiacritics('Ĝ')).toBe('G');
    });

    it('should remove diacritics from H variants', () => {
      expect(removeDiacritics('Ĥ')).toBe('H');
      expect(removeDiacritics('Ħ')).toBe('H');
    });

    it('should remove diacritics from I variants', () => {
      expect(removeDiacritics('Í')).toBe('I');
      expect(removeDiacritics('Ì')).toBe('I');
      expect(removeDiacritics('Ï')).toBe('I');
      expect(removeDiacritics('Î')).toBe('I');
      expect(removeDiacritics('Ī')).toBe('I');
      expect(removeDiacritics('Į')).toBe('I');
      expect(removeDiacritics('İ')).toBe('I');
    });

    it('should remove diacritics from J variants', () => {
      expect(removeDiacritics('Ĵ')).toBe('J');
    });

    it('should remove diacritics from K variants', () => {
      expect(removeDiacritics('Ķ')).toBe('K');
    });

    it('should remove diacritics from L variants', () => {
      expect(removeDiacritics('Ĺ')).toBe('L');
      expect(removeDiacritics('Ł')).toBe('L');
    });

    it('should remove diacritics from N variants', () => {
      expect(removeDiacritics('Ñ')).toBe('N');
      expect(removeDiacritics('Ń')).toBe('N');
      expect(removeDiacritics('Ň')).toBe('N');
      expect(removeDiacritics('Ņ')).toBe('N');
      expect(removeDiacritics('Ŋ')).toBe('N');
    });

    it('should remove diacritics from O variants', () => {
      expect(removeDiacritics('Ó')).toBe('O');
      expect(removeDiacritics('Ò')).toBe('O');
      expect(removeDiacritics('Ö')).toBe('O');
      expect(removeDiacritics('Ô')).toBe('O');
      expect(removeDiacritics('Õ')).toBe('O');
      expect(removeDiacritics('Ø')).toBe('O');
      expect(removeDiacritics('Ō')).toBe('O');
      expect(removeDiacritics('Ő')).toBe('O');
    });

    it('should remove diacritics from R variants', () => {
      expect(removeDiacritics('Ŕ')).toBe('R');
      expect(removeDiacritics('Ř')).toBe('R');
    });

    it('should remove diacritics from S variants', () => {
      expect(removeDiacritics('Š')).toBe('S');
      expect(removeDiacritics('Ś')).toBe('S');
      expect(removeDiacritics('Ş')).toBe('S');
      expect(removeDiacritics('Ŝ')).toBe('S');
    });

    it('should remove diacritics from T variants', () => {
      expect(removeDiacritics('Ţ')).toBe('T');
    });

    it('should remove diacritics from U variants', () => {
      expect(removeDiacritics('Ú')).toBe('U');
      expect(removeDiacritics('Ù')).toBe('U');
      expect(removeDiacritics('Ü')).toBe('U');
      expect(removeDiacritics('Û')).toBe('U');
      expect(removeDiacritics('Ū')).toBe('U');
      expect(removeDiacritics('Ů')).toBe('U');
      expect(removeDiacritics('Ű')).toBe('U');
    });

    it('should remove diacritics from W variants', () => {
      expect(removeDiacritics('Ŵ')).toBe('W');
    });

    it('should remove diacritics from Y variants', () => {
      expect(removeDiacritics('Ý')).toBe('Y');
      expect(removeDiacritics('Ÿ')).toBe('Y');
    });

    it('should remove diacritics from Z variants', () => {
      expect(removeDiacritics('Ž')).toBe('Z');
      expect(removeDiacritics('Ź')).toBe('Z');
      expect(removeDiacritics('Ż')).toBe('Z');
    });
  });

  describe('lowercase letters', () => {
    it('should remove diacritics from a variants', () => {
      expect(removeDiacritics('á')).toBe('a');
      expect(removeDiacritics('å')).toBe('a');
      expect(removeDiacritics('ä')).toBe('a');
      expect(removeDiacritics('â')).toBe('a');
      expect(removeDiacritics('ã')).toBe('a');
      expect(removeDiacritics('à')).toBe('a');
      expect(removeDiacritics('ā')).toBe('a');
      expect(removeDiacritics('ă')).toBe('a');
      expect(removeDiacritics('ą')).toBe('a');
    });

    it('should handle special a variants', () => {
      expect(removeDiacritics('æ')).toBe('ae');
    });

    it('should remove diacritics from c variants', () => {
      expect(removeDiacritics('ç')).toBe('c');
      expect(removeDiacritics('ć')).toBe('c');
      expect(removeDiacritics('č')).toBe('c');
      expect(removeDiacritics('ĉ')).toBe('c');
      expect(removeDiacritics('ċ')).toBe('c');
    });

    it('should remove diacritics from d variants', () => {
      expect(removeDiacritics('đ')).toBe('d');
    });

    it('should remove diacritics from e variants', () => {
      expect(removeDiacritics('é')).toBe('e');
      expect(removeDiacritics('è')).toBe('e');
      expect(removeDiacritics('ë')).toBe('e');
      expect(removeDiacritics('ê')).toBe('e');
      expect(removeDiacritics('ē')).toBe('e');
      expect(removeDiacritics('ė')).toBe('e');
      expect(removeDiacritics('ę')).toBe('e');
    });

    it('should remove diacritics from g variants', () => {
      expect(removeDiacritics('ğ')).toBe('g');
      expect(removeDiacritics('ĝ')).toBe('g');
    });

    it('should remove diacritics from h variants', () => {
      expect(removeDiacritics('ĥ')).toBe('h');
      expect(removeDiacritics('ħ')).toBe('h');
    });

    it('should remove diacritics from i variants', () => {
      expect(removeDiacritics('í')).toBe('i');
      expect(removeDiacritics('ì')).toBe('i');
      expect(removeDiacritics('ï')).toBe('i');
      expect(removeDiacritics('î')).toBe('i');
      expect(removeDiacritics('ī')).toBe('i');
      expect(removeDiacritics('į')).toBe('i');
      expect(removeDiacritics('ı')).toBe('i');
    });

    it('should remove diacritics from j variants', () => {
      expect(removeDiacritics('ĵ')).toBe('j');
    });

    it('should remove diacritics from k variants', () => {
      expect(removeDiacritics('ķ')).toBe('k');
    });

    it('should remove diacritics from l variants', () => {
      expect(removeDiacritics('ĺ')).toBe('l');
      expect(removeDiacritics('ł')).toBe('l');
    });

    it('should remove diacritics from n variants', () => {
      expect(removeDiacritics('ñ')).toBe('n');
      expect(removeDiacritics('ń')).toBe('n');
      expect(removeDiacritics('ň')).toBe('n');
      expect(removeDiacritics('ņ')).toBe('n');
      expect(removeDiacritics('ŋ')).toBe('n');
    });

    it('should remove diacritics from o variants', () => {
      expect(removeDiacritics('ó')).toBe('o');
      expect(removeDiacritics('ò')).toBe('o');
      expect(removeDiacritics('ö')).toBe('o');
      expect(removeDiacritics('ô')).toBe('o');
      expect(removeDiacritics('õ')).toBe('o');
      expect(removeDiacritics('ø')).toBe('o');
      expect(removeDiacritics('ō')).toBe('o');
      expect(removeDiacritics('ő')).toBe('o');
    });

    it('should remove diacritics from r variants', () => {
      expect(removeDiacritics('ŕ')).toBe('r');
      expect(removeDiacritics('ř')).toBe('r');
    });

    it('should remove diacritics from s variants', () => {
      expect(removeDiacritics('š')).toBe('s');
      expect(removeDiacritics('ś')).toBe('s');
      expect(removeDiacritics('ş')).toBe('s');
      expect(removeDiacritics('ŝ')).toBe('s');
    });

    it('should handle special s variants', () => {
      expect(removeDiacritics('ß')).toBe('ss');
    });

    it('should remove diacritics from t variants', () => {
      expect(removeDiacritics('ţ')).toBe('t');
    });

    it('should remove diacritics from u variants', () => {
      expect(removeDiacritics('ú')).toBe('u');
      expect(removeDiacritics('ù')).toBe('u');
      expect(removeDiacritics('ü')).toBe('u');
      expect(removeDiacritics('û')).toBe('u');
      expect(removeDiacritics('ū')).toBe('u');
      expect(removeDiacritics('ů')).toBe('u');
      expect(removeDiacritics('ű')).toBe('u');
    });

    it('should remove diacritics from w variants', () => {
      expect(removeDiacritics('ŵ')).toBe('w');
    });

    it('should remove diacritics from y variants', () => {
      expect(removeDiacritics('ÿ')).toBe('y');
      expect(removeDiacritics('ý')).toBe('y');
    });

    it('should remove diacritics from z variants', () => {
      expect(removeDiacritics('ž')).toBe('z');
      expect(removeDiacritics('ź')).toBe('z');
      expect(removeDiacritics('ż')).toBe('z');
    });
  });

  describe('mixed text', () => {
    it('should handle words with multiple diacritics', () => {
      expect(removeDiacritics('café')).toBe('cafe');
      expect(removeDiacritics('naïve')).toBe('naive');
      expect(removeDiacritics('résumé')).toBe('resume');
      expect(removeDiacritics('piñata')).toBe('pinata');
      expect(removeDiacritics('façade')).toBe('facade');
    });

    it('should handle sentences with diacritics', () => {
      expect(removeDiacritics('The café serves excellent crêpes')).toBe(
        'The cafe serves excellent crepes',
      );
      expect(removeDiacritics('José lives in São Paulo')).toBe(
        'Jose lives in Sao Paulo',
      );
      expect(removeDiacritics('Zürich is in Österreich')).toBe(
        'Zurich is in Osterreich',
      );
    });

    it('should preserve spaces and punctuation', () => {
      expect(removeDiacritics('Hola, ¿cómo estás?')).toBe('Hola, ¿como estas?');
      expect(removeDiacritics('À bientôt!')).toBe('A bientot!');
      expect(removeDiacritics('Señor García, ¡buenos días!')).toBe(
        'Senor Garcia, ¡buenos dias!',
      );
    });

    it('should handle mixed case', () => {
      expect(removeDiacritics('CAFÉ')).toBe('CAFE');
      expect(removeDiacritics('Café')).toBe('Cafe');
      expect(removeDiacritics('cAfÉ')).toBe('cAfE');
    });
  });

  describe('language-specific examples', () => {
    it('should handle French text', () => {
      expect(removeDiacritics('français')).toBe('francais');
      expect(removeDiacritics('très bien')).toBe('tres bien');
      expect(removeDiacritics('hôtel')).toBe('hotel');
      expect(removeDiacritics('coûter')).toBe('couter');
      expect(removeDiacritics('élève')).toBe('eleve');
    });

    it('should handle German text', () => {
      expect(removeDiacritics('Mädchen')).toBe('Madchen');
      expect(removeDiacritics('München')).toBe('Munchen');
      expect(removeDiacritics('Größe')).toBe('Grosse');
      expect(removeDiacritics('Straße')).toBe('Strasse');
    });

    it('should handle Spanish text', () => {
      expect(removeDiacritics('niño')).toBe('nino');
      expect(removeDiacritics('mañana')).toBe('manana');
      expect(removeDiacritics('José María')).toBe('Jose Maria');
      expect(removeDiacritics('corazón')).toBe('corazon');
    });

    it('should handle Italian text', () => {
      expect(removeDiacritics('così')).toBe('cosi');
      expect(removeDiacritics('perché')).toBe('perche');
      expect(removeDiacritics('più')).toBe('piu');
      expect(removeDiacritics('città')).toBe('citta');
    });

    it('should handle Portuguese text', () => {
      expect(removeDiacritics('ação')).toBe('acao');
      expect(removeDiacritics('coração')).toBe('coracao');
      expect(removeDiacritics('São Paulo')).toBe('Sao Paulo');
      expect(removeDiacritics('não')).toBe('nao');
    });

    it('should handle Polish text', () => {
      expect(removeDiacritics('łóżko')).toBe('lozko');
      expect(removeDiacritics('ćwiczenie')).toBe('cwiczenie');
      expect(removeDiacritics('świat')).toBe('swiat');
      expect(removeDiacritics('żółć')).toBe('zolc');
    });

    it('should handle Czech text', () => {
      expect(removeDiacritics('škola')).toBe('skola');
      expect(removeDiacritics('děkuji')).toBe('dekuji');
      expect(removeDiacritics('český')).toBe('cesky');
      expect(removeDiacritics('řeka')).toBe('reka');
    });

    it('should handle Turkish text', () => {
      expect(removeDiacritics('Türkçe')).toBe('Turkce');
      expect(removeDiacritics('şehir')).toBe('sehir');
      expect(removeDiacritics('Gümüş')).toBe('Gumus');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(removeDiacritics('')).toBe('');
    });

    it('should handle strings without diacritics', () => {
      expect(removeDiacritics('hello world')).toBe('hello world');
      expect(removeDiacritics('12345')).toBe('12345');
      expect(removeDiacritics('ABC123xyz')).toBe('ABC123xyz');
    });

    it('should handle strings with only diacritics', () => {
      expect(removeDiacritics('áéíóú')).toBe('aeiou');
      expect(removeDiacritics('ÀÈÌÒÙ')).toBe('AEIOU');
      expect(removeDiacritics('ñçß')).toBe('ncss');
    });

    it('should handle special characters and symbols', () => {
      expect(removeDiacritics('café@email.com')).toBe('cafe@email.com');
      expect(removeDiacritics('résumé.pdf')).toBe('resume.pdf');
      expect(removeDiacritics('$100 für etwas')).toBe('$100 fur etwas');
    });

    it('should handle numbers mixed with diacritics', () => {
      expect(removeDiacritics('2023 año')).toBe('2023 ano');
      expect(removeDiacritics('café #1')).toBe('cafe #1');
      expect(removeDiacritics('50% más')).toBe('50% mas');
    });
  });

  describe('real-world use cases', () => {
    it('should normalize names for search', () => {
      expect(removeDiacritics('José María García')).toBe('Jose Maria Garcia');
      expect(removeDiacritics('François Müller')).toBe('Francois Muller');
      expect(removeDiacritics('Øyvind Åse')).toBe('Oyvind Ase');
    });

    it('should normalize addresses', () => {
      expect(removeDiacritics('Rua São João, 123')).toBe('Rua Sao Joao, 123');
      expect(removeDiacritics('Straße der Einheit')).toBe(
        'Strasse der Einheit',
      );
      expect(removeDiacritics("Château d'If")).toBe("Chateau d'If");
    });

    it('should normalize file names', () => {
      expect(removeDiacritics('résumé.pdf')).toBe('resume.pdf');
      expect(removeDiacritics('présentation.ppt')).toBe('presentation.ppt');
      expect(removeDiacritics('español_básico.doc')).toBe('espanol_basico.doc');
    });

    it('should normalize URLs/slugs', () => {
      expect(removeDiacritics('artículo-sobre-programación')).toBe(
        'articulo-sobre-programacion',
      );

      expect(removeDiacritics('café-près-de-chez-nous')).toBe(
        'cafe-pres-de-chez-nous',
      );

      expect(removeDiacritics('tschüss-und-danke')).toBe('tschuss-und-danke');
    });

    it('should normalize email addresses', () => {
      expect(removeDiacritics('josé.garcía@email.com')).toBe(
        'jose.garcia@email.com',
      );
      expect(removeDiacritics('françois@café.fr')).toBe('francois@cafe.fr');
    });

    it('should preserve non-diacritic Unicode characters', () => {
      // Should not affect characters not covered by the function
      expect(removeDiacritics('hello 世界')).toBe('hello 世界');
      expect(removeDiacritics('café مرحبا')).toBe('cafe مرحبا');
      expect(removeDiacritics('résumé русский')).toBe('resume русский');
    });
  });

  describe('performance and consistency', () => {
    it('should be idempotent', () => {
      const text = 'café résumé naïve';
      const once = removeDiacritics(text);
      const twice = removeDiacritics(once);
      expect(once).toBe(twice);
    });

    it('should handle all supported characters consistently', () => {
      // Test that uppercase and lowercase variants map to the same base letter
      const uppercases = 'ÀÁÂÄÆÃÅĀĂĄ';
      const lowercases = 'àáâäæãåāăą';

      const upperResult = removeDiacritics(uppercases);
      const lowerResult = removeDiacritics(lowercases);

      expect(upperResult.toLowerCase()).toBe(lowerResult);
    });
  });
});
