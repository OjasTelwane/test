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


// const Dashboard = ({ auth: { user } }) => {
//   useEffect(() => {}, []);

//   return user === null ? (
//     <> </>
//   ) : (
//     <div style={{ padding: '10px' }}>
//       <div className='row mx-0'>
//         <h4 style={{ fontWeight: 'bold' }}>Dashboard</h4>
//       </div>
//       {/* <PreviewMedia files={files}/> */}
//     </div>
//   );
// };

// Dashboard.propTypes = {
//   auth: PropTypes.object.isRequired
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth
// });
// export default connect(mapStateToProps, {})(Dashboard);



const Dashboard = ({ auth: { user } }) => {
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
      console.log('examineeId==>', examineeId);
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
    width: '280px',
    transitionDuration: '0.3s',
    backgroundColor: 'white',
    borderRadius : '20px'
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
    const path = '/new_test/' + id;
    // const path = '/test/' + id;
    history.push(path);
  };

  return user === null ? (
    <> </>
  ) : (
    <div style={{ padding: '10px' }}>
      <h4 style={{ fontWeight: 'bold' }}>
        Dashboard
      </h4>
      <div className='row mx-0'>
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: '#0A84A6' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant='scrollable'
              scrollButtons='auto'
              indicatorColor='primary'
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
            <Box sx={{ height: '90vh' }}>
            <div style={{display : 'flex', columnGap : '15px'}}>
              {tests &&
                tests.map((test, index) => {
                  return (
                    <div key={index}>
                      <Card style={cardStyle}>
                        <center>
                        <CardContent>
                          <Typography variant='h6' component='div'>
                            {test.testName}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary' variant='p'>
                            {test.testDescription} <br />
                          </Typography>
                          <br/><br/>
                          <Typography variant='body2' variant='h6'>
                            {/* Test Date : {new Date(test.testDate).getDate()} /{' '}
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
                            <br /> */}
                            Questions : {test.questions.length}
                            <br/>
                            Time : {test.testDuration} mins
                          </Typography>
                          {/* <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                          Status : {test.status} <br />
                          </Typography> */}
                        </CardContent>
                        <div style={{display : 'flex', columnGap : '10px', justifyContent:'center'}}>
                        <CardActions>
                          
                          {/* <button
                            style={{
                              border:'1px solid #23242a',
                              borderRadius : '20px', width : '120px',
                              color : 'white',
                              background:'#23242a',
                              height : '30px'
                              }}
                            // onClick={(e) => handleStart(test.id)}
                          >
                            Edit
                          </button> */}
                          <button
                            style={{
                              border:'1px solid #1594f3',
                              borderRadius : '20px', width : '120px',
                              color : 'white',
                              background : '#1594f3',
                              height : '30px'
                            }}
                            onClick={(e) => handleStart(test.id)}
                          >
                            Start
                          </button>
                        </CardActions>
                        </div>

                        </center>
                      </Card>
                    </div>
                  );
                })}
                </div>
            </Box>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={1}>
          <Container>
            <Box sx={{ height: '90vh' }}>
            <div style={{display : 'flex', columnGap : '15px'}}>
              {tests &&
                tests.map((test, index) => {
                  return (
                    <div key={index}>
                      <Card style={cardStyle}>
                        <center>
                        <CardContent>
                          <Typography variant='h6' component='div'>
                            {test.testName}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary' variant='p'>
                            {test.testDescription} <br />
                          </Typography>
                          <br/><br/>
                          <Typography variant='body2' variant='h6'>
                            {/* Test Date : {new Date(test.testDate).getDate()} /{' '}
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
                            <br /> */}
                            Questions : {test.questions.length}
                            <br/>
                            Time : {test.testDuration} mins
                          </Typography>
                          {/* <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                          Status : {test.status} <br />
                          </Typography> */}
                        </CardContent>
                        <div style={{display : 'flex', columnGap : '10px', justifyContent:'center'}}>
                        <CardActions>
                          
                          {/* <button
                            style={{
                              border:'1px solid #23242a',
                              borderRadius : '20px', width : '120px',
                              color : 'white',
                              background:'#23242a',
                              height : '30px'
                              }}
                            // onClick={(e) => handleStart(test.id)}
                          >
                            Edit
                          </button> */}
                          <button
                            style={{
                              border:'1px solid #1594f3',
                              borderRadius : '20px', width : '120px',
                              color : 'white',
                              background : '#1594f3',
                              height : '30px'
                            }}
                            onClick={(e) => handleStart(test.id)}
                          >
                            Resume
                          </button>
                        </CardActions>
                        </div>

                        </center>
                      </Card>
                    </div>
                  );
                })}
                </div>
              </Box>
              </Container>
          </TabPanel>
          <TabPanel value={value} index={2}>
          <Container>
            <Box sx={{ height: '90vh' }}>
            <div style={{display : 'flex', columnGap : '15px'}}>
              {tests &&
                tests.map((test, index) => {
                  return (
                    <div key={index}>
                      <Card style={cardStyle}>
                        <center>
                        <CardContent>
                          <Typography variant='h6' component='div'>
                            {test.testName}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary' variant='p'>
                            {test.testDescription} <br />
                          </Typography>
                          <br/><br/>
                          <Typography variant='body2' variant='h6'>
                            {/* Test Date : {new Date(test.testDate).getDate()} /{' '}
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
                            <br /> */}
                            Questions : {test.questions.length}
                            <br/>
                            Time : {test.testDuration} mins
                          </Typography>
                          {/* <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                          Status : {test.status} <br />
                          </Typography> */}
                        </CardContent>
                        <div style={{display : 'flex', columnGap : '10px', justifyContent:'center'}}>
                        <CardActions>
                          
                          {/* <button
                            style={{
                              border:'1px solid #23242a',
                              borderRadius : '20px', width : '120px',
                              color : 'white',
                              background:'#23242a',
                              height : '30px'
                              }}
                            // onClick={(e) => handleStart(test.id)}
                          >
                            Edit
                          </button> */}
                          {/* <button
                            style={{
                              border:'1px solid #1594f3',
                              borderRadius : '20px', width : '120px',
                              color : 'white',
                              background : '#1594f3',
                              height : '30px'
                            }}
                            // onClick={(e) => handleStart(test.id)}
                          >
                            Start
                          </button> */}
                        </CardActions>
                        </div>

                        </center>
                      </Card>
                    </div>
                  );
                })}
                </div>
            </Box>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={3}>
          <Container>
            <Box sx={{ height: '90vh' }}>
              <div style={{display : 'flex', columnGap : '15px'}}>
              {tests &&
                tests.map((test, index) => {
                  return (
                    <div key={index}>
                      <Card style={cardStyle}>
                        <center>
                        <CardContent>
                          <Typography variant='h6' component='div'>
                            {test.testName}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color='textSecondary' variant='p'>
                            {test.testDescription} <br />
                          </Typography>
                          <br/><br/>
                          <Typography variant='body2' variant='h6'>
                            {/* Test Date : {new Date(test.testDate).getDate()} /{' '}
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
                            <br /> */}
                            Questions : {test.questions.length}
                            <br/>
                            Time : {test.testDuration} mins
                            <br />
                            Test Status : {test.status}
                          </Typography>
                          {/* <Typography sx={{ mb: 1.5 }} color='textSecondary'>
                          Status : {test.status} <br />
                          </Typography> */}
                        </CardContent>
                        <div style={{display : 'flex', columnGap : '10px', justifyContent:'center'}}>
                        <CardActions>
                          
                          {/* <button
                            style={{
                              border:'1px solid #23242a',
                              borderRadius : '20px', width : '120px',
                              color : 'white',
                              background:'#23242a',
                              height : '30px'
                              }}
                            // onClick={(e) => handleStart(test.id)}
                          >
                            Edit
                          </button> */}
                          {/* <button
                            style={{
                              border:'1px solid #1594f3',
                              borderRadius : '20px', width : '120px',
                              color : 'white',
                              background : '#1594f3',
                              height : '30px'
                            }}
                            onClick={(e) => handleStart(test.id)}
                          >
                            Start
                          </button> */}
                        </CardActions>
                        </div>

                        </center>
                      </Card>
                    </div>
                  );
                })}
                </div>
            </Box>
            </Container>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});
export default connect(mapStateToProps, {})(Dashboard);
