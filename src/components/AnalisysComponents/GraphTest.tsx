import React, {useContext, useState} from 'react';
import Plot from 'react-plotly.js';
import {AppContext} from "../state/ContextProvider";
import {Data} from "plotly.js";

type Props = {}

const GraphTest: React.FC<Props> = (props) => {
  const {allUrl, allCategory} = useContext(AppContext);

  const data1:Data[] = [
    {
      type: "scatter3d",
      x: allUrl.map(v => {
        let score = 0;
        for (const tag of v.tagList) {
          if (!tag.includes("さん") && !tag.includes("年")){
            const mainTag = allCategory.find(value => value.category == tag);
            if(mainTag?.point?.length){
              score += mainTag.point[0];
            }
          }
        }
        return score;
      }),
      y: allUrl.map(v => {
        let score = 0;
        for (const tag of v.tagList) {
          if (!tag.includes("さん") && !tag.includes("年")){
            const mainTag = allCategory.find(value => value.category == tag);
            if(mainTag?.point?.length){
              score += mainTag.point[1];
            }
          }
        }
        return score;
      }),
      z: allUrl.map(v => {
        let score = 0;
        for (const tag of v.tagList) {
          if (!tag.includes("さん") && !tag.includes("年")){
            const mainTag = allCategory.find(value => value.category == tag);
            if(mainTag?.point?.length){
              score += mainTag.point[2];
            }
          }
        }
        return score;
      }),
      mode: "markers",
      text: allUrl.map(v=>v.title),
      xaxis: "個性的-社会的",
      yaxis: "教養-実用"
    },
  ];

  const layout1 = { title: "横:個性的-社会的 縦:教養性-実用性" };

  return (
    <Plot data={data1} layout={layout1} />
  );
};

export default GraphTest;
