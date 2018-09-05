import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const RegistrationModal = props => {
  return (
    <div>
      <Modal
        isOpen={props.openFlag}
        toggle={props.toggleFunction}
        className={"modal-lg " + props.className}
      >
        <ModalHeader>User Details</ModalHeader>
        <ModalBody>
          <div>
            <span style={{textAlign :"center"}}><h6>Username : {props.email}</h6></span> 
            <span style={{textAlign :"center"}}><h6>Password  : {props.password}</h6></span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={props.toggleFunction}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RegistrationModal;
