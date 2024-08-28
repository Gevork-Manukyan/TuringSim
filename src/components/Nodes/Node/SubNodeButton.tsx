import './Node.scss'

type NodeSettingButtonProps = {
  children?: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLSpanElement> | undefined;
}
  
export default function SubNodeButton({ children, className, style, onClick }: NodeSettingButtonProps) {

  return (
    <div 
      className={`Node__settingBtn${className ? ` ${className}`: ''}`}
      style={style}
      onClick={onClick}
      >
      {children}
    </div>
  )
}
