import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from '../src/Component/Navbar';

import Home from "./Component/Home";
import Create from './Component/Create'
import MyListedItems from './Component/MyListedItems'
import MyPurchases from './Component/MyPurchases'
//import MarketplaceAbi from '../contractsData/Marketplace.json'
//import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from './contracts/NFT.json'
import NFTAddress from './contracts/Address.json'
import { useState } from 'react'
//import { Spinner } from 'react-bootstrap'
import { DeadlineProvider } from './Component/DeadlineContext'
import './App.css';


function App() {
  const [account, setAccount] = useState(null)
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    
  }





  return (
    <DeadlineProvider>
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account}  />
        </>
        
      </div>
      <div>
      <Routes>
      <Route path="/" element={<Home />} />
              <Route path="/create" element={
                <Create  />
              } />
              <Route path="/MyNfts" element={
                <MyListedItems />
              } />

<Route path="/Home" element={
                <Home  />
              } />

<Route path="/MyPurchases" element={
                <MyPurchases />
              } />
              
            </Routes>
      </div>
    </BrowserRouter>
    </DeadlineProvider>

  );
}

export default App;
