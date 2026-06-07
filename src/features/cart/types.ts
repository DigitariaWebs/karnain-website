/** The minimum needed to add a fragrance to the bag. */
export type CartItemInput = {
  readonly slug: string;
  readonly name: string;
  readonly priceEur: number;
};

/** A bag line: an item plus its quantity. */
export type CartLine = CartItemInput & {
  readonly quantity: number;
};
