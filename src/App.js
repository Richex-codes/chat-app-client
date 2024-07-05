
import './App.css';
import './register.css';
import './login.css'
import Register from './components/Register';
import HomePage from './components/Homepage';
import Loginpage from './components/Loginpage';
import Dashboard from './Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="landing-page">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Loginpage />} />
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard />} /> 
        </Route>
      </Routes>
    </div>
    
  );
}

export default App;
