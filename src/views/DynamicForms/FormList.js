import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../../store/actions/index";
import {
  FormGroup,
  Col,
  Button,
  Card,
  CardHeader,
  Row,
  CardBody
} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal/ModalCart";
class FormList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      deleteFlag: false,
      formId: ""
    };
  }
  componentDidMount() {
    this.props.getFormList();
    let compRef = this;
    setTimeout(() => {
      let getFormError = compRef.props.getFormError;
      if (getFormError) {
        toast.error("Something went wrong", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
      compRef.setState({ loading: false });
    }, 1000);
  }
  ondeleteForm(cell, row) {
    return (
      <Link to={this} onClick={() => this.confirmDelete(row._id)}>
        <i className="fa fa-trash" title="Delete" />
      </Link>
    );
  }
  confirmDelete(id) {
    let deleteFlag = this.state.deleteFlag;
    this.setState({
      deleteFlag: !deleteFlag,
      formId: id
    });
  }
  deleteForm() {
    let id = this.state.formId;
    this.props.deleteForm(id);
    let compRef = this;
    this.setState({ deleteFlag: false });
    setTimeout(() => {
      let deleteFormError = compRef.props.deleteFormError;
      compRef.Toaster(compRef, deleteFormError, "Delete");
    }, 1000);
  }
  Toaster(compRef, deleteFormError, actionName) {
    if (!deleteFormError) {
      toast.success("Form " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  onEditForm(cell, row) {
    return (
      <Link
        to={`${this.props.match.url}/questionForms/${row._id}`}
        onClick={() => this.props.storeCurrentForm(row)}
      >
        <i className="fa fa-pencil" title="Edit" />
      </Link>
    );
  }
  onViewForm(cell, row) {
    return (
      <Link
        to={`${this.props.match.url}/renderForm/${row._id}`}
        onClick={() => this.props.storeCurrentForm(row)}
      >
        <i className="fa fa-eye" title="View" />
      </Link>
    );
  }
  render() {
    const options = {
      sizePerPageList: [
        {
          text: "50",
          value: 50
        },
        {
          text: "100",
          value: 100
        },
        {
          text: "200",
          value: 200
        },
        {
          text: "All",
          value: this.props.formList.length
        },
        {
          text: "All",
          value: this.props.formList.length
        }
      ],
      sizePerPage: 50
    };
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <div>
        <ToastContainer autoClose={2000} />
        <FormGroup row className="marginBottomZero">
          <Col xs="6" md="3">
            <Link to={`${this.props.match.url}/questionForms`}>
              <Button type="button" color="primary" size="small">
                <i className="fa fa-plus" />
                Create Form
              </Button>
            </Link>
          </Col>
        </FormGroup>

        <br />
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <FormGroup row className="marginBottomZero">
                    <Col xs="6" md="3">
                      <h1 className="regHeading paddingTop8">Form List</h1>
                    </Col>
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <BootstrapTable
                      ref="table"
                      data={this.props.formList}
                      pagination={true}
                      search={true}
                      options={options}
                      version='4'
                    >
                      <TableHeaderColumn
                        dataField="_id"
                        headerAlign="left"
                        isKey
                        hidden
                      >
                        Id
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="eventName"
                        headerAlign="left"
                        width="80"
                        dataSort={true}
                      >
                        Event Name
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="sessionName"
                        headerAlign="left"
                        width="80"
                        dataSort={true}
                      >
                        Session Name
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="formType"
                        headerAlign="left"
                        width="80"
                        dataSort={true}
                      >
                        Form Type
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="view"
                        dataFormat={this.onViewForm.bind(this)}
                        headerAlign="left"
                        width="20"
                        export={false}
                      >
                        Preview
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="edit"
                        dataFormat={this.onEditForm.bind(this)}
                        headerAlign="left"
                        width="20"
                        export={false}
                      >
                        Edit
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="delete"
                        dataFormat={this.ondeleteForm.bind(this)}
                        headerAlign="left"
                        width="20"
                        export={false}
                      >
                        Delete
                      </TableHeaderColumn>
                    </BootstrapTable>
                    <Modal
                      openFlag={this.state.deleteFlag}
                      toggleFunction={this.confirmDelete.bind(this)}
                      confirmFunction={this.deleteForm.bind(this)}
                      message=" Are you sure you want to permanently delete this form ?"
                    />
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    error: state.registration.error,
    formList: state.questionForm.forms,
    getFormError: state.questionForm.getFormError,
    deleteFormError: state.questionForm.deleteFormError
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getFormList: () => dispatch(actions.getForms()),
    storeCurrentForm: form => dispatch(actions.storeCurrentForm(form)),
    deleteForm: id => dispatch(actions.deleteForm(id))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormList);
