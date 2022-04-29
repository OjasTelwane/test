import React , {useState} from 'react'
import PropTypes from 'prop-types';
import AuthGuard from '../core/guards/authentication.guard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { Pages } from '../shared/constants/routes';
import { logout } from '../core/actions/authentication';
import Permission from '../core/services/permission';

import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
// import CssBaseline from '@mui/material/CssBaseline';
// import MuiAppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import MuiListItem from '@material-ui/core/ListItem';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@material-ui/icons/Dashboard';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Icon } from '@iconify/react';
import Dashboard from '../modules/dashboard/dashboard';
import TestComponent from '../modules/testPlatform/test.component';
import NewTestPlatform from '../modules/newTestPlatform/test.component';
import dashboardIcon from '@material-ui/icons/Dashboard';
import logo from '../../assets/images/IMATMI.png';
import logo1 from '../../assets/images/IMATMIlogo1.png';
import TestQuestion from '../modules/testPlatform/testQuestion';
import testList from '../modules/testPlatform/testList';
import TestResult from '../modules/testResult/testResult';
import User from '../modules/userProfile/user';

const drawerWidth = 220;
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    overflowX: 'hidden'
  });
  
  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(9)} + 1px)`
    }
  });
  
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  }));
  
  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme)
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme)
      })
    })
  );
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    },
    drawerPaper: {
      marginTop: '20px',
      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
    }
  }));
  const ListItem = withStyles({
    root: {
      'width' : 'auto',
      '&$selected': {
        backgroundColor: 'red',
        color: 'white',
        '& .MuiListItemIconRoot': {
          color: 'white'
        }
      },
      '&$selected:hover': {
        backgroundColor: 'purple',
        color: 'white',
        '& .MuiListItemIconRoot': {
          color: 'white'
        }
      },
      '& .MuiTypographyRoot' : {
        'fontWeight' : '500',
        'color' : '#000',
        'fontSize' : '20px'
      },
      margin : '6px',
      '&:hover': {
        backgroundColor: '#edf9fa',
        color: 'black',
        '& .MuiListItemIconRoot': {
          color: 'black'
        }
      }
    },
    selected: {}
  })(MuiListItem);
const SidebarNew = ({ auth: { isAuthenticated, authLoading, isFirstTime }, logout, Window }) => {

  const sideBarData = [];
// if(Permission.checkPermission('Test', 'List')) {
  const dashboard = {
      id: 1,
      title: 'Dashboard',
      path: Pages.dashboard.link,
      icon: <DashboardIcon/>
    };
    sideBarData.push(dashboard);
      //   sideBarData.push(testsList);
  // }

  if(Permission.checkPermission('Test', 'List')) {
    const testsList = {
      id: 2,
      title: 'Test List',
      path: Pages.tests_list.link,
      icon: <QuestionAnswerIcon/>
    };
    sideBarData.push(testsList);
  }

  
  // if(Permission.checkPermission('Test', 'List')) {
    const testQuestion = {
      id: 2,
      title: 'Test Question',
      path: Pages.test_question.link,
      icon: <QuestionAnswerIcon/>
    };
    sideBarData.push(testQuestion);
  // }
    const Profile = {
      id: 3,
      title: 'My Profile',
      path: Pages.user.link,
      icon: <QuestionAnswerIcon/>
    };
    sideBarData.push(Profile);
      const classes = useStyles();
      const theme = useTheme();
      const [open, setOpen] = useState(false);
    
      const handleDrawerOpen = () => {
        setOpen(true);
      };
      
      const handleDrawerClose = () => {
        setOpen(false);
      };
      let active = {
        'background' : '#d0d6d5',
        'border-radius' : '5px',
        'color' : '#fff',
        '& .MuiListItemIconRoot': {
          'color': 'primary'
        }
      }
      let active2 = {
        'color' : 'blue'
      }
      let iconStyle = {
        'color' : 'black'
      }
      const location = useLocation();
      return (
        <>
            <Box sx={{ display: 'flex' }}>
            { ( location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/' ) && (
              <>
            
            <Drawer
                variant='permanent' open={open}
                classes={{
                  paper: classes.drawerPaper
                }}
            >
                <DrawerHeader>
                { open===false && ( 
                <Button onClick={handleDrawerOpen
                }>
                <img src={logo1} alt='Card' width='60px' height='100%'></img>
              </Button>
                ) }
                { open===true && ( <Button onClick={handleDrawerClose}>
                  <img src={logo} alt='Card' width='180px' height='100%'></img>
                </Button>
                ) }
                </DrawerHeader>
                <List>
                {sideBarData.map((menu, index) => (
                    <Link
                    to={menu.path}
                    >
                    <ListItem key={index} style={location.pathname === menu.path ? active : null}>
                    <ListItemIcon style={location.pathname === menu.path ? active2 : null}>
                        {menu.icon}
                    </ListItemIcon>
                    <ListItemText primary={menu.title}/>
                    </ListItem>
                    </Link>
                ))}
                <Link
                    to={Pages.landingPage.link}
                    onClick={() => {
                        logout();
                    }}
                >
                    <ListItem>
                    <ListItemIcon>
                    <LogoutIcon />                 
                    </ListItemIcon>
                        <ListItemText primary='Logout' />
                    </ListItem>
                </Link>
                </List>
            </Drawer>
            <Box component='main' sx={{ flexGrow: 1 }}>
                <Switch>
                    <AuthGuard
                    exact
                    path={Pages.dashboard.link}
                    component={Dashboard}
                    />
                    <AuthGuard
                    exact
                    path={Pages.tests_list.link}
                    component={testList}
                    />
                    <AuthGuard
                    exact
                    path={Pages.test_question.link}
                    component={TestQuestion}
                    />
                    <AuthGuard
                    exact
                    path={Pages.test_platform.link}
                    component={TestComponent}
                    />
                    <AuthGuard
                    exact
                    path='/test_result/:id'
                    component={TestResult}
                    />
                    <AuthGuard
                    exact
                    path={Pages.new_test.link}
                    component={NewTestPlatform}
                    />
                     <AuthGuard
                    exact
                    path={Pages.user.link}
                    component={User}
                    />
                </Switch>
            </Box>
            </>
            )}
            </Box>
        </>
    )
}
SidebarNew.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
    };

    const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { logout })(SidebarNew);