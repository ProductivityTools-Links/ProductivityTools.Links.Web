import './App.css';

import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter as Router , Route, Routes } from 'react-router-dom'

import Date from './Components/Date'
import Console from './Components/Console';
import Home from './Components/Home';

import Login from './Session/login'
import { AuthProvider } from './Session/AuthContext'
import { ToastContainer } from 'react-toastify';




function App() {
  return (
    <AuthProvider>
      <div className="App">
        <StyledEngineProvider injectFirst>
          <Router >
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/Console' element={<Console />} />
              <Route path='/Date' element={<Date />} />
              <Route path='/' element={<Home />} />
              <Route path='/:login' element={<Console />} />
            </Routes>

          </Router >
        </StyledEngineProvider>
        <ToastContainer />
      </div>
    </AuthProvider>
  );
}

export default App;
