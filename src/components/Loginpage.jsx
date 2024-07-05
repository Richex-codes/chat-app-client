import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
export default function Loginpage(){
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState(''); // State to track error messages
    const [loading, setLoading] = useState(false); // State to track loading state
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setErrorMessage(''); 
  
      try {
        const response = await axios.post('http://localhost:3001/login', formData);
        console.log('User logged in successfully:', response.data);
        const { token } = response.data;
        localStorage.setItem('token', token);
        navigate('/dashboard'); 
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrorMessage('Invalid email or password');
        } else {
          setErrorMessage('Error logging in');
        }
        console.error('Error logging in:', error);
      } finally {
        setLoading(false);  
      }
      console.log('Form submitted:', formData);
    };

    return (
      <div className="container">
        <div className="form-container">
          {loading && <div className="spinner"></div>}
          {errorMessage && !loading && <div className="error-message">{errorMessage}</div>}
          {!loading && (
            <form onSubmit={handleSubmit}>
              <input 
                className="login-input"
                type="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              />
              <input 
              className="login-input"
                type="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              />
              <button type="submit">Login</button>
            </form>
          )}
          {!loading && (
            <p>
              Don't have an account? <a href="/register">Sign up</a>
            </p>
          )}
        </div>
      </div>
    );
}