import { testABCD } from './utilFinctions';

describe('Test of utility utils', () => {
  it('testABDC', () => {
    expect(testABCD()).toBe('ABCD');
  });
});
