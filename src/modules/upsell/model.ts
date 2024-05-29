import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import { database } from '../../config/sequelize'
import Product from '../product/model'

class ProductUpsell extends Model<InferAttributes<ProductUpsell>, InferCreationAttributes<ProductUpsell>> {
  declare productId: ForeignKey<Product['productId']>
  declare upsellProductId: ForeignKey<Product['productId']>
}

ProductUpsell.init({
  productId: {
    type: DataTypes.BIGINT.UNSIGNED
  },
  upsellProductId: {
    type: DataTypes.BIGINT.UNSIGNED
  }
}, {
  tableName: 'ProductUpsell',
  sequelize: database
})

export default ProductUpsell
