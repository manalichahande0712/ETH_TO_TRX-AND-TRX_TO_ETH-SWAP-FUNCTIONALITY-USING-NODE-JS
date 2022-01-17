const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        ethAddress: {
            type: String,
            require: true
        },
        ethPrivateKey: {
            type: String,
            require: true
        },
        trxAddress: {
            type: String,
            require: true
        },
        trxPrivateKey: {
            type: String,
            require: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Account', AccountSchema);