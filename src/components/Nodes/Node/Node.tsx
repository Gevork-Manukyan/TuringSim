import './Node.scss'

type NodeProps = {
  children?: React.ReactNode;
  className?: string;
}

export default function Node({ children, className }: NodeProps) {
  return (
    <button className={`Node${className ? ` ${className}` : ''}`}>{children}</button>
  )
}
