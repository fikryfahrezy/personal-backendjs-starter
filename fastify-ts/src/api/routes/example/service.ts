import type { DummyArrayDataType, DummyDataType } from '../../repositories/ExampleRepository';
import type { AddedFileBody } from '../../types/schema';
import { ErrorResponse } from '../../utils/error-handler';
import { exampleMultipleData, exampleSingleData } from '../../repositories/ExampleRepository';
import { saveFile } from '../../utils/file-management';

export const getService: () => DummyArrayDataType = function getService() {
  const data = exampleMultipleData();

  return data;
};

export const postService: (text: string) => boolean = function postService(text: string) {
  const isSuccess = typeof text === 'string' && true;

  return isSuccess;
};

export const getIdService: (id: number) => DummyDataType | Error = function getIdService(id) {
  const data = exampleSingleData(id);

  if (!data) throw new ErrorResponse(`data with id ${id} not found`, 404);

  return data;
};

export const postFileService: (files: AddedFileBody[]) => Promise<void> = async (files) => {
  await saveFile(files[0]);
};
