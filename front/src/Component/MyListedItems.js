import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Moralis from 'moralis';
import QuickListForm  from './QuickListForm'

import Web3 from 'web3';
import { Spinner } from 'react-bootstrap';
import MARKETPLACEconfiguration from '../contracts/Marketplace.json';
Moralis.start({
  apiKey: "kBOIfRaOgIKbDdGf2TjjoasWakchpwtTGam7evplfAKt5xf2vOo9xIo5mP85kPpf"
});
const MyListedItems = () => {
  const [loading, setLoading] = useState(true);
  const [nfts, setNFTs] = useState([]);
  const [tokenIDs, setTokenIDs] = useState([]);
  const [showQuickList, setShowQuickList] = useState(false);
  const defaultMetadataURl = "https://gateway.pinata.cloud/ipfs/QmeNEA4fUajuCgaaDdfpFHVhj1HNrBHgaLV9xvNB9Nq5Hr?_gl=1*1tj3erw*_ga*MTc3MTAwNzQ5MS4xNjg5ODkwNjYy*_ga_5RMPXG14TE*MTY5MzQ4NDIzMi4zMS4xLjE2OTM0ODQyNDEuNTEuMC4w";
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [listednft, setlistednft]=useState([]);
  // Fetch token IDs from the Marketplace contract using web3
  const web3 = new Web3(window.ethereum);
  const MARKETPLACE_ADDRESS ="0x8Fa3bCE4D250A9Ec2050F9f2C13AD9d98c8B840C";
  const MARKETPLACE_ABI = MARKETPLACEconfiguration.abi;
  const MARKETPLACEContract = new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);

  
  const handleListForSaleClick = (nft) => {
    setSelectedNFT(nft);
    setShowQuickList(true);
  };

  const handleCloseQuickList = () => {
    setShowQuickList(false);
  };
  // Initialize Moralis
  

  async function fetchNFTs() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      

      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        "chain": "0x5",
        "format": "decimal",
        "mediaItems": true,  // Fetch full NFT objects
        "address": accounts[0]
      });

      setNFTs(response.result);
      console.log(nfts);
      
      // Call the getItemsCount function from the Marketplace contract
      const itemCount = await MARKETPLACEContract.methods.itemCount().call();

      // Create an array to store token IDs
      const tokenIds = [];
      const listnft =[];
      // Loop through the item IDs and fetch token IDs
      for (let i = 1; i <= itemCount; i++) {
        const tokenId = await MARKETPLACEContract.methods.items(i).call();
        listnft.push(tokenId);
        tokenIds.push(tokenId.tokenId);
      }
      setTokenIDs(tokenIds);
      setlistednft(listnft);
      console.log(tokenIds);
      console.log(listnft);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }


  useEffect(() => {
    
    fetchNFTs();
  }, []);

  

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      
    

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
<Spinner animation="border" style={{ display: 'flex' }} />
<p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
</div>
</main>
  )

  // Filter the nfts array based on tokenID array
  

  
  
  const filteredMap = [];
  const fetchItemsAndFilter = async () => {
  for (const nft of nfts) {
    const nftTokenIdInt = parseInt(nft.tokenId, 10);
    let tokenIdFound = false;
    
    for (const listnft of listednft) {
      const tokenIdInt = parseInt(listnft.tokenId, 10);
      if (nftTokenIdInt === tokenIdInt) {
        
        if(listnft.sold){
          let occurrenceCount = 0;
          let j=0;
          let k=0;
          for (const tokenId of tokenIDs) {
            if (parseInt(tokenId, 10) === tokenIdInt) {
              occurrenceCount++;
              k=j;
            }
            j++;
          }
          const item =listednft[k].sold;
          console.log(`The occurrence of ID ${tokenIdInt} is: ${occurrenceCount} sold :  ${item}`);
          if (item) {
            filteredMap.push(nft);
          
          }
          
        }
        tokenIdFound = true;
        break;
      }
    }

    if (!tokenIdFound) {
      filteredMap.push(nft);
    }
  }
  

  



}
  fetchItemsAndFilter();

  

  return (
    <div className="flex justify-center">
      {nfts.length > 0 ? (
        <div className="px-5 py-3 container">
          <h2>{nfts.length} items</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {nfts.map((nft, index) => (
              <Col key={index} className="overflow-hidden">
                <Card >
                  <div className="text-center">
                    <Card.Img
                      variant="top"
                      src={nft.metadata.image || defaultMetadataURl}
                      style={{ width: '286px', height: '300px', objectFit: 'cover' }}
                    />
                  </div>
                  <Card.Footer    style={{ width: '286px', height: '80px', objectFit: 'cover' }}>
                    <div className="text-center">{nft.metadata.name}  </div>
                    <div className="text-center">
                      {filteredMap.includes(nft) && (
                        <button className="btn btn-primary" onClick={() => handleListForSaleClick(nft)}>List for sale</button>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          {showQuickList && <QuickListForm onClose={handleCloseQuickList} selectedNFT={selectedNFT}/>}
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No minted assets</h2>
        </main>
      )}
    </div>
  );
};

export default MyListedItems;
