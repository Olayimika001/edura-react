import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const login = async (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const register = async (userData) => {
    return dispatch(registerUser(userData));
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};