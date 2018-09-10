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
import Select from "react-select";
import "react-select/dist/react-select.css";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal/ModalCart";
class SponsorsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: "",
      loading: true,
      deleteFlag: false,
      sponsorId: ""
    };
  }
  componentDidMount() {
    this.props.getSponsors();
    let compRef = this;
    setTimeout(() => {
      let getSponsorError = compRef.props.getSponsorError;
      if (getSponsorError) {
        toast.error("Something went wrong", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
      compRef.setState({ loading: false });
    }, 1000);
    this.props.getEvents();
  }
  onDeleteSponsor(cell, row) {
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
      sponsorId: id
    });
  }
  deleteSponsor() {
    let id = this.state.sponsorId;
    this.props.deleteSponsor(id);
    let compRef = this;
    this.setState({ deleteFlag: false });
    setTimeout(() => {
      let deleteSponsorError = compRef.props.deleteSponsorError;
      compRef.Toaster(compRef, deleteSponsorError, "Delete");
    }, 1000);
  }
  Toaster(compRef, deleteSponsorError, actionName) {
    if (!deleteSponsorError) {
      toast.success("Sponsor " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  onEditSponsor(cell, row) {
    return (
      <Link
        to={`${this.props.match.url}/sponsorForm/${row._id}`}
        onClick={() => this.props.storeCurrentSponsor(row)}
      >
        <i className="fa fa-pencil" title="Edit" />
      </Link>
    );
  }
  handleEventChange(value) {
    if (value !== null) {
      this.setState({ event: value });
      this.props.getSponsorsForEvent(value);
    } else {
      this.setState({ event: "" });
      this.props.getSponsors();
    }
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
          value: this.props.sponsorsList.length
        },
        {
          text: "All",
          value: this.props.sponsorsList.length
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
            <Link to={`${this.props.match.url}/sponsorForm`}>
              <Button type="button" color="primary" size="small">
                <i className="fa fa-plus" />
                Add Sponsor
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
                      <h1 className="regHeading paddingTop8">Sponsor List</h1>
                    </Col>
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="4">
                      <Select
                        name="Event"
                        placeholder="Select event"
                        options={this.props.eventList}
                        value={this.state.event}
                        simpleValue
                        onChange={this.handleEventChange.bind(this)}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <BootstrapTable
                      ref="table"
                      data={this.props.sponsorsList}
                      pagination={true}
                      search={true}
                      options={options}
                      exportCSV={true}
                      csvFileName="Sponsors List"
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
                        dataField="name"
                        headerAlign="left"
                        width="100"
                        csvHeader="Sponsor Name"
                        dataSort={true}
                      >
                        Sponsor Name
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="category"
                        headerAlign="left"
                        width="100"
                        csvHeader="Category"
                        dataSort={true}
                      >
                        Category
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="eventName"
                        headerAlign="left"
                        width="100"
                        csvHeader="Event"
                        dataSort={true}
                      >
                        Event
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="edit"
                        dataFormat={this.onEditSponsor.bind(this)}
                        headerAlign="left"
                        width="40"
                        export={false}
                      >
                        Edit
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="delete"
                        dataFormat={this.onDeleteSponsor.bind(this)}
                        headerAlign="left"
                        width="40"
                        export={false}
                      >
                        Delete
                      </TableHeaderColumn>
                    </BootstrapTable>
                    <Modal
                      openFlag={this.state.deleteFlag}
                      toggleFunction={this.confirmDelete.bind(this)}
                      confirmFunction={this.deleteSponsor.bind(this)}
                      message=" Are you sure you want to permanently delete this sponsor ?"
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
    sponsorsList: state.sponsor.sponsors,
    eventList: state.event.eventList,
    deleteSponsorError: state.sponsor.deleteSponsorError,
    getSponsorError: state.sponsor.getSponsorError
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getSponsors: () => dispatch(actions.getSponsors()),
    storeCurrentSponsor: sponsor =>
      dispatch(actions.storeCurrentSponsor(sponsor)),
    deleteSponsor: id => dispatch(actions.deleteSponsor(id)),
    getEvents: () => dispatch(actions.getEvents()),
    getSponsorsForEvent: eventId =>
      dispatch(actions.getSponsorsForEvent(eventId))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SponsorsList);
