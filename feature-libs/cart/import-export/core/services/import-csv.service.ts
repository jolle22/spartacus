import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImportExportConfig } from '../config/import-export-config';

@Injectable({
  providedIn: 'root',
})
export class ImportCsvService {
  constructor(protected importExportConfig: ImportExportConfig) {}

  /**
   * Extracts CSV file and process into a JSON data
   *
   * @param file CSV file to extract the data
   * @returns processed data from CSV or error data in CSV extraction
   */
  loadFile(file: File): Observable<string | ProgressEvent<FileReader>> {
    return new Observable((observer: Observer<string>) => {
      const fileReader: FileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        observer.next(fileReader.result as string);
        observer.complete();
      };
      fileReader.onerror = (error) => {
        fileReader.abort();
        observer.error(error);
      };
    });
  }

  /**
   * Processes the CSV data
   *
   * @param csvString raw extracted data from CSV
   * @param ignoreHeader flag allows for ignore headers row while reading
   * @returns Processed data containing productCode and quantity
   */
  readCsvData(csvString: string, ignoreHeader = true): string[][] {
    const tempSplitter = new RegExp(`\\\\${this.separator}`, 'g');
    const splitter = new RegExp(`\\.*(?<!\\\\)${this.separator}`, 'g');
    return csvString
      .split('\n')
      .map((row) =>
        row
          .split(splitter)
          .map((cell) =>
            cell.replace(tempSplitter, this.separator).replace('\r', '')
          )
          .map((cell) =>
            cell.startsWith('"') && cell.endsWith('"')
              ? cell.substring(1, cell.length - 1)
              : cell
          )
      )
      .filter(
        (row, index) =>
          !(ignoreHeader && index === 0) && row.length > 0 && row[0] !== ''
      );
  }

  loadCsvData(file: File): Observable<string[][]> {
    return this.loadFile(file).pipe(
      map((res) => this.readCsvData(res as string))
    );
  }

  private get separator() {
    return this.importExportConfig.cartImportExport?.file.separator ?? ',';
  }
}
