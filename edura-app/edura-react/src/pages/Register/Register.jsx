import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from '../../components/auth/RegisterForm';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await register(data).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="register-card">
              <h2 className="register-title">Create Your Account</h2>
              <p className="register-subtitle">
                Join Edura and start your learning journey today.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <RegisterForm onSubmit={onSubmit} loading={loading} />

              <div className="register-footer">
                <p>
                  Already have an account? <a href="/login">Login here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;