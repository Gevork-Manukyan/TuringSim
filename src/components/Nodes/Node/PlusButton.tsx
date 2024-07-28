import './Node.scss'
import { useDirectedGraph } from '../../../lib/hooks/useDirectedGraph';

type PlusButtonProps = {
  className: string;
  style?: React.CSSProperties;
  nodeId: string;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}
  
export default function PlusButton({ className, style, nodeId, setIsClicked }: PlusButtonProps) {

  const addNode = useDirectedGraph(state => state.addNode)
  const addEdge = useDirectedGraph(state => state.addEdge)

  const handleClick = () => {
    const newNodeId = addNode(null);
    addEdge({ from: nodeId, to: newNodeId })
    setIsClicked(false)    
  }

  return (
    <span 
      className={`Node__plusBtn${className ? ` ${className}`: ''}`}
      style={style}
      onClick={handleClick}
      >
      +
    </span>
  )
}
