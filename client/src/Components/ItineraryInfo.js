import 'date-fns';
import { Link } from "react-router-dom"
import { makeStyles, Typography } from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import Button from "@material-ui/core/Button"
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import CssTextField from "./CssTextField"
import DateFnsUtils from '@date-io/date-fns';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from "@material-ui/core/Grid"
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import MeteoCard from "./MeteoCard"
import React, { useState, useEffect } from "react"
import Toolbar from '@material-ui/core/Toolbar'
import UpdateIcon from '@material-ui/icons/Update';
import alasql from 'alasql';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom : "1.5%",
    },
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        alignItems: "center",
        justifyContent: "center"
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

/*function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}    */


function ItineraryInfo(props) {

    const classes = useStyles();

    const [incomingMeteos, setIncomingMeteos] = useState(props.clickedItinMeteos);
    const [openPopUp, setOpenPopUp] = useState(false);
    const [open, setOpen] = useState(false);
    const [clickedMeteoComp, setClickedMeteoComp] = useState("");
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [selectedDate, setSelectedDate] = React.useState(new Date(''));

    async function patchIfProblems(){
        var tempCurrentDate = new Date().getTime() / 1000
        var currentDate = tempCurrentDate.toFixed(0)

        const ids = await Promise.all(incomingMeteos.map(async item => {
            if(!item.available || item.date < currentDate){
                await patch(props.user, props.clickedItinId, item._id);
            }
        }));
        get();
    }

    useEffect(() => {
        patchIfProblems()
    }, [])


    async function patch(user_id, itinerary_id, meteo_id){
        await fetch("/meteoComponents" , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: "PATCH",
            body: JSON.stringify({
                "user_id": user_id,
                "itinerary_id": itinerary_id,
                "meteo_id": meteo_id
            })
        }).then(response => response.json())
        .then(function(data) {
            if(data.error != null){
                window.alert(data.error);
                console.log("ERROR");
            } else {
                //console.log(data.success);
            }
        })
        .catch(error => {
            window.alert(error);
            console.error(error);
        })

    }
    
    function handleCancelDel() {
        setOpenPopUp(false);
    }
    
    function handleClickDel(event) {
        setOpenPopUp(true);
    }
    
    async function handleDelete() {
        setLoading(true);
        await fetch('/meteoComponents', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({
                "user_id": props.user,
                "itinerary_id": props.clickedItinId,
                "meteo_id": clickedMeteoComp
            })
        }).then((resp) => resp.json())
        .then(function (data) {
            get();
        })
        .catch(error => console.error(error));
        setOpenPopUp(false);
    }
    
    async function get(){
        await fetch('/meteoComponents/' + props.user + "&" + props.clickedItinId, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'GET'
        }).then((resp) => resp.json())
        .then(function (data) {
            var res1 = alasql('SELECT * FROM ? ORDER BY date',[data]);
            setIncomingMeteos(res1);
            setLoading(false);
        })
        .catch(error => console.error(error))
    }
    
    
    function handleCancelAdd() {
        setOpen(false)
    }
    
    function handleClickAdd() {
        setOpen(true);
    }
    
    function handleChange(event) {
        setName(event.target.value);
    }
    
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    
    async function handleDone() {
        setLoading(true);
        addStageFetch();
        setOpen(false);
    }

    async function handleUpdate(){
        setLoading(true);
        await Promise.all(incomingMeteos.map(async item => {
            await patch(props.user, props.clickedItinId, item._id);
        }));
        get();
    }
    
    async function addStageFetch(){
        const unixDate=new Date(selectedDate).getTime()/1000
        await fetch('/meteoComponents' , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                "itinerary_id": props.clickedItinId,
                "user_id": props.user,
                "cityName": name,
                "date": unixDate,
            })
        }).then(resp => resp.json())
        .then(function (data) {
            if(data.error != null){
                window.alert(data.error);
                console.log("ERROR");
            }
            setName("");
            get()
        })
        .catch(error => {
            window.alert(error);
            console.error(error);
        })
    }
    
    
    function renderCards() {
        return (
            <Grid
                container
                direction="row"
                alignItems="center"
                justify="center"
                spacing={3}
            >
                {incomingMeteos.map(item => (
                        <MeteoCard
                            key={item._id}
                            item={item}
                            handleClickDel={handleClickDel}
                            setClickedMeteoComp={setClickedMeteoComp}
                        />
                ))}
            </Grid>
        )

    }


    return (
        <div>
            <Toolbar style={{ minHeight: "40px", marginTop: "5px" }}>
                <Link to={"/itinerary"} style={{ textDecoration: 'none' }}>
                    <Button
                        className="btn"
                        variant="contained"
                        size="small"
                        startIcon={<KeyboardBackspaceIcon />}
                    >
                        Back
                    </Button>
                </Link>
            </Toolbar>
            <Container
                display="flex"
                component="main"
                width="70%"
                style={{ marginTop: "-0.25%" }}
            >
                <div className={classes.paper}>
                    <Typography style={{ color: "white", marginBottom: "1%" }} component="h5" variant="h5">
                        STAGES OF THE ITINERARY "{props.clickedItinName}"
                    </Typography>
                    <Grid container direction="row" spacing={2} justify="center" alignItems="center">
                        <Grid item>
                            <Button
                                className="btn"
                                variant="contained"
                                size="medium"
                                startIcon={<AddIcon />}
                                onClick={handleClickAdd}
                                style={{minWidth:"155px"}}
                            >
                                ADD STAGE
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                style={{background: "linear-gradient(to right, #5c5c5c, #ffffff)"}}
                                variant="contained"
                                size="medium"
                                startIcon={<UpdateIcon />}
                                onClick={handleUpdate}
                            >
                                UPDATE DATA
                            </Button>
                        </Grid>
                    </Grid>
                    <br />
                </div>

                {loading ?
                    <div className={classes.root}>
                        <CircularProgress style={{ color: "white" }} />
                    </div> :
                    renderCards()
                }

            </Container>

            <Dialog open={openPopUp} onClose={handleCancelDel} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">DELETE STAGE</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this?
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

            <Dialog open={open} onClose={handleCancelAdd} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">ADD A NEW STAGE</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: "black" }}>
                        Insert the name of the city
                    </DialogContentText>
                    <CssTextField
                        autoFocus
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="City"
                        variant="outlined"
                        value={name}
                        onChange={handleChange}
                        name="cityName"
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
                    <DialogContentText style={{ color: "black", marginTop:"10px", marginBottom: "0px" }}>
                        Pick a date
                    </DialogContentText>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label=""
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{color: "black"}}
                        />
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelAdd} style={{ color: "red" }}>
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
    )
}

export default ItineraryInfo