import { Link } from "react-router-dom"
export default function HomePage(){
    return(
        <div>
            <header className="header">
        <Link to='/' className="logo">IgweChat</Link>
        <nav className="nav">
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><Link to='/login'>Login</Link></li>
          </ul>
        </nav>
      </header>
      <section className="hero">
        <h1>Welcome to IgweChat</h1>
        <p>Connect with friends and family instantly.</p>
        <Link to='/register' className="cta-button">Get Started</Link>
      </section>
      <section id="features" className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Real-Time Messaging</h3>
            <p>Chat with your friends in real-time with our ultra-fast messaging system.</p>
          </div>
          <div className="feature">
            <h3>Secure and Private</h3>
            <p>Your messages are encrypted to ensure privacy and security.</p>
          </div>
          <div className="feature">
            <h3>Cross-Platform</h3>
            <p>Available on web, iOS, and Android. Stay connected on any device.</p>
          </div>
        </div>
      </section>
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>IgweChat is dedicated to providing the best communication experience with a focus on speed and privacy.</p>
      </section>
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <p>Have questions? <a href="mailto:richardigwe2005@gmail.com">Email us</a></p>
      </section>
      <footer className="footer">
        <p>&copy; 2024 ChatApp. All rights reserved.</p>
      </footer>
        </div>
    )
}