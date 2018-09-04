import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const ModalCart = props => {
  return (
    <div>
      <Modal
        isOpen={props.openFlag}
        toggle={props.toggleFunction}
        className={"modal-lg " + props.className}
      >
        <ModalHeader toggle={props.toggleFunction}>Confirm</ModalHeader>
        <ModalBody>
          <div>
            <span>{props.message}</span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={props.confirmFunction}>
            Confirm
          </Button>
          &nbsp;
          <Button color="danger" onClick={props.toggleFunction}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalCart;
