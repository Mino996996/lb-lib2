import {Color, PlotData} from "plotly.js";
import {CategoryInfo, UrlInfo} from "../utilTypes";

export enum Tend {
  social,
  education,
  join
}

const scores = (allUrl:UrlInfo[], allCategory:CategoryInfo[], person:string, tend:Tend):number[]=>{
  return allUrl.filter(value => value.tagList.includes(person))
    .map(v => {
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

export const colorHex = (r:number, g:number, b:number):string => {
  return `#${(r % 255).toString(16)}${(g % 255).toString(16)}${(b % 255).toString(16)}`
}

const threeScatterData = (allUrl:UrlInfo[], allCategory:CategoryInfo[], person:string, color:Color):Partial<PlotData> => {
  return {
    type: "scatter3d",
    x: scores(allUrl, allCategory, person, Tend.social),
    y: scores(allUrl, allCategory, person, Tend.education),
    z: scores(allUrl, allCategory, person, Tend.join),
    marker:{symbol:"circle", opacity:1, size:3, color:color},
    mode: "markers",
      text: allUrl.filter(value => value.tagList.includes(person)).map(v=>v.title)
  }
};

export {threeScatterData}
