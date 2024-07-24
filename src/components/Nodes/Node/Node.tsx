import './Node.scss'

type NodeProps = {
  children?: React.ReactNode;
  className?: string;
}

export default function Node({ children, className }: NodeProps) {
  return (
    <div className='Node__wrapper'>
      <span className="Node__plus_btn">+</span>
      <span className="Node__plus_btn">+</span>
      <span className="Node__plus_btn">+</span>
      <span className="Node__plus_btn">+</span>
      
      <button className={`Node${className ? ` ${className}` : ''}`}>
        {children}
      </button>
    </div>
  )
}
