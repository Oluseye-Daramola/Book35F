
import { Link } from 'react-router-dom';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {Logo} from '../components/Logo';

import '../styles/Landing.css';






export const LandingPage=()=>{
  return (
    <div>
      
      <div className="hero">
        
        <div style={{ marginBottom: 20 }}>
          <Logo />
        </div>

        <p className="text-display">Appointment booking, made simple</p>
        <p style={{ marginTop: 10 }}>
          Set your hours once. Share a link. Let people book straight into
          your calendar.
        </p>

        <div className="hero-ctas">
          
          <Link to="/signup">
            <Button variant="accent">
              Get Started
            </Button>
          </Link>
          
          <Link to="/login">
            <Button variant="primary">
              Log In
            </Button>
          </Link>
          
        </div>
        
      </div>

      
      <div className="how-it-works">
        
        <Card>
          <h2>For providers</h2>
          <p>
            Set your availability. Share a link. Get bookings.
          </p>
        </Card>
        
        <Card>
          <h2>For customers</h2>
          <p>
            Click a link. Choose a time. Confirm your booking.
          </p>
        </Card>
        
      </div>
      
    </div>
    
  );
}