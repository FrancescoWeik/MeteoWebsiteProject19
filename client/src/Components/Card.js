import Box from "@material-ui/core/Box"
import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import OpacityIcon from '@material-ui/icons/Opacity'
import React, { useState } from "react"
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import WeatherWindyIcon from 'mdi-react/WeatherWindyIcon'

function Card(props) {
    const [data] = useState(props.data)
    const [index] = useState(props.num)

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

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    const date = new Date(data[index].date);

    return (
        <Box
            border={0}
            mt="auto"
            mr="auto"
            mb="auto"
            ml="auto"
            width={250}
            height={300}
            borderRadius={16}
            boxShadow="10"
        >
            <Box
                component="div"
                width="100%"
                className="card__inner"
            >
                <Box
                    component="div"
                    className="card__face card__face--front"
                    style = {{
                        backgroundColor : "rgba(255,255,255,0.35)"
                    }}
                >
                    <Grid container direction = "column" alignItems = "center" justify = "center" spacing = {2}>
                        <Grid item>
                            <h3> {date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()} </h3>
                            <img src={data[index].icon} id="imm_uno" alt="Immagine" className="image__icon" />
                            <h2 style = {{color : "Black", fontSize : "30px"}}>{data[index].main}</h2>
                        </Grid>
                        <Divider orientation="horizontal" flexItem/>
                        <Grid item>
                            <Grid container direction = "row" alignItems = "center" spacing = {5}>
                                <Grid item>
                                    <Grid container direction = "column" alignItems = "center" spacing = {1}>
                                        <Grid item>
                                            <ThermometerIcon size = {30}/>
                                            <h3>{round(data[index].temp,1) + "°"}</h3>
                                        </Grid>
                                        <Grid item > 
                                            <p style = {{fontWeight : "bold", color:"#008fd6"}}>
                                                {round(data[index].temp_Min,1) + "°"}
                                            </p>
                                            <p style = {{fontWeight : "bold", color:"rgba(140,0,0,0.8"}}>
                                                {round(data[index].temp_Max,1) + "°"}
                                            </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider orientation="vertical" style = {{marginBottom : "5%", marginTop: "5%"}} flexItem/>
                                <Grid item>
                                    <OpacityIcon style = {{ fontSize : "30px"}}/>
                                    <h3>{data[index].humidity + "%"}</h3>
                                </Grid>
                                <Divider orientation="vertical" style = {{marginBottom : "5%", marginTop: "5%"}} flexItem/>
                                <Grid item>
                                    <Grid container direction = "column" alignItems = "center" spacing = {1} >
                                        <Grid item>
                                            <div>
                                                <WeatherWindyIcon size = {30} />
                                                <h3>{round(data[index].wind_speed,1)}</h3>
                                                <h6>km/h</h6>
                                            </div>
                                        </Grid>
                                        <Grid item>
                                            {toTextualDescription(data[index].wind_deg)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default Card