import React from 'react';

const CoinContainer = (props) => (
  <div className="four columns">
    <div className="coin-container">
        <div className="cross" onClick={props.remove}><span>x</span></div>
        <h1>{props.name}</h1>
        <h3> &#8364;{props.price_euro}</h3>
    </div>
  </div>
);


export default CoinContainer;
