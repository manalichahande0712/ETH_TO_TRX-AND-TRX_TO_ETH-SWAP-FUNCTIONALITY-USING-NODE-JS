const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const Users = require('../models/Account');
const eth_tron = require('../models/eth_tron');

const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const web3 = new Web3(process.env.INFURA_API);

const TronWeb = require('tronweb');
const  fullNode  = 'https://api.shasta.trongrid.io/';
const solidityNode= 'https://api.shasta.trongrid.io/';
const eventServer  = 'https://api.shasta.trongrid.io/';

const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
    qs: {
        'amount': '1',
        'symbol': 'ETH',
        'convert': 'TRX'
    },    
    headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API
    },
    json: true,
    gzip: true
};

router.post('/ethtotron', async (req, res, next) => {
    try {
        const {ethAddress, trxAddress,  amount } = req.body;
        if(!( ethAddress, trxAddress, amount)){
            res.send('Please fill all fields!');
        } else {
            try {
                let userETH = await Users.findOne({ethAddress});
                let userTRX = await Users.findOne({trxAddress});

                //ETH account data
                const ethSender = userETH.ethAddress;
                const ethReceiver = userTRX.ethAddress;
                const ethPrivateKey = userETH.ethPrivateKey;
                const privateKeyETH = Buffer.from(ethPrivateKey, 'hex');

                //TRX account data
                const trxSender = userTRX.trxAddress;
                const trxReceiver = userETH.trxAddress;
                const privateKeyTRX = userTRX.trxPrivateKey;
                const tronWeb = new TronWeb( fullNode, solidityNode, eventServer, privateKeyTRX);

                // console.log('ethSender: ',ethSender, '\ntrxReceiver: ',trxReceiver, '\nethPrivkey: ',privateKeyETH);
                // console.log('\ntrxSender: ',trxSender, '\nethReceiver: ',ethReceiver, '\ntrxPrivkey: ',privateKeyTRX);

                if(!(ethSender)){
                    res.send('Invalid ETH address!');
                } else if(!(trxSender)) {
                    res.send('Invalid TRX address!');
                } else {
                    
                    rp(requestOptions).then(async response => {
                        const trxValue = response.data.quote.TRX.price;
                        const swapTRX = trxValue * amount;
                        
                        // Ethereum (ETH) transaction....
                        web3.eth.getTransactionCount(ethSender, async (err, txCount) => {
        
                            // Build the Transaction
                            const txObject = {
                                nonce : web3.utils.toHex(txCount),
                                to : ethReceiver,
                                value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
                                gasLimit : web3.utils.toHex(21000),
                                gasPrice : web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
                            }
                        
                            //Sign the Transaction
                            const tx = new Tx(txObject, { chain: 'ropsten' });
                            tx.sign(privateKeyETH);
                        
                            const serializedTransaction =tx.serialize();
                            const raw ='0x'+serializedTransaction.toString('hex');
                        
                            //Broadcast the Transaction
                            web3.eth.sendSignedTransaction(raw, async (err,txHash) => {
                                console.log('err:', err);
                                console.log('txHash:', txHash);
                            
                                // TRON (TRX) Transaction....
                                const tradeobj = await tronWeb.transactionBuilder.sendTrx(trxReceiver, swapTRX, trxSender);
                                const signedtxn = await tronWeb.trx.sign(tradeobj);
                                const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);
                                console.log('Receipt: ',receipt.txid);

                                let transaction = await ETH_to_TRX({
                                    ethSender: ethSender,
                                    ethReceiver: ethReceiver,
                                    ethSwapValue: amount,
                                    ethHash: txHash,
                                    trxSender: trxSender,
                                    trxReceiver: trxReceiver,
                                    trxSendValue: swapTRX,
                                    trxHash: receipt.txid
                                });
                                let t1 = transaction.save();
                                res.status(200).json({
                                    Message: 'ETH to TRX swap transaction complete and save successfully...',
                                    transaction
                                });
                            }); 
                        });

                    }).catch((err) => {
                        console.log('API call error:', err.message);
                    })
                }
                
            } catch (error) {
                res.send('Invalid Addresses!');
            }
        }
    } catch (error) {
        console.log('Error: ',error);
        res.status(400).json({
            Message: 'Somthing error...',
        })
    }
});


module.exports = router;