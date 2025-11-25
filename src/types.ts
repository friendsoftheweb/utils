export type TimeZone =
  | 'America/Chicago'
  | 'America/Los_Angeles'
  | 'America/New_York'
  | 'Europe/Berlin'
  | 'Europe/Madrid'
  | 'UTC'
  | Omit<
      `America/${string}` | `Europe/${string}` | `Asia/${string}`,
      | 'America/Chicago'
      | 'America/Los_Angeles'
      | 'America/New_York'
      | 'Europe/Berlin'
      | 'Europe/Madrid'
      | 'UTC'
    >;
