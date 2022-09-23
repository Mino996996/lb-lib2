import React, {useEffect, useRef} from 'react';
import {Network} from "vis-network";

type Props = {}

const NetworkGraph: React.FC<Props> = (props) => {
  const nodes = [
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
  ];

  const edges = [
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3 },
  ];

  const visJsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const network =
      visJsRef.current &&
      new Network(visJsRef.current, { nodes, edges } );
    // Use `network` here to configure events, etc
  }, [visJsRef, nodes, edges]);

  return <div ref={visJsRef} className="bg-white" />;
};

export default NetworkGraph;
