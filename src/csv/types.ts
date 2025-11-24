export interface CreateCSVStreamOptions {
  dateFormat?: Intl.DateTimeFormat;
  reportError?(error: unknown): void;
}

export type CSVCell = string | number | boolean | Date | null | undefined;
