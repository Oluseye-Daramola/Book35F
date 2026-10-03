import { useNavigate } from 'react-router-dom';
import {Button} from '../components/Button';
import { useAuth } from '../context/AuthContext';




export const ProviderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  
  return (
    
    <div style={{ padding: 24 }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <h1>Welcome, {user?.name}</h1>
        
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
        
      </div>
      
      <p className="text-caption">
        Full dashboard shell arrives in Task 2.
      </p>
      
    </div>
    
  );
  
};