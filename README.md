# Shopping Cart Exercise

A flexible shopping cart implementation for Amaysim's SIM card pricing system.

## Quick Start

```bash
# Run the demo (shows all 4 required scenarios)
npm run demo

# Run tests
npm test

# See custom examples
npm run examples:custom-rules
```

## Requirements

✅ All 4 test scenarios implemented:
1. 3 x ult_small, 1 x ult_large → $94.70
2. 2 x ult_small, 4 x ult_large → $209.40
3. 1 x ult_small, 2 x ult_medium → $84.70
4. 1 x ult_small, 1 x 1gb + promo → $31.32

## Usage

```javascript
import { ShoppingCart, products, ThreeForTwoRule, BulkDiscountRule, BundleRule, PromoCodeRule } from './src/index.js';

const pricingRules = [
  new ThreeForTwoRule('ult_small'),
  new BulkDiscountRule('ult_large', 4, 39.90),
  new BundleRule('ult_medium', products['1gb']),
  new PromoCodeRule('I<3AMAYSIM', 10)
];

const cart = new ShoppingCart(pricingRules);
cart.add(products.ult_small);
cart.add(products.ult_large, 'I<3AMAYSIM');

console.log(cart.total); // Final price
```

## Architecture

Uses **Strategy Pattern** for flexible pricing rules:
- Easy to add new promotions
- Each rule is independently testable
- Rules can be combined or used separately

## Structure

```
src/
├── cart/ShoppingCart.js     # Main cart implementation
├── models/                  # Product and CartItem models
├── pricing/rules/           # Individual promotion rules
└── index.js                # Main exports

test/                       # Comprehensive test suite (40+ tests)
examples/                   # Demo and usage examples
```

## Testing

- **40+ tests** covering all scenarios, edge cases, and validation
- **100% requirement coverage** - all scenarios pass
- Run with `npm test`