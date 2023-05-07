import {
  averageTendScores,
  createYearList,
  createYearRange,
  dateYMD,
  filterEventLogsByTags,
  filterEventLogsByYear,
  HitTime,
  hitTimes,
  totalScores,
  validateInputYears,
} from './analysisUtils';
import { EVENT_SAMPLES, CATEGORY_SAMPLES } from '../../fixtures/samples/samples';
import { EventLog } from '../../utils/utilTypes';
import { TendScore } from './TendScore';

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
    it('year=すべて, isSingleYear=trueで、素のEventLogリストが返ってくる', () => {
      const expectedResult: EventLog[] = EVENT_SAMPLES;
      const isSingleYear = true;
      const year = 'すべて';
      const yearRange = ['この条件のとき、ここに何が入っててもエラーにならない'];

      expect(filterEventLogsByYear(EVENT_SAMPLES, isSingleYear, year, yearRange)).toEqual(expectedResult);
    });

    it('year=任意の年, isSingleYear=trueで、該当年でフィルターされたEventLogリストが返ってくる', () => {
      const expectedResult: EventLog[] = [EVENT_SAMPLES[0]];
      const isSingleYear = true;
      const year = '2013年';
      const yearRange = ['この条件のとき、ここに何が入っててもエラーにならない'];

      expect(filterEventLogsByYear(EVENT_SAMPLES, isSingleYear, year, yearRange)).toEqual(expectedResult);
    });

    it('year=なんでも, isSingleYear=false、yearRange=[はじめ~おわり]で該当範囲年でフィルターされたEventLogリストが返ってくる', () => {
      const expectedResult: EventLog[] = [EVENT_SAMPLES[1], EVENT_SAMPLES[2]];
      const isSingleYear = false;
      const year = 'この条件のとき、ここに何が入っててもエラーにならない';
      const yearRange = ['2016年', '2017年', '2018年', '2019年'];

      expect(filterEventLogsByYear(EVENT_SAMPLES, isSingleYear, year, yearRange)).toEqual(expectedResult);
    });
  });

  describe('filterEventLogsByTags', () => {
    // 前提：EventLogリストは昇順にソートされたものがやってくる。EVENT_SAMPLEも対応済み
    it('person=すべて, selectTag=すべてで、素のEventLogリストが返ってくる', () => {
      const expectedResult: EventLog[] = EVENT_SAMPLES;
      const person = 'すべて';
      const selectTag = 'すべて';

      expect(filterEventLogsByTags(EVENT_SAMPLES, person, selectTag)).toEqual(expectedResult);
    });

    it('person=任意の発表者, selectTag=すべてで、該当発表者のEventLogリストが返ってくる', () => {
      const expectedResult: EventLog[] = [EVENT_SAMPLES[1]];
      const person = '垣内さん';
      const selectTag = 'すべて';

      expect(filterEventLogsByTags(EVENT_SAMPLES, person, selectTag)).toEqual(expectedResult);
    });

    it('person=すべて, selectTag=任意の発表者で、該当発表者のEventLogリストが返ってくる', () => {
      const expectedResult: EventLog[] = [EVENT_SAMPLES[1], EVENT_SAMPLES[2]];
      const person = 'すべて';
      const selectTag = '教養';

      expect(filterEventLogsByTags(EVENT_SAMPLES, person, selectTag)).toEqual(expectedResult);
    });

    it('person=任意, selectTag=任意で、被害等の場合は空のリストが返ってくる', () => {
      const expectedResult: EventLog[] = [];
      const person = 'ボブさん';
      const selectTag = 'すべて';

      expect(filterEventLogsByTags(EVENT_SAMPLES, person, selectTag)).toEqual(expectedResult);
    });
  });

  describe('createYearList', () => {
    it('該当する年の文字列配列を返す', () => {
      const expectedResult: string[] = ['2013年', '2014年', '2015年'];

      expect(createYearList(CATEGORY_SAMPLES)).toEqual(expectedResult);
    });
  });

  describe('createYearRange', () => {
    it('startYear～lastYearの範囲で1年毎の"○○年"という文字列配列を返す', () => {
      const expectResult = ['2010年', '2011年', '2012年', '2013年', '2014年'];
      const startYear = '2010年';
      const endYear = '2014年';

      expect(createYearRange(startYear, endYear)).toEqual(expectResult);
    });
  });

  describe('validateInputYears', () => {
    it('startYearとendYearに規定外の入力があったらエラーを投げる', () => {
      const startYear = '2010';
      const endYear = '2014年';
      expect(() => validateInputYears(startYear, endYear)).toThrow('入力に誤りがあります。\n start：2010\n end:2014年');
    });

    it('startYear>=endYearなら、エラーを投げる', () => {
      const startYear = '2010年';
      const endYear = '2009年';
      expect(() => validateInputYears(startYear, endYear)).toThrow('範囲の終わりは2010年より以降の年を選択してください');
    });
  });

  describe('totalScores', () => {
    it('該当発表リストから社会的スコアリストを返す', () => {
      const expectedResult = [0, 0, 0, -1];
      const events = EVENT_SAMPLES;
      const categories = CATEGORY_SAMPLES;
      const tendType = TendScore.Socially;

      expect(totalScores(events, categories, tendType)).toEqual(expectedResult);
    });
  });

  describe('averageTendScores', () => {
    it('発表リストの傾向ごとの平均社会的スコアを返す', () => {
      const expectedResult = -0.25;
      const events = EVENT_SAMPLES;
      const categories = CATEGORY_SAMPLES;
      const tendType = TendScore.Socially;

      expect(averageTendScores(events, categories, tendType)).toEqual(expectedResult);
    });

    it('発表リストの傾向ごとの平均教養的スコアを返す', () => {
      const expectedResult = -0.175;
      const events = EVENT_SAMPLES;
      const categories = CATEGORY_SAMPLES;
      const tendType = TendScore.Educated;

      expect(averageTendScores(events, categories, tendType)).toEqual(expectedResult);
    });

    it('発表リストの傾向ごとの平均講義的スコアを返す', () => {
      const expectedResult = 0.625;
      const events = EVENT_SAMPLES;
      const categories = CATEGORY_SAMPLES;
      const tendType = TendScore.Lecture;

      expect(averageTendScores(events, categories, tendType)).toEqual(expectedResult);
    });
  });

  describe('hitTimes', () => {
    it('発表リストから登録されているメインタグを多い順にして配列で返す', () => {
      const expectedResult: HitTime[] = [{ name: 'LB活性化', times: 1 }];
      const events = EVENT_SAMPLES;
      const categories = CATEGORY_SAMPLES;
      const filter = 'tag';

      expect(hitTimes(events, categories, filter)).toEqual(expectedResult);
    });

    it('発表リストから登録されている発表者を多い順にして配列で返す', () => {
      const expectedResult: HitTime[] = [{ name: '長野さん', times: 1 }];
      const events = EVENT_SAMPLES;
      const categories = CATEGORY_SAMPLES;
      const filter = 'person';

      expect(hitTimes(events, categories, filter)).toEqual(expectedResult);
    });
  });
});
