import {
  createProductInput,
  CreateProductInput,
  ListProductResponse,
  updateProductInput,
  UpdateProductInput,
  UpsertProductResponse
} from './schema'
import { Response } from '../../utils/types'
import Product from './model'

async function productExists (name: string): Promise<boolean> {
  const product = await Product.findOne({ where: { name } })
  return product !== null
}

export async function createProduct (
  data: CreateProductInput
): Promise<Response<UpsertProductResponse>> {
  const validation = createProductInput.safeParse(data)
  if (!validation.success) {
    console.error(validation.error)
    return { code: 400, error: 'This data does not match required parameters' }
  }

  const exists = await productExists(validation.data.name)
  if (exists) return { code: 409, error: 'This product already exists' }

  try {
    const instance = await Product.create(validation.data)
    return {
      code: 201,
      data: {
        productId: instance.productId,
        name: instance.name
      }
    }
  } catch (error) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}

export async function updateProduct (
  data: UpdateProductInput
): Promise<Response<UpsertProductResponse>> {
  const validation = updateProductInput.safeParse(data)
  if (!validation.success) {
    console.error(validation.error)
    return { code: 400, error: 'This data does not match required parameters' }
  }

  try {
    const product = await Product.findByPk(validation.data.productId)
    if (product === null) return { code: 404, error: 'Product cannot be found' }

    await product
      .set(validation.data)
      .save()

    return {
      code: 200,
      data: {
        productId: product.productId,
        name: product.name
      }
    }
  } catch (error) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}

export async function listProducts (): Promise<Response<ListProductResponse>> {
  try {
    const products = await Product.findAll()

    return { code: 200, data: products }
  } catch (error: unknown) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}

export async function deleteProduct (
  productId: number
): Promise<Response<null>> {
  try {
    const product = await Product.findByPk(productId)
    if (product === null) return { code: 404, error: 'Product cannot be found' }

    await product.destroy()

    return {
      code: 204,
      data: null
    }
  } catch (error) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}
