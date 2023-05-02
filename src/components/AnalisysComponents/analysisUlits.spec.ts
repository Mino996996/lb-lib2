import { dateYMD } from './analysisUtils';

describe('dateYMD', () => {
  it('UTCタイムゾーンの時刻から+9時間の日本時刻に変換されている', () => {
    const timestampInSeconds = 1629640800; // 2021-08-22T14:00:00.000Z
    const expectedResult = new Date('2021-08-22T23:00:00.000Z');

    expect(dateYMD(timestampInSeconds)).toEqual(expectedResult);
  });

  it('上限と下限値でも変換可能である', () => {
    const minTimestamp = 0;
    const maxTimestamp = 2147483647; // Max 32-bit integer value
    const minDate = new Date('1970-01-01T09:00:00.000Z');
    const maxDate = new Date('2038-01-19T12:14:07.000Z');

    expect(dateYMD(minTimestamp)).toEqual(minDate);
    expect(dateYMD(maxTimestamp)).toEqual(maxDate);
  });
});
