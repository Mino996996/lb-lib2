export const setConfigLocalStorage = (keyName: string, input: boolean): void => {
  localStorage.setItem(keyName, String(input));
};
