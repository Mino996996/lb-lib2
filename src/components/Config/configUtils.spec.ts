import { setConfigLocalStorage } from './configUtils';

describe('configUtils', () => {
  describe('setConfigLocalStorage', () => {
    beforeEach(() => localStorage.clear());

    it('指定したキーのlocalStorageに値を入れる', () => {
      const key = 'image';
      const bool = true;
      setConfigLocalStorage(key, bool);

      expect(localStorage.getItem(key)).toEqual('true');
    });
  });
});
