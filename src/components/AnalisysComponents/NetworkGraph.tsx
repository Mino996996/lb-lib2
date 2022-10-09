import React, {useContext, useEffect, useRef} from 'react';
import {Network,Node,Edge} from "vis-network";
import {AppContext} from "../state/ContextProvider";
import {UrlInfo} from "../utilTypes";

type Props = {}

const createEdges = (urls: UrlInfo[]):Edge[] => {
  let edges: Edge[] =[];
  for (const url of urls) {
    for (const tag of url.tagList) {
      edges.push({from:url.title, to: tag})
    }
  }
  return edges;
}

const NetworkGraph: React.FC<Props> = (props) => {
  const {allUrl, allCategory} = useContext(AppContext);
  
  const container = useRef(null);
  
  const categoryNodes: Node[] = allCategory.map(value => {
    return { id: value.category, label: value.category, color:'green'}
  });
  
  const titleNodes: Node[] = allUrl.map(value => {
    return { id: value.title, label: value.title}
  });
  
  const nodes:Node[] = [...categoryNodes, ...titleNodes];
  
  const edges:Edge[] = createEdges(allUrl);
  
  const options = {};
  
  useEffect(() => {
    // 引数のoptionsが無いと表示されないので空でも入れておく
    const network =
      container.current && new Network(container.current, { nodes, edges }, options);
    // Use `network` here to configure events, etc
  }, [container, nodes, edges]);
  
  return <div ref={container} style={{ height: '1200px', width: '1800px' }}/>;
};

export default NetworkGraph;
