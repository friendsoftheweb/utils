export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | Array<string | number | boolean | null | JSONObject>;

export interface JSONObject {
  [key: string]: JSONValue;
}

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
