import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Table } from 'reactstrap';

import moment from 'moment';
import { Event as CalEvent } from 'microsoft-graph';
import { config } from './Config';
import { getEvents } from './GraphService';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';

interface EventdetailState {
  //calevent: CalEvent;
  //caleventId: String;
  caleventId: any;
  
}

// Helper function to format Graph date/time
function formatDateTime(dateTime: string | undefined) {
  if (dateTime !== undefined) {
    return moment.utc(dateTime).local().format('DD/MM/YYYY hh:mm');
  }
}

class Eventdetail extends React.Component<AuthComponentProps, EventdetailState> {
//class Eventdetail extends React.Component {
    constructor(props: any) {
      super(props);

      //const { caleventId } = props.match.params.id;
      //const { caleventId } = this.props.children.;

      //console.log("props:"+JSON.stringify(props));
      //console.log("this.props:"+JSON.stringify(this.props));

      //console.log("this.props.history"+JSON.stringify(this.props. ));

      //console.log("id:"+props.match.params.id);
     
    
      this.state = {
        caleventId:null
      };

      if (props.match.params.id){
      this.state = {
        caleventId:props.match.params.id
      };
      };
      console.log("id:"+this.state.caleventId);
      
  
    }
  
    componentDidMount () {
      
      
          
    }

  render() {
    
    return (
      <div>
        <h1>Event Detail</h1>
        </div>
    );
  }
}

//export default withAuthProvider;
export default withAuthProvider(Eventdetail);