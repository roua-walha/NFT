import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Moralis from 'moralis';
import QuickListForm  from './QuickListForm'
import Web3 from 'web3';
import MARKETPLACEconfiguration from '../contracts/Marketplace.json';
const MyListedItems = () => {
  const [nfts, setNFTs] = useState([]);
  const [tokenIDs, setTokenIDs] = useState([]);
  const [showQuickList, setShowQuickList] = useState(false);
  const defaultMetadataURl = "URL_DE_VOTRE_IMAGE_PAR_DEFAUT";
  const [selectedNFT, setSelectedNFT] = useState(null);
  
  const handleListForSaleClick = (nft) => {
    setSelectedNFT(nft);
    setShowQuickList(true);
  };

  const handleCloseQuickList = () => {
    setShowQuickList(false);
  };


  useEffect(() => {
    async function fetchNFTs() {
      try {
        await Moralis.start({
          apiKey: "kBOIfRaOgIKbDdGf2TjjoasWakchpwtTGam7evplfAKt5xf2vOo9xIo5mP85kPpf"
        });

        const response = await Moralis.EvmApi.nft.getWalletNFTs({
          "chain": "0x5",
          "format": "decimal",
          "mediaItems": true,  // Fetch full NFT objects
          "address": "0xb0EB7d58BD9892ad8A8bE898035BfDc2f66d4443"
        });

        setNFTs(response.result);

        // Fetch token IDs from the Marketplace contract using web3
        const web3 = new Web3(window.ethereum);
    const MARKETPLACE_ADDRESS ="0x8Fa3bCE4D250A9Ec2050F9f2C13AD9d98c8B840C";
    const MARKETPLACE_ABI = MARKETPLACEconfiguration.abi;
    const MARKETPLACEContract = new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);

        // Call the getItemsCount function from the Marketplace contract
        const itemCount = await MARKETPLACEContract.methods.itemCount().call();

        // Create an array to store token IDs
        const tokenIds = [];

        // Loop through the item IDs and fetch token IDs
        for (let i = 1; i <= itemCount; i++) {
          const tokenId = await MARKETPLACEContract.methods.items(i).call();
          tokenIds.push(tokenId.tokenId);
        }
        setTokenIDs(tokenIds);
        console.log(tokenIds)
      } catch (e) {
        console.error(e);
      }
    }

    fetchNFTs();
  }, []);

  // Filter the nfts array based on tokenID array
  

  const filteredNFTs = [];

  for (const nft of nfts) {
    const nftTokenIdInt = parseInt(nft.tokenId, 10);
    let tokenIdFound = false;

    for (const tokenId of tokenIDs) {
      const tokenIdInt = parseInt(tokenId, 10);
      if (nftTokenIdInt === tokenIdInt) {
        tokenIdFound = true;
        break;
      }
    }

    if (!tokenIdFound) {
      filteredNFTs.push(nft);
    }
  }

  return (
    <div className="flex justify-center">
      {nfts.length > 0 ? (
        <div className="px-5 py-3 container">
          <h2>{nfts.length} items</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {nfts.map((nft, index) => (
              <Col key={index} className="overflow-hidden">
                <Card className="h-100 d-flex flex-column justify-content-between">
                  <div className="text-center">
                    <Card.Img
                      variant="top"
                      src={nft.metadata.image || defaultMetadataURl}
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <Card.Footer>
                    <div className="text-center">{nft.metadata.name}</div>
                    <div className="text-center">
                      {filteredNFTs.includes(nft) && (
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
