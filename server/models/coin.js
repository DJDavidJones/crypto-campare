const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  coinSym: { type: 'String', required: true },
  value: { type: 'String', required: true }
});
module.exports = mongoose.model('Coin', coinSchema);
