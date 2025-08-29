interface ButtonProps {
  children: React.ReactNode;
  type?: 'blue' | 'red' | 'green' | 'yellow' | 'amber' | 'gray' | 'white';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
}
function Button({
  children,
  type = 'blue',
  size = 'sm',
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`bg-${type}-500 text-white px-4 py-2 rounded-md text-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
