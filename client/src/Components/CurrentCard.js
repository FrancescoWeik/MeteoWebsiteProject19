import Box from "@material-ui/core/Box"
import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import OpacityIcon from '@material-ui/icons/Opacity'
import React from "react"
import SunglassesIcon from 'mdi-react/SunglassesIcon'
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import WeatherWindyIcon from 'mdi-react/WeatherWindyIcon'

function CurrentCard(props) {

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    function  toTextualDescription(degree){
        if (degree>337.5) 
            return 'N'
        if (degree>292.5) 
            return 'NW'
        if (degree>247.5) 
            return 'W'
        if (degree>202.5) 
            return 'SW'
        if (degree>157.5) 
            return 'S'
        if (degree>122.5) 
            return 'SE'
        if (degree>67.5) 
            return 'E'
        if (degree>22.5) 
            return 'NE'
        return 'N';
    }

    return(
        <div>     
        
            <Box
                mt="auto"
                mr="auto"
                mb="auto"
                ml="auto"
                width={350}
                height={280}
                borderRadius={16}
                boxShadow="20"
                style = {{
                    backgroundColor : "rgba(255,255,255,0.5)"
                }}
            >
                <Grid container direction="column" justify= "center" alignItems = "center">
                    <Grid item style = {{padding : 0}}>
                        <img src={props.incomingData.icon} />
                        <h2 style = {{color : "Black", fontSize : "30px"}}>{props.incomingData.main}</h2>
                    </Grid>
                    <Grid item>
                        <Grid container direction = "row" justify = "center" alignItems = "center" spacing = {6} style = {{marginTop : 0}}>
                            <Grid item>
                                <Grid item >
                                    <Grid container direction = "column" alignItems = "center" spacing = {1}>
                                        <Grid item>
                                            <ThermometerIcon size = {30}/>
                                            <h3>{round(props.incomingData.temp,1) + "°"}</h3>
                                        </Grid>
                                        <Grid item >
                                                <p style = {{fontWeight : "bold", color:"#008fd6"}}>
                                                    {round(props.incomingData.temp_Min,1) + "°"}
                                                </p>
                                                <p style = {{fontWeight : "bold", color:"#b30000"}}>
                                                    {round(props.incomingData.temp_Max,1) + "°"}
                                                </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider orientation="vertical" style = {{marginBottom : "5%", marginTop: "5%"}} flexItem/>
                            <Grid item>
                                <OpacityIcon style = {{ fontSize : "30px"}}/>
                                <h3>{props.incomingData.humidity + "%"}</h3>
                            </Grid>
                            <Divider orientation="vertical" style = {{marginBottom : "5%", marginTop: "5%"}} flexItem/>
                            <Grid item>
                                <Grid container direction = "column" alignItems = "center" spacing = {1} >
                                    <Grid item>
                                            <WeatherWindyIcon size = {30} />
                                            <h3>{round(props.incomingData.wind_speed,1)}</h3>
                                            <h6>km/h</h6>
                                    </Grid>
                                    <Grid item>
                                        {toTextualDescription(props.incomingData.wind_deg)}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider orientation="vertical" style = {{marginBottom : "5%", marginTop: "5%"}} flexItem/>
                            <Grid item>
                                <SunglassesIcon size = {30} />
                                <br/>
                                <h3>{props.incomingData.uvi}</h3>
                                <p style={{fontWeight : "bold"}}>UV</p>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )


}

export default CurrentCard