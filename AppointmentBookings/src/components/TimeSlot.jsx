



export const TimeSlot = ({ time, status = 'open', selected = false, onClick }) => {
  
  let className = 'time-slot tabular';
  
  if (status === 'booked') className += ' time-slot-booked';
  
  if (selected) className += ' time-slot-selected';

  
  return (
    
    <button
      type="button"
      className={className}
      onClick={status === 'booked' ? undefined : onClick}
    >
      
      {time}
      
    </button>
    
  );
  
}

