import { parse } from 'csv-parse/sync'

export function parseCsv<T>(source: string): T[] {
  return parse(source, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as T[]
}
