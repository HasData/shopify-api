declare type CollectionsAPIParams = {
  url: string
}

declare type ProductsAPIParams = {
  url: string
  limit?: number
  page?: number
  collection?: string
}


declare class ShopifyAPI {
  private readonly apiKey: string;
  constructor(apiKey: string);

  collections(params: CollectionsAPIParams): Promise<Record<any, any>>;
  products(params: ProductsAPIParams): Promise<Record<any, any>>;
}

export default ShopifyAPI;
