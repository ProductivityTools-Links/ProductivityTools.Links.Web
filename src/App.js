import './App.css';

import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Date from './Components/Date'
import Console from './Components/Console';
import Home from './Components/Home';

import Login from './Session/login'
import { AuthProvider } from './Session/AuthContext'
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';

const theme = createMuiTheme();

const useStyles = makeStyles((theme) => {
  root: {
    // some CSS that accesses the theme
  }
});

function App() {


  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
