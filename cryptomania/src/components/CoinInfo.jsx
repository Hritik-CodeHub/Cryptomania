import React, { useEffect, useState } from 'react';
import { CryptoState } from '../CryptoContext';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  CircularProgress,
  createTheme,
  ThemeProvider,
  Typography,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SelectButton from './SelectButton';
import { chartDays } from './../config/data';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currency } = CryptoState();

  const fetchHistoricData = async () => {
    try {
      setLoading(true);
      let url = '';

      if (startDate && endDate) {
        const from = Math.floor(new Date(startDate).getTime() / 1000);
        const to = Math.floor(new Date(endDate).getTime() / 1000);
        url = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}`;
      } else {
        url = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${currency}&days=${days}`;
      }

      const { data } = await axios.get(url);
      setHistoricData(data.prices);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching historical data:', err);
    }
  };

  useEffect(() => {
    fetchHistoricData();
  }, [currency, days, startDate, endDate]);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#fff',
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          width: { xs: '100%', md: '70%' },
          padding: 2,
          margin: 'auto',
          textAlign: 'center',
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress style={{ color: 'gold' }} size={100} thickness={1.5} />
          </Box>
        ) : (
          <>
            <Typography variant="h5" mb={2}>
              {coin.name} Price Chart
            </Typography>

            <Line
              data={{
                labels: historicData.map((coin) => {
                  const date = new Date(coin[0]);
                  return days === 1 && !(startDate && endDate)
                    ? `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
                    : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    label: `Price in ${currency}`,
                    data: historicData.map((coin) => coin[1]),
                    borderColor: '#EEBC1D',
                    backgroundColor: 'rgba(238,188,29,0.1)',
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${currency} ${tooltipItem.raw.toLocaleString()}`,
                    },
                  },
                },
                elements: {
                  point: { radius: 2 },
                },
                scales: {
                  x: { ticks: { color: '#fff' } },
                  y: { ticks: { color: '#fff' } },
                },
              }}
            />

            <Box mt={3} display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  selected={day.value === days && !startDate && !endDate}
                >
                  {day.label}
                </SelectButton>
              ))}
            </Box>

            <Box mt={3} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                    setDays(null);
                  }}
                  maxDate={new Date()}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                    setDays(null);
                  }}
                  minDate={startDate || undefined}
                  maxDate={new Date()}
                />
              </LocalizationProvider>
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default CoinInfo;
