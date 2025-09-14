export function formatCurrency(v) {
  if (v == null) return "—";
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency:'USD', maximumFractionDigits:2 }).format(v);
}

export function calcTotalValue(assets) {
  // If there is no live price feed, use stored priceAtAdd as fallback.
  // assets expected: [{qty, priceAtAdd, currentPrice?}]
  return assets.reduce((acc, a) => {
    const price = (a.currentPrice != null) ? Number(a.currentPrice) : (a.priceAtAdd != null ? Number(a.priceAtAdd) : 0);
    return acc + (Number(a.qty) * price);
  }, 0);
}
