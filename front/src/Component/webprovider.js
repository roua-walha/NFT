import Web3 from 'web3';
import NFTconfiguration from '../contracts/NFT.json';
import MARKETPLACEconfiguration from '../contracts/Marketplace.json'

// Use the Goerli testnet URL
const web3 = new Web3('https://goerli.infura.io/v3/48034cd842a44192bd912cfabb98ab5b');

// Replace 'YOUR_INFURA_PROJECT_ID' with your actual Infura Project ID for Goerli.

const NFT_ADDRESS ="0x6Dbb3355AD4b7C26e7cDbdD86509EE3e0b4A8AC1";
const NFT_ABI = NFTconfiguration.abi;

const NFTContract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);


    const MARKETPLACE_ADDRESS ="0x8Fa3bCE4D250A9Ec2050F9f2C13AD9d98c8B840C";
    const MARKETPLACE_ABI = MARKETPLACEconfiguration.abi;
    const MARKETPLACEContract = new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);


export { web3, NFTContract,MARKETPLACEContract };



/*const NFTContract = require('../contracts/NFT.json');
const ethers = require('ethers');

let provider, signer, NFTContractInstance;

if (typeof window !== 'undefined' && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  const contractAddress = '0x6Dbb3355AD4b7C26e7cDbdD86509EE3e0b4A8AC1'; // Replace with the actual contract address

  NFTContractInstance = new ethers.Contract(contractAddress, NFTContract.abi, signer);
} else {
  console.error("Ethereum provider (e.g., MetaMask) not detected. Please install and unlock MetaMask.");
}

module.exports = { provider, signer, NFTContractInstance };*/
