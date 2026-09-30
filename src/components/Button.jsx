

export const Button=({
  variant = 'primary',   // 'primary' | 'accent' | 'secondary'
  disabled = false,
  type = 'button',
  onClick,
  children,
}) => {
  
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      
    </button>
    
  );
  
}