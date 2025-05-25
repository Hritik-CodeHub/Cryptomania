import React, {createContext, useContext, useEffect, useState } from 'react';
import {CoinList} from "./config/Api";
import axios from 'axios';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { onSnapshot, doc } from "firebase/firestore";
// Create the context
const Crypto = createContext();

// Create the provider component
const CryptoContext = ({children}) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [coins, setCoins]=useState([]);
  const [loading,setLoading]=useState(false);
  const [user,setUser]=useState(null);
  const [alert, setAlert]=useState({
    open:false,
    message:"",
    type:"success",
  });

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user?.uid);
      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          
          setWatchlist(coin.data().coins);
        } else {
          console.log("No Items in Watchlist");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

   const [watchlist,setWatchlist]=useState([]);
  useEffect(()=>{
   onAuthStateChanged(auth, user =>{
    if (user) setUser(user);
    else setUser(null);
    
   });
  },[])

  const fetchCoins= async()=>{
          setLoading(true);
          const {data}= await axios.get(CoinList(currency));
  
          setCoins(data);
          setLoading(false);
      };
  

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  return (
    <Crypto.Provider 
      value={{ 
      currency, 
      symbol,
      setCurrency,
      coins,
      loading,
      fetchCoins,
      alert,
      setAlert,
      user,
      watchlist
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

// Custom hook to use the Crypto context
export const CryptoState = () => {
  return useContext(Crypto);
};
