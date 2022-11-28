import Box from "@material-ui/core/Box"
import DeleteIcon from 'mdi-react/DeleteIcon'
import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import OpacityIcon from '@material-ui/icons/Opacity'
import React, { useState } from "react"
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import WeatherWindyIcon from 'mdi-react/WeatherWindyIcon'


function MeteoCard(props) {

    const date = new Date(props.item.date * 1000);

    const updateDate = new Date(props.item.dataUpdatedOn * 1000)
    const [clicked] = useState(props.item._id);
    const [availableDate] = useState(subtractDays(date));

    function subtractDays(data) {
        var result = new Date(data);
        result.setDate(result.getDate() - 7);
        return result;
    }

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    function toTextualDescription(degree) {
        if (degree > 337.5)
            return 'N'
        if (degree > 292.5)
            return 'NW'
        if (degree > 247.5)
            return 'W'
        if (degree > 202.5)
            return 'SW'
        if (degree > 157.5)
            return 'S'
        if (degree > 122.5)
            return 'SE'
        if (degree > 67.5)
            return 'E'
        if (degree > 22.5)
            return 'NE'
        return 'N';
    }

    function handleClickDel(event) {
        props.setClickedMeteoComp(clicked)
        props.handleClickDel();
    }

    return (
        <Grid item>
            <Box
                mt="auto"
                mr="auto"
                mb="auto"
                ml="auto"
                width={250}
                minHeight={344}
                borderRadius={16}
                boxShadow="20"
                style={{
                    backgroundColor: "rgba(255,255,255,0.5)"
                }}
            >

                {props.item.available ?
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify="center"
                        spacing={1}
                    >
                        <Grid item>
                            <h1 style={{ color: "Black", fontSize: "27px", marginTop: "3px", marginBottom: "3px", textAlign: "center" }}>
                                {props.item.cityName}
                            </h1>
                            <h3 style={{ textAlign: "center" }}>
                                {date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}
                            </h3>
                            <img 
                                alt="weatherIcon"
                                src={"http://openweathermap.org/img/wn/" + props.item.icon + ".png"}
                                style={{ marginLeft: "auto", marginRight: "auto", display: "block" }}>

                            </img>
                            <h2 style={{ color: "Black", fontSize: "25px", textAlign: "center" }}>
                                {props.item.main}
                            </h2>
                        </Grid>
                        <Divider orientation="horizontal" flexItem />
                        <Grid item>
                            <Grid
                                container
                                direction="row"
                                alignItems="center"
                                spacing={5}
                            >
                                <Grid item>
                                    <Grid
                                        container
                                        direction="column"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <Grid item>
                                            <ThermometerIcon size={30} />
                                            <h3>{round(props.item.temp, 1) + "°"}</h3>
                                        </Grid>
                                        <Grid item>
                                            <Grid container direction="column" justify="center" alignItems="center">
                                                <Grid item >
                                                    <p style={{ fontWeight: "bold", color: "#008fd6" }}>
                                                        {round(props.item.temp_Min, 1) + "°"}
                                                    </p>
                                                </Grid>
                                                <Grid item>
                                                    <p style={{ fontWeight: "bold", color: "rgba(140,0,0,0.8" }}>
                                                        {round(props.item.temp_Max, 1) + "°"}
                                                    </p>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider
                                    orientation="vertical"
                                    style={{ marginBottom: "11%", marginTop: "11%" }}
                                    flexItem
                                />
                                <Grid item>
                                    <OpacityIcon style={{ fontSize: "30px" }} />
                                    <h3>{props.item.humidity + "%"}</h3>
                                </Grid>
                                <Divider
                                    orientation="vertical"
                                    style={{ marginBottom: "11%", marginTop: "11%" }}
                                    flexItem
                                />
                                <Grid item>
                                    <Grid
                                        container
                                        direction="column"
                                        alignItems="center"
                                        justify="center"
                                    >
                                        <Grid item>
                                                <WeatherWindyIcon size={30} />
                                        </Grid>
                                        <Grid item>
                                            <h3>{round(props.item.wind_speed, 1)}</h3>
                                        </Grid>
                                        <Grid item>
                                                <h6>km/h</h6>
                                        </Grid>
                                        <Grid item style = {{marginTop : "40%"}}>
                                            {toTextualDescription(props.item.wind_deg)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                            style={{ marginTop: "8px" }}
                        >
                            <Grid item>
                                <h6> Updated on: </h6>
                            </Grid>
                            <Grid item>
                                <h6> {updateDate.getDate() + "/" + (updateDate.getMonth() + 1) + "/" + updateDate.getFullYear()} </h6>
                            </Grid>
                        </Grid>

                        <Grid item style={{ marginTop: "-7px" }}>
                            <div style={{ textAlign: "center" }}>
                                <IconButton
                                    onClick={handleClickDel}
                                >
                                    <DeleteIcon style={{ pointerEvents: "none" }} />
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>
                    :
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        spacing={1}
                        style = {{minWidth : 250 , minHeight : 344}}
                    > 
                        <Grid item>

                            <h1 style={{ color: "Black", fontSize: "27px", marginTop : "3%", marginBottom: "2%", textAlign: "center" }}>
                                {props.item.cityName}
                            </h1>

                            <h3 style={{ textAlign: "center"}}>
                                {date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}
                            </h3>

                        </Grid>
                        <Grid item style={{ textAlign: "center", verticalAlign : "center" , marginTop:"37%"}}>
                            <h1 >
                                DATA WILL BE AVAILABLE ON:
                                    {availableDate.getDate() + "/" +
                                    (availableDate.getMonth() + 1) + "/" +
                                    availableDate.getFullYear()}
                            </h1>
                        </Grid>

                        <Grid item style={{ marginTop: "32%" , textAlign: "center"}}>
                            <div>
                                <IconButton
                                    onClick={handleClickDel}
                                >
                                    <DeleteIcon style={{ pointerEvents: "none" }} />
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>
                }
            </Box>
        </Grid >
    )
}

export default MeteoCard


