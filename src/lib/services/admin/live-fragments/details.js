/**
 * Detail and create screens whose data comes from the admin API.
 * The shell matches `livePaths` exactly and `livePatterns` as regular expressions.
 */
export const livePaths = ['/admin/products/new', '/admin/products/import', '/admin/orders/new'];

export const livePatterns = [
  '^/admin/products/(?!new$|import$|pending$)[^/]+$',
  '^/admin/vendors/(?!verification$|scores$|reports$)[^/]+$',
  '^/admin/customers/(?!coupons$|reviews$)[^/]+$',
  '^/admin/returns/(?!reasons$)[^/]+$',
  '^/admin/payouts/(?!items$|access$|legacy$)[^/]+$',
  '^/admin/support/[^/]+$',
];
