const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const API_KEY_TWELVEDATA = '4d8a10ee3603472cb0cac7060ad56dff';
const API_KEY_MARKETAUX = '7d9YAY3fHHrE3ndYDOpPOfpOvlH1B2iIaNy4x23d'; // Replace with your Marketaux API key

app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));

app.set('view engine', 'ejs');

// Existing root route for stock data
app.get('/', async (req, res) => {
  try {
    const symbols = ['AAPL', 'GOOGL', 'MSFT'];
    const stockPromises = symbols.map(symbol =>
      axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${API_KEY_TWELVEDATA}`)
    );

    const stocks = await Promise.all(stockPromises);
    const stockData = stocks.map(stock => stock.data);

    res.render('index', { stockData });
  } catch (error) {
    console.error(error);
    res.send('Error fetching data');
  }
});

app.get('/stock-data', async (req, res) => {
  try {
    const symbol = req.query.symbol;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const response = await axios.get(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${API_KEY_TWELVEDATA}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// New /education route with news feed
app.get('/education', async (req, res) => {
  try {
    // Fetch news data from Marketaux API
    const response = await axios.get(`https://api.marketaux.com/v1/news/all?symbols=TSLA,AMZN,MSFT&filter_entities=true&language=en&api_token=${API_KEY_MARKETAUX}`);
    const newsData = response.data.data; // Extract the news articles array

    // Render the education page with news data
    res.render('education', { newsData });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.send('Error fetching financial news');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
