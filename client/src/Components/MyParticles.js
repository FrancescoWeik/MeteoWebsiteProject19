import Particles from 'react-particles-js'
import React from "react"

function MyParticles(){
    return (
            <Particles
                params={{
                    particles: {
                        number : {
                            value : 50
                        },
                        color : "#ffffff",
                        line_linked : {
                            enable: true,
                            color : "#bdbdbd",
                            opacity: 0.5,
                            width : 0.5
                        },
                    }
                }}
            />
    )
}

export default MyParticles