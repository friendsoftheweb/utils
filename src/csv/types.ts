export interface CreateCSVStreamOptions {
  booleanFormat?: {
    format(value: boolean): string;
  };
  numberFormat?: Intl.NumberFormat;
  dateFormat?: Intl.DateTimeFormat;
  reportError?(error: unknown): void;
}

export type CSVCell = string | number | boolean | Date | null | undefined;
