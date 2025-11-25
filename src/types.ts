export type TimeZone = `${TimeZoneGroup}/${string}` | 'UTC';

type TimeZoneGroup =
  | 'Africa'
  | 'America'
  | 'Antarctica'
  | 'Asia'
  | 'Atlantic'
  | 'Australia'
  | 'Europe'
  | 'Indian'
  | 'Pacific';
