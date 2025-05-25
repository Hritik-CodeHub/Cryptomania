import React, { useEffect, useState } from 'react';
import "./CoinPage.css";
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from './../config/Api';
import CoinInfo from '../components/CoinInfo';
import parse from 'html-react-parser';
import { numberWithCommas } from '../components/CoinsTable/CoinsTable';
import { LinearProgress, Typography, Button } from '@mui/material';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
const CoinPage = () => {
  const {id}=useParams();
  const [coin,setCoin]=useState();

  const {currency ,symbol, user, setAlert, watchlist}=CryptoState();

  const fetchCoin = async () => {
    const {data} = await axios.get(SingleCoin(id));

    setCoin(data);
  };
  

  useEffect(()=>{
    fetchCoin();
  },[]);

  const inWatchlist = watchlist.includes(coin?.id);
  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist ? [...watchlist, coin?.id] : [coin?.id] },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Added to the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className='container'>
      <div className='sidebar'>
        <img 
         src={coin?.image.large} 
         alt={coin?.name}
         height="200"
         style={{ marginBottom:20 }} 
        />
        <Typography variant="h3" className="heading">
            {coin?.name}
        </Typography>
        <Typography variant="subtitle1" className="description">
         {parse(coin?.description.en.split(". ")[0])}.
        </Typography>
        <div className="marketData">
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className="heading">
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              className="data"
            >
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className="heading">
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              className="data"
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className="heading">
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              className="data"
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                marginTop:20,
                backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
              }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>
      <CoinInfo coin={coin}/>
    </div>
  )
}
export default CoinPage