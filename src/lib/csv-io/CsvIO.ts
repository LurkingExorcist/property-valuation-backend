import * as fs from 'fs';
import * as path from 'path';

import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

import { ElementType } from '@/types';

export class CsvIO {
  static parse<
    C extends readonly string[],
    T extends Record<ElementType<C>, string>
  >(opts: { bufferData: Buffer; columns: C; excludeHeader: boolean }): T[] {
    const rows: T[] = parse(opts.bufferData, {
      delimiter: ',',
      columns: [...opts.columns],
    });

    if (opts.excludeHeader) {
      rows.splice(0, 1);
    }

    return rows;
  }

  static read<
    C extends readonly string[],
    T extends Record<ElementType<C>, string>
  >(opts: { filePath: string; columns: C; excludeHeader: boolean }): T[] {
    const resolvedPath = path.resolve(process.cwd(), opts.filePath);
    const bufferData = fs.readFileSync(resolvedPath);

    return CsvIO.parse<C, T>({
      bufferData,
      columns: opts.columns,
      excludeHeader: opts.excludeHeader,
    });
  }

  static write<T>(opts: { filePath: string; data: T[]; columns: string[] }) {
    const resolvedPath = path.resolve(process.cwd(), opts.filePath);

    fs.writeFileSync(
      resolvedPath,
      stringify(opts.data, { columns: opts.columns, header: true })
    );
  }
}
