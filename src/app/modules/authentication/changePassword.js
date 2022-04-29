
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { changePassword } from '../../core/actions/authentication';
import { setAlert } from '../../core/actions/alert';
import { SessionStorageKeywords } from '../../shared/constants/global-constant';

const ChangePassword = ({ changePassword, setAlert, isAuthenticated, isFirstTime }) => {
  const [formData, setFormData] = useState({
    id: '',
    oldPassword: '',
    newPassword: ''    
  }); //state of the form

  const { id, oldPassword, newPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    //Get User Id from session storage
    let cu = sessionStorage?.getItem(
      SessionStorageKeywords?.currentUser
    );
    if (cu) {
      cu = JSON.parse(cu);
    }
    const uid = cu?.id;
    changePassword({ id:uid, oldPassword, newPassword });
  };

  //Redirect if logged in
  if (isAuthenticated && !isFirstTime) {
    return <Redirect to='/dashboard' />;
  } else if(!isAuthenticated) {
    return <Redirect to='/login' />;
  }
  return (
    <Fragment>
      <section className='container-login'>
        <h1 className='medium text-primary'>Change Password</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Change Password
        </p>
        <form className='form' onSubmit={(e) => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='id'
              name='id'
              value={id}
              hidden={true}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Old Password'
              name='oldPassword'
              minLength='6'
              value={oldPassword}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='New Password'
              name='newPassword'
              minLength='6'
              value={newPassword}
              onChange={(e) => onChange(e)}
            />
          </div>
          <input type='submit' className='btn btn-primary' value='Change Password' />
        </form>
      </section>
    </Fragment>
  );
};
ChangePassword.prototype = {
  changePassword: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  isFirstTime: PropTypes.bool
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isFirstTime: state.auth.isFirstTime 
});
export default connect(mapStateToProps, { changePassword, setAlert })(ChangePassword);
