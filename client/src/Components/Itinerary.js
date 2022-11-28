import { FixedSizeList } from 'react-window'
import { makeStyles, Typography } from "@material-ui/core"
import { Redirect } from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
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
import IconButton from '@material-ui/core/IconButton';
import InformationOutlineIcon from "mdi-react/InformationOutlineIcon"
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MapMarkerPathIcon from 'mdi-react/MapMarkerPathIcon'
import React, { useState, useEffect } from "react"


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        alignItems: "center",
        justifyContent: "center"
    },
    paper: {
        marginTop: theme.spacing(10),
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

function Itinerary(props) {

    const classes = useStyles();

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [openPopUp, setOpenPopUp] = useState(false);
    const [delClickedItin, setDelClickedItin] = useState("");
    const [itinData, setItinData] = useState([])
    const [done, setDone] = useState(false);
    const [open, setOpen] = useState(false);

    // COMPONENT DID MOUNT
    useEffect(() => {
        fetching();
    }, [])

    async function fetching() {
        setLoading(true);
        await fetch('/itineraries/' + props.user, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'GET'
        }).then((resp) => resp.json())
            .then(function (data) {
                setItinData(data);
                setLoading(false);
            })
            .catch(error => console.error(error))

    }

    
    // HANDLERS
    
    async function handleDelete(event) {
        
        await fetch('/itineraries', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'DELETE', 
            body: JSON.stringify({
                "user_id": props.user,
                "itinerary_id": delClickedItin
            })
        }).then((resp) => resp.json())
        .then(function (data) {
        })
        .catch(error => console.error(error));
        
        setOpenPopUp(false);
        fetching();
        
    }
    
    async function handleInfo(event) {
        
        props.setClickedItinId(event.target.id);
        props.setClickedItinName(event.target.getAttribute("name"))
        
        await fetch('/meteoComponents/' + props.user + "&" + event.target.id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'GET'
        }).then((resp) => resp.json())
        .then(function (data) {
            props.setClickedItinMeteos(data);
        })
        .catch(error => console.error(error))
        setDone(true);
        
    };
    
    async function addItinerary(){
        await fetch('/itineraries' , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                "itinerary_name": name,
                "user_id": props.user
            })
        }).then(response => response.json())
        .then(function (data) {
            if(data.error != null){
                window.alert(data.error);
            }
        })
        .catch(error => {
            window.alert(error);
            console.error(error);
        })

        setName("");
        fetching();
    }
    
    function handleClick() {
        setOpen(true);
    }
    
    function handleCancel() {
        setOpen(false);
    }
    
    function handleCancelDel() {
        setOpenPopUp(false);
    }
    
    function handleClickDel(event){
        setDelClickedItin(event.target.id)
        setOpenPopUp(true);
    }

    function handleDone() {
        setOpen(false);
        addItinerary();
    }
    
    function handleChange(event){
        setName(event.target.value);
    }
    
    // RENDER DELLE RIGHE
    function renderRow() {
        return (
            <div>
                {itinData.map(item => (
                    <div
                        key={item._id}
                        className="itineraryDiv"
                    >
                        <ListItem
                            style={{ 
                                color: "white", 
                                background: "linear-gradient(to right, rgba(255,255,255,0.8),rgba(112,112,112,0.7))" , 
                                borderRadius : "15px"
                            }}
                        >
                            <ListItemText style={{ pointerEvents: "none", color: "black" }} >
                                <h2> {item.name} </h2>
                            </ListItemText>

                            <div
                                onClick={handleInfo}
                                id={item._id}
                                name={item.name}
                            >
                                <IconButton  style={{ pointerEvents: "none" }}>
                                    <InformationOutlineIcon style={{ pointerEvents: "none" }} />
                                </IconButton>
                            </div>

                            <div
                                onClick={handleClickDel}
                                id={item._id}
                                name={item.name}
                            >
                                <IconButton style={{ pointerEvents: "none" }} variant="outlined">
                                    <DeleteIcon style={{ pointerEvents: "none" }} />
                                </IconButton>
                            </div>

                        </ListItem>
                    </div>
                ))}
            </div>
        )
    }
    
    // RENDERING
    return (
        <div>
            {done ?
                <Redirect to={"/myitinerary"} /> :
                
                <Container component="main" maxWidth="xs" style={{ paddingTop: 0 }}>

                    <div className={classes.paper}>
                        <MapMarkerPathIcon size={45} style={{ color: "white", marginBottom: "8px" }} />
                        <Typography 
                            style={{ color: "white", marginBottom: "3%" }} 
                            component="h5" 
                            variant="h5"
                        >
                            MY ITINERARIES
                        </Typography>
                        <br />
                    </div>

                    <Box
                        component="div"
                        border={2}
                        mx={0}
                        mt={5}
                        pt={1}
                        pb={1}
                        boxShadow={10}
                        style={{ textAlign: "center", borderColor: "rgba(0,0,0,0.3)", color: "white", background: "rgba(0,0,0,0.2)", borderRadius : "16px" }}
                    >
                        {loading ?
                            <div className={classes.root}>
                                <CircularProgress style={{ color: "white" }} />
                            </div> :
                            <FixedSizeList
                                height={270}
                                width={300}
                                itemSize={600}
                                itemCount={1}
                                style={{ position: "relative", margin: "auto" }}
                            >
                                {renderRow}
                            </FixedSizeList>
                        }
                    </Box>

                    <div className={classes.button}>
                        <Button
                            className="btn"
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={handleClick}
                            style={{color: "black", borderStyle: "solid", borderColor: "black", borderWidth:"1px"}}
                        >
                            Add itinerary
                        </Button>
                    </div>
                </Container>
            }

                        
            <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">ADD A NEW ITINERARY</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{color: "black"}}>
                        Insert the name of the new itinerary
                    </DialogContentText>
                    <CssTextField
                        autoFocus
                        style={{width: "100%" }}
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={handleChange}
                        name="name"
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
                    <Button onClick={handleCancel} style={{color: "red"}}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDone} 
                        variant="outlined"
                        style={{color: "black", borderColor: "black"}}
                    >
                        <p>Done</p>
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openPopUp} onClose={handleCancel} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">DELETE ITINERARY</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDel} style={{color: "black"}}>
                        Cancel
                    </Button>

                    <div>
                        <Button 
                            onClick={handleDelete} 
                            variant="contained"
                            style={{color: "black", borderColor: "black", background:"red"}}
                            >
                            <p>YES</p>
                        </Button>
                    </div>

                </DialogActions>
            </Dialog>

        </div>
    )


}


export default Itinerary