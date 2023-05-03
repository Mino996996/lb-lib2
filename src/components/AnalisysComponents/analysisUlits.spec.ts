import { dateYMD, filterEventLogsByYear } from './analysisUtils';
import { EVENT_SAMPLES } from '../../fixtures/samples/samples';
import { EventLog } from '../utilTypes';

describe('analysisUtils', () => {
  describe('dateYMD', () => {
    it('UTCタイムゾーンの時刻から+9時間の日本時刻に変換されている', () => {
      const timestampInSeconds = 1629640800; // 2021-08-22T14:00:00.000Z
      const expectedResult = new Date('2021-08-22T23:00:00.000Z'); // +9時間のデータ

      expect(dateYMD(timestampInSeconds)).toEqual(expectedResult);
    });

    it('int型（4バイト）上限と下限値の値でチェック', () => {
      const minTimestamp = 0;
      const maxTimestamp = 2147483647; // Max 32-bit integer value
      const minDate = new Date('1970-01-01T09:00:00.000Z');
      const maxDate = new Date('2038-01-19T12:14:07.000Z');

      expect(dateYMD(minTimestamp)).toEqual(minDate);
      expect(dateYMD(maxTimestamp)).toEqual(maxDate);
    });
  });

  describe('filterEventLogsByYear', () => {
    // 前提：EventLogリストは昇順にソートされたものがやってくる。EVENT_SAMPLEも対応済み
    it('year==すべて, yearConfig==単年で、素のEventLogリストが返ってくる', () => {
      const expectedResult: EventLog[] = EVENT_SAMPLES;
      const yearConfig = '単年';
      const year = 'すべて';
      const yearRange = ['この条件のとき、ここに何が入っててもエラーにならない'];

      expect(filterEventLogsByYear(EVENT_SAMPLES, yearConfig, year, yearRange)).toEqual(expectedResult);
    });

    it('year==任意の年, yearConfig==単年で、該当年でフィルターされたEventLogリストが返ってくる', () => {
      const expectedResult: EventLog[] = [EVENT_SAMPLES[0]];
      const yearConfig = '単年';
      const year = '2013年';
      const yearRange = ['この条件のとき、ここに何が入っててもエラーにならない'];

      expect(filterEventLogsByYear(EVENT_SAMPLES, yearConfig, year, yearRange)).toEqual(expectedResult);
    });

    it('year=なんでも, yearConfig!=単年、yearRange=[はじめ、おわり]で該当範囲年でフィルターされたEventLogリストが返ってくる', () => {
      const expectedResult: EventLog[] = [EVENT_SAMPLES[1], EVENT_SAMPLES[2]];
      const yearConfig = '期間指定';
      const year = 'この条件のとき、ここに何が入っててもエラーにならない';
      const yearRange = ['2016年', '2017年', '2018年', '2019年'];

      expect(filterEventLogsByYear(EVENT_SAMPLES, yearConfig, year, yearRange)).toEqual(expectedResult);
    });
  });
});
