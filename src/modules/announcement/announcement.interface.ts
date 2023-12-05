export interface IObjectManagerFeature {
  type: string;
  id: number;
  geometry: {
    type: string;
    coordinates: number[];
  };
}
