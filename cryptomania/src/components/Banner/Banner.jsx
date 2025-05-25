import React from 'react';
import "./Banner.css";
import {Container,  Typography,} from "@mui/material"
import Carousel from './Carousel';
const Banner = () => {
  return (
    <div className='banner'>
      <Container className="banner-content">
        <div className='tagline'>
          <Typography
            variant="h2"
            style={{
            fontWeight:"bold",
            marginBottom:15,
            fontFamily:"Montserrat",
          }}
          >
            Cryptomania
          </Typography>
          <Typography
          variant="subtitle2"
          style={{
            color: "darkgrey",
            textTransform:"capitalize",
            fontFamily:"Montserrat",
          }}>
            Get all the Info regarding your favorite Crypto currency
          </Typography>
         </div>
         <Carousel/>
      </Container>
    </div>
  )
}

export default Banner