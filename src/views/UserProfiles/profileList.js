import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import CardLayout from "../../components/CardLayout/";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Col, FormGroup, Button } from "reactstrap";
import { Link } from "react-router-dom";
import Select from "react-select";

class profileList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      eventValue: ""
    };
  }
  componentDidMount() {
    this.props.getProfiles();
    this.props.getEvents();
  }

  handleEventSelectChange(value) {
    let eventValue = value,
      profiles = [];
    this.setState({
      eventValue: eventValue
    });

    this.props.profiles.forEach(profile => {
      if (profile.event._id === eventValue)
        profiles.push({ id: profile._id, profileName: profile.profileName });
    });
    this.setState({
      profiles: profiles
    });
  }

  deleteProfile(profileId) {
    var x = confirm("Are you sure you want to delete?");
    if (x) {
      this.props.deleteProfile(profileId);
    } else return false;
  }

  onDeleteProfile(cell, row) {
    let componentRef = this;
    return (
      <Link to={this} onClick={() => componentRef.deleteProfile(row.id)}>
        <i class="fa fa-trash" />
      </Link>
    );
  }

  onEditProfile(cell, row) {
    let componentRef = this;
    return (
      <Link to={`${componentRef.props.match.url}/profileForm/${row.id}`}>
        <i className="fa fa-pencil" />
      </Link>
    );
  }
  render() {
    const eventList = this.props.eventList;
    const { eventValue } = this.state;

    const sortingOptions = {
      defaultSortName: "profileName",
      defaultSortOrder: "asc",
      sizePerPageList: [
        {
          text: "250",
          value: 250
        },
        {
          text: "500",
          value: 500
        },
        {
          text: "1000",
          value: 1000
        },
        {
          text: "All",
          value: this.state.profiles.length
        }
      ],
      sizePerPage: 250
    };
    return (
      <div>
        <FormGroup row>
          <Col xs="12" md="3">
            <Link to={`${this.props.match.url}/profileForm`}>
              <Button type="button" color="primary" size="small">
                {" "}
                <i className="fa fa-plus" />
                Add Profile{" "}
              </Button>
            </Link>
          </Col>
        </FormGroup>
        <CardLayout name="Profile List">
          <br />
          <FormGroup row>
            <Col xs="12" md="3">
              <Select
                placeholder="Select Event Name"
                value={eventValue}
                options={eventList}
                simpleValue
                onChange={this.handleEventSelectChange.bind(this)}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <BootstrapTable
              ref="table"
              data={this.state.profiles}
              pagination={true}
              search={true}
              options={sortingOptions}
              exportCSV={true}
            >
              <TableHeaderColumn dataField="id" headerAlign="left" isKey hidden>
                Id
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="profileName"
                headerAlign="left"
                width="100"
                csvHeader="Profile Name"
              >
                Profile Name
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="delete"
                dataFormat={this.onDeleteProfile.bind(this)}
                headerAlign="left"
                width="30"
                export={false}
              />
              <TableHeaderColumn
                dataField="edit"
                dataFormat={this.onEditProfile.bind(this)}
                headerAlign="left"
                width="30"
                export={false}
              />
            </BootstrapTable>
          </FormGroup>
        </CardLayout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profiles: state.profile.profiles,
    eventList: state.event.eventList
  };
};

const matchDispatchToProps = dispatch => {
  return {
    getProfiles: () => dispatch(actions.getProfiles()),
    getEvents: () => dispatch(actions.getEvents()),
    deleteProfile: profileId => dispatch(actions.deleteProfile(profileId))
  };
};
export default connect(
  mapStateToProps,
  matchDispatchToProps
)(profileList);
