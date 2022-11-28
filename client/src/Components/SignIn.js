import "../Css/search.css"
import { grey } from '@material-ui/core/colors';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import CssTextField from "./CssTextField"
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    palette: {
      primary: {
        main: grey,
        mainGradient: "linear-gradient(to right, #ffffff, #5c5c5c)"
      }
    }
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
    background: "linear-gradient(to right, #ffffff,#5c5c5c)"
  },
  cssLabel: {
    color: "white"
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.primary.main} !important`,
    }
  },
  notchedOutline: {
    borderWidth: '1px',
    borderColor: 'grey !important'
  },
  multilineColor: {
    color: "white"
  },

}));

// COMPONENT
function SignIn(props) {
  const classes = useStyles();

  // STATO
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogged, setLogged] = useState(props.logged);

  function handleChangeMail(event) {
    const { value } = event.target
    setEmail(value);
  }

  function handleChangePsw(event) {
    const { value } = event.target
    setPassword(value);
  }

  function onFormSubmit(e){
    e.preventDefault();
  }

  async function getIdFromToken(token){
    await fetch("/api/provaVerifica", {
      headers: {
        'auth-token' : token
    },
      method : "GET"
    })
      .then((resp) => resp.json())
      .then(function(data) {
        if (data.error != null) {
          alert("ERROR,\n" + data.error);
          console.log("ERROR");
          return false;
        } else { 
          props.setLogged(data._id);
          return true
        } 
      })
        .catch(error => console.error(error));
      return false;
  }

  async function handleClick() {
    await fetch('/users/login', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
        method: 'POST',
        body: JSON.stringify({
          "email": email,
          "password": password
        })
    })
      .then((resp) => resp.json())
      .then(function (data) {
        if (data.error != null) {
          alert(data.error);
          console.log("ERROR");
          return false;
        } else {

          var date= Math.round((new Date().getTime())/1000)+300;

          localStorage.setItem('token', data.token);
          localStorage.setItem('expiry', date);
          getIdFromToken(data.token)
          setLogged(true)
          return true;
        }
      })
      .catch(error => console.error(error));
    return false;
  }

  // GRAFICA
  return (
    <div>
      {isLogged ? <Redirect to={"/"} /> : 
      <Container component="main" maxWidth="xs" style={{ paddingTop: 50 }}>
        <CssBaseline />
        <div className={classes.paper}>

          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography style={{ color: "white" }} component="h1" variant="h5">
            SIGN IN
          </Typography>

          <form className={classes.form} noValidate onSubmit={onFormSubmit}>
            <CssTextField
              onChange={handleChangeMail}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              InputProps={{
                className: classes.multilineColor,
                classes: {
                  root: classes.cssOutlinedInput,
                  notchedOutline: classes.notchedOutline
                }
              }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                },
              }}
            />
            <CssTextField
              onChange={handleChangePsw}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                className: classes.multilineColor,
                classes: {
                  root: classes.cssOutlinedInput,
                  notchedOutline: classes.notchedOutline
                }
              }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                },
              }}
            />

            <Button
              type="submit"
              className={classes.submit}
              fullWidth
              variant="contained"
              size="large"
              onClick={handleClick}
            >
              SIGN IN
            </Button> 
            
            <Grid container>
              <Grid
                item
                style={{ margin: "auto" }}
              >
                <Button
                  variant="outlined"
                  style={{ textTransform: "none", borderColor: "#5c5c5c" }}
                >
                  <Link
                    style={{ color: "white" }}
                    to={"/SignUp"}
                    variant="body2"
                  >
                    Don't have an account? Sign Up
                        </Link>
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>}
    </div>
  )
}


export default SignIn