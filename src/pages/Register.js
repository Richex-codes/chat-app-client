import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from '../components/Spinner';

const Register = () => {
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        dateOfBirth: '',
        country: '',
        phoneNumber: ''
      });
      const [successMessage, setSuccessMessage] = useState('');
      const [loading, setLoading] = useState(false); 
    

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Add your own form submission logic here, like sending data to the server or using an API
        try {
          const response = await axios.post('http://localhost:3001/register', formData);
          console.log('User registered successfully:', response.data);
          setSuccessMessage('User registered successfully!');
          setTimeout(() => {
            navigate('/login');
          }, 2000); // Redirect to the login page after 2 seconds
        } catch (error) {
          if (error.response && error.response.status === 401) {
            setSuccessMessage('This email exists');
            setTimeout(() => {
              setSuccessMessage(''); 
            }, 1500); //
          } if(error.response && error.response.status === 402){
            setSuccessMessage('Invalid email or password');
            setTimeout(() => {
              setSuccessMessage(''); 
            }, 1500); //
          }
          else {
            setSuccessMessage('Error registering user');
            setTimeout(() => {
              setSuccessMessage(''); 
            }, 1500); //
          }
        } finally {
          setLoading(false); // Set loading to false regardless of success or error
        }
        console.log('Form submitted:', formData);
      };
    
      return (
        <div className="registration-page">
          {loading && <Spinner/>}
          {successMessage && !loading && <div className="success-message">{successMessage}</div>} 
          {!successMessage && !loading && (
          <div className="registration-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn">Sign Up</button>
            </form>
            <p className="already-have-account">
              Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
        )}
        </div>
      );
}

export default Register