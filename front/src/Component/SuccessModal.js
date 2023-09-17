import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SuccessModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        onClose(); // Automatically close the modal after a delay
        navigate('/MyPurchases'); // Navigate after closing the modal
      }, 20000); // Adjust the delay in milliseconds (3 seconds in this example)

      return () => clearTimeout(timeout); // Clear the timeout if the modal is closed early
    }
  }, [show, onClose, navigate]);

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Success!</Modal.Title>
      </Modal.Header>
      <Modal.Body>Your purchase was successful.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;

