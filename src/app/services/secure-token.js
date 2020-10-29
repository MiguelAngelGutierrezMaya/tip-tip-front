/**
 * Import Crypto
 */
const SimpleCrypto = require("simple-crypto-js").default;
const simpleCrypto = new SimpleCrypto(process.env.REACT_APP_TOKEN_KEY);

const encrypt = obj => {
    return simpleCrypto.encrypt(JSON.stringify(obj));
};

const decrypt = token => {
    return _verify(simpleCrypto.decrypt(token));
};

export default { decrypt, encrypt };

function _verify(result) {
    if (typeof result == 'string') return JSON.parse(result);
    return result;
}