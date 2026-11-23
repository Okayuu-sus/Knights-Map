export type Building = {
  id: string;
  code: string;
  name: string;
  description: string | null;

  latitude: number;
  longitude: number;

  address: string | null;
  floors: number | null;
  height: number | null;

  createdAt: string;
  updatedAt: string;
};