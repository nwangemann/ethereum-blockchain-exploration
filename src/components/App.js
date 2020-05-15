import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Marketplace from '../abis/Marketplace.json'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
  }

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. Try again buckaroo')
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3
    //load account
    const accounts = await web3.eth.getAccounts()
    console.log('accounts', accounts)
    this.setState({
      account: accounts[0]
    })
  }
  
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <h1 className="navbar-brand col-sm-3 col-md-2 mr-0">
            Blockchain Exploration Marketplace
          </h1>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
    <span id="account">{this.state.account}</span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Blockchain Exploration Marketplace</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
