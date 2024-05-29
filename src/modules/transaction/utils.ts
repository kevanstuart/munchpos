import { TransactionProductInput } from './schema'
import Product from '../product/model'
import { fn, col } from 'sequelize'

type ProductsMap = Map<number, number>

export function expandUpsellIntoMap (
  map: ProductsMap,
  products?: number[]
): ProductsMap {
  products?.forEach(item => map.set(item, 1))
  return map
}

export function productsReducer (
  map: ProductsMap,
  product: TransactionProductInput
): ProductsMap {
  map.set(product.productId, product.quantity)
  expandUpsellIntoMap(map, product.upsell)
  return map
}

export function expandProductsIntoHashMap (
  products: TransactionProductInput[]
): ProductsMap {
  return products.reduce(
    productsReducer,
    new Map<number, number>()
  )
}

export function checkQuantityMatchesTotal (
  map: ProductsMap,
  total: number
): boolean {
  return [...map.values()].reduce((sum, item) => sum + item, 0) === total
}

/**
 * Return a string due to the misrepresentation of
 * floating point numbers in Javascript.
 */
export async function getTotalPriceByProductIds (
  map: ProductsMap
): Promise<string> {
  const [result] = await Product.findAll({
    attributes: [[fn('SUM', col('price')), 'price']],
    where: { productId: [...map.keys()] }
  })

  return (result.price ?? 0).toString()
}

export async function checkHasProductStock (
  map: ProductsMap
): Promise<boolean> {
  const result = await Product.findAll({
    attributes: ['productId', 'quantity'],
    where: { productId: [...map.keys()] }
  })

  return result.every(item => item.quantity >= (map.get(item.productId) ?? 0))
}
