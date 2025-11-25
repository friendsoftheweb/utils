export interface CreateCSVStreamOptions {
  numberFormat?: Intl.NumberFormat;
  dateFormat?: Intl.DateTimeFormat;
  reportError?(error: unknown): void;
}

export type CSVCell = string | number | boolean | Date | null | undefined;
