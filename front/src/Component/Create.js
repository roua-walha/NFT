import { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
// import { create as ipfsHttpClient } from 'ipfs-http-client';
import { web3, NFTContract } from '../Component/webprovider';
import Web3 from 'web3';
import NFTconfiguration from '../contracts/NFT.json';
//import pinataSDK from '@pinata/sdk'; // Import the Pinata SDK
//const pinataApiKey = '48f0598706c4aaf60db6'; // Replace with your actual Pinata API key
//const pinataSecretApiKey = '4da95f298767ba4122e65f7d7a7fc223c4eb2b2ee2c62495edfa84d8d7a3c15d'; // Replace with your actual Pinata Secret API key
//const client = pinataSDK(pinataApiKey, pinataSecretApiKey); // Initialize the Pinata client

  const Create = () => {
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        const options = {
          pinataMetadata: {
            name: file.name,
          },
        };

        //const result = await client.pinFileToIPFS(file, options);
        //console.log(result);
        setImage(`https://gateway.pinata.cloud/ipfs/QmYcnWZM47YfKhot3T9kqaMkFQoaJDKvWbQxu3axQtPZy4`); // Update the image URL to use ipfs.io instead of infura.io
      } catch (error) {
        console.log('IPFS image upload error: ', error);
      }
    }
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) return;
    try {
      const options = {
        pinataMetadata: {
        name: 'metadata.json',
        },
      };

      const metadata = JSON.stringify({ image, price, name, description });
      //const metadataResult = await client.pinJSONToIPFS(JSON.parse(metadata), options);
      //console.log(metadataResult);
      const web3 = new Web3(window.ethereum);

// Replace 'YOUR_INFURA_PROJECT_ID' with your actual Infura Project ID for Goerli.

const NFT_ADDRESS ="0x6Dbb3355AD4b7C26e7cDbdD86509EE3e0b4A8AC1";
const NFT_ABI = NFTconfiguration.abi;

const NFTContract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);

      const uri = `https://gateway.pinata.cloud/ipfs/QmYcnWZM47YfKhot3T9kqaMkFQoaJDKvWbQxu3axQtPZy4`;
      // mint nft
      await NFTContract.methods.mint(uri).send({ from: '0xBbBD66C9cebF2094806f6a4B6044876AA9494216' });
    } catch (error) {
      console.log('IPFS uri upload error: ', error);
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;