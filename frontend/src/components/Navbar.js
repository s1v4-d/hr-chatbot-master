import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/chatbot">Chatbot</Link></li>
      <li><Link to="/upload">Upload Documents</Link></li>
    </ul>
  </nav>
);

export default Navbar;