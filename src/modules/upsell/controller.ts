import { createUpsellInput, CreateUpsellInput, GetUpsellResponse } from './schema'
import { Response } from '../../utils/types'
import Product from '../product/model'

async function getProduct (productId: number): Promise<Product | null> {
  return await Product.findByPk(productId)
}

async function doUpsellProductsExist (productIds: number[]): Promise<boolean> {
  const products = await Product.findAll({ where: { productId: productIds } })
  return products.length === productIds.length
}

export async function createProductUpsell (
  data: CreateUpsellInput
): Promise<Response<null>> {
  const validation = createUpsellInput.safeParse(data)
  if (!validation.success) {
    console.error(validation.error)
    return { code: 400, error: 'This data does not match required parameters' }
  }

  const product = await getProduct(validation.data.productId)
  if (product === null) return { code: 400, error: 'This product does not exist' }

  const upsellProductsExist = await doUpsellProductsExist(validation.data.upsellIds)
  if (!upsellProductsExist) return { code: 400, error: 'These upsell products do not exist' }

  try {
    await product.addUpsell(validation.data.upsellIds)
    return { code: 201, data: null }
  } catch (error: unknown) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}

export async function getProductUpsell (
  productId: number
): Promise<Response<GetUpsellResponse>> {
  try {
    const product = await Product.findByPk(productId, {
      include: {
        model: Product,
        as: 'upsell',
        required: true
      }
    })

    if (product === null) {
      return { code: 404, error: 'Product does not exist' }
    }

    const upsell = product.upsell ?? []
    const products = upsell.map(upsell => upsell.toJSON())

    return { code: 200, data: products }
  } catch (error: unknown) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}

export async function removeProductUpsell (
  productId: number,
  upsellId: number
): Promise<Response<null>> {
  try {
    const product = await Product.findByPk(productId)
    if (product === null) return { code: 404, error: 'Product cannot be found' }

    await product.removeUpsell(upsellId)
    return { code: 204, data: null }
  } catch (error: unknown) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}
