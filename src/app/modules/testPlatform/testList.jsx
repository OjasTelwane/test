import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import TestComponent from '../testPlatform/test.component';
import {
  stopPrntScr,
  AccessClipboardData
} from '../../core/services/disablePrintScreen';
import { requestFullScreen } from '../../core/services/fullScreen';
import { disableRightClick } from '../../core/services/disableKeyboardMouse';
import TestDataService from '../../core/actions/test';
import {
  getSessionStorageOrDefault,
  setSessionStrage,
  removeSessionStorage
} from '../../core/services/useSessionStorage';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

const TestList = ({ auth: { user } }) => {
  const [tests, setTests] = useState([]);
  const [value, setValue] = useState(0);
  const history = useHistory();
  const [allTests, setAllTests] = useState([]);

  const onPageLoad = () => {
    console.log('onPageLoad-Start');
    requestFullScreen();
    stopPrntScr();
    AccessClipboardData();
    disableRightClick();
    console.log('onPageLoad-End');
  };

  useEffect(() => {
    async function fetchData(id) {
      const examineeId = id;
      const data = await TestDataService.getAllTests(examineeId);
      // console.log('Test list ==>', data);
      const testList = data.data.tests;
      console.log('Test list ==>', testList);
      setAllTests(testList);
      setTests(getTests(0));
      setValue(0);
    }

    if (!user) {
      user = getSessionStorageOrDefault('test', user);
    }
    if (user) {
      setSessionStrage('test', user);
      const { id } = user;
      fetchData(id);
    }
  }, []);

  var cardStyle = {
    display: 'block',
    width: '100%',
    transitionDuration: '0.3s',
    backgroundColor: '#a6a5b014'
  };
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role='tabpanel'
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`
    };
  }
  const getTests = (index) => {
    if (index === 0) {
      // newValue===0 means show all "assigned" test assign to this user
      return allTests.filter((test) => {
        return test.status === 'Assigned';
      });
    } else if (index === 1) {
      // newValue===1 means show all In Progress test assign to this user
      return allTests.filter((test) => {
        return test.status === 'Progress' || test.status === 'Start';
      });
    } else if (index === 2) {
      // newValue===2 means show all Completed test assign to this user
      return allTests.filter((test) => {
        return test.status === 'Complete';
      });
    } else if (index === 3) {
      // newValue===3 means show all test assign to this user
      return allTests;
    }
  };

  const handleChange = (event, newValue) => {
    console.log('newValue==>', newValue);
    console.log('allTests==>', allTests);
    setTests(getTests(newValue));
    setValue(newValue);
  };

  const handleStart = (id) => {
    const path = '/test/' + id;
    history.push(path);
  };

  return user === null ? (
    <> </>
  ) : (
    <div style={{ padding: '10px' }}>
      <h4 style={{ fontWeight: 'bold' }}>
        Test List
      </h4>
      <div className='row mx-0'>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant='scrollable'
              scrollButtons='auto'
              allowScrollButtonsMobile
            >
              <Tab label='Assigned' {...a11yProps(0)} />
              <Tab label='In Progress' {...a11yProps(1)} />
              <Tab label='Completed' {...a11yProps(2)} />
              <Tab label='All' {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
          <Container>
            <Box sx={{ height: '90vh', fontFamily:'Poppins Roboto sans-serf !important' }}>
              {tests &&
                tests.map((test, index) => {
                  return (
                    <div key={index}>
                      <Card sx={{ minWidth: 300 }} style={cardStyle}>
                        <CardContent>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color='textSecondary'
                            gutterBottom
                          >
                            {test.testName}
                          </Typography>
                          <Typography variant='h5' component='div'>
                            {test.testName}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                            {test.testDescription} <br />
                          </Typography>
                          <Typography variant='body2'>
                            Test Date : {new Date(test.testDate).getDate()} /{' '}
                            {new Date(test.testDate).getMonth() + 1} /{' '}
                            {new Date(test.testDate).getFullYear()}
                            <br />
                            Start Time :{' '}
                            {new Date(test.startTime).getUTCHours()} :{' '}
                            {new Date(test.startTime).getUTCMinutes()} :{' '}
                            {new Date(test.startTime).getUTCSeconds()}
                            <br />
                            End Time : {new Date(
                              test.endTime
                            ).getUTCHours()} :{' '}
                            {new Date(test.endTime).getUTCMinutes()} :{' '}
                            {new Date(test.endTime).getUTCSeconds()}
                            <br />
                            Duration : {test.testDuration} minutes
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                            Status : {test.status} <br />
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size='small'
                            color='primary'
                            variant='contained'
                            onClick={(e) => handleStart(test.id)}
                          >
                            Start Test
                          </Button>
                        </CardActions>
                      </Card>
                    </div>
                  );
                })}
            </Box>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={1}>
          <Container>
            <Box sx={{ height: '90vh', fontFamily:'Poppins Roboto sans-serf !important' }}>
              {tests &&
                tests.map((test, index) => {
                  return (
                    <div key={index}>
                      <Card sx={{ minWidth: 300 }} style={cardStyle}>
                        <CardContent>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color='textSecondary'
                            gutterBottom
                          >
                            {test.testName}
                          </Typography>
                          <Typography variant='h5' component='div'>
                            {test.testName}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                            {test.testDescription} <br />
                          </Typography>
                          <Typography variant='body2'>
                            Test Date : {new Date(test.testDate).getDate()} /{' '}
                            {new Date(test.testDate).getMonth() + 1} /{' '}
                            {new Date(test.testDate).getFullYear()}
                            <br />
                            Start Time :{' '}
                            {new Date(test.startTime).getUTCHours()} :{' '}
                            {new Date(test.startTime).getUTCMinutes()} :{' '}
                            {new Date(test.startTime).getUTCSeconds()}
                            <br />
                            End Time : {new Date(
                              test.endTime
                            ).getUTCHours()} :{' '}
                            {new Date(test.endTime).getUTCMinutes()} :{' '}
                            {new Date(test.endTime).getUTCSeconds()}
                            <br />
                            Duration : {test.testDuration} minutes
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                          Status : {test.status} <br />
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size='small'
                            color='primary'
                            variant='contained'
                            onClick={(e) => handleStart(test.id)}
                          >
                            Resume Test
                          </Button>
                        </CardActions>
                      </Card>
                    </div>
                  );
                })}
              </Box>
              </Container>
          </TabPanel>
          <TabPanel value={value} index={2}>
          <Container>
            <Box sx={{ height: '90vh', fontFamily:'Poppins Roboto sans-serf !important' }}>
              {tests &&
                tests.map((test, index) => {
                  return (
                    <div key={index}>
                      <Card sx={{ minWidth: 300 }} style={cardStyle}>
                        <CardContent>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color='textSecondary'
                            gutterBottom
                          >
                            {test.testName}
                          </Typography>
                          <Typography variant='h5' component='div'>
                            {test.testName}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                            {test.testDescription} <br />
                          </Typography>
                          <Typography variant='body2'>
                            Test Date : {new Date(test.testDate).getDate()} /{' '}
                            {new Date(test.testDate).getMonth() + 1} /{' '}
                            {new Date(test.testDate).getFullYear()}
                            <br />
                            Start Time :{' '}
                            {new Date(test.startTime).getUTCHours()} :{' '}
                            {new Date(test.startTime).getUTCMinutes()} :{' '}
                            {new Date(test.startTime).getUTCSeconds()}
                            <br />
                            End Time : {new Date(
                              test.endTime
                            ).getUTCHours()} :{' '}
                            {new Date(test.endTime).getUTCMinutes()} :{' '}
                            {new Date(test.endTime).getUTCSeconds()}
                            <br />
                            Duration : {test.testDuration} minutes
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                          Status : {test.status} <br />
                          </Typography>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
            </Box>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={3}>
          <Container>
            <Box sx={{ height: '90vh', fontFamily:'Poppins Roboto sans-serf !important' }}>
              {tests &&
                tests.map((test, index) => {
                  return (
                    <div key={index}>
                      <Card sx={{ minWidth: 300 }} style={cardStyle}>
                        <CardContent>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color='textSecondary'
                            gutterBottom
                          >
                            {test.testName}
                          </Typography>
                          <Typography variant='h5' component='div'>
                            {test.testName}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                            {test.testDescription} <br />
                          </Typography>
                          <Typography variant='body2'>
                            Test Date : {new Date(test.testDate).getDate()} /{' '}
                            {new Date(test.testDate).getMonth() + 1} /{' '}
                            {new Date(test.testDate).getFullYear()}
                            <br />
                            Start Time :{' '}
                            {new Date(test.startTime).getUTCHours()} :{' '}
                            {new Date(test.startTime).getUTCMinutes()} :{' '}
                            {new Date(test.startTime).getUTCSeconds()}
                            <br />
                            End Time : {new Date(
                              test.endTime
                            ).getUTCHours()} :{' '}
                            {new Date(test.endTime).getUTCMinutes()} :{' '}
                            {new Date(test.endTime).getUTCSeconds()}
                            <br />
                            Duration : {test.testDuration} minutes
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                          Status : {test.status} <br />
                          </Typography>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
            </Box>
            </Container>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

TestList.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});
export default connect(mapStateToProps, {})(TestList);
