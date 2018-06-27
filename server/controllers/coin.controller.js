const axios = require('axios');

const  Coin = require('../models/coin');
const  config = require('../config');
const refreshLimit = 5 * 60 * 1000;
let lastFetched = 0

/**
 * Save a coin
 * @param req
 * @param res
 * @returns void
 */
exports.addCoin =  async function addCoin(req, res) {
  try {
    let value = await axios.get(`${config.api}/price?fsym=${req.body.coinSym}&tsyms=EUR`);
    if(value.data.Response!=="Error") {
      await Coin.update( { coinSym : req.body.coinSym }, { coinSym : req.body.coinSym, value:value.data.EUR },{ upsert : true }).exec();
      let list = await Coin.find().exec();
      res.status(201).json(list);
    } else {
      res.status(200).json(value.data);
    }
  } catch (e) {
    return res.status(500).send(e);
  }
};

/**
 * Get coins and its euro value
 * @param req
 * @param res
 * @returns void
 */
exports.getCoin = async function getCoin(req, res) {
  try {
    let list = await Coin.find().exec();
    let currentTime = new Date().getTime();
    //check to fetch fresh data
    if((currentTime - lastFetched > refreshLimit) || (lastFetched === 0)) {
      lastFetched = currentTime;
      //comma separated list of coin symbol e.g ETH,BTC
      let coinSymList = list.reduce((merge, coin) => {
        merge+=coin.coinSym+',';
        return merge;
      }, "");
      let valueList = await axios.get(`${config.api}/pricemulti?fsyms=${coinSymList}&tsyms=EUR`);
      for (let coin of list) {
        //update database with fresh data if it is changed
        if(valueList.data[coin.coinSym].EUR != coin.value) {
          const contents = await Coin.update( {_id : coin._id }, { value : valueList.data[coin.coinSym].EUR }).exec();
        }
      }
      list.forEach(coin => {
        coin.value = valueList.data[coin.coinSym].EUR
      });
    }
    res.status(200).json(list);
  } catch (e) {
    return res.status(500).send(e);
  }
};

/**
 * Delete a coin  by symbol
 * @param req
 * @param res
 * @returns void
 */
exports.deleteCoin =  async function deleteCoin(req, res) {
  try {
    await Coin.remove({ coinSym : req.params.coinSym }).exec();;
    res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).send(e);
  }
};
