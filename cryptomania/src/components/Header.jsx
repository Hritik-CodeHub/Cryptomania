import React from 'react'
import  {CryptoState} from '../CryptoContext';
import { useNavigate } from "react-router-dom";
import UserSidebar from "./sidebar/UserSidebar"
import {
  AppBar,Container,
  MenuItem,
  Toolbar,
  Typography,
  Select,
  createTheme,
  ThemeProvider
} from "@mui/material"
import AuthModel from './Authentication/AuthModel';

const title={
  flex:"1",
  color:"gold",
  fontFamily:"Montserrat",
  fontWeight:"bold",
  cursor:"pointer",
}
const Header = () => {
  const navigate = useNavigate();
  const { currency, setCurrency , user} = CryptoState();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme} style={{backgroundColor:"rgb(0, 0, 0)"}}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography
              onClick={() => navigate("/")}
              style={title}
              variant="h5"
            >
              Cryptomania
            </Typography>

            <Select
              variant="outlined"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currency}
              style={{ width: 100, height: 40, marginLeft: 15 }}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"INR"}>INR</MenuItem>
            </Select>
            
            {user ? <UserSidebar /> : <AuthModel/>}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};


export default Header