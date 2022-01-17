const mongoose = require('mongoose');

const tron_eth_Schema = mongoose.Schema(
    {
        trxSender: {
            type: String,
            require: true
        },
        trxReceiver: {
            type: String,
            require: true
        },
        trxSendValue: {
            type: String,
            require: true
        },
        trxHash:{
            type: String,
            require: true
        },
        ethSender: {
            type: String,
            require: true
        },
        ethReceiver: {
            type: String,
            require: true
        },
        ethSwapValue: {
            type: String,
            require: true
        },
        ethHash:{
            type: String,
            require: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('tron_eth_Transaction', tron_eth_Schema);