<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { BookingPage } from './pages/BookingPage';
import { DesignDemo } from './pages/DesignDemo';
import './styles/global.css';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/book/:providerSlug" element={<BookingPage />} />
      {/* Team-owned provider routes remain available without being part of the customer flow. */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/provider" element={<ProviderDashboard />} />
      <Route path="/designDemo" element={<DesignDemo />} />
    </Routes>
  </BrowserRouter>
);
=======

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';


import {LandingPage} from './pages/LandingPage';
import {SignUp} from './pages/SignUp';
import {Login} from './pages/Login';
import {ProviderDashboard} from './pages/ProviderDashboard';
import {BookingPage} from './pages/BookingPage';

import {DesignDemo} from "./pages/DesignDemo";


import './styles/global.css'









export const App = () => {
  
  return (
    <BrowserRouter>
      
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/login" element={<Login />} />
        
        <Route path="/provider" element={<ProviderDashboard />} />
        
        <Route path="/book/:providerName" element={<BookingPage />} />

        <Route path="/designDemo" element={<DesignDemo />} />
        
      </Routes>
      
    </BrowserRouter>
  );
  
}
>>>>>>> origin/Appointment-Booking
