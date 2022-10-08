import React, {useContext, useState} from 'react';
import Plot from 'react-plotly.js';
import {AppContext} from "../state/ContextProvider";
import {PlotData} from "plotly.js";
import {colorHex, threeScatterData} from "./graphFunctions";

type Props = {}

const GraphTest: React.FC<Props> = (props) => {
  const {allUrl, allCategory} = useContext(AppContext);

  const data1:Partial<PlotData> = threeScatterData(allUrl, allCategory, "赤堀さん", "2022年", colorHex(250,86,44));
  const data2:Partial<PlotData> = threeScatterData(allUrl, allCategory, "内山さん", "2022年", colorHex(100,86,254));
  
  const lineX:Partial<PlotData> = {
    type: "scatter3d",
    x:[-10,10],
    y:[0,0],
    z:[0,0],
    mode: "lines",
    line:{color:"black"}
  };
  const lineY:Partial<PlotData> = {
    type: "scatter3d",
    x:[0,0],
    y:[-10,10],
    z:[0,0],
    mode: "lines",
    line:{color:"black"}
  };
  const lineZ:Partial<PlotData> = {
    type: "scatter3d",
    x:[0,0],
    y:[0,0],
    z:[-10,10],
    mode: "lines",
    line:{color:"black"}
  };
  
  const layout1 = { title: "３次元グラフ" };
  const allData = [data1, data2, lineX, lineY, lineZ]
  return (
    <Plot data={allData} layout={layout1} />
  );
};

export default GraphTest;
