import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { globalVariables } from './constants';

export default class StoreInfo extends Component {

  constructor(props){
    super(props);
    this.state = {
      storelist : []
    }
  }

  componentWillMount(){
    this.getStoreList();
  }

  getStoreList(){
    fetch(globalVariables.STOREINFO_URL , { 
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
            storelist: result
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
    const storeData = this.state.storelist ;

    return (
      <div>
        <ReactTable
          data={ storeData }
          columns={[
            {
              Header: "Store Infomation",
              columns: [
                {
                  Header: "Store ID",
                  id:"storeId",
                  accessor: "storeId"
                },
                {
                  Header: "Store Name",
                  accessor: "storeName"                  
                },
                {
                  Header: "Store Address",
                  accessor: "storeAddress"                  
                },
                {
                  Header: "StoreLongitude",
                  accessor: "storeLongitude"                  
                },
                {
                  Header: "Store Latitude",
                  accessor: "storeLatitude"                  
                }
              ]
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
          
        />

        
      </div>

    );
  }
}


