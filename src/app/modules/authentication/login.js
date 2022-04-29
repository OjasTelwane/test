import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../core/actions/authentication';
import { setAlert } from '../../core/actions/alert';
const Login = ({ login, setAlert, isAuthenticated, isFirstTime }) => {
  const [formData, setFormData] = useState({
    empId: '',
    password: ''
  }); //state of the form

  const { empId, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login({ empId, password });
  };

  //Redirect if logged in
  if (isAuthenticated && !isFirstTime) {
    return <Redirect to='/dashboard' />;
  } else if (isAuthenticated && isFirstTime) {
    return <Redirect to='/changePassword' />;
  }
  return (
    <Fragment>
      <section className='container-login'>
        <h1 className='medium text-primary'>Sign In</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Sign Into Your Account
        </p>
        <form className='form' onSubmit={(e) => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Employee ID'
              name='empId'
              value={empId}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              minLength='6'
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>

          <input type='submit' style={{'color': '#fff', 'backgroundColor': '#007bff', 'borderColor': '#007bff','padding': '0.4rem 1.3rem',
    'marginRight': '0.5rem' , 'borderRadius': '0.25rem'}} value='Login' />
        </form>
        <p className='my-1'>
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </section>
    </Fragment>
  );
};
Login.prototype = {
  login: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  isFirstTime: PropTypes.bool
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isFirstTime: state.auth.isFirstTime
});
export default connect(mapStateToProps, { login, setAlert })(Login);
