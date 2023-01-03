/* eslint-disable max-len */
import Button from 'Components/Button';
import { TextInput } from 'Components/Input';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { Pathname } from 'Routes';
import './styles.scss';
import biniLarge from 'Assets/images/bini-logo-big.png';
import { Snackbar, defaultSnackbar } from 'Components/Snackbar';

import { useDispatch } from 'react-redux';
import { signIn, signUp } from 'Store/actions';
import { Config } from 'Configs';

const Login = ({ setSnackbar }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    if (name) {
      const data = { ...formData };
      data[name] = value;
      setFormData(data);
    }
  };
  const handleSubmit = () => {
    setIsLoading(true);
    dispatch(signIn(formData, setSnackbar, (response) => {
      setIsLoading(false);
      if (response.status) {
        setTimeout(() => {
          history.push(Pathname.home);
        }, 1000);
      }
    }));
  };

  return (
    <>
      <div className="form-body" onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}>
        <TextInput placeholder="Username" type="text" name="email" onChange={handleChange} className="auth-input" />
        <TextInput placeholder="Password" type="password" name="password" onChange={handleChange} className="auth-input" />
        <div className="forgot-password">
          <Link to={Pathname.forgotPassword}>
            Forgot Password
          </Link>
        </div>
      </div>
      <div className="form-actions">
        <Button onClick={handleSubmit} disable={isLoading}>{isLoading ? 'Logging' : 'Login'}</Button>
        <div>
          Don’t have an Account?
          {' '}
          <span>

            <Link to={Pathname.signUp}>
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </>
  );
};
const SignUp = ({ setSnackbar }) => {
  const [formData, setFormData] = useState({
    role: Config.validUserRoles.retailer
  });
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    if (name) {
      const data = { ...formData };
      data[name] = value;
      setFormData(data);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    dispatch(signUp({ ...formData }, setSnackbar, (response) => {
      setIsLoading(false);
      if (response.status) {
        history.push(Pathname.home);
      }
    }));
  };
  return (
    <>
      <div className="form-body">
        <TextInput className="auth-input" placeholder="Full Name" type="text" name="name" onChange={handleChange} />
        <TextInput className="auth-input" placeholder="Email" type="text" name="email" onChange={handleChange} />
        {/* <TextInput className="auth-input" placeholder="Username" type="text" name="email" onChange={handleChange} /> */}
        <TextInput className="auth-input" placeholder="Password" type="password" name="password" onChange={handleChange} />
      </div>
      <div className="form-actions">
        <Button onClick={handleSubmit} disable={isLoading}>{isLoading ? 'Signing Up' : 'Sign Up'}</Button>

        <div>
          Already have an account?
          {' '}
          <span>

            <Link to={Pathname.signIn}>
              Login
            </Link>
          </span>
        </div>
        {' '}

      </div>
    </>
  );
};

export default function Auth() {
  const [snackbar, setSnackbar] = useState(defaultSnackbar);
  const [isLogin, setIsLogin] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === Pathname.signIn) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [location.pathname]);
  return (
    <div className="auth-section">
      <div className="form-section">
        <div className="form-head">
          <div className="form-head-image">
            <img src={biniLarge} alt="Brand Logo" />
          </div>
          <div className="form-head-mainHeading">
            Bini Ops
          </div>
          <div className="form-head-subHeading">
            Welcome! Please login to continue.
          </div>
        </div>
        {isLogin
          ? <Login setSnackbar={setSnackbar} />
          : <SignUp setSnackbar={setSnackbar} />}
      </div>
      <Snackbar
        isVisible={snackbar?.isVisible}
        message={snackbar?.message || ''}
        onClose={() => { setSnackbar(defaultSnackbar); }}
        type={snackbar?.type}
      />
    </div>
  );
}
