export type TimeZone =
  | 'America/Chicago'
  | 'America/Los_Angeles'
  | 'America/New_York'
  | 'Europe/Berlin'
  | 'Europe/Madrid'
  | 'UTC'
  | Omit<
      string,
      | 'America/Chicago'
      | 'America/Los_Angeles'
      | 'America/New_York'
      | 'Europe/Berlin'
      | 'Europe/Madrid'
      | 'UTC'
    >;
