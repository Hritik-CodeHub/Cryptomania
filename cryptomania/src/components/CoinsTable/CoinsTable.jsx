import React, { useEffect } from 'react';
import axios from 'axios';
import {useState} from "react";
import { CoinList } from '../../config/Api';
import { CryptoState } from '../../CryptoContext';
import { useNavigate } from "react-router-dom";
import "./CoinsTable.css";
import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  Typography,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
  Pagination,
} from "@mui/material";
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

const CoinsTable = () => {
    const [search,setSearch]=useState("");
    const [page,setPage]=useState(1);
    const navigate = useNavigate();

    const {currency, symbol,coins,loading,fetchCoins} = CryptoState();
    
    const darkTheme = createTheme({
        palette: {
          primary: {
            main: "#fff",
          },
          mode: "dark",
        },
      });
       
    
    useEffect(()=>{
       fetchCoins();
     },[currency]);
    
     const handleSearch = () => {
        return coins.filter(
          (coin) =>
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toUpperCase().includes(search)
        );
      };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
         Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
        label="Search For a Crypto Currency.."
        variant="outlined"
        style={{ marginBottom: 20, width: "100%" }}
        onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
            {loading ?(<LinearProgress className="linear-prog"/>
            ) : (
              <Table aria-label="simple table">
                <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                  <TableRow>
                    {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                        <TableCell
                            style={{
                            color: "black",
                            fontWeight: "700",
                            fontFamily: "Montserrat",
                            }}
                            key={head}
                            align={head === "Coin" ? "" : "right"}
                        >
                         {head}
                        </TableCell>
                     ))}
                  </TableRow>
                </TableHead>

                <TableBody  className="rowStyle">
                    {handleSearch()
                      .slice((page - 1) * 10, (page - 1) * 10 + 20)
                      .map((row) => {
                        const profit = row.price_change_percentage_24h > 0;
                        return (
                        <TableRow
                            onClick={() => navigate(`/coins/${row.id}`)}
                           
                            key={row.name}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                style={{
                                    display: "flex",
                                    gap: 15,
                                }}
                            >
                                <img
                                    src={row?.image}
                                    alt={row.name}
                                    height="50"
                                    style={{ marginBottom: 10 }}
                                />
                                <div
                                    style={{ display: "flex", flexDirection: "column" }}
                                >
                                    <span
                                        style={{
                                            textTransform: "uppercase",
                                            fontSize: 22,
                                        }}
                                    >
                                    {row.symbol}
                                    </span>
                                    <span style={{ color: "darkgrey" }}>
                                    {row.name}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell align="right">
                                {symbol}{" "}
                                {numberWithCommas(row.current_price.toFixed(2))}
                            </TableCell>
                            <TableCell
                                align="right"
                                style={{
                                    color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                                    fontWeight: 500,
                                }}
                            >
                                {profit && "+"}
                                {row.price_change_percentage_24h.toFixed(2)}%
                            </TableCell>
                            <TableCell align="right">
                                {symbol}{" "}
                                {numberWithCommas(
                                    row.market_cap.toString().slice(0, -6)
                                )}
                                M
                            </TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>
            </Table> 
            )}
        </TableContainer>
        <Pagination
          count={(handleSearch()?.length / 20).toFixed(0)}
          className="pagination-style"
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />    
       </Container>
    </ThemeProvider>
  )
}

export default CoinsTable