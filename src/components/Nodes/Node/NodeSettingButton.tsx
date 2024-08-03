import './Node.scss'
import { useDirectedGraph } from '../../../lib/hooks/useDirectedGraph';

type NodeSettingButtonProps = {
  children?: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  nodeId: string;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
}
  
export default function NodeSettingButton({ children, className, style, nodeId, setIsClicked }: NodeSettingButtonProps) {

  const addNode = useDirectedGraph(state => state.addNode)
  const addEdge = useDirectedGraph(state => state.addEdge)

  const handleClick = () => {
    const newNodeId = addNode(null);
    addEdge(nodeId, newNodeId)
    setIsClicked(false)    
  }

  return (
    <span 
      className={`Node__plusBtn${className ? ` ${className}`: ''}`}
      style={style}
      onClick={handleClick}
      >
      {children}
    </span>
  )
}
