const express = require('express');
const router = express.Router();

const Web3 = require('web3');
const web3 = new Web3(process.env.INFURA_API);

const TronWeb = require('tronweb');
const fullNode = 'https://api.shasta.trongrid.io';
const solidityNode = 'https://api.shasta.trongrid.io';
const eventServer = 'https://api.shasta.trongrid.io';

const CreateAccount = require('../models/Account');

router.post('/Account', async (req, res) => {
    try {
        const { name, email } = req.body;
        if(!(name, email)){
            res.send('All input fields required!');
        } else {
            const invalidEmail = email.match( /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
            if(!(invalidEmail)){
                res.send('Invalid Email')
            }else {
                    
                let user = await CreateAccount.findOne({email});
                if(!(user)){
                        const ethAccount = await web3.eth.accounts.create(); //ETH Account
            
                        const trxAccount = TronWeb.createAccount(); //TRX Account
                        
                        //Trx account Promise
                        trxAccount.then( async (trxAccount) => { 
                            const createAcc = await CreateAccount({
                                name,
                                email,
                                ethAddress: ethAccount.address,
                                ethPrivateKey: ethAccount.privateKey.slice(2),
                                trxAddress: trxAccount.address.base58,
                                trxPrivateKey: trxAccount.privateKey
                            });
                            let created = createAcc.save();
                            res.status(200).json({
                                Message: 'Account Created Successfully...!',
                                createAcc
                            });
                        });
                } else {
                    res.send('Email already used!')
                }
            }
        }
    } catch (error) {
        res.status(400).json({
            Message: 'Error',
            error
        });
        console.log(error)
    }
});

module.exports = router;