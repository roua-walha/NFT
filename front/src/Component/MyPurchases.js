import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { web3, NFTContract, MARKETPLACEContract } from './webprovider';
import { Spinner } from 'react-bootstrap';
export default function MyPurchases() {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);

  const loadPurchasedItems = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const buyerAddress = accounts[0].toLowerCase();

      const events = await MARKETPLACEContract.getPastEvents('Bought', {
        fromBlock: 0,
        toBlock: 'latest',
      });

      const purchasedItems = await Promise.all(
        events
          .filter(event => event.returnValues.buyer.toLowerCase() === buyerAddress)
          .map(async event => {
            const { tokenId, price, itemId } = event.returnValues;
            const uri = await NFTContract.methods.tokenURI(tokenId).call();
            const response = await fetch(uri);
            const metadata = await response.json();
            const totalPrice = await MARKETPLACEContract.methods.getTotalPrice(itemId).call();

            return {
              totalPrice,
              price,
              itemId,
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
            };
          })
      );

      setPurchases(purchasedItems);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      
    

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
<Spinner animation="border" style={{ display: 'flex' }} />
<p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
</div>
</main>
  )

  return (
    <div className="flex justify-center">
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} style={{ width: '286px', height: '300px', objectFit: 'cover' }} />
                  <Card.Footer>Price: {item.totalPrice.toString()} Wei</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: '1rem 0' }}>
          <h2>No purchases</h2>
        </main>
      )}
    </div>
  );
}


/*import { web3, NFTContract,MARKETPLACEContract } from './webprovider'
import React, { useEffect, useState } from 'react';
//import Web3 from 'web3';



function MyPurchases() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    
    const contract = MARKETPLACEContract;
    
    async function fetchEvents() {

      try {
        
        const eventName = 'Bought';
        const fetchedEvents = await contract.getPastEvents(eventName, {
          fromBlock: 0,
          toBlock: 'latest',
        });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const filteredEvents = fetchedEvents.filter(event => event.returnValues.buyer.toLowerCase() === accounts[0].toLowerCase());
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Marketplace Bought Events</h1>
      <div>
        {events.map((event, index) => (
          <div key={index}>
            <p>Item ID: {event.returnValues.itemId.toString()}</p>
            <p>NFT: {event.returnValues.nft}</p>
            <p>Token ID: {event.returnValues.tokenId.toString()}</p>
            <p>Price: {event.returnValues.price.toString()} wei</p>
            <p>Seller: {event.returnValues.seller}</p>
            <p>Buyer: {event.returnValues.buyer}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPurchases;*/
