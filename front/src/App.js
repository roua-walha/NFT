import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from '../src/Component/Navbar';

//import Home from './Home.js'
import Create from './Component/Create'
import My_listed_items from './Component/My_listed_items'
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
              <Route path="/MyListedItems" element={
                <My_listed_items/>
              } />
              
            </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
