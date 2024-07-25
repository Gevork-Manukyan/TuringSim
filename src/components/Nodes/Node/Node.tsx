import './Node.scss'
import { useState } from 'react';
import { useDirectedGraph, TNode } from '../../../lib/hooks/useDirectedGraph';

type NodeProps = {
  className?: string;
  node: TNode;
}

export default function Node({ className, node }: NodeProps) {
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = () => {
    setIsClicked(prev => !prev)
  }

  return (
    <div className='Node__wrapper'>
      <button 
        className={`Node${className ? ` ${className}` : ''}${isClicked ? ' Node--clicked': ''}`} 
        onClick={handleClick}
      >
        {node.value ? node.value : "Node"}
      </button>

      <PlusButton className='Node__plus_btn--1' nodeId={node.id} setIsClicked={setIsClicked} />
      <PlusButton className='Node__plus_btn--2' nodeId={node.id} setIsClicked={setIsClicked} />
      <PlusButton className='Node__plus_btn--3' nodeId={node.id} setIsClicked={setIsClicked} />
      <PlusButton className='Node__plus_btn--4' nodeId={node.id} setIsClicked={setIsClicked} />
    </div>
  )
}

type PlusButtonProps = {
  className: string;
  nodeId: string;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

function PlusButton({ className, nodeId, setIsClicked }: PlusButtonProps) {

  const addNode = useDirectedGraph(state => state.addNode)
  const addEdge = useDirectedGraph(state => state.addEdge)

  const handleClick = () => {
    const newNodeId = addNode(null);
    addEdge({
      from: nodeId,
      to: newNodeId
    })

    setIsClicked(false)    
  }

  return (
    <span 
      className={`Node__plus_btn${className ? ` ${className}`: ''}`}
      onClick={handleClick}
    >
      +
    </span>
  )
}
