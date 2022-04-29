import React from 'react'
import PropTypes from 'prop-types';
import AuthGuard from '../core/guards/authentication.guard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Pages } from '../shared/constants/routes';
import { logout } from '../core/actions/authentication';
import logo from '../../assets/images/IMATMIEngine.svg';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemButton } from '@mui/material';

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@mui/material/Toolbar';
import dashboard from '../modules/testPlatform/testQuestion';
import TestComponent from '../modules/testPlatform/test.component';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@material-ui/icons/Dashboard';
// import LogoutIcon from '@material-ui/icons/Logout';
import { Icon } from '@iconify/react';

const drawerWidth = 170;

const SidebarNew = ({ auth: { isAuthenticated, authLoading, isFirstTime }, logout, Window }) => {

    const sideBarData = [
        {
          id: 1,
          title: 'Dashboard',
          path: Pages.dashboard.link,
          icon: <DashboardIcon/>
        //   iconHover: dashboardIconWhite
        }
      ];

    const window = Window;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const location = useLocation();

    const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    };

    let active = {
        'background' : '#4285F4',
        'color' : 'white'
    }
    const drawer = (
    <div>
        <Toolbar />
        <Divider />
        <List>
        {sideBarData.map((menu, index) => (
            <Link
            to={menu.path}
            className='nav'
            style={location.pathname == menu.path ? active : null}
            >
            <ListItemButton key={index} alignItems='center'>
                <div style={{'marginLeft' : '10px', 'minWidth' : '40px'}}>
                    {menu.icon}
                </div>
                <ListItemText primary={menu.title}/>
            </ListItemButton>
            </Link>

        ))}
        <Link
            to={Pages.landingPage.link}
            className='nav'
            onClick={() => {
                logout();
              }}
          >
             <ListItemButton>
              <div style={{'marginLeft' : '10px', 'minWidth' : '40px'}}>
                 <Icon icon='ant-design:logout-outlined' width='28' height='28'/>
               </div>
               <ListItemText primary='Logout' />
            </ListItemButton>
          </Link>
        </List>
        <Divider />
    </div>
    );
    
    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <div>
        {!authLoading && !isFirstTime && ( isAuthenticated ) ? 
        
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position='fixed'
                sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px`,
                '.MuiToolbar-root' : { background : '#4285F4'} 
            }
                }}
            >
                <Toolbar>
                <Box sx={{display : {sm : 'none'}, mr : 3}}>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        edge='start'
                        onClick={handleDrawerToggle}
                        sx = {{'.MuiSvgIcon-root' : {color : 'white'}}}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Typography variant='img' noWrap component='div'>
                    <img src={logo} alt='Card'></img>
                </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component='nav'
                sx={{ width: { sm: drawerWidth },flexShrink: { sm: 0 } }}
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                container={container}
                variant='temporary'
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                }}
                >
                {drawer}
                </Drawer>
                <Drawer
                variant='permanent'
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    backgroundColor: '#121212',
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth}
                }}
                open
                >
                {drawer}
                </Drawer>
            </Box>  
            <Box
                component='main'
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Switch>
                    <AuthGuard
                    exact
                    path={Pages.dashboard.link}
                    component={dashboard}
                    />
                    <AuthGuard
                    exact
                    path={Pages.test_platform.link}
                    component={TestComponent}
                    />
                </Switch>
            </Box>
            </Box> : 
            null
        }
        </div>
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
