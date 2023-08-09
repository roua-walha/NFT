import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Moralis from 'moralis';

const MyListedItems = () => {
  const [nfts, setNFTs] = useState([]);
  const defaultImageUrl = "URL_DE_VOTRE_IMAGE_PAR_DEFAUT";

  useEffect(() => {
    async function fetchNFTs() {
      try {
        await Moralis.start({
          apiKey: "kBOIfRaOgIKbDdGf2TjjoasWakchpwtTGam7evplfAKt5xf2vOo9xIo5mP85kPpf"
        });

        const response = await Moralis.EvmApi.nft.getWalletNFTs({
          "chain": "0x5",
          "format": "decimal",
          "mediaItems": false,
          "address": "0xb0EB7d58BD9892ad8A8bE898035BfDc2f66d4443"
        });

        const liste = await Promise.all(response.result.map(async (nft) => {
          try {
            const metadataResponse = await fetch(nft.tokenUri);
            
            if (metadataResponse.ok) {
              const metadata = await metadataResponse.json();
              return metadata.image || defaultImageUrl;
            } else {
              return defaultImageUrl;
            }
          } catch (error) {
            console.error('Error fetching metadata:', error);
            return defaultImageUrl;
          }
        }));

        setNFTs(liste);
      } catch (e) {
        console.error(e);
      }
    }

    fetchNFTs();
  }, []);

  return (
    <div className="flex justify-center">
      {nfts.length > 0 ? (
        <div className="px-5 py-3 container">
          <h2>Minted</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {nfts.map((imageURL, index) => (
              <Col key={index} className="overflow-hidden">
                <Card >
                  <Card.Img variant="top" src={imageURL} />
                </Card> 
              </Col>
            ))}
          </Row>
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