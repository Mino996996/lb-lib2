import {Color, PlotData} from "plotly.js";
import {CategoryInfo, UrlInfo} from "../utilTypes";

export enum Tend {
  social,
  education,
  join
}

// 傾向値の計算用
const scores = (allUrl:UrlInfo[], allCategory:CategoryInfo[], person:string|'all', year:string|'all', tend:Tend):number[] => {
  let urls = allUrl;
  if (person !== 'all') {
    urls = urls.filter(value => value.tagList.includes(person));
  }
  if (year !== 'all') {
    urls = urls.filter(value => value.tagList.includes(year));
  }
  return urls.map(v => {
      let score = 0;
      for (const tag of v.tagList) {
        if (!tag.includes("さん") && !tag.includes("年")) {
          const mainTag = allCategory.find(value => value.category === tag);
          if (mainTag?.point?.length) {
            score += mainTag.point[tend];
          }
        }
      }
      return score;
    });
}

// 各タイトルの抽出用
const titles = (allUrl:UrlInfo[], allCategory:CategoryInfo[], person:string|'all', year:string|'all'):string[] => {
  let urls = allUrl;
  if (person !== 'all') {
    urls = urls.filter(value => value.tagList.includes(person));
  }
  if (year !== 'all') {
    urls = urls.filter(value => value.tagList.includes(year));
  }
  return urls.map(v=>v.title);
}

export const colorHex = (r:number, g:number, b:number):string => {
  return `#${(r % 255).toString(16)}${(g % 255).toString(16)}${(b % 255).toString(16)}`
}

// ３次元グラフの必要データオブジェクトを作る
export const threeScatterData = (allUrl:UrlInfo[], allCategory:CategoryInfo[], person:string|'all', year:string|'all', color:Color):Partial<PlotData> => {
  return {
    type: "scatter3d",
    x: scores(allUrl, allCategory, person, year, Tend.social),
    y: scores(allUrl, allCategory, person, year, Tend.education),
    z: scores(allUrl, allCategory, person, year, Tend.join),
    marker:{symbol:"circle", opacity:1, size:3, color:color},
    mode: "markers",
    text: titles(allUrl, allCategory, person, year),
    name: person,
  }
};
