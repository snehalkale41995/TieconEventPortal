import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const SessionValidModal = props => {
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
          {props.event==""||props.event==null?(<span style={{textAlign :"center"}}><h6>Please select Event </h6></span>) : null}         
          {props.room=="" ||props.event==null? (<span style={{textAlign :"center"}}><h6>Please select Room </h6></span>) : null }        
          {props.startTime==""||props.event==null? (<span style={{textAlign :"center"}}><h6>Please select Slots </h6></span>) : null}         
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

export default SessionValidModal;
