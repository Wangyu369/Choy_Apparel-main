import { Order, Product } from '../utils/products.types';

// Hydrate each order's items with the full product object if missing
export function hydrateOrdersWithProducts(orders: Order[], products: Product[]): Order[] {
  const productMap: Record<string, Product> = {};
  for (const product of products) {
    productMap[String(product.id)] = product;
  }
  return orders.map(order => {
    const createdAt = order.createdAt || '';
    return {
      ...order,
      createdAt,
      items: order.items.map((item: any) => {
        let productKey = item.product_id || item.product_details?.id || item.product?.id;
        let hydratedProduct = item.product || productMap[String(productKey)];
        if (hydratedProduct && !hydratedProduct.name) {
          hydratedProduct = { ...hydratedProduct, name: productKey };
        }
        if (!hydratedProduct) {
          hydratedProduct = {
            id: productKey,
            name: productKey,
            price: item.price || 0,
            category: 'essentials',
            image: '',
          };
        }
        // Ensure image is preserved if present
        if (!hydratedProduct.image && productMap[String(productKey)]?.image) {
          hydratedProduct.image = productMap[String(productKey)].image;
        }
        return {
          ...item,
          product: hydratedProduct,
        };
      }),
    };
  });
}
