import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
const AuthGuard = ({
  component: Component,
  auth: { isAuthenticated, authLoading, isFirstTime },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated && !authLoading ? (
        <Redirect to='/login' />
      ) : (
        isAuthenticated && authLoading && isFirstTime ? (
          <Redirect to='/changePassword' />
        ) : (
          <Component {...props} />
        )
      )
    }
  />
);

AuthGuard.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
  auth: state.auth
});
export default connect(mapStateToProps)(AuthGuard);
