/*import { useState } from 'react'
//import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try{
      const result = await client.add(JSON.stringify({image, price, name, description}))
      mintThenList(result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    //const listingPrice = ethers.utils.parseEther(price.toString())
    //await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }
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
}

export default Create*/

import { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
// import { create as ipfsHttpClient } from 'ipfs-http-client';
import { web3, NFTContract } from '../Component/webprovider';
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