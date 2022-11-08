import * as fs from 'fs';
import * as path from 'path';

import { parse } from 'csv-parse/sync';

import { ElementType } from '@/types';

export class CsvReader {
  static read<
    C extends readonly string[],
    T extends Record<ElementType<C>, string>
  >(opts: { filePath: string; columns: C; excludeHeader: boolean }): T[] {
    const resolvedPath = path.resolve(process.cwd(), opts.filePath);

    const bufferData = fs.readFileSync(resolvedPath);
    const rows: T[] = parse(bufferData, {
      delimiter: ',',
      columns: [...opts.columns],
    });

    if (opts.excludeHeader) {
      rows.splice(0, 1);
    }

    return rows;
  }
}
