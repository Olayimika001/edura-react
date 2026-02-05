import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

const RegisterForm = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form">
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              {...register('firstName')}
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <div className="invalid-feedback">
                {errors.firstName.message}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              {...register('lastName')}
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName.message}</div>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          placeholder="Create a password"
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          {...register('confirmPassword')}
          className={`form-control ${
            errors.confirmPassword ? 'is-invalid' : ''
          }`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <div className="invalid-feedback">
            {errors.confirmPassword.message}
          </div>
        )}
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="agreeToTerms"
          {...register('agreeToTerms')}
        />
        <label className="form-check-label" htmlFor="agreeToTerms">
          I agree to the{' '}
          <a href="/terms" target="_blank">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" target="_blank">
            Privacy Policy
          </a>
        </label>
        {errors.agreeToTerms && (
          <div className="text-danger small">{errors.agreeToTerms.message}</div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default RegisterForm;