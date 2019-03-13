import React, { Component } from "react";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import {
  FormGroup,
  Col,
  Button,
  Label,
  Input,
  Row,
  Card,
  CardBody,
  CardHeader
} from "reactstrap";
import CsvParse from "@vtex/react-csv-parse";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import uuid from "uuid";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Loader from "../../components/Loader/Loader";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const csvData = [
  [
    "firstName",
    "lastName",
    "email",
    "contact",
    "profileName",
    "briefInfo"
  ]
];

class AttendeeBulkUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showDataTable: false,
      CSVdata: [],
      CSVdataTracker: null,
      showTableHeaderFormat: false,
      csvFileRequired: false,
      uploadFlag: false,
      bulkUploadError: false,
      fileName: "",
      clearCSValue: false,
      csvFileInvalid: false,
      eventValue: "",
      eventRequired: false
    };
    this.handleData = this.handleData.bind(this);
  }
  componentDidMount() {
    //this.props.getBulkUploadHistory();
    this.props.getEvents();
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  }

  handleEventChange(value) {
    let compRef = this;
    if (value !== null) {
      this.setState({
        eventValue: value,
        eventRequired: false
      });
    }
  }

  handleData(data, file) {
    if (data.length !== 0) {
      this.setState({
        clearCSValue: false,
        csvFileInvalid: false,
        showDataTable: true,
        CSVdata: data,
        CSVdataTracker: data,
        csvFileRequired: false,
        bulkUploadError: false,
        uploadFlag: false
      });
    } else {
      this.setState({
        clearCSValue: false,
        CSVdata: data,
        CSVdataTracker: [],
        csvFileRequired: false,
        csvFileInvalid: true,
        uploadFlag: false
      });
    }
  }

  onReset() {
    this.setState({
      clearCSValue: true,
      showDataTable: false,
      CSVdata: [],
      CSVdataTracker: null,
      csvFileRequired: false,
      bulkUploadError: false,
      fileName: "",
      uploadFlag: false,
      csvFileInvalid: false,
      eventRequired : false
    });
  }

  onValidate() {
    let attendees = [...this.state.CSVdata];
    let compRef = this;
    !this.state.eventValue ? this.setState({ eventRequired: true }) : null;
    if (attendees.length !== 0 && this.state.eventValue) {
      this.setState({ loading: true });
       this.props.bulkValidateAttendee(attendees);
      setTimeout(() => {
        let bulkValidationError = this.props.bulkValidationError;
        let CSVdata = compRef.props.attendeeList;
        bulkValidationError
          ? this.setState({
              loading: false,
              CSVdata: CSVdata,
              bulkUploadError: true
            })
          : this.setState({
              loading: false,
              uploadFlag: true,
              bulkUploadError: false
            });
      }, 5000);
    } else if (this.state.CSVdataTracker === null) {
      this.setState({ csvFileRequired: true });
    } 
  }

  onSubmit() {
    let attendees = [...this.state.CSVdata];
    let eventId = this.state.eventValue;
    if (this.state.CSVdataTracker === null) {
      this.setState({ csvFileRequired: true });
    } else if (this.state.CSVdataTracker === []) {
      this.setState({ csvFileInvalid: true });
    }
    if (attendees.length === 0) {
      this.setState({ csvFileRequired: true });
    }
    let compRef = this;
    if (!this.state.csvFileRequired && !this.state.csvFileInvalid) {
      this.props.bulkUploadAttendee(attendees, eventId);
      this.setState({ loading: true });
      setTimeout(() => {
        let message = "";
        compRef.setState({ loading: false });
        let bulkUploadError = compRef.props.bulkUploadError;
        compRef.Toaster(compRef, bulkUploadError);
        setTimeout(() => {
          if (!compRef.props.bulkUploadError) {
            compRef.onReset();
            compRef.props.history.push("/registrationList");
          }
        }, 1000);
      }, 2000);
    }
  }

  Toaster(compRef, bulkUploadError) {
    compRef.setState({ loading: false });
    if (!bulkUploadError) {
      toast.success("Attendee uploaded successfully", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  onShowTableFormat() {
    let showTableHeaderFormat = this.state.showTableHeaderFormat;
    this.setState({
      showTableHeaderFormat: !showTableHeaderFormat
    });
  }
  
  render() {
    let trStyle = (row, rowIndex) => {
      return { color: "#E00000" };
    };
   
    const sortingOptions = {
      defaultSortName: "firstName",
      defaultSortOrder: "asc",
      sizePerPageList: [
        {
          text: "5",
          value: 5
        },
        {
          text: "10",
          value: 10
        },
        {
          text: "20",
          value: 20
        },
        {
          text: "All",
          value: this.state.CSVdata.length
        }
      ],
      sizePerPage: 5
    };
    const keys = [
      "firstName",
      "lastName",
      "email",
      "contact",
      "profileName",
      "briefInfo"
    ];
    const tableFormat = keys.map(key => {
      return <td className="csv-table-border">{key}</td>;
    });

    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <div>
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <FormGroup row className="marginBottomZero">
                    <Col xs="12" md="4">
                      <h1 className="regHeading paddingTop8">
                        Attendee Bulk Upload
                      </h1>
                    </Col>
                    <Col xs="10" md="3">
                      <Select
                        name="Event"
                        placeholder="Select event"
                        options={this.props.eventList}
                        value={this.state.eventValue}
                        simpleValue
                        onChange={this.handleEventChange.bind(this)}
                      />
                      {this.state.eventRequired ? (
                        <div
                          style={{ color: "red", marginTop: -1 }}
                          className="help-block"
                        >
                          *Please select event
                        </div>
                      ) : null}
                    </Col>
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col xs="12">
                      <FormGroup row>
                        <Col xs="12" md="6">
                          <CsvParse
                            keys={keys}
                            onDataUploaded={this.handleData}
                            value={this.state.fileName}
                            //onError={this.handleError}
                            render={onChange => (
                              <Input
                                id="fileValue"
                                icon=""
                                label="CSV file"
                                type="file"
                                accept=".csv"
                                value={
                                  this.state.clearCSValue
                                    ? this.state.fileName
                                    : null
                                }
                                onChange={onChange}
                                required={this.state.csvFileRequired}
                                //invalid={this.state.csvFileInvalid}
                                // blankCSVFile={this.state.csvFileInvalid}
                              />
                            )}
                          />
                          {this.state.csvFileInvalid ? (
                            <div
                              className="help-block"
                              style={{ marginTop: 2 }}
                            >
                              *Blank CSV file cannot be accepted
                            </div>
                          ) : null}
                        </Col>
                        <Col md="6">
                          <FormGroup row>
                            <Label>
                              Format required for CSV : &nbsp; &nbsp;
                            </Label>
                            <CSVLink
                              filename="_attendeeList.csv"
                              data={csvData}
                            >
                              Download
                            </CSVLink>
                            &nbsp; Or &nbsp;
                            <Link
                              to={this}
                              onClick={this.onShowTableFormat.bind(this)}
                            >
                              View
                            </Link>
                            &nbsp; CSV header format
                            <br />{" "}
                            <div
                              className="help-block"
                              style={{
                                fontWeight: "500",
                                marginTop: 20
                              }}
                            >
                              *Use the provided format ONLY for bulk upload.
                            </div>
                          </FormGroup>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        {this.state.showTableHeaderFormat ? (
                          <Col xs="12" md="10">
                            <table className="csv-table-border">
                              <tr className="csv-table-border">
                                {tableFormat}
                              </tr>
                            </table>
                            <div
                              style={{
                                marginTop: 0,
                                color: "red",
                                fontSize: 12
                              }}
                            >
                              *Please note : Sequence of headers should be
                              exactly same.
                            </div>
                          </Col>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    {this.state.uploadFlag ? (
                      <Col md="1">
                        <Button
                           color="success"
                          onClick={this.onSubmit.bind(this)}
                        >
                          Upload
                        </Button>
                      </Col>
                    ) : (
                      <Col md="1">
                        <Button
                          color="primary"
                          onClick={this.onValidate.bind(this)}
                        >
                          Validate
                        </Button>
                      </Col>
                    )}
                    <Col md="1">
                      <Button
                         color="secondary"
                        onClick={this.onReset.bind(this)}
                      >
                        Reset
                      </Button>
                    </Col>
                  </FormGroup>
                  {this.state.showDataTable ? (
                    <div>
                      <h5>Your Uploaded File : </h5>
                      <BootstrapTable
                        ref="table"
                        data={this.state.CSVdata}
                        pagination={true}
                        //search={true}
                        options={sortingOptions}
                        hover={true}
                        ScrollPosition="Bottom"
                      >
                        <TableHeaderColumn
                          dataField="email"
                          headerAlign="left"
                          isKey
                          hidden
                        >
                          email
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="firstName"
                          headerAlign="left"
                          dataSort={true}
                          width={20}
                        >
                          First Name
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="lastName"
                          headerAlign="left"
                          dataSort={true}
                          width={20}
                        >
                          Last Name
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          width={30}
                          dataField="email"
                          headerAlign="left"
                          dataSort={true}
                        >
                          Email
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          width={20}
                          dataField="contact"
                          headerAlign="left"
                          dataSort={true}
                        >
                          Contact
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          width={20}
                          dataField="profileName"
                          headerAlign="left"
                          dataSort={true}
                        >
                          Profile Name
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          width={20}
                          dataField="briefInfo"
                          headerAlign="left"
                          dataSort={true}
                        >
                          Brief Info
                        </TableHeaderColumn>
                        {this.state.bulkUploadError ? (
                          <TableHeaderColumn
                            tdStyle={trStyle}
                            dataField="errorMessage"
                            headerAlign="left"
                            width={50}
                          >
                            ErrorMessage
                          </TableHeaderColumn>
                        ) : null}
                      </BootstrapTable>
                      <hr />
                    </div>
                  ) : null}
                   <ToastContainer autoClose={1000} />
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
    attendeeList : state.bulkUpload.attendeeList,
    bulkUploadError : state.bulkUpload.bulkUploadError,
    bulkValidationError : state.bulkUpload.bulkValidationError,
    eventList: state.event.eventList
  };
};

const mapDispatchToProps = dispatch => {
  return {
     bulkUploadAttendee: (attendees, eventId) =>
      dispatch(actions.bulkUploadAttendee(attendees, eventId)),
     bulkValidateAttendee: (attendees) =>
      dispatch(actions.bulkValidateAttendee(attendees)),
     getEvents: () => dispatch(actions.getEvents())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendeeBulkUpload);

