import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { globalVariables } from './constants';
import routlink from "./routeimg.svg"
import "./App.css"


class SearchPopup extends React.Component {

  render() {
    const propsnow = this.props;
    
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <center><u><h2>Drone Route Details</h2></u>

            <p className='popuptext'>
              <u><b>Drone Opted:</b></u> <br/>
              Drone ID: { null==propsnow.droneDetails ? "" : propsnow.droneDetails.droneId } <br/>
              Drone Station ID: { null==propsnow.droneDetails ? "" : propsnow.droneDetails.droneStationId } <br/>
              Drone Staion Address: { null==propsnow.droneDetails ? "" : propsnow.droneDetails.droneStationAddress } <br/>
              Drone Station Latitude: { null==propsnow.droneDetails ? "" : propsnow.droneDetails.droneStationLatitude } <br/>
              Drone Station Longitude: { null==propsnow.droneDetails ? "" : propsnow.droneDetails.droneStationLongitude } <br/>
              Drone Speed (Kmph): { null==propsnow.droneDetails ? "" : propsnow.droneDetails.droneSpeedKmph } <br/><br/>

              <u><b>Store Opted:</b></u> <br/>
              Store ID : { null==propsnow.storeDetails ? "" : propsnow.storeDetails.storeId } <br/>
              Store Name : { null==propsnow.storeDetails ? "" : propsnow.storeDetails.storeName } <br/>
              Store Address : { null==propsnow.storeDetails ? "" : propsnow.storeDetails.storeAddress } <br/>
              Store Latitude : { null==propsnow.storeDetails ? "" : propsnow.storeDetails.storeLatitude } <br/>
              Store Longitude : { null==propsnow.storeDetails ? "" : propsnow.storeDetails.storeLongitude } <br/><br/>
              <u><b>Other Details:</b></u> <br/>
              Station To Store Distance: {this.props.distanceStationStore}<br/>
              Store to Customer Distance: {this.props.distanceStoreCustomer}<br/>
              Total Distance: {this.props.totalDistance}<br/>
              Total Time: {this.props.totalTime}
            </p>
            <button onClick={this.props.closePopup}>OK</button>
          </center>
        </div>
      </div>
    );
  }
}

export default class CustomerInfo extends Component {

  constructor(props){
    super(props);
    this.state = {
      customerlist : [],
      showPopup: false,
      routResults : []
    }
    this.togglePopup = this.togglePopup.bind(this);
  }

  //Function called during loading of compnent
  //Used for querying micro service and get data
  componentWillMount(){
    this.getCustomerList();    
  }

  //function for managing pop-up
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  //get route details from server
  getRouteResult(selectedRow){
    fetch(globalVariables.ROUTE_PLAN_URL , { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"customerId":selectedRow.customerId})               
      })
      .then( (res) => {
        return res.json();
      })
      .then(
        (result) => {
          
          this.setState({
            routResults : result
        });
         
        },
        (error) => {
          this.setState({
            errorDesc : error
          });
        }
      );
  }

  //get customer details during loading
  getCustomerList(){
    fetch(globalVariables.CUSTOMERINFO_URL , { 
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
            customerlist: result
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
      var customerData = this.state.customerlist ;
      var finalCustomerData = [];
      customerData.forEach((rec) => {        
          var tempCustRec = {
            customerId : "",
            customerName : "",
            customerAddress : "",
            customerLongitude : "",
            customerLatitude : "",
            routaction : ""
          };

          tempCustRec.customerId = rec.customerId;     
          tempCustRec.customerName = rec.customerName;
          tempCustRec.customerAddress = rec.customerAddress;
          tempCustRec.customerLongitude = rec.customerLongitude;
          tempCustRec.customerLatitude = rec.customerLatitude;
          tempCustRec.routaction=<img src={routlink} alt="searchlogo"/>;

        finalCustomerData.push(tempCustRec);
      });

    return (
      <div>
        <ReactTable
          data={ finalCustomerData }
          columns={[
            {
              Header: "Customer Information",
              columns: [
                {
                  Header: "Customer ID",
                  accessor: "customerId"
                },
                {
                  Header: "Customer Name",
                  accessor: "customerName"                  
                },
                {
                  Header: "Customer Address",
                  accessor: "customerAddress"                  
                },
                {
                  Header: "Customer Longitude",
                  accessor: "customerLongitude"                  
                },
                {
                  Header: "Customer Latitude",
                  accessor: "customerLatitude"                  
                },
                {
                  Header: "Delivery Drone Search",
                  accessor: "routaction"                
                }
              ]
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"

          getTdProps={(state, rowInfo, column, instance) => {
            return {
                onClick: (e, handleOriginal) => {
                
                  this.getRouteResult(rowInfo.original);

                  this.togglePopup();

                  //console.log('A Td Element was clicked!')
                  //console.log('it produced this event:', e)
                  //console.log('It was in this column:', column)
                  //console.log('It was in this row:', rowInfo.original)
                  //console.log('It was in this table instance:', instance)
          
                  // IMPORTANT! React-Table uses onClick internally to trigger
                  // events like expanding SubComponents and pivots.
                  // By default a custom 'onClick' handler will override this functionality.
                  // If you want to fire the original onClick handler, call the
                  // 'handleOriginal' function.
                  if (handleOriginal) {
                    handleOriginal()
                }
              }
            }
          }}

        />
        <br />
        {this.state.showPopup ? 
          <SearchPopup
            droneDetails={this.state.routResults.droneInfo}
            storeDetails={this.state.routResults.storeInfo}
            distanceStationStore={this.state.routResults.distanceStationStore}
            distanceStoreCustomer={this.state.routResults.distanceStoreCustomer}
            totalDistance={this.state.routResults.totalDistance}
            totalTime={this.state.routResults.totalTime}
            closePopup={this.togglePopup.bind(this)}
          />
          : null
        }
      </div>

    );
  }
}


