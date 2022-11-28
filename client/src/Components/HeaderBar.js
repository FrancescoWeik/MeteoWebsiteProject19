import { Link } from "react-router-dom"
import AppBar from '@material-ui/core/AppBar'
import Button from "@material-ui/core/Button"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Home from "@material-ui/icons/Home"
import MapMarkerPathIcon from 'mdi-react/MapMarkerPathIcon'
import Menu from "@material-ui/core/Menu";
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from "@material-ui/core/MenuItem";
import Person from "@material-ui/icons/Person"
import React, { useState, useEffect } from "react"
import Toolbar from '@material-ui/core/Toolbar'

function HeaderBar(props) {

       const [anchorEl, setAnchorEl] = useState(null);
       const [openMenu, setOpenMenu] = useState(false)

       useEffect(() => {
              setOpenMenu(false);
       }, []);

       const handleMouseOver = (event) => {
              setAnchorEl(event.currentTarget);
              setOpenMenu(true);
       };

       const handleClose = () => {
              setOpenMenu(false)
              setAnchorEl(null);
       };

       function handleClickLogged0() {
              props.setLogged(0);
              handleClose();

       }
       function handleClickLogged1() {
              props.setLogged(1)
              handleClose();
       }

       function handleClickAccount() {
              handleClose();
       }

       return (
              <AppBar position="static" style={{ color: "white", backgroundColor: "Black" }}>
                     <Toolbar style={{ minHeight: "50px" }}>
                            <Link to={"/"} style={{ textDecoration: 'none' }}>
                                   <Button startIcon={<Home style={{ color: "white" }} />} style={{ color: "white" }} >
                                          Home
                                   </Button>
                            </Link>
                            <div style={{ marginLeft: "auto" }}>
                                   {props.logged ?
                                          <Link to={"/itinerary"} style={{ textDecoration: 'none' }}>
                                                 <Button variant="outlined" style={{ color: "white" }} startIcon={<MapMarkerPathIcon size={18} />}>
                                                        MY Itineraries
                                                 </Button>
                                          </Link>
                                          :
                                          null
                                   }
                            </div>
                            <div style={{ marginLeft: "auto" }}>
                                   {props.logged ?
                                          (
                                                 <div>

                                                        <Button
                                                               color="inherit"
                                                               startIcon={<MenuIcon />}
                                                               style={{ color: "white" }}
                                                               aria-controls="simple-menu"
                                                               aria-haspopup="true"
                                                               onClick={handleMouseOver}
                                                        >
                                                               MENÙ
                                                        </Button>


                                                        <Menu
                                                               id="simple-menu"
                                                               anchorEl={anchorEl}
                                                               open={openMenu}
                                                               onClose={handleClose}
                                                               style = {{marginTop : "1%"}}
                                                        >
                                                               <Link
                                                                      to={"/myaccount"}
                                                                      style={{ textDecoration: 'none', color: "black" }}
                                                               >
                                                                      <MenuItem onClick={handleClickAccount}>
                                                                             <Button
                                                                                    style={{
                                                                                           pointerEvents: "none",
                                                                                           color: "black"
                                                                                    }}
                                                                                    startIcon={<Person />}
                                                                             >
                                                                                    MY ACCOUNT
                                                                             </Button>
                                                                      </MenuItem>
                                                               </Link>

                                                               <Link
                                                                      to={"/"}
                                                                      onClick={props.logged ? handleClickLogged0 : () => handleClickLogged1}
                                                                      style={{ textDecoration: 'none', color: "black" }}
                                                               >
                                                                      <MenuItem>
                                                                             <Button
                                                                                    style={{
                                                                                           pointerEvents: "none",
                                                                                           color: "black"
                                                                                    }}
                                                                                    startIcon={<ExitToAppIcon />}
                                                                             >
                                                                                    LOGOUT
                                                                             </Button>
                                                                      </MenuItem>
                                                               </Link>
                                                        </Menu>

                                                 </div>
                                          )
                                          :
                                          (
                                                 <Link to={"/login"} onClick={props.logged ? () => props.setLogged(0) : () => props.setLogged(1)} style={{ textDecoration: 'none' }}>
                                                        <Button color="inherit" startIcon={<Person />} style={{ color: "white" }}>
                                                               LogIn
                                                 </Button>
                                                 </Link>
                                          )
                                   }
                            </div>
                     </Toolbar>
              </AppBar>
       )
}

export default HeaderBar