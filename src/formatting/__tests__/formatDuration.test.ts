import { formatDuration } from '../formatDuration';

describe('formatDuration', () => {
  describe('when duration is less than 1 hour', () => {
    it('formats zero duration correctly', () => {
      expect(formatDuration(0)).toBe('00:00');
    });

    it('formats seconds only', () => {
      expect(formatDuration(5)).toBe('00:05');
      expect(formatDuration(30)).toBe('00:30');
      expect(formatDuration(59)).toBe('00:59');
    });

    it('formats minutes and seconds', () => {
      expect(formatDuration(60)).toBe('01:00'); // 1 minute
      expect(formatDuration(65)).toBe('01:05'); // 1 minute 5 seconds
      expect(formatDuration(125)).toBe('02:05'); // 2 minutes 5 seconds
      expect(formatDuration(599)).toBe('09:59'); // 9 minutes 59 seconds
    });

    it('formats full minutes under an hour', () => {
      expect(formatDuration(120)).toBe('02:00'); // 2 minutes
      expect(formatDuration(600)).toBe('10:00'); // 10 minutes
      expect(formatDuration(1800)).toBe('30:00'); // 30 minutes
      expect(formatDuration(3540)).toBe('59:00'); // 59 minutes
    });

    it('formats maximum duration under an hour', () => {
      expect(formatDuration(3599)).toBe('59:59'); // 59 minutes 59 seconds
    });
  });

  describe('when duration is 1 hour or more', () => {
    it('formats exactly 1 hour', () => {
      expect(formatDuration(3600)).toBe('01:00:00');
    });

    it('formats hours with minutes and seconds', () => {
      expect(formatDuration(3665)).toBe('01:01:05'); // 1 hour 1 minute 5 seconds
      expect(formatDuration(3725)).toBe('01:02:05'); // 1 hour 2 minutes 5 seconds
      expect(formatDuration(7325)).toBe('02:02:05'); // 2 hours 2 minutes 5 seconds
    });

    it('formats hours with only minutes', () => {
      expect(formatDuration(3660)).toBe('01:01:00'); // 1 hour 1 minute
      expect(formatDuration(7200)).toBe('02:00:00'); // 2 hours
      expect(formatDuration(10800)).toBe('03:00:00'); // 3 hours
    });

    it('formats hours with only seconds', () => {
      expect(formatDuration(3605)).toBe('01:00:05'); // 1 hour 5 seconds
      expect(formatDuration(7259)).toBe('02:00:59'); // 2 hours 59 seconds
    });

    it('formats large hour values', () => {
      expect(formatDuration(36000)).toBe('10:00:00'); // 10 hours
      expect(formatDuration(359999)).toBe('99:59:59'); // 99 hours 59 minutes 59 seconds
    });

    it('formats very large hour values', () => {
      expect(formatDuration(360000)).toBe('100:00:00'); // 100 hours
      expect(formatDuration(3600000)).toBe('1000:00:00'); // 1000 hours
    });
  });

  describe('decimal and floating point handling', () => {
    it('floors decimal seconds correctly', () => {
      expect(formatDuration(5.1)).toBe('00:05');
      expect(formatDuration(5.9)).toBe('00:05');
      expect(formatDuration(59.99)).toBe('00:59');
    });

    it('floors decimal minutes correctly', () => {
      expect(formatDuration(65.7)).toBe('01:05'); // 1 minute 5.7 seconds -> 1:05
      expect(formatDuration(125.9)).toBe('02:05'); // 2 minutes 5.9 seconds -> 2:05
    });

    it('floors decimal hours correctly', () => {
      expect(formatDuration(3665.8)).toBe('01:01:05'); // 1 hour 1 minute 5.8 seconds
      expect(formatDuration(3599.9)).toBe('59:59'); // Still under 1 hour
      expect(formatDuration(3600.1)).toBe('01:00:00'); // Just over 1 hour
    });

    it('handles very small decimal values', () => {
      expect(formatDuration(0.1)).toBe('00:00');
      expect(formatDuration(0.9)).toBe('00:00');
      expect(formatDuration(0.99)).toBe('00:00');
    });
  });

  describe('edge cases and boundary values', () => {
    it('handles boundary transitions', () => {
      expect(formatDuration(59.99)).toBe('00:59'); // Just under 1 minute
      expect(formatDuration(60.01)).toBe('01:00'); // Just over 1 minute
      expect(formatDuration(3599.99)).toBe('59:59'); // Just under 1 hour
      expect(formatDuration(3600.01)).toBe('01:00:00'); // Just over 1 hour
    });

    it('handles zero and near-zero values', () => {
      expect(formatDuration(0)).toBe('00:00');
      expect(formatDuration(0.0)).toBe('00:00');
      expect(formatDuration(0.1)).toBe('00:00');
      expect(formatDuration(0.999)).toBe('00:00');
    });
  });

  describe('padding and formatting', () => {
    it('pads single digit values with leading zeros', () => {
      expect(formatDuration(5)).toBe('00:05'); // Seconds padded
      expect(formatDuration(65)).toBe('01:05'); // Minutes and seconds padded
      expect(formatDuration(3665)).toBe('01:01:05'); // Hours, minutes, and seconds padded
    });

    it('does not pad hours to specific width (can be any length)', () => {
      expect(formatDuration(36000)).toBe('10:00:00'); // 2-digit hours
      expect(formatDuration(360000)).toBe('100:00:00'); // 3-digit hours
      expect(formatDuration(3600000)).toBe('1000:00:00'); // 4-digit hours
    });

    it('always pads minutes and seconds to 2 digits', () => {
      expect(formatDuration(3600)).toBe('01:00:00'); // 01 not 1
      expect(formatDuration(3605)).toBe('01:00:05'); // 05 not 5
      expect(formatDuration(3665)).toBe('01:01:05'); // Both 01 and 05
    });
  });

  describe('real-world examples', () => {
    it('formats typical video durations', () => {
      expect(formatDuration(30)).toBe('00:30'); // 30-second video
      expect(formatDuration(150)).toBe('02:30'); // 2.5-minute video
      expect(formatDuration(600)).toBe('10:00'); // 10-minute video
      expect(formatDuration(3900)).toBe('01:05:00'); // 65-minute movie
    });

    it('formats typical audio track durations', () => {
      expect(formatDuration(180)).toBe('03:00'); // 3-minute song
      expect(formatDuration(240)).toBe('04:00'); // 4-minute song
      expect(formatDuration(420)).toBe('07:00'); // 7-minute song
    });

    it('formats workout/timer durations', () => {
      expect(formatDuration(45)).toBe('00:45'); // 45-second exercise
      expect(formatDuration(300)).toBe('05:00'); // 5-minute break
      expect(formatDuration(1800)).toBe('30:00'); // 30-minute workout
      expect(formatDuration(5400)).toBe('01:30:00'); // 90-minute session
    });

    it('formats meeting durations', () => {
      expect(formatDuration(900)).toBe('15:00'); // 15-minute standup
      expect(formatDuration(1800)).toBe('30:00'); // 30-minute meeting
      expect(formatDuration(3600)).toBe('01:00:00'); // 1-hour meeting
      expect(formatDuration(7200)).toBe('02:00:00'); // 2-hour workshop
    });
  });

  describe('mathematical precision', () => {
    it('handles JavaScript floating point precision', () => {
      // Test values that might cause floating point precision issues
      expect(formatDuration(0.1 + 0.2)).toBe('00:00'); // 0.30000000000000004
      expect(formatDuration(1.1 * 60)).toBe('01:06'); // 66.00000000000001
    });

    it('correctly floors fractional calculations', () => {
      expect(formatDuration(89.7)).toBe('01:29'); // 89.7 seconds = 1 minute 29.7 seconds
      expect(formatDuration(149.2)).toBe('02:29'); // 149.2 seconds = 2 minutes 29.2 seconds
      expect(formatDuration(3689.8)).toBe('01:01:29'); // 3689.8 seconds = 1 hour 1 minute 29.8 seconds
    });
  });

  describe('input type consistency', () => {
    it('works with integer values', () => {
      expect(formatDuration(60)).toBe('01:00');
      expect(formatDuration(3600)).toBe('01:00:00');
    });

    it('works with floating point values', () => {
      expect(formatDuration(60.5)).toBe('01:00');
      expect(formatDuration(3600.7)).toBe('01:00:00');
    });

    it('works with very precise decimal values', () => {
      expect(formatDuration(60.123456789)).toBe('01:00');
      expect(formatDuration(3600.987654321)).toBe('01:00:00');
    });
  });

  describe('modulo arithmetic validation', () => {
    it('correctly calculates seconds remainder', () => {
      expect(formatDuration(125)).toBe('02:05'); // 125 % 60 = 5 seconds
      expect(formatDuration(3725)).toBe('01:02:05'); // 3725 % 60 = 5 seconds
    });

    it('correctly calculates minutes remainder', () => {
      expect(formatDuration(3725)).toBe('01:02:05'); // (3725 / 60) % 60 = 2 minutes
      expect(formatDuration(7325)).toBe('02:02:05'); // (7325 / 60) % 60 = 2 minutes
    });

    it('correctly calculates total hours', () => {
      expect(formatDuration(7325)).toBe('02:02:05'); // 7325 / 3600 = 2 hours
      expect(formatDuration(14725)).toBe('04:05:25'); // 14725 / 3600 = 4 hours
    });
  });

  describe('invalid inputs', () => {
    it('handles negative numbers', () => {
      expect(() => formatDuration(-5)).toThrow(
        'Duration must be a finite, non-negative number',
      );
    });

    it('handles NaN', () => {
      expect(() => formatDuration(NaN)).toThrow(
        'Duration must be a finite, non-negative number',
      );
    });

    it('handles Infinity', () => {
      expect(() => formatDuration(Infinity)).toThrow(
        'Duration must be a finite, non-negative number',
      );
    });
  });
});
