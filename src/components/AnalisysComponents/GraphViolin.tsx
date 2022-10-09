import React, {useContext} from 'react';
import {AppContext} from "../state/ContextProvider";
import {Layout, ViolinData} from "plotly.js";
import Plot from "react-plotly.js";
import {scores, Tend} from "./graphFunctions";

type Props = {}

const GraphViolin: React.FC<Props> = (props) => {
  const {allUrl, allCategory} = useContext(AppContext);
  
  const data1:Partial<ViolinData> = {
    type:'violin',
    points: 'all',
    y:scores(allUrl, allCategory, '沖藤拓さん', 'all', Tend.education)
  }
  
  const data2:Partial<ViolinData> = {
    type:'violin',
    points: 'all',
    y:scores(allUrl, allCategory, '小橋さん', 'all', Tend.education)
  }
  
  const data3:Partial<ViolinData> = {
    type:'violin',
    points: 'all',
    y:scores(allUrl, allCategory, '赤堀さん', 'all', Tend.education)
  }
  
  const layout1:Partial<Layout> = { title: "発表傾向：教養-実用型", yaxis: {zeroline: false}};
  const allData = [data1, data2, data3]
  return (
    <Plot data={allData} layout={layout1} />
  );
};

export default GraphViolin;
