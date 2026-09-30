
import { useId } from 'react';




export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  multiline = false,
}) => {
  
  const id = useId();
  
  const className = `field-input${error ? ' has-error' : ''}`;


  
  return (
    
    <div className="field">
      
      <label htmlFor={id} className="field-label text-label">
        {label}
      </label>

      
      {multiline ? (
      
        <textarea
          id={id}
          rows={3}
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      
      ) : (
      
        <input
          id={id}
          type={type}
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      
      )}

      {error && <div className="field-error">{error}</div>}
      
    </div>
  );
  
}
