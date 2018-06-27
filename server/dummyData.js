const Coin = require('./models/coin');

module.exports = async function generateDummyData() {
  const count = await Coin.count().exec();
  if (count > 0) {
    return;
  }


  const coin = new Coin({
    coinSym: 'BTC', value: '12'
  });

  await Coin.create([coin]);
};
