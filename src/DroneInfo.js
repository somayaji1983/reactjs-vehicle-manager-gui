import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { globalVariables } from './constants';

export default class DroneInfo extends Component {

  constructor(props){
    super(props);
    this.state = {
      dronelist : []
    }
  }

  componentWillMount(){
    this.getDroneList();
  }

  getDroneList(){
    fetch(globalVariables.DRONEINFO_URL , { 
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                body: null
      })
      .then( (res) => {
        return res.json();
      })
      .then(
        (result) => {
          this.setState({
            dronelist: result
          });
          
        },
        (error) => {
          this.setState({
            errorDesc : error
          });
        }
      );
  }

  render() {
    const droneData = this.state.dronelist ;
    return (
      <div>
        <ReactTable
          data={ droneData }
          columns={[
            {
              Header: "Drone Infomation",
              columns: [
                {
                  Header: "Drone ID",
                  accessor: "droneId"
                },
                {
                  Header: "Drone Station ID",
                  accessor: "droneStationId"                  
                },
                {
                  Header: "Drone Station Address",
                  accessor: "droneStationAddress"                  
                },
                {
                  Header: "Drone Station Longitude",
                  accessor: "droneStationLongitude"                  
                },
                {
                  Header: "Drone Station Latitude",
                  accessor: "droneStationLatitude"                  
                },
                {
                  Header: "Drone Speed (km/h)",
                  accessor: "droneSpeedKmph"
                }
              ]
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
        <br />
        
      </div>

    );
  }
}


