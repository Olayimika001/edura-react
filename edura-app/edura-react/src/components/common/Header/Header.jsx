import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Header.module.css'; // ✅ CSS Module import

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <Link to="/">
              <img src="/assets/img/logo.svg" alt="Edura" />
            </Link>
          </div>
          
          <ul className={styles.navMenu}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/instructors">Instructors</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          <div className={styles.headerActions}>
            {isAuthenticated ? (
              <>
                <Link to="/cart" className={styles.cartIcon}>
                  <i className="fas fa-shopping-cart"></i>
                </Link>
                <div className={styles.userMenu}>
                  <span>{user?.firstName || user?.email}</span>
                  <div className={styles.dropdown}>
                    <Link to="/profile">Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className={styles.btnLogin}>
                <i className="far fa-user"></i> Login / Register
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;