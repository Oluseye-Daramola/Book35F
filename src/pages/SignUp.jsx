import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {Card} from '../components/Card';
import {Input} from '../components/Input';
import {Button} from '../components/Button';
import { useAuth } from '../context/AuthContext';


import '../styles/Auth.css';








export const SignUp = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  
  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) newErrors.email = 'Enter a valid email address';
    
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validate()) return;

    try {
      await signup(email, password);
      navigate('/provider');
    } catch (err) {
      setSubmitError(err.message);
    }
  };


  
  return (
    <div className="auth-page">

      <div className="auth-card-wrap">
        <Card>
          <h1>Create your account</h1>
          <form onSubmit={handleSubmit}>
            <Input label="Email" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <Input label="Password" type="password" placeholder="At least 8 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
            <Input label="Confirm password" type="password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} />
  
            {submitError && <p className="field-error">{submitError}</p>}
  
            
            <div className="auth-btn">
              <Button type="submit" variant="accent" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
            
          </form>
          
          <p className="text-caption auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
          
        </Card>
      </div>
      
    </div>
  );
};