import { Transaction, TransactionProduct } from './model'
import { Response } from '../../utils/types'
import Product from '../product/model'
import {
  createTransactionInput,
  CreateTransactionInput,
  CreateTransactionResponse,
  GetTransactionResponse
} from './schema'
import {
  checkQuantityMatchesTotal,
  getTotalPriceByProductIds,
  checkHasProductStock,
  expandProductsIntoHashMap
} from './utils'

export async function createTransaction (
  data: CreateTransactionInput
): Promise<Response<CreateTransactionResponse>> {
  const validation = createTransactionInput.safeParse(data)
  if (!validation.success) {
    console.error(validation.error)
    return { code: 400, error: 'This data does not match required parameters' }
  }

  try {
    const products = validation.data.products
    const lookupList = expandProductsIntoHashMap(products)

    if (!checkQuantityMatchesTotal(lookupList, validation.data.totalQuantity)) {
      return { code: 400, error: 'Product quantities do not match total quantity' }
    }

    const totalPrice = await getTotalPriceByProductIds(lookupList)
    console.log(totalPrice)
    if (parseFloat(totalPrice) !== validation.data.totalPrice) {
      return { code: 400, error: 'Product prices do not match total price' }
    }

    if (!await checkHasProductStock(lookupList)) {
      return { code: 400, error: 'One or more products may not be in stock' }
    }

    const instance = await Transaction.create({
      totalPrice: validation.data.totalPrice,
      totalQuantity: validation.data.totalQuantity
    })

    const productDetails = await Product.findAll({
      attributes: ['productId', 'price', 'quantity'],
      where: { productId: [...lookupList.keys()] }
    })

    await TransactionProduct.bulkCreate(productDetails.map(product => ({
      productId: product.productId,
      price: product.price,
      quantity: lookupList.get(product.productId) ?? 0,
      transactionId: instance.transactionId
    })))

    await Promise.allSettled(productDetails.map(
      async product => {
        return await Product.decrement(
          ['quantity'],
          {
            by: lookupList.get(product.productId),
            where: { productId: product.productId }
          }
        )
      }
    ))

    return {
      code: 201,
      data: {
        transactionId: instance.transactionId,
        totalPrice: instance.totalPrice,
        totalQuantity: instance.totalQuantity
      }
    }
  } catch (error) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}

export async function getTransaction (
  transactionId: number
): Promise<Response<GetTransactionResponse>> {
  try {
    const transaction = await Transaction.findByPk(transactionId, {
      include: {
        model: TransactionProduct,
        as: 'products',
        required: true
      }
    })

    if (transaction === null) {
      return { code: 404, error: 'Transaction does not exist' }
    }

    return { code: 200, data: transaction.toJSON() }
  } catch (error) {
    console.error(error)
    return { code: 500, error: 'Server Error. Please contact the administrator.' }
  }
}
