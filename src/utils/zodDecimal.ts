export default (n: number): boolean => {
  if (isNaN(n) || n < 0) return false

  const components = n.toString().split('.')
  if (components.length === 1) return true
  if (components.length === 2 && components[1].length > 2) return false

  return true
}
