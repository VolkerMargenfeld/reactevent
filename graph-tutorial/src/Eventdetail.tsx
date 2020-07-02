import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Table } from 'reactstrap';

import moment from 'moment';
import { Event as CalEvent, Attendee } from 'microsoft-graph';
import { config } from './Config';
import { getEvents, getCalEvent} from './GraphService';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';

interface EventdetailState {
  //calevent: CalEvent;
  //caleventId: String;
  caleventId: any;
  calevent: CalEvent;
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
        caleventId:null,
        calevent:{}
      };

      if (props.match.params.id){
      this.state = {
        caleventId:props.match.params.id,
        calevent:{}
      };
      };
      console.log("id:"+this.state.caleventId);
      
  
    }
  
    async componentDidMount () {
      
      try {
        // Get the user's access token
        var accessToken = await this.props.getAccessToken(config.scopes);
        // Get the user's events
        var tempcalevent = await getCalEvent(accessToken,this.state.caleventId);
        // Update the array of events in state
        // console.log(events.value);
        // this.props.setError('ERROR', events.value);
        //console.log("Calevent:"+ JSON.stringify(tempcalevent));
        this.setState({calevent: tempcalevent});
        console.log("Calevent (State):"+JSON.stringify(this.state.calevent));
      }
      catch(err) {
        this.props.setError('ERROR', JSON.stringify(err));
      }
          
    }

  render() {
    
    /*
    onlineMeetingUrl:{JSON.stringify(this.state.calevent.onlineMeetingUrl)}<br/>
        onlineMeetingUrl:{this.state.calevent.onlineMeetingUrl}<br/>
        */
       console.log("Calevent (locstion):"+JSON.stringify(this.state.calevent.location?.displayName));
       console.log("Calevent (locstionType):"+JSON.stringify(this.state.calevent.location?.locationType));
       console.log("Calevent (locationUri):"+JSON.stringify(this.state.calevent.location?.locationUri ));
       console.log("Calevent (type):"+JSON.stringify(this.state.calevent.type ));
       //console.log("Calevent (OnlineMeetingInfo):"+JSON.stringify(this.state.calevent.OnlineMeetingInfo? ));
       console.log("Calevent (seriesMasterId):"+JSON.stringify(this.state.calevent.seriesMasterId ));
       console.log("Calevent (attendees):"+JSON.stringify(this.state.calevent.attendees));
       this.state.calevent.attendees?.map(
        function(attendee: Attendee){
          console.log("Calevent (attendee):"+JSON.stringify(attendee));
          console.log("Calevent (attendee):"+JSON.stringify(attendee.emailAddress?.name));
          console.log("Calevent (attendee):"+JSON.stringify(attendee.emailAddress?.address));
          
        }
       )

    return (
      <div>
        <h1>Event Detail</h1>
        Subject:{this.state.calevent.subject}<br/>
        Organizer:{this.state.calevent.organizer?.emailAddress?.name}<br/>
        Location:{this.state.calevent.location?.displayName}<br/>
        Start:{formatDateTime(this.state.calevent.start?.dateTime)}<br/>
        End:{formatDateTime(this.state.calevent.end?.dateTime)}<br/>
        isOrganizer:{JSON.stringify(this.state.calevent.isOrganizer)}<br/>
        isAllDay:{JSON.stringify(this.state.calevent.isAllDay)}<br/>
        type:{this.state.calevent.type}<br/>
        <Table>
          <thead>
          attendees
            <tr>
            
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {this.state.calevent.attendees?.map(
        function(attendee: Attendee){
          return(
          <tr>
          <td>{attendee.emailAddress?.name}</td>
          <td>{attendee.type}</td>
          <td>{attendee.emailAddress?.address}</td>
          </tr>
          )



            })}
          </tbody>
        </Table>

      </div>
    );
  }
}

//export default withAuthProvider;
export default withAuthProvider(Eventdetail);