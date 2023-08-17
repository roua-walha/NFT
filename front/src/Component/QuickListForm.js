import React, { useState } from 'react';
import { Row, Form, Button, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Web3 from 'web3';
import MARKETPLACEconfiguration from '../contracts/Marketplace.json';
import NFTconfiguration from '../contracts/NFT.json';
const calculateDeadline = (selectedDuration) => {
    const durationValues = {
      '1 hour': 3600,
      '6 hours': 6 * 3600,
      '1 day': 24 * 3600,
      '3 days': 3 * 24 * 3600,
      '7 days': 7 * 24 * 3600,
      '1 month': 30 * 24 * 3600,
      '3 months': 3 * 30 * 24 * 3600,
      '6 months': 6 * 30 * 24 * 3600,
    };

    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    const durationInSeconds = durationValues[selectedDuration];
    const deadlineInSeconds = currentTimeInSeconds + durationInSeconds;

    const deadlineDate = new Date(deadlineInSeconds * 1000);

    return deadlineDate.toLocaleString();
  };

const QuickListForm = ({ onClose, selectedNFT }) => {
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('1 hour');
  const [deadline, setDeadline] = useState(calculateDeadline('1 hour'));
  const [selectedDate, setSelectedDate] = useState(new Date());


  const createNFT = async ()  => {
    console.log("Price:", price);
    console.log("Duration:", duration);
    console.log("Deadline:", deadline);

    setPrice(price);
    setDuration(duration);
    setDeadline(calculateDeadline(deadline));

    const web3 = new Web3(window.ethereum);
    const MARKETPLACE_ADDRESS ="0x8Fa3bCE4D250A9Ec2050F9f2C13AD9d98c8B840C";
    const MARKETPLACE_ABI = MARKETPLACEconfiguration.abi;
    const MARKETPLACEContract = new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);
    
    const NFT_ADDRESS ="0x6Dbb3355AD4b7C26e7cDbdD86509EE3e0b4A8AC1";
    const NFT_ABI = NFTconfiguration.abi;
    const NFTContract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
    const id= selectedNFT.tokenId;
    try{
      await NFTContract.methods.approve(MARKETPLACE_ADDRESS,id).send({ from: '0xb0EB7d58BD9892ad8A8bE898035BfDc2f66d4443' });
      
    }
    catch (error) {
      console.error('Error approving contract:', error);
    }
    try{
      await MARKETPLACEContract.methods.makeItem(NFT_ADDRESS,id,price).send({ from: '0xb0EB7d58BD9892ad8A8bE898035BfDc2f66d4443' });
    }
    catch (error) {
      console.error('Error make item:', error);
    }
    
  };

  

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    setDuration(newDuration);

    if (newDuration !== 'custom') {
      setSelectedDate(new Date());
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (duration === 'custom') {
      setDeadline(date.toLocaleString());
    } else {
      setDeadline(calculateDeadline(duration, date));
    }
  };

  
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Card className="h-100 d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-end mb-3">
                  <button className="btn btn-link text-decoration-none" onClick={onClose}>
                    <h2>x</h2>
                  </button>
                </div>
                <h2>List NFT</h2>
                <div className="d-flex align-items-start">
                  <Card.Img
                    variant="top"
                    src={selectedNFT.metadata.image}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <div className="ms-3">
                    <h6>{selectedNFT.metadata.name}</h6>
                  </div>
                </div>
                <Card.Footer>
                  <h6>Set a price</h6>
                  <Form.Control
                    onChange={(e) => setPrice(e.target.value)}
                    size="lg"
                    required
                    type="number"
                    placeholder="Price in ETH"
                  />
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>Duration</h6>
                      <Form.Control
                        as="select"
                        value={duration}
                        onChange={handleDurationChange}
                        size="lg"
                        style={{ width: '250px'}}
                        required
                      >
                        <option value="1 hour">1 hour</option>
                        <option value="6 hours">6 hours</option>
                        <option value="1 day">1 day</option>
                        <option value="3 days">3 days</option>
                        <option value="7 days">7 days</option>
                        <option value="1 month">1 month</option>
                        <option value="3 months">3 months</option>
                        <option value="6 months">6 months</option>
                        <option value="custom">Custom</option>
                      </Form.Control>
                    </div>
                    <div>
                      <h6>Deadline</h6>
                      {duration === 'custom' ? (
                        <DatePicker
                          selected={selectedDate}
                          onChange={setSelectedDate}
                          
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className="form-control form-control-lg"
                        />
                      ) : (
                        <p style={{ width: '250px'}}>  <h6>  {calculateDeadline(duration)} </h6> </p>
                      )}
                    </div>
                  </div>
                  <div className="d-grid px-0">
                    <Button onClick={createNFT} variant="primary" size="lg">
                      List NFT!
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuickListForm;






