import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import CoinContainer from './component/CoinContainer';
import Spinner from "./component/Spinner"

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list : [],
      showLoader :true

    };
    this.getAllCoins()
    .finally(() => {
      this.setState({showLoader:false});
    });
    //5 min refresh rate for fetching data from backend
    this.refreshTime = 5 * 60 * 1000;
  }

  componentDidMount() {
    this.streamId = setInterval(this.getAllCoins, this.refreshTime);
  }

  componentWillUnmount() {
    clearInterval(this.streamId);
  }
  getAllCoins = () => {
    return axios.get('/api/get-coins')
      .then(list => {
        // Get the coins data and store them in store
        this.setState({ list : list.data })
      })

  }

  handleExpand=() => {
    this.expand.classList.toggle('expand');
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }
  //To  add new coin
  handleSubmit= (event) =>   {
    event.preventDefault();
    this.setState({showLoader:true})
    axios.post(`/api/addcoin`, {
      coinSym : this.state.coinSym.toUpperCase()
    })
    .then(res => {
      if(res.data.Response!="Error") {
        this.setState({ list : res.data , coinSym:""});
        this.handleExpand();
      }
    })
    .finally(() => {
      this.setState({showLoader:false})
    })
  }
  remove = (coinSym) => {
    this.setState({showLoader:true});
    axios.delete(`/api/deletecoin/${coinSym}`)
    .then(res => {
        if(res.data.success) {
          this.setState({ list : this.state.list.filter((coin)=>(coin.coinSym!= coinSym)) })
        }
    })
    .finally(() => {
      console.log("HERE");
      this.setState({showLoader:false});
    });
  }
 renderRow = () =>{
   let coins =[];
   let coinContainers = this.state.list.map((coin, i) =>{
       return (
         <CoinContainer key={coin.coinSym} name={coin.coinSym} price_euro={coin.value} remove= {() =>{
           this.remove(coin.coinSym)
         }}/>
       );
   });
   //row can have three items concurrently
   //TODO : this can be handled with css, with a better grid system
   while (coinContainers.length > 0) {
     let row = (<div key={Math.random()} className="row">{coinContainers.splice(0,3)}</div>);
     coins.push(row);
   }
   return coins;
 }

  render() {
    let { list } = this.state;
    return (
      <div className="App">
          {
            this.state.showLoader && <Spinner/>
          }
          <div className="container">
          <div className="row">
            <div className="nine columns">
              <div id="coin-total"></div>
            </div>
            <div className="three columns expand-btn-container">
              <button id="expand-btn"  className="more" onClick={this.handleExpand} >Add Coin</button>
            </div>
            <div className="twelve columns expand " ref={(value)=>this.expand = value}>
              <form onSubmit={this.handleSubmit} >
                  <input type="text" name="coinSym" value={this.state.coinSym} onChange={this.handleInputChange} placeholder="Coin symbol e.g BTC" required />
                  <input className="button-primary" type="submit" value="Add" ref={(value) => this.coinSym = value} />
              </form>
            </div>
          </div>
            {this.renderRow()}
          </div>
      </div>
    );
  }
}

export default App;
