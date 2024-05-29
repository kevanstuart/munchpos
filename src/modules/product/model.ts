import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationsMixin,
  HasManyRemoveAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute
} from 'sequelize'
import { database } from '../../config/sequelize'

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product, { omit: 'upsell' }>> {
  declare productId: CreationOptional<number>
  declare name: string
  declare price: number
  declare description: CreationOptional<string>
  declare quantity: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare upsell?: NonAttribute<Product[]>

  declare addUpsell: HasManyAddAssociationsMixin<Product, number>
  declare removeUpsell: HasManyRemoveAssociationMixin<Product, number>

  declare static associations: {
    upsell: Association<Product, Product>
  }
}

Product.init({
  productId: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  tableName: 'Products',
  sequelize: database
})

Product.belongsToMany(Product, {
  as: 'upsell',
  through: 'ProductUpsell',
  foreignKey: 'productId'
})

export default Product
