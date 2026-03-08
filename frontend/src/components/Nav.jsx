import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav>
      <div className="container">
        <Link to="/">Project & Task Manager</Link>
        {user ? (
          <span>
            <span style={{ marginRight: "1rem" }}>{user.username}</span>
            <button type="button" className="btn btn-sm btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </span>
        ) : (
          <span>
            <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
            <Link to="/signup">Sign up</Link>
          </span>
        )}
      </div>
    </nav>
  );
}
