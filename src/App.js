
import './App.css';
import './styles/register.css';
import './styles/login.css';
import Register from './pages/Register';
import HomePage from './pages/Homepage';
import Loginpage from './pages/Loginpage';
import Chat from './pages/Chat';
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
          <Route path='/chat' element={<Chat />} /> 
        </Route>
        <Route path='*' element={<HomePage />} />
      </Routes>
    </div>
    
  );
}

export default App;
