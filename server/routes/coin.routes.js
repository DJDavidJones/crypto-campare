const { Router } = require('express');
const CoinController = require('../controllers/coin.controller');

const router = Router();


router.route('/get-coins').get(CoinController.getCoin);

router.route('/addcoin').post(CoinController.addCoin);

router.route('/deletecoin/:coinSym').delete(CoinController.deleteCoin);

module.exports = router;
