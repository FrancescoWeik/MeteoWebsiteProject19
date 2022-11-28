import { Link } from "react-router-dom"
import { makeStyles, Typography } from "@material-ui/core"
import { Redirect } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import CssTextField from "./CssTextField"
import DeleteIcon from '@material-ui/icons/Delete'; 
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import MailIcon from '@material-ui/icons/Mail';
import MapMarkerPathIcon from 'mdi-react/MapMarkerPathIcon'
import Person from "@material-ui/icons/Person"
import React, { useEffect, useState } from "react"

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(20),
        marginBottom: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    cssLabel: {
        color: "black"
    },

    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: `${theme.palette.primary.main} !important`,
        }
    },
    notchedOutline: {
        borderWidth: '1px',
        borderColor: 'black !important'
    },

    multilineColor: {
        color: "black"
    },
}));


function MyAccount(props) {

    const classes = useStyles();

    const [currentEmail, setCurrentEmail] = useState("");
    const [deleted, setDeleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [names, setNames] = useState("")
    const [newEmail, setNewEmail] = useState("");
    const [openDelPopUp, setOpenDelPopUp] = useState(false);
    const [openEmailPopUp, setOpenEmailPopUp] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [])

    async function fetchUser(){
        await fetch("/users/" + props.user_id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method:"GET"
        }).then(resp => resp.json())
        .then(function(data) {
            setCurrentEmail(data.email)
            setNames(data.itinerary.map(item => item.name))
            setLoading(false);
        })
        .catch(error => {
            console.log(error)
        });
    }

    function handleClickDel() {
        setOpenDelPopUp(true);
    }

    function handleCancelDel() {
        setOpenDelPopUp(false);
    }

    function handleCancel() {
        setOpenEmailPopUp(false)
    }

    function handleClickEmail() {
        setOpenEmailPopUp(true);
    }

    function handleChange(event) {
        setNewEmail(event.target.value);
    }

    async function handleDelete() {
        await fetch("/users", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({
                "user_id": props.user_id
            })
        }).then((resp) => resp.json())
            .then(function (data) {
            }).catch(error => console.log(error))

        setOpenDelPopUp(false);
        props.setLogged(0);
        setDeleted(true)

    }

    async function handleDone() {

        setLoading(true);
        await fetch("/users/" + props.user_id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: "PATCH",
            body: JSON.stringify({
                "email": newEmail
            })
        }).then((resp) => resp.json())
        .then(function (data) {
                if (data.error != null) {
                    window.alert(data.error);
                    console.log("ERROR");
                } else {
                    setCurrentEmail(newEmail);
                }
        }).catch(error => console.log(error))

        setOpenEmailPopUp(false);
        setNewEmail("")
        setLoading(false);

    }



    function renderItems() {
        return Object.keys(names).map(key =>
            <li
                style={{ fontSize: "20px", listStylePosition: "inside" }}
                key={key}
            >
                {names[key]}
            </li>)
    }

    return (
        <div>
            {deleted ? <Redirect to={"/"} /> :
                <div>
                    <Container
                        component="main"
                        maxWidth="sm"
                        style={{ 
                            paddingTop: 0, 
                            justify:"center", 
                            alignItems:"center", 
                        }}
                    >

                        <div className={classes.paper}>
                            <Person size={45} style={{ color: "white", marginBottom: "8px" }} />
                            <Typography
                                style={{ color: "white", marginBottom: "3%" }}
                                component="h5"
                                variant="h5"
                            >
                                MY ACCOUNT
                            </Typography>
                            <br />
                        </div>

                        <Box
                            component="div"
                            border={2}
                            mx={0}
                            pt={1}
                            pb={1}
                            pl={3}
                            pr={3}
                            boxShadow={13}
                            style={{ 
                                textAlign: "center", 
                                borderColor: "rgba(0,0,0,0.3)", 
                                borderRadius : "16px",
                                color: "white", 
                                background: "rgba(0,0,0,0.2)" 
                            }}
                        >
                            {loading ?
                                <div className={classes.root}>
                                    <CircularProgress style={{ color: "white" }} />
                                </div>
                                :
                                <Grid
                                    container
                                    direction="column"
                                    spacing={3}
                                    pl={1}
                                    pr={1}
                                >
                                    <Grid item>
                                        <Grid
                                            container
                                            direction="row"
                                            alignItems="center"
                                            justify="center"
                                            spacing={5}
                                        >
                                            <Grid item>
                                                <h1 style={{ fontSize: "20px" }}>Email: {currentEmail}</h1>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    className="btn"
                                                    size="small"
                                                    style={{ color: "black", borderStyle: "solid", borderColor: "black", borderWidth: "1px" }}
                                                    startIcon={<MailIcon />}
                                                    onClick={handleClickEmail}
                                                >
                                                    change email
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid
                                            container
                                            direction="row"
                                            alignItems="center"
                                            justify="center"
                                            spacing={5}
                                        >
                                            <Grid item>
                                                <h1 style={{ fontSize: "20px" }}> List of the itineraries: </h1>
                                                <ul>
                                                    {renderItems()}
                                                </ul>
                                            </Grid>
                                            <Grid item>
                                                <Link to={"/itinerary"} style={{textDecoration:"none"}}>
                                                    <Button
                                                        className="btn"
                                                        size="small"
                                                        style={{ color: "black", borderStyle: "solid", borderColor: "black", borderWidth: "1px" }}
                                                        startIcon={<MapMarkerPathIcon/>}
                                                    >
                                                        My itineraries
                                                    </Button>
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            }
                        </Box>
                        <div className={classes.button}>
                            <Button
                                className="btn"
                                variant="contained"
                                size="large"
                                startIcon={<DeleteIcon />}
                                onClick={handleClickDel}
                                style={{ color: "black", borderStyle: "solid", borderColor: "black", borderWidth: "1px" }}
                            >
                                DELETE ACCOUNT
                            </Button>
                        </div>
                    </Container>

                    <Dialog open={openDelPopUp} onClose={handleCancelDel} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">DELETE ACCOUNT</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete your account? This action is irreversible.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelDel} style={{ color: "black" }}>
                                Cancel
                            </Button>

                            <div>
                                <Button
                                    onClick={handleDelete}
                                    variant="contained"
                                    style={{ color: "black", borderColor: "black", background: "red" }}
                                >
                                    <p>YES</p>
                                </Button>
                            </div>

                        </DialogActions>
                    </Dialog>



                    <Dialog open={openEmailPopUp} onClose={handleCancel} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">CHANGE EMAIL</DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{ color: "black" }}>
                                Insert the new email
                    </DialogContentText>
                            <CssTextField
                                autoFocus
                                style={{ width: "100%" }}
                                id="outlined-basic"
                                label="Email"
                                variant="outlined"
                                value={newEmail}
                                onChange={handleChange}
                                name="email"
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
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancel} style={{ color: "red" }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDone}
                                variant="outlined"
                                style={{ color: "black", borderColor: "black" }}
                            >
                                <p>Done</p>
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            }
        </div>

    )
}

export default MyAccount