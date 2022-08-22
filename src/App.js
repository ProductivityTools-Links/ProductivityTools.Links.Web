import './App.css';
import Home from './Components/Home';
import { StyledEngineProvider } from '@mui/material/styles';


function App() {
  return (
    <div className="App">
                      <StyledEngineProvider injectFirst>

      <Home />
      </StyledEngineProvider>
    </div>
  );
}

export default App;
