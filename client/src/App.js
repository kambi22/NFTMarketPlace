import logo from './logo.svg';
import './App.css';
import './compnent/Project.css'
import Connection from './Web3Connection/Connection';
import CustomThemeProvider from './Context/themeContext';


function App() {
  return (
    <CustomThemeProvider>
      <div className="App">
        <Connection />
      </div>
    </CustomThemeProvider>
  );
}

export default App;
