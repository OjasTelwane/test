import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from "styled-components";
import store from '../store';
import './app.scss';
import { loadUser } from './core/actions/authentication';
import AuthGuard from './core/guards/authentication.guard';
import { setAuthToken } from './core/services/central-operations.service';
import Layout from './layout';

require('./core/interceptors');

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const theme = {
  primaryColor : '#4285F4',
  secondaryColor: '#F0EBF8',
  dangerColor: '#D93025',
  textColor: '#5F6368',
  formBackgroundColor: '#FFFFFF',
  skyBlue: '#4990EF',
  lightPink:'#F84973',
  white: '#FFFFFF',
  borderColor: '#DADCE0',
  inputAreaHoverColor: '#F1F3F4'
};

const App = (props) => {
  const toast = useRef(null);
  useEffect(() => {
    store.dispatch(loadUser());

  }, []); //read react.js documentation for explanation

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Layout/>
          {/* <section className='container-fluid p-0'>
            <div className='wrapper'>
              <Switch>
                <AuthGuard
                  exact
                  path={Pages.dashboard.link}
                  component={Dashboard}
                />
                <AuthGuard
                  exact
                  path={Pages.test_platform.link}
                  component={TestComponent}
                />
              </Switch>
            </div>
          </section> */}
      </Provider>
    </ThemeProvider>
  );
};

export default App;
