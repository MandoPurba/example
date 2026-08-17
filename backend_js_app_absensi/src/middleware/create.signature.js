const crypto = require("crypto");
const querystring = require("querystring");
require('dotenv').config();

const apiSecret = process.env.SIGNATURE_KEY;

function createSignature(params) {
    const query = querystring.stringify(params);

    return crypto
        .createHmac("sha256", apiSecret)
        .update(query)
        .digest("hex");
}

const params = {
    timestamp: Date.now()
};

const signature = createSignature(params);
