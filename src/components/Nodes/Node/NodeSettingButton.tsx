import './Node.scss'

type NodeSettingButtonProps = {
  children?: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  nodeId: string;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  onClick?: React.MouseEventHandler<HTMLSpanElement> | undefined;
}
  
export default function NodeSettingButton({ children, className, style, onClick }: NodeSettingButtonProps) {

  return (
    <span 
      className={`Node__settingBtn${className ? ` ${className}`: ''}`}
      style={style}
      onClick={onClick}
      >
      {children}
    </span>
  )
}
