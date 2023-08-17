import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from '../src/Component/Navbar';

import Home from "./Component/Home";
import Create from './Component/Create'
import MyListedItems from './Component/MyListedItems'
//import MyPurchases from './MyPurchases.js'
//import MarketplaceAbi from '../contractsData/Marketplace.json'
//import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from './contracts/NFT.json'
import NFTAddress from './contracts/Address.json'
import { useState } from 'react'
import * as ethers from "ethers";
//import { Spinner } from 'react-bootstrap'

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation  />
        </>
        
      </div>
      <div>
      <Routes>
              
              <Route path="/create" element={
                <Create  />
              } />
              <Route path="/MyNfts" element={
                <MyListedItems />
              } />

<Route path="/Home" element={
                <Home  />
              } />
              
            </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
