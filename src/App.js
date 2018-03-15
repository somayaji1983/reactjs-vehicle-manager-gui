import React, { Component } from 'react';
import DroneInfo from "./DroneInfo";
import CustomerInfo from "./CustomerInfo";
import StoreInfo from "./StoreInfo";
import "./App.css";


export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {      
      errorDesc : null
    }
  }

  render() {
    return (
        <div>
          <div className='rowC'> 
            <DroneInfo/>
            <StoreInfo/>
          </div>         
          <CustomerInfo/>
        </div>     
    );
  }
}



