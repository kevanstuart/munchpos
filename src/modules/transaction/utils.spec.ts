import { TransactionProductInput } from './schema'
import Product from '../product/model'
import {
  expandUpsellIntoMap,
  expandProductsIntoHashMap,
  checkQuantityMatchesTotal,
  getTotalPriceByProductIds,
  checkHasProductStock
} from './utils'

describe('Transaction Utils', () => {
  describe('Expand Upsell Util', () => {
    it('should return original map if products are undefined', () => {
      const map = new Map<number, number>().set(1, 1)
      const result = expandUpsellIntoMap(map)
      expect(result).toEqual(map)
    })

    it('should add an item to map with a key of 1 and a value of 1', () => {
      const map = new Map<number, number>()
      const result = expandUpsellIntoMap(map, [1])
      expect(result).toEqual(new Map<number, number>().set(1, 1))
    })

    it('should add multiple items to map with a value of 1', () => {
      const map = new Map<number, number>()
      const result = expandUpsellIntoMap(map, [1, 2])
      expect(result).toEqual(new Map<number, number>().set(1, 1).set(2, 1))
    })
  })

  describe('Expand Products into HashMap', () => {
    const products: TransactionProductInput[] = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 }
    ]
    it('should reduce an array of products into a hash map without upsell', () => {
      const expected = new Map<number, number>()
        .set(1, 2)
        .set(2, 1)

      const result = expandProductsIntoHashMap(products)
      expect(result).toEqual(expected)
    })

    it('should reduce an array of products into a hash map with a single upsell', () => {
      products[0].upsell = [3]
      const expected = new Map<number, number>()
        .set(1, 2)
        .set(3, 1)
        .set(2, 1)

      const result = expandProductsIntoHashMap(products)
      expect(result).toEqual(expected)
    })

    it('should reduce an array of products into a hash map with multiple upsells', () => {
      products[1].upsell = [5, 10]
      const expected = new Map<number, number>()
        .set(1, 2)
        .set(3, 1)
        .set(2, 1)
        .set(5, 1)
        .set(10, 1)

      const result = expandProductsIntoHashMap(products)
      expect(result).toEqual(expected)
    })
  })

  describe('Check Total Quantity matches individual quantities', () => {
    const map = new Map<number, number>()
      .set(1, 2)
      .set(2, 1)

    it('should return false if mapped quantites are not equal', () => {
      const result = checkQuantityMatchesTotal(map, 5)
      expect(result).toBe(false)
    })

    it('should return true if mapped quantites are equal', () => {
      const result = checkQuantityMatchesTotal(map, map.size)
      expect(result).toBe(false)
    })
  })

  describe('Get the sum of all product prices', () => {
    const price = 27.55
    const map = new Map<number, number>()
      .set(1, 2)
      .set(2, 1)

    it('should return the sum of all product prices', async () => {
      jest.spyOn<any, 'findAll'>(Product, 'findAll').mockResolvedValueOnce([
        { price }
      ])

      const result = await getTotalPriceByProductIds(map)
      expect(result).toEqual(price.toString())
    })
  })

  describe('Check that all the products have enough stock', () => {
    const map = new Map<number, number>().set(1, 2)

    it('should return false if the products are not in stock', async () => {
      jest.spyOn<any, 'findAll'>(Product, 'findAll').mockResolvedValueOnce([
        { productId: 1, quantity: 1 }
      ])

      const result = await checkHasProductStock(map)
      expect(result).toBe(false)
    })

    it('should return true if the products are in stock', async () => {
      jest.spyOn<any, 'findAll'>(Product, 'findAll').mockResolvedValueOnce([
        { productId: 1, quantity: 2 }
      ])

      const result = await checkHasProductStock(map)
      expect(result).toBe(true)
    })
  })
})
