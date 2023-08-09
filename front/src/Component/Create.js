import { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
import Moralis from 'moralis';
// import { create as ipfsHttpClient } from 'ipfs-http-client';
import { web3, NFTContract } from '../Component/webprovider';
import Web3 from 'web3';
import NFTconfiguration from '../contracts/NFT.json';
//import MARKETPLACEconfiguration from '../contracts/'
import  axios  from "axios";
const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5ZGE3Mjg1Ni0wMjUyLTQ5YWYtYTBmZC02YWQ3YzQ0ZGQ2ZDYiLCJlbWFpbCI6InJvdWF3YWxoYTdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjVmYzk0ODhmZWViNTE3OTU5MGQ0Iiwic2NvcGVkS2V5U2VjcmV0IjoiZjUxMTgzYWY3YmFhNzdkMTQzMTZkNWYwYjdlMWQ2MTQ2OThiMmRiZjVjOTZiNGYwNzQwMmQ1NDE3MDNjM2NhOCIsImlhdCI6MTY5MDU5NzEwOX0.YUfMl-J-Cr8UDcCWVYgWoveDRbEis16gwISgF2AfgtY`

//import pinataSDK from '@pinata/sdk'; // Import the Pinata SDK
//const pinataApiKey = '48f0598706c4aaf60db6'; // Replace with your actual Pinata API key
//const pinataSecretApiKey = '4da95f298767ba4122e65f7d7a7fc223c4eb2b2ee2c62495edfa84d8d7a3c15d'; // Replace with your actual Pinata Secret API key
//const client = pinataSDK(pinataApiKey, pinataSecretApiKey); // Initialize the Pinata client

  const Create = () => {
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('')

  const uploadToIPFS = async (event) => {
    
    const reader = new FileReader();
        if(event.target.files[0]) reader.readAsDataURL(event.target.files[0])

        reader.onload = (readerEvent) => {
            const file = readerEvent.target.result
            setImage(file)
            setFileUrl(event.target.files[0])
        }
  };

  const showNFT = async () => {
    /*try {
      const web3 = new Web3(window.ethereum);
      const NFT_ABI = NFTconfiguration.abi;
      const NFT_ADDRESS = "0x6Dbb3355AD4b7C26e7cDbdD86509EE3e0b4A8AC1";
  
      const NFTContract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
  
      // Call the balanceOf function to get the number of NFTs owned by the wallet address
      const balance = await NFTContract.methods.balanceOf("0xb0EB7d58BD9892ad8A8bE898035BfDc2f66d4443").call();
  
      // Convert the balance to a number
      const numNFTsOwned = parseInt(balance);
  
      // If numNFTsOwned is greater than 0, the wallet owns NFTs
      if (numNFTsOwned > 0) {
        console.log(numNFTsOwned);
      } else {
        console.log("The wallet does not own any NFTs.");
      }
    } catch (error) {
      console.error('Error checking ownership:', error);
    }*/
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
  
      console.log(response.result); // Log the result array containing the NFTs
  
      // If you want to log each individual token, you can use a loop
      response.result.forEach((nft) => {
        console.log("NFT Object:", nft);
        
        // Log any other properties you want from the NFT object
      });
      // Fetch and display metadata for each NFT
      response.result.forEach(async (nft) => {
        try {
          // Fetch metadata from the tokenUri
          const metadataResponse = await fetch(nft.tokenUri);
          
          // Check if the response is successful (status code 200)
          if (metadataResponse.ok) {
            // Parse the JSON metadata
            const metadata = await metadataResponse.json();
            console.log("NFT Metadata:", metadata);
      
            // Extract and display relevant information
            console.log("Name:", metadata.name);
            console.log("Description:", metadata.description);
            console.log("Image:", metadata.image);
            // ... (extract and display other properties as needed)
          } else {
            console.error('Failed to fetch metadata:', metadataResponse);
          }
        } catch (error) {
          console.error('Error fetching metadata:', error);
        }
      });


    } catch (e) {
      console.error(e);
    }
  }
  const getMetadataFromIPFS = async () => {
    try {
      const response = await axios.get("https://ipfs.io/ipfs/QmdMASG7zgSU2rftWnWmvJihWjqbamNbefoRndeXKiFcee", { responseType: 'json' });
      if (response.status === 200) {
        const metadata = response.data;
        console.log('Metadata:', metadata);
        // Faites quelque chose avec les métadonnées récupérées ici
        return metadata;
      } else {
        console.error('Failed to fetch metadata:', response);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };


  const createNFT = async () => {
    if (!image || !name || !description) return;
    try {
      const formData = new FormData();
      formData.append('file', fileUrl);      
      const pinatametadata = JSON.stringify({
        name: name,
      });
      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataMetadata', pinatametadata);
      formData.append('pinataOptions', options);
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxContentLength: Infinity,
          headers: {
            'Content-Type':  `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      console.log(response.data)
      const created = response.data;
      const imageURI = `https://ipfs.io/ipfs/${created.IpfsHash}`;
      
        const data = JSON.stringify({
          pinataContent: {
            name: `${name}`,
            description: `${description}`,
            image: `${imageURI}`,
          },
          pinataMetadata: {
            name: "Pinnie NFT Metadata",
          },
        });
    
        const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': JWT
          },
          body: data
        })
      const resData = await res.json()
      console.log("Metadata uploaded, CID:", resData.IpfsHash)
      const metadataURI= `https://ipfs.io/ipfs/${resData.IpfsHash}`;
      const web3 = new Web3(window.ethereum);
      const NFT_ADDRESS ="0x6Dbb3355AD4b7C26e7cDbdD86509EE3e0b4A8AC1";
      const NFT_ABI = NFTconfiguration.abi;
      const NFTContract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
      await NFTContract.methods.mint( metadataURI).send({ from: '0xb0EB7d58BD9892ad8A8bE898035BfDc2f66d4443' });

      const MARKETPLACE_ADDRESS="";
//MARKETPLACE_ABI = MARKETPLACEconfiguration.abi;
//const MARKETPLACEContract = new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);


     
    
      // get tokenId of new nft 
    const id = await NFTContract.methods.tokenCount().call();
    console.log(id);

    // approve marketplace to spend nft
    //await(await NFTContract.setApprovalForAll(MARKETPLACEContract.address, true)).wait()
    // add nft to marketplace
    //const listingPrice = ethers.utils.parseEther(price.toString())
    //await(await MARKETPLACEContract.makeItem(NFTContract.address, id, listingPrice)).wait()
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
/*import { useState } from "react"
import axios from "axios"
const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5ZGE3Mjg1Ni0wMjUyLTQ5YWYtYTBmZC02YWQ3YzQ0ZGQ2ZDYiLCJlbWFpbCI6InJvdWF3YWxoYTdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjVmYzk0ODhmZWViNTE3OTU5MGQ0Iiwic2NvcGVkS2V5U2VjcmV0IjoiZjUxMTgzYWY3YmFhNzdkMTQzMTZkNWYwYjdlMWQ2MTQ2OThiMmRiZjVjOTZiNGYwNzQwMmQ1NDE3MDNjM2NhOCIsImlhdCI6MTY5MDU5NzEwOX0.YUfMl-J-Cr8UDcCWVYgWoveDRbEis16gwISgF2AfgtY`

const Create = () => {

  const [selectedFile, setSelectedFile] = useState();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async() => {

    const formData = new FormData();
    
    formData.append('file', selectedFile)

    const metadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT
        }
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <label className="form-label">Choose File</label>
    <input type="file"  onChange={changeHandler}/>
    <button onClick={handleSubmission}>Submit</button>
    </>
  )
}

export default Create*/