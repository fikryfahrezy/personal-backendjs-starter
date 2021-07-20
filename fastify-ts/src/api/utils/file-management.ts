import pmp from 'pump';
import stream from 'stream';
import fs from 'fs';
import path from 'path';
import util from 'util';
import slugify from 'slugify';
import type { AddedFileBody } from '../types/schema';

const pump = util.promisify(pmp) as (...streams: Array<pmp.Stream | pmp.Callback>) => Promise<void>;

export const randomFilename: (filename: string) => string = function randomFilename(filename) {
  const randomString = Math.random().toString(36).substring(2);
  const currTime = Date.now();

  return `${randomString}-${currTime}-${filename}`;
};

export const renameFiles: (
  fromUrl: string,
  files?: AddedFileBody[],
) => AddedFileBody[] | undefined = function renameFiles(fromUrl, files) {
  if (!files) return undefined;

  const isLimit = files.reduce((_, { limit }) => limit, false);
  if (isLimit) throw Error('limit');

  return files.map(({ filename, ...data }) => {
    /**
     * Remove all occurances except las
     * https://stackoverflow.com/questions/9694930/remove-all-occurrences-except-last
     */
    const [name, ext] = filename.replace(/[.](?=.*[.])/g, '').split('.');
    let newName = slugify(name, { lower: true });

    if (fromUrl.includes('banks') || fromUrl.includes('wallets'))
      newName = `${newName}_logo.${ext}`;
    else if (fromUrl.includes('categories')) newName = `${newName}_icon.${ext}`;
    else if (fromUrl.includes('medias')) newName = `${newName}_medias.${ext}`;
    else newName = `${newName}.${ext}`;

    return { ...data, filename: randomFilename(newName) };
  });
};

export const saveFile: (file: AddedFileBody) => Promise<void> = async function saveFiles({
  filename,
  data,
}) {
  if (!data) throw Error('file required');

  const dir = './public/img/';
  const destFile = `${dir}${filename}`;
  const streamFile = stream.Readable.from(data);
  const dest = fs.createWriteStream(destFile);

  return pump(streamFile, dest);
};

export const saveFiles: (...files: AddedFileBody[]) => Promise<void> = async function saveFiles(
  ...files
) {
  await Promise.all(files.map((file) => saveFile(file)));
};

export const deleteLocalFile: (
  filepath: string | null | undefined,
) => void = function deleteLocalFile(filepath) {
  if (filepath) fs.unlink(path.resolve('./', 'public', `./${filepath}`), () => {});
};

export const deleteLocalFiles: (
  ...filepaths: (string | null | undefined)[]
) => void = function deleteLocalFiles(...filepaths) {
  filepaths.forEach((filepath) => deleteLocalFile(filepath));
};
