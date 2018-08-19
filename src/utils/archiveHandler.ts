import * as archiver from 'archiver';
import { createWriteStream, readdirSync } from 'fs';
import * as path from 'path';

/**
 * Archives files in the source directory
 * that matches the given file extension
 *
 * @param source {String} source path
 * @param destination {String} destination path
 * @param fileExtensions {Array} array of file ext
 * @return {Promise<any>}
 */
export async function generateArchiveForDirectory(
    source: string,
    destination: string,
    fileExtensions: string[],
): Promise<any> {
    return new Promise((resolve, reject) => {

        const output = createWriteStream(destination);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            resolve();
        });

        archive.on('error', (err: Error) => {
            reject(err);
        });

        archive.pipe(output);

        const files = readdirSync(source);
        files
            .filter((file: string) => fileExtensions.indexOf(path.extname(file)) !== -1)
            .forEach((file: string) => {
                switch (path.extname(file)) {
                    case '.log':
                        archive.file(source + '/' + file, { name: 'logs/' + file });
                        break;
                    case '.dmp':
                    case '.txt': // on Windows .txt files will be created as part of crash dump
                        archive.file(source + '/' + file, { name: 'crashes/' + file });
                        break;
                    default:
                        break;
                }
            });

        archive.finalize();
    });

}
