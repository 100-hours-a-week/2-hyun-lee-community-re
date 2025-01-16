import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../styles/confirmationModal-style.css"
const ConfirmationModal = ({ show, title, message, onConfirm, onCancel}) =>{
    return (
        <Modal show ={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>취소</Button>
                <Button variant="danger" onClick={onConfirm}>삭제</Button>

            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmationModal;