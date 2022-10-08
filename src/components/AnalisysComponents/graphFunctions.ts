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

export const colorHex = (pattern: number):string => {
  const redCoefficient = 64;
  const greenCoefficient = 83;
  const blueCoefficient = 31;
  const r = (redCoefficient * pattern % 255).toString(16);
  const g = (greenCoefficient * pattern % 255).toString(16);
  const b = (blueCoefficient * pattern % 255).toString(16);
  return `#${r}${g}${b}`
}

const threeScatterData = (allUrl:UrlInfo[], allCategory:CategoryInfo[], person:string, color:Color):Partial<PlotData> => {
  return {
    type: "scatter3d",
    x: scores(allUrl, allCategory, person, Tend.social),
    y: scores(allUrl, allCategory, person, Tend.education),
    z: scores(allUrl, allCategory, person, Tend.join),
    marker:{symbol:"diamond", opacity:1, size:4, color:color},
    mode: "markers",
      text: allUrl.filter(value => value.tagList.includes(person)).map(v=>v.title)
  }
};

export {threeScatterData}
