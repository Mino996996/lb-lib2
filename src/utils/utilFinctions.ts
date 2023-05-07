export const testABCD = (): string => 'ABCD';
// オリジナルIDを作成
export const createId = (digit: number): string => {
  const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(crypto.getRandomValues(new Uint32Array(digit)))
    .map((n) => S[n % S.length])
    .join('');
};

export const checkSelectedKeywords = (_keywords: string | null): string[] => {
  if (_keywords !== null && _keywords !== '') {
    return JSON.parse(_keywords) as string[];
  }
  return [];
};

export const checkSelectedCategory = (_selectedCategory: string | null): string => {
  if (_selectedCategory !== null && _selectedCategory !== '') {
    return _selectedCategory;
  }
  return '';
};

export const checkHasBoolean = (localStorageString: string | null): boolean => {
  return localStorageString !== null && localStorageString === 'true';
};
