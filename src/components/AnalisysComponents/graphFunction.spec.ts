import { colorHex } from './graphFunctions'

describe('', () => {
  it('RGBの16進数文字列を返す', () => {
    expect(colorHex(69, 179, 157)).toBe('#45b39d')
    expect(colorHex(324, 434, 412)).toBe('#45b39d')
  })
})
