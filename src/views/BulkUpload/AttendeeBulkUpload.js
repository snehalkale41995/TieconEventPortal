// import React, { Component } from "react";
// import { connect } from "react-redux";
// import * as actions from "../../store/actions/index";
// import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
// import moment from "moment";
// import Loader from "../../components/Loader/Loader";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import CsvParse from "@vtex/react-csv-parse";
// import { Link } from "react-router-dom";
// import { CSVLink } from "react-csv";

// class AttendeeBulkUpload extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       events: [],
//       loading: true
//     };
//   }
//   componentDidMount() {
//     this.props.getEvents();
//     let compRef = this;
//     setTimeout(function() {
//       compRef.setState({ loading: false });
//     }, 1000);
//   }
//   componentDidUpdate(prevProps, prevState) {
//     if (prevProps.events !== this.props.events) {
//       this.setState({
//         events: this.props.events
//       });
//     }
//   }
//   render() {
//     var ColorCode = "#808587";
//     let today = new Date().setHours(0, 0, 0, 0);
//     if (this.state.loading || this.props.events.length === 0) {
//       //return <Loader loading={this.state.loading} />;
//       return <h1>hello</h1>;
//     } else {
//       return (
//         <div className="animated fadeIn">
//           <div>
//             {this.props.events.map((event, index) => {
//               index % 2 === 0
//                 ? (ColorCode = "#8bc3d7")
//                 : (ColorCode = "#808587");

//               if (today <= new Date(event["endDate"]).setHours(0, 0, 0, 0)) {
//                 return (
//                   <Row key={index} className="justify-content-left">
//                     <Col xs="6">
//                       <Card
//                         className="mx-12"
//                         style={{ backgroundColor: ColorCode }}
//                       >
//                         <CardHeader>
//                           <h3>{event.eventName}</h3>
//                         </CardHeader>
//                         <CardBody
//                           style={{ fontWeight: "bold", fontSize: 20 }}
//                           className="p-8"
//                         >
//                           <Row>
//                             <Col xs="12">
//                               <h5> {event.description} </h5>
//                             </Col>
//                           </Row>
//                           <Row>
//                             <Col xs="12" md="4">
//                               <h5>
//                                 <i className="fa fa-map-marker" /> {event.venue}
//                               </h5>
//                             </Col>
//                           </Row>
//                           <Row>
//                             <Col md="8">
//                               <h5>
//                                 <i className="fa fa-clock-o" />
//                                 {moment(event.startDate).format(
//                                   "DD.MM.YYYY"
//                                 )} -{" "}
//                                 {moment(event.endDate).format("DD.MM.YYYY")}
//                               </h5>
//                             </Col>
//                           </Row>
//                         </CardBody>
//                       </Card>
//                     </Col>
//                     <ToastContainer autoClose={2000} />
//                   </Row>
//                 );
//               }
//             })}
//           </div>
//           {/* <div>
//             <div class="pm-button">
//               <a href="https://www.payumoney.com/paybypayumoney/#/AA5AF4F8AAE527C22E26FA4FB3A0CCAE">
//                 <img src="https://www.payumoney.com/media/images/payby_payumoney/new_buttons/21.png" />
//               </a>
//             </div>{" "}
//           </div> */}
//         </div>
//       );
//     }
//   }
// }
// const mapStateToProps = state => {
//   return {
//     events: state.event.events
//   };
// };
// const mapDispatchToProps = dispatch => {
//   return {
//     getEvents: () => dispatch(actions.getEvents())
//   };
// };
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(AttendeeBulkUpload);

import React, { Component } from "react";
// import CardLayout from "../../components/Cards/CardLayout";
// import InputElement from "../../components/InputElement/InputElement";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import { FormGroup, Col, Button, Label, Input } from "reactstrap";
import CsvParse from "@vtex/react-csv-parse";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import uuid from "uuid";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Loader from "../../components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import * as Toaster from "../../constants/Toaster";

const csvData = [
  [
    "firstName",
    "lastName",
    "email",
    "event",
    // "password",
    "contact",
    "profileName",
    "roleName",
    "briefInfo"
    // "attendeeLabel",
    // "attendeeCount",
    // "profileImageURL",
    // "facebookProfileURL",
    // "linkedinProfileURL",
    // "twitterProfileURL"
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
      bulkUserError: false,
      fileName: "",
      clearCSValue: false,
      csvFileInvalid: false
    };
    this.handleData = this.handleData.bind(this);
  }
  componentDidMount() {
    //this.props.getBulkUploadHistory();
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  }

  handleData(data, file) {
    console.log("data", data);
    if (data.length !== 0) {
      this.setState({
        clearCSValue: false,
        csvFileInvalid: false,
        showDataTable: true,
        CSVdata: data,
        CSVdataTracker: data,
        csvFileRequired: false,
        bulkUserError: false,
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
      bulkUserError: false,
      fileName: "",
      uploadFlag: false,
      csvFileInvalid: false
    });
  }

  onValidate() {
    let attendees = [...this.state.CSVdata];
    let compRef = this;
    if (attendees.length !== 0) {
      this.setState({ loading: true });
      // this.props.bulkValidateattendee(attendees);
      setTimeout(() => {
        let validationError = this.props.bulkUserError;
        let CSVdata = compRef.props.bulkUserData;
        validationError
          ? this.setState({
              loading: false,
              CSVdata: CSVdata,
              bulkUserError: true
            })
          : this.setState({
              loading: false,
              uploadFlag: true,
              bulkUserError: false
            });
      }, 1000);
    } else if (this.state.CSVdataTracker === null) {
      this.setState({ csvFileRequired: true });
    } else {
      this.setState({
        csvFileInvalid: true
      });
    }
    //else if(this.state.CSVdata === null){
    //   this.setState({ csvFileRequired: true });
    // }else{
    //   if (attendees.length === 0 && this.state.clearCSValue) {
    //     this.setState({
    //       csvFileInvalid: true
    //     });
    //   }
    // }

    // else {
    //   if (attendees.length === 0 ) {
    //     this.setState({
    //       csvFileInvalid: true
    //     });
    //   } else {
    //     this.setState({ csvFileRequired: true });
    //   }
    // }
  }

  onSubmit() {
    let attendees = [...this.state.CSVdata];
    //let csvFileRequired = false;
    if (this.state.CSVdataTracker === null) {
      this.setState({ csvFileRequired: true });
    } else if (this.state.CSVdataTracker === []) {
      this.setState({ csvFileInvalid: true });
    }
    if (attendees.length === 0) {
      //csvFileRequired = true;
      this.setState({ csvFileRequired: true });
    }
    let compRef = this;
    if (!this.state.csvFileRequired && !this.state.csvFileInvalid) {
      let guid = uuid.v1(new Date());
      let currentUser = localStorage.getItem("user");
      attendees.forEach(attendee => {
        attendee.BulkUploadId = guid;
        attendee.CreatedOn = new Date();
        attendee.Createdby = currentUser;
        attendee.Active = true;
        attendee.Role = "attendee User";
      });
      this.props.bulkUploadattendee(attendees);
      this.setState({ loading: true });
      setTimeout(() => {
        let message = "";
        compRef.setState({ loading: false });
        compRef.props.attendeeError
          ? (message = "Something went wrong !")
          : (message = "Users uploaded successfully");

        // Toaster.Toaster(message, compRef.props.attendeeError);
        setTimeout(() => {
          if (!compRef.props.attendeeError) {
            compRef.onReset();
            compRef.props.history.push("/attendee/attendeeList");
          }
        }, 1000);
      }, 2000);
    }
  }
  onShowTableFormat() {
    let showTableHeaderFormat = this.state.showTableHeaderFormat;
    this.setState({
      showTableHeaderFormat: !showTableHeaderFormat
    });
  }
  renderShowsTotal() {
    // return <p>Total : {this.props.bulkUploadHistory.length}</p>;
  }
  render() {
    let trStyle = (row, rowIndex) => {
      return { color: "#E00000" };
    };
    const historySortOptions = {
      defaultSortName: "CreatedOn",
      defaultSortOrder: "desc",
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
          value: ""
        }
      ],
      sizePerPage: 5
      //paginationPosition: 'top',
      //paginationShowsTotal: this.props.bulkUploadHistory.length
    };
    const sortingOptions = {
      defaultSortName: "Name",
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
      "event",
      // "password",
      "contact",
      "profileName",
      "roleName",
      "briefInfo"
      // "attendeeLabel",
      // "attendeeCount",
      // "profileImageURL",
      // "facebookProfileURL",
      // "linkedinProfileURL",
      // "twitterProfileURL"
    ];
    const tableFormat = keys.map(key => {
      return <td className="csv-table-border">{key}</td>;
    });

    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <CardLayout name="Bulk Upload Attendee">
        <div className="div-padding">
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
                          this.state.clearCSValue ? this.state.fileName : null
                        }
                        onChange={onChange}
                        required={this.state.csvFileRequired}
                        //invalid={this.state.csvFileInvalid}
                        // blankCSVFile={this.state.csvFileInvalid}
                      />
                    )}
                  />
                  {this.state.csvFileInvalid ? (
                    <div className="help-block" style={{ marginTop: 2 }}>
                      *Blank CSV file cannot be accepted
                    </div>
                  ) : null}
                </Col>
                <Col md="6">
                  <FormGroup row>
                    <Label>Format required for CSV : &nbsp; &nbsp;</Label>
                    <CSVLink filename="_attendeeList.csv" data={csvData}>
                      Download
                    </CSVLink>
                    &nbsp; Or &nbsp;
                    <Link to={this} onClick={this.onShowTableFormat.bind(this)}>
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
                      <tr className="csv-table-border">{tableFormat}</tr>
                    </table>
                    <div style={{ marginTop: 0, color: "red", fontSize: 12 }}>
                      *Please note : Sequence of headers should be exactly same.
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
                  className="theme-positive-btn"
                  onClick={this.onSubmit.bind(this)}
                >
                  Upload
                </Button>
              </Col>
            ) : (
              <Col md="1">
                <Button
                  className="theme-positive-btn"
                  onClick={this.onValidate.bind(this)}
                >
                  Validate
                </Button>
              </Col>
            )}
            <Col md="1">
              <Button
                className="theme-reset-btn"
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
                  Id
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
                  width={30}
                  dataField="event"
                  headerAlign="left"
                >
                  Event
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
                  dataField="roleName"
                  headerAlign="left"
                  dataSort={true}
                >
                  Role Name
                </TableHeaderColumn>
                <TableHeaderColumn
                  width={20}
                  dataField="briefInfo"
                  headerAlign="left"
                  dataSort={true}
                >
                  Brief Info
                </TableHeaderColumn>
                {/* <TableHeaderColumn
                  width={50}
                  dataField="profileImageURL"
                  headerAlign="left"
                  dataSort={true}
                >
                  Profile ImageURL
                </TableHeaderColumn> */}
                {/* <TableHeaderColumn
                  width={50}
                  dataField="facebookProfileURL"
                  headerAlign="left"
                  dataSort={true}
                >
                  Facebook URL
                </TableHeaderColumn>
                <TableHeaderColumn
                  width={50}
                  dataField="linkedinProfileURL"
                  headerAlign="left"
                  dataSort={true}
                >
                  Linkedin URL
                </TableHeaderColumn>
                <TableHeaderColumn
                  width={50}
                  dataField="twitterProfileURL"
                  headerAlign="left"
                  dataSort={true}
                >
                  Twitter URL
                </TableHeaderColumn> */}
                {this.state.bulkUserError ? (
                  <TableHeaderColumn
                    tdStyle={trStyle}
                    dataField="ErrorMessage"
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
        </div>
        <ToastContainer autoClose={1000} />
      </CardLayout>
    );
  }
}
// const mapStateToProps = state => {
//   return {
//     attendeeError: state.attendeeReducer.attendeeError,
//     bulkUploadHistory: state.attendeeReducer.bulkUploadHistory,
//     bulkUserData: state.attendeeReducer.bulkUserData,
//     bulkUserError: state.attendeeReducer.bulkUserError
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     bulkUploadattendee: attendees =>
//       dispatch(actions.bulkUploadattendee(attendees)),
//     getBulkUploadHistory: () => dispatch(actions.getBulkUploadHistory()),
//     bulkValidateattendee: attendees =>
//       dispatch(actions.bulkValidateattendee(attendees))
//   };
// };
// export default connect(mapStateToProps, mapDispatchToProps)(AttendeeBulkUpload);
export default AttendeeBulkUpload;
