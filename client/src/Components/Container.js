import Box from "@material-ui/core/Box"
import Card from "./Card"
import CurrentCard from "./CurrentCard"
import Divider from "@material-ui/core/Divider"
import React, { useState } from "react"
import Typography from "@material-ui/core/Typography"


function Container(props) {
    const [incomingData] = useState(props.dataToPass);
    const [incomingSecondData] = useState(props.dataToPassTwo)

    return (
        <div>
            <Typography variant = "h5" style={{color : "white" , marginTop : "1%"}}>
                    Current
            </Typography>
            <Divider style = {{background : "rgba(255,255,255,0.15)", marginLeft : "30%", marginRight: "30%", marginBottom : "0.5%"}}/> 
            
            <CurrentCard incomingData = {incomingData} />
            
            <Typography variant = "h5" style={{color : "white", marginTop : "1%"}}>
                Forecast
            </Typography>
            <Divider style = {{background : "rgba(255,255,255,0.15)", marginLeft : "13%", marginRight: "13%", marginBottom : "0.5%"}}/>

            <Box
                component="div"
                display="flex"
                mx={0}
                mt={0}
                pt={0}
                pb={0}
            >
                <Card num="0" data = {incomingSecondData} />
                <Card num="1" data = {incomingSecondData}/>
                <Card num="2" data = {incomingSecondData}/>
                <Card num="3" data = {incomingSecondData}/>
                <Card num="4" data = {incomingSecondData}/>
            </Box>
        </div>
    )


}

export default Container