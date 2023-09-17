import { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
//import Moralis from 'moralis';
import { web3, NFTContract } from '../Component/webprovider';
import Web3 from 'web3';
import NFTconfiguration from '../contracts/NFT.json';
import SuccessModalMint from './SuccessModalMint';
import { useNavigate } from 'react-router-dom';

import  axios  from "axios";
const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5ZGE3Mjg1Ni0wMjUyLTQ5YWYtYTBmZC02YWQ3YzQ0ZGQ2ZDYiLCJlbWFpbCI6InJvdWF3YWxoYTdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjVmYzk0ODhmZWViNTE3OTU5MGQ0Iiwic2NvcGVkS2V5U2VjcmV0IjoiZjUxMTgzYWY3YmFhNzdkMTQzMTZkNWYwYjdlMWQ2MTQ2OThiMmRiZjVjOTZiNGYwNzQwMmQ1NDE3MDNjM2NhOCIsImlhdCI6MTY5MDU5NzEwOX0.YUfMl-J-Cr8UDcCWVYgWoveDRbEis16gwISgF2AfgtY`

  const Create = () => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [SuccessModalMintVisible, setSuccessModalMintVisible] = useState(false);
  const uploadToIPFS = async (event) => {
    const reader = new FileReader();
        if(event.target.files[0]) reader.readAsDataURL(event.target.files[0])

        reader.onload = (readerEvent) => {
            const file = readerEvent.target.result
            setImage(file)
            setFileUrl(event.target.files[0])
        }
  };
 
  const createNFT = async () => {

    if (!window.ethereum) {
      alert("Metamask wallet is not detected. Please install Metamask to make a purchase.");
      return;
    }
    if (!image || !name || !description){alert("Please ensure that you have selected a file, entered a name, and provided a description.");
    return;} 
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
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      await NFTContract.methods.mint( metadataURI).send({ from: accounts[0] })
      .then(() => { 
        setSuccessModalMintVisible(true); // Show the success modal
      })
  ;
      // get tokenId of new nft 
    const id = await NFTContract.methods.tokenCount().call();
    console.log(id);
   
    } catch (error) {
      console.log('IPFS uri upload error: ', error);
    }
  };
  const navigate = useNavigate();
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
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create NFT!
                </Button>
                    
              </div>
            </Row>
          </div>
          <SuccessModalMint
        show={SuccessModalMintVisible}
        onClose={() => {setSuccessModalMintVisible(false); navigate('/MyNfts')}}
      />
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