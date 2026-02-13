export interface PropertyResponseDto {
  id: string;
  address: string;
  suburb: string;
  state?: string;
  postcode?: string;
  salePrice: number;
  description?: string;
  createdAt?: string;
}

export interface PropertySearchResponseDto {
  address: string;
  suburb: string;
  state?: string;
  postcode?: string;
  salePrice: number;
  comparison: 'above' | 'below' | 'equal';
  suburbAvg: number;
}

export interface PropertySearchPaginatedResponseDto {
  properties: PropertySearchResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}