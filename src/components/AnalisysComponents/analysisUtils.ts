import { CategoryInfo, EventLog } from '../utilTypes';
import { Theme } from '../CategoryComponents/themeList';

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

// todo：データチェックと処理を分けること
// 選択年の範囲作成用：ここでデータチェックをする
export const createYearRange = (startYear: string, lastYear: string): string[] => {
  const startYearRegex = /^\d{1,4}年$/;
  const lastYearRegex = /^\d{1,4}年$/;

  if (!startYearRegex.test(startYear) || !lastYearRegex.test(lastYear)) {
    throw new Error(`入力に誤りがあります。\n start：${startYear}\n last:${lastYear}`);
  }

  const start = Number(startYear.replace('年', ''));
  const last = Number(lastYear.replace('年', ''));
  const range: string[] = [];
  for (let year = start; year <= last; year++) {
    range.push(String(year) + '年');
  }
  return range;
};