import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const MessageModal = props => {
  return (
    <div>
      <Modal
        isOpen={props.openFlag}
        toggle={props.toggleFunction}
        className={"modal-lg " + props.className}
      >
        <ModalHeader>Note</ModalHeader>
        <ModalBody>
          <div>
            <span>{props.message}</span>
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

export default MessageModal;
