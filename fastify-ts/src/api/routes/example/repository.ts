export type DummyDataType = { id: number; data: string };
export type DummyArrayDataType = DummyDataType[];
type FnMultipleDataType = () => DummyArrayDataType;
type FnSingleDataType = (id: number) => DummyDataType | undefined;

const data: DummyArrayDataType = [
  {
    id: 1,
    data: 'hi',
  },
  {
    id: 2,
    data: 'hello',
  },
  {
    id: 3,
    data: 'world',
  },
];

export const exampleMultipleData: FnMultipleDataType = () => data;

export const exampleSingleData: FnSingleDataType = (id: number) => data.find((dt) => dt.id === id);
