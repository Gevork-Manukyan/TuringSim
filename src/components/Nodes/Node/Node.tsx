import { useState } from 'react';
import './Node.scss'

type NodeProps = {
  children?: React.ReactNode;
  className?: string;
}

export default function Node({ children, className }: NodeProps) {
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
        {children}
      </button>

      <span className="Node__plus_btn Node__plus_btn--1">+</span>
      <span className="Node__plus_btn Node__plus_btn--2">+</span>
      <span className="Node__plus_btn Node__plus_btn--3">+</span>
      <span className="Node__plus_btn Node__plus_btn--4">+</span>
    </div>
  )
}
