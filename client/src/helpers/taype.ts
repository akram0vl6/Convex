export interface Product {
  _id: string;
  name: string;
  title: string;
  weight: number,
  price: number;
  quantity: number;
  img: string;
  createdBy: {
    _id: string;
    email: string;
    name: string;
  };
}


export interface PromoCode {
  _id: string;
  count: number,
  code: string;
  title: string;
  discount: number;
  supplierId: object;
  productIds: string[];
  isUsed: boolean;
}