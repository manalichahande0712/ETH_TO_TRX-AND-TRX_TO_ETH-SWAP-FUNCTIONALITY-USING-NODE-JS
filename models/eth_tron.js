const mongoose = require('mongoose');

const eth_tron_Schema = mongoose.Schema(
    {
        ethSender: {
            type: String,
            require: true
        },
        ethReceiver: {
            type: String,
            require: true
        },
        ethSendValue: {
            type: String,
            require: true
        },
        ethHash:{
            type: String,
            require: true
        },
        trxSender: {
            type: String,
            require: true
        },
        trxReceiver: {
            type: String,
            require: true
        },
        trxSwapValue: {
            type: String,
            require: true
        },
        trxHash:{
            type: String,
            require: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('eth_tron_Transaction', eth_tron_Schema);
