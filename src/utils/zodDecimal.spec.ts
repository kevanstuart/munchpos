import zodDecimal from './zodDecimal'

describe('ZodDecimal ensures an input conforms to a valid decimal pattern', () => {
  it('should return false if the input is a negative number', () => {
    const result = zodDecimal(-1)
    expect(result).toBe(false)
  })

  it('should return false if the input has more than 2 digits after the decimal point', () => {
    const result = zodDecimal(1.143)
    expect(result).toBe(false)
  })

  it('should return true if the input has no digits after the decimal point', () => {
    const result = zodDecimal(1)
    expect(result).toBe(true)
  })

  it('should return true for a correctly formatted decimal value', () => {
    const result = zodDecimal(1.14)
    expect(result).toBe(true)
  })
})
