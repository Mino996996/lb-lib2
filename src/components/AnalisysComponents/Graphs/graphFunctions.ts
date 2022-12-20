import { Color, PlotData } from 'plotly.js';
import { CategoryInfo, EventLog } from '../../utilTypes';
import { Score } from './Score';
import { Theme } from '../../CategoryComponents/themeList';

interface relation {
  name: string;
  times: number;
}

export const colorHex = (r: number, g: number, b: number): string => {
  return `#${(r % 255).toString(16)}${(g % 255).toString(16)}${(b % 255).toString(16)}`;
};

// 発表の数値化 => グラフのXかY座標リスト。傾向分析用にも使用中
export const totalScores = (eventLogs: EventLog[], allCategories: CategoryInfo[], type: Score): number[] => {
  return eventLogs.map((v) => {
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
};

// 発表者またはタグの名前と登場回数のオブジェクトを返す
export const relations = (presentations: EventLog[], allCategory: CategoryInfo[], filter: 'person' | 'tag'): relation[] => {
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
