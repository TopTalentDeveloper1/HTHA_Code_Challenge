export type Property = {
  id: string;
  address: string;
  suburb: string;
  state?: string;
  postcode?: string;
  salePrice: number;
  description?: string;
  createdAt?: string;
};

export type PropertyWithComparison = {
  id: string;
  address: string;
  suburb: string;
  state?: string;
  postcode?: string;
  salePrice: number;
  description?: string;
  createdAt?: string;
  suburbAvg: number;
  comparison: 'above' | 'below' | 'equal';
};
