// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { createCanvas } from 'canvas';

// plotlyがwindow.URL.createObjectURLを呼び出すが、node.js上では利用できないのでモック関数と追加する
window.URL.createObjectURL = function () {
  return 'mocked function';
};

// @ts-expect-error:window.HTMLCanvasElement.prototype.getContext
window.HTMLCanvasElement.prototype.getContext = function () {
  return createCanvas(1, 1).getContext('2d');
};
