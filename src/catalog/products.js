import { Product } from '../models/Product.js';

export const products = {
  ult_small: new Product('ult_small', 'Unlimited 1GB', 24.90),
  ult_medium: new Product('ult_medium', 'Unlimited 2GB', 29.90),
  ult_large: new Product('ult_large', 'Unlimited 5GB', 44.90),
  '1gb': new Product('1gb', '1 GB Data-pack', 9.90)
};

export function getProduct(code) {
  return products[code];
}