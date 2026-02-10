import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/Navbar.css";
const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        User Management
      </Link>
      <div className="navbar-links">
        {currentUser ? (
          <>
            <span className="navbar-user">Welcome, {currentUser.username}</span>
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/signup" className="navbar-link">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
