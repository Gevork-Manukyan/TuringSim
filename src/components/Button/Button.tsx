import "./Button.scss";

type Variant = "primary" | "ghost" | "danger" | "icon";
type Size = "sm" | "md";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export default function Button({
  variant = "ghost",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes =
    `Button Button--${variant} Button--${size}` +
    (className ? ` ${className}` : "");
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
