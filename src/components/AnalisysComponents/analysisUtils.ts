import { CategoryInfo, EventLog } from '../utilTypes';
import { Theme } from '../CategoryComponents/themeList';
import { TendScore } from './TendScore';

export interface HitTime {
  name: string;
  times: number;
}

// 年月日の数値取り出し用：msデータを日本時刻のDateに変換
export const dateYMD = (sec: number): Date => {
  const JST = sec + 9 * 3600;
  return new Date(JST * 1000);
};

// スコアリング用：発表情報が持つ登録タグリストから発表年と発表者のタグを除外する
export const tagFilter = (tags: string[]): string[] => {
  return tags.filter((tag) => tag.slice(-1) !== '年' && !tag.includes('さん'));
};

// 発表資料を年でフィルタリング
export const filterEventLogsByYear = (allEventLogs: EventLog[], isSingleYear: boolean, selectedYear: string, yearRange: string[]): EventLog[] => {
  // 単年指定時
  if (isSingleYear) {
    if (selectedYear !== 'すべて') {
      return allEventLogs.filter((eventLog) => eventLog.tagList.includes(selectedYear));
    }
    return allEventLogs;
  }
  // 範囲指定時
  const list = [];
  for (const targetYear of yearRange) {
    const categories = allEventLogs.filter((eventLog) => eventLog.tagList.includes(targetYear));
    list.push(...categories);
  }
  return list;
};

// 発表資料をタグでフィルタフィング
export const filterEventLogsByTags = (eventLogs: EventLog[], person: string, selectTag: string): EventLog[] => {
  if (person !== 'すべて') {
    eventLogs = eventLogs.filter((eventLog) => eventLog.tagList.includes(person));
  }
  if (selectTag !== 'すべて') {
    eventLogs = eventLogs.filter((eventLog) => eventLog.tagList.includes(selectTag));
  }
  return eventLogs;
};

// 発表年選択用
export const createYearList = (allEventLogs: CategoryInfo[]): string[] => {
  return allEventLogs.filter((category) => category.theme === Theme.year).map((value) => value.category);
};

// 選択年の範囲作成用：ここでデータチェックをする
export const createYearRange = (startYear: string, endYear: string): string[] => {
  const start = Number(startYear.replace('年', ''));
  const end = Number(endYear.replace('年', ''));
  const range: string[] = [];
  for (let year = start; year <= end; year++) {
    range.push(String(year) + '年');
  }
  return range;
};

// 入力値バリデーション
export const validateInputYears = (startYear: string, endYear: string): void => {
  const startYearRegex = /^\d{1,4}年$/;
  const endYearRegex = /^\d{1,4}年$/;
  if (!startYearRegex.test(startYear) || !endYearRegex.test(endYear)) {
    throw new Error(`入力に誤りがあります。\n start：${startYear}\n end:${endYear}`);
  }

  const start = Number(startYear.replace('年', ''));
  const end = Number(endYear.replace('年', ''));
  if (start >= end) {
    throw new Error(`範囲の終わりは${startYear}より以降の年を選択してください`);
  }
};

// 該当発表の指定傾向タイプにおける平均値 => グラフのXかY座標と傾向分析用に使用
export const averageTendScores = (eventLogs: EventLog[], allCategories: CategoryInfo[], type: TendScore): number => {
  const sums = eventLogs.map((v) => {
    let score = 0;
    for (const tag of v.tagList) {
      if (!tag.includes('さん') && tag.slice(-1) !== '年') {
        const mainTag = allCategories.find((value) => value.category === tag);
        if (mainTag?.point?.length != null) {
          score += mainTag.point[type];
        }
      }
    }
    return score;
  });
  return sums.reduce((pre: number, cur: number) => pre + cur) / eventLogs.length;
};

// 発表者またはタグの名前と登場回数のオブジェクトを返す
export const hitTimes = (presentations: EventLog[], allCategory: CategoryInfo[], filter: 'person' | 'tag'): HitTime[] => {
  const theme = filter === 'person' ? Theme.member : Theme.genre;
  return allCategory
    .filter((category) => category.theme === theme)
    .map((relation) => {
      return {
        name: relation.category,
        times: presentations.filter((eventLog) => eventLog.tagList.includes(relation.category)).length,
      };
    })
    .filter((presenter) => presenter.times !== 0)
    .sort((a, b) => b.times - a.times);
};
