import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Box from "@material-ui/core/Box"
import Form from "./Form"
import HeaderBar from "./HeaderBar"
import Itinerary from "./Itinerary"
import ItineraryInfo from "./ItineraryInfo"
import MuiAlert from '@material-ui/lab/Alert';
import MyAccount from "./MyAccount"
import MyParticles from './MyParticles'
import React, { useState, useEffect } from "react"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import Snackbar from '@material-ui/core/Snackbar';


function App() {

  const [user, setLogged] = useState({logged : false,
                                      user_id : "",
                                      snackBarOpensLoginControl : false,
                                      snackBarOpensLogOutControl : false,
                                      snackBarOpensSignUpControl : false})
  const [clickedItinMeteos, setClickedItinMeteos] = useState([]);
  const [clickedItinId, setClickedItinId] = useState("");
  const [clickedItinName, setClickedItinName] = useState("");

  useEffect(() => {
    if(user.user_id == ""){
      checkToken();
    }
  },[])

  const signInDone = (userID) => {
    setLogged({logged : true,//checkToken()
              user_id : userID,
              snackBarOpensLoginControl : true,
              snackBarOpensLogOutControl : false,
              snackBarOpensSignUpControl : false})
  }

  const signUpDone = () => {
    setLogged({logged : false, 
              user_id : "",
              snackBarOpensLoginControl : false,
              snackBarOpensLogOutControl : false,
              snackBarOpensSignUpControl : true})
  }



  const logOut = (val) => {       //se il valore passato è 0 l' utente si slogga altrimenti si logga (necessario solo per l' alert)
    localStorage.setItem('token',"");
    val==0 ? 
      setLogged({logged : false, 
                user_id : "",
                snackBarOpensLoginControl : false,
                snackBarOpensLogOutControl : true,
                snackBarOpensSignUpControl : false})
    :
      setLogged({logged : false, 
                user_id : "",
                snackBarOpensLoginControl : false,
                snackBarOpensLogOutControl : false,
                snackBarOpensSignUpControl : false})
  }
  
  async function validToken(token){
    await fetch("/api/provaVerifica", {
      headers: {
        'auth-token' : token
    },
      method : "GET"
    })
      .then((resp) => resp.json())
      .then(function(data) {
        if (data.error != null) {
          //console.log(data.error);
          return false
        } else { 
          setLogged({logged : true,
                    user_id : data._id,
                    snackBarOpensLoginControl : false,
                    snackBarOpensLogOutControl : false,
                    snackBarOpensSignUpControl : false})
          //localStorage.setItem('user-id', data._id);
          return true
        } 
      })
        .catch(error => console.error(error));
      return false
  }
  
  async function checkToken(){
    const token= localStorage.getItem('token');
    const expiryTime = localStorage.getItem('expiry');
    if(token!=null){
      var now = Math.round((new Date().getTime())/1000);
	    if (now > expiryTime) {
        localStorage.setItem('token', "");
        localStorage.setItem('expiry', 0);
      }
      await validToken(localStorage.getItem('token'));
    }else{
      localStorage.setItem('token', "");
      localStorage.setItem('expiry', 0);
      await validToken(localStorage.getItem('token'));
    }
	}

  return (
    <Router>
      <Box 
        component="div"
      >
        <MyParticles />

          <Switch>
            <Route exact path="/">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/> 

              <Snackbar
                  style = {{marginTop : "37px", marginRight : "6px"}}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}

                  open={user.snackBarOpensLogOutControl}
                  autoHideDuration={850}
                  onClose={() => setLogged({logged : false, 
                                      user_id : "",
                                      snackBarOpensLoginControl : false,
                                      snackBarOpensLogOutControl : false,
                                      snackBarOpensSignUpControl : false})}
              >
                <MuiAlert elevation={6} variant="filled" severity="success">
                  User logged out.
                </MuiAlert>
              </Snackbar>

              <Snackbar
                  style = {{marginTop : "37px", marginRight : "6px"}}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}

                  open={user.snackBarOpensLoginControl}
                  autoHideDuration={850}
                  onClose={() => setLogged({logged : user.logged, 
                                      user_id : user.user_id,
                                      snackBarOpensLoginControl : false,
                                      snackBarOpensLogOutControl : false,
                                      snackBarOpensSignUpControl : false})}
              >
                <MuiAlert elevation={6} variant="filled" severity="success">
                  User logged in.
                </MuiAlert>
              </Snackbar>

              <Snackbar
                  style = {{marginTop : "37px", marginRight : "6px"}}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}

                  open={user.snackBarOpensSignUpControl}
                  autoHideDuration={850}
                  onClose={() => setLogged({logged : user.logged, 
                                      user_id : user.user_id,
                                      snackBarOpensLoginControl : false,
                                      snackBarOpensLogOutControl : false,
                                      snackBarOpensSignUpControl : false})}
              >
                <MuiAlert elevation={6} variant="filled" severity="success">
                  User signed up.
                </MuiAlert>
              </Snackbar>
              
              <Form logged = {user.logged}/>
            </Route>

            <Route exact path="/itinerary">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/>
              <Itinerary 
                user = {user.user_id}
                setClickedItinMeteos={setClickedItinMeteos}
                setClickedItinId={setClickedItinId}
                setClickedItinName={setClickedItinName}
              />
            </Route>

            <Route exact path="/myitinerary">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/> 
              <ItineraryInfo 
                user = {user.user_id} 
                clickedItinMeteos={clickedItinMeteos} 
                clickedItinName={clickedItinName}
                clickedItinId={clickedItinId}
              />
            </Route>
            
            <Route exact path="/myaccount">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/> 
              <MyAccount user_id = {user.user_id} setLogged = {logOut} />
            </Route>

            <Route exact path="/signup">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/>
              <SignUp setSignedUp = {signUpDone}/>
            </Route>

            <Route exact path = "/login">
                <HeaderBar logged = {user.logged} setLogged = {logOut}/>
                <SignIn logged = {user.logged} setLogged = {signInDone} />
            </Route>
          </Switch>
      </Box>
    </Router>
  );
}

export default App;
