import { test } from 'node:test';
import assert from 'node:assert';
import { ShoppingCart } from '../src/cart/ShoppingCart.js';
import { products } from '../src/catalog/products.js';
import { ThreeForTwoRule } from '../src/pricing/rules/ThreeForTwoRule.js';
import { BulkDiscountRule } from '../src/pricing/rules/BulkDiscountRule.js';
import { BundleRule } from '../src/pricing/rules/BundleRule.js';
import { PromoCodeRule } from '../src/pricing/rules/PromoCodeRule.js';

const pricingRules = [
  new ThreeForTwoRule('ult_small'),
  new BulkDiscountRule('ult_large', 4, 39.90),
  new BundleRule('ult_medium', products['1gb']),
  new PromoCodeRule('I<3AMAYSIM', 10)
];

test('Scenario 1: 3 x ult_small, 1 x ult_large', () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_small);
  cart.add(products.ult_small);
  cart.add(products.ult_small);
  cart.add(products.ult_large);

  assert.strictEqual(cart.total, 94.70);

  const ultSmallItems = cart.items.filter(item => item.product.code === 'ult_small');
  const ultLargeItems = cart.items.filter(item => item.product.code === 'ult_large');
  assert.strictEqual(ultSmallItems[0].quantity, 3);
  assert.strictEqual(ultLargeItems[0].quantity, 1);
});

test('Scenario 2: 2 x ult_small, 4 x ult_large', () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_small);
  cart.add(products.ult_small);
  cart.add(products.ult_large);
  cart.add(products.ult_large);
  cart.add(products.ult_large);
  cart.add(products.ult_large);

  assert.strictEqual(cart.total, 209.40);

  const ultSmallItems = cart.items.filter(item => item.product.code === 'ult_small');
  const ultLargeItems = cart.items.filter(item => item.product.code === 'ult_large');
  assert.strictEqual(ultSmallItems[0].quantity, 2);
  assert.strictEqual(ultLargeItems[0].quantity, 4);
});

test('Scenario 3: 1 x ult_small, 2 x ult_medium', () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_small);
  cart.add(products.ult_medium);
  cart.add(products.ult_medium);

  assert.strictEqual(cart.total, 84.70);
  assert.strictEqual(cart.items.length, 3);

  const ultSmallItems = cart.items.filter(item => item.product.code === 'ult_small');
  const ultMediumItems = cart.items.filter(item => item.product.code === 'ult_medium');
  const dataPackItems = cart.items.filter(item => item.product.code === '1gb');

  assert.strictEqual(ultSmallItems[0].quantity, 1);
  assert.strictEqual(ultMediumItems[0].quantity, 2);
  assert.strictEqual(dataPackItems[0].quantity, 2);
  assert.strictEqual(dataPackItems[0].product.price, 0);
});

test('Scenario 4: 1 x ult_small, 1 x 1gb with promo code I<3AMAYSIM', () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_small);
  cart.add(products['1gb'], 'I<3AMAYSIM');

  assert.strictEqual(cart.total, 31.32);

  const ultSmallItems = cart.items.filter(item => item.product.code === 'ult_small');
  const dataPackItems = cart.items.filter(item => item.product.code === '1gb');

  assert.strictEqual(ultSmallItems[0].quantity, 1);
  assert.strictEqual(dataPackItems[0].quantity, 1);
});