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
export const filterEventLogsByYear = (allEventLogs: EventLog[], yearConfig: string, year: string, yearRange: string[]): EventLog[] => {
  let eventLogs = allEventLogs;
  if (yearConfig === '単年') {
    if (year !== 'すべて') {
      eventLogs = eventLogs.filter((eventLog) => eventLog.tagList.includes(year));
    }
  } else {
    const list = [];
    for (const targetYear of yearRange) {
      const categories = allEventLogs.filter((eventLog) => eventLog.tagList.includes(targetYear));
      list.push(...categories);
    }
    eventLogs = list;
  }
  return eventLogs;
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
