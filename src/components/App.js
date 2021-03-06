import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import Marketplace from "../abis/Marketplace.json";
import NavBar from "../components/NavBar";
import Main from "../components/Main";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true,
    };
  }
  
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected. Try again buckaroo");
    }
  }
  
  createProduct = (name, price) => {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, price).send({from:this.state.account})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }
  purchaseProduct = (id, price) => {
    this.setState({ loading: true })
    this.state.marketplace.methods.purchaseProduct(id).send({from:this.state.account, value: price})
    .once('receipt', (receipt) => {
      this.setState({ loading: false }) 
    })
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    //load account
    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);
    this.setState({
      account: accounts[0],
    });
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      const marketplace = web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      this.setState({ marketplace: marketplace });
      const productCount = await marketplace.methods.productCount().call()
      this.setState({ productCount })
      for (let i = 1; i <= productCount; i++){
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false });
    } else {
      window.alert("Marketplace not deployed to detected network");
    }
  }

  render() {
    return (
      <div>
        <NavBar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>: <Main createProduct={this.createProduct} purchaseProduct={this.purchaseProduct} products={this.state.products} />}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
