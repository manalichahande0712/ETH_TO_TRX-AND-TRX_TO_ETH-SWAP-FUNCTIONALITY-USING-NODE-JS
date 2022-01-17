const express = require('express')
const app = express()
const PORT = 5000
const Account = require('./routes/Account');
const eth_tron_Router = require('./routes/eth_tron');
const tron_eth_router = require('./routes/tron_eth');
require('dotenv').config();
require('./config/database').connect() 

app.use(express.json())


app.use('/api', Account);
app.use('/api', eth_tron_Router);
app.use('/api', tron_eth_router);


app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});