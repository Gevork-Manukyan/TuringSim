import './Node.scss'

type NodeSettingButtonProps = {
  children?: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function SubNodeButton({ children, className, style, title, onClick }: NodeSettingButtonProps) {

  return (
    <button
      className={`Node__subNodeBtn${className ? ` ${className}` : ''}`}
      style={style}
      title={title}
      aria-label={title}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
