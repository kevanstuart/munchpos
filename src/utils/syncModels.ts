import ProductUpsell from '../modules/upsell/model'
import Product from '../modules/product/model'
import User from '../modules/user/model'
import {
  Transaction,
  TransactionProduct
} from '../modules/transaction/model'

/**
 * I'm using this method of importing the models for a few reasons:
 * - I'm not fond of the opinionated approach of Sequelize
 * - There are a limited number of models to synchronize
 * - I wanted to store models in the module that they are related to
 * - I felt like Sequelize CLI was too much work to implement for this challenge
 */
export default async function (): Promise<void> {
  await Product.sync()
  await User.sync()
  await Transaction.sync()
  await TransactionProduct.sync()
  await ProductUpsell.sync()
}
