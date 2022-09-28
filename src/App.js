import './App.css';

import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Date from './Components/Date'
import Home from './Components/Home';

import Login from './Session/login'


function App() {
  return (
    <div className="App">
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Home />} />
            <Route path='/Date' element={<Date />} />
          </Routes>
        </BrowserRouter>
      </StyledEngineProvider>
    </div>
  );
}

export default App;
