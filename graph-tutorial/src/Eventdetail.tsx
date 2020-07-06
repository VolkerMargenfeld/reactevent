import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Table } from 'reactstrap';
import useForm from 'react-hooks-useform';

import moment from 'moment';
import { Event as CalEvent, Attendee, Location as CalLocation, ItemBody as CalItemBody } from 'microsoft-graph';
import { config } from './Config';
import { getEvents, getCalEvent, updateCalEvent} from './GraphService';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import ErrorMessage from './ErrorMessage';

interface EventdetailState {
  //calevent: CalEvent;
  //caleventId: String;
  caleventId: any;
  calevent: CalEvent;
  newlocation: any;
}

// Helper function to format Graph date/time
function formatDateTime(dateTime: string | undefined) {
  if (dateTime !== undefined) {
    return moment.utc(dateTime).local().format('DD/MM/YYYY HH:mm');
  }
}

class Eventdetail extends React.Component<AuthComponentProps, EventdetailState> {
//class Eventdetail extends React.Component {
    constructor(props: any) {
      super(props);
      
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      //const { caleventId } = props.match.params.id;
      //const { caleventId } = this.props.children.;

      //console.log("props:"+JSON.stringify(props));
      //console.log("this.props:"+JSON.stringify(this.props));

      //console.log("this.props.history"+JSON.stringify(this.props. ));

      //console.log("id:"+props.match.params.id);
     
    
      this.state = {
        caleventId:null,
        calevent:{},
        newlocation:null
      };

      if (props.match.params.id){
      this.state = {
        caleventId:props.match.params.id,
        calevent:{},
        newlocation:null
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
        this.setState({newlocation: this.state.calevent.location?.displayName});
        
        console.log("Calevent (State):"+JSON.stringify(this.state.calevent));
      }
      catch(err) {
        this.props.setError('ERROR', JSON.stringify(err));
      }
          
    }

    async updateEvent () {
      
      console.log("update Event");
      try {
        // Get the user's access token
        var accessToken = await this.props.getAccessToken(config.scopes);
        // Get the user's events

        //const covidMessage:string ="&#x3C;html&#x3E;&#x3C;head&#x3E;&#x3C;meta http-equiv=&#x22;Content-Type&#x22; content=&#x22;text/html; charset=utf-8&#x22;&#x3E;&#x3C;meta name=&#x22;Generator&#x22; content=&#x22;Microsoft Exchange Server&#x22;&#x3E;&#x3C;!-- converted from rtf --&#x3E;&#x3C;style&#x3E;&#x3C;!-- .EmailQuote { margin-left: 1pt; padding-left: 4pt; border-left: #800000 2px solid; } --&#x3E;&#x3C;/style&#x3E;&#x3C;/head&#x3E;&#x3C;body&#x3E;&#x3C;font face=&#x22;Calibri&#x22; size=&#x22;4&#x22;&#x3E;&#x3C;span style=&#x22;font-size:14pt;&#x22;&#x3E;&#x3C;div&#x3E;&#x3C;font color=&#x22;red&#x22;&#x3E;Hinweis: Covid-19 Schutz-Ma&#xDF;nahme&#x3C;/font&#x3E;&#x3C;/div&#x3E;&#x3C;div&#x3E;&#x3C;font color=&#x22;red&#x22;&#x3E;Meeting d&#xFC;rfen maximal 60 Minuten dauern &#x2013; anschlie&#xDF;end muss der Raum f&#xFC;r 60 Minuten ohne Teilnehmer bel&#xFC;ftet werden!&#x3C;/font&#x3E;&#x3C;/div&#x3E;&#x3C;div&#x3E;&#x3C;font color=&#x22;red&#x22;&#x3E;Dieser Hinweis darf nicht gel&#xF6;scht werden &#x2013; Corporate Security!&#x3C;/font&#x3E;&#x3C;/div&#x3E;&#x3C;div&#x3E;&#x3C;font size=&#x22;2&#x22;&#x3E;&#x3C;span style=&#x22;font-size:11pt;&#x22;&#x3E;*********************&#x3C;/span&#x3E;&#x3C;/font&#x3E;&#x3C;/div&#x3E;&#x3C;div&#x3E;&#x3C;font size=&#x22;2&#x22;&#x3E;&#x3C;span style=&#x22;font-size:11pt;&#x22;&#x3E;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/font&#x3E;&#x3C;/div&#x3E;&#x3C;div&#x3E;&#x3C;font size=&#x22;2&#x22;&#x3E;&#x3C;span style=&#x22;font-size:11pt;&#x22;&#x3E;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/font&#x3E;&#x3C;/div&#x3E;&#x3C;/span&#x3E;&#x3C;/font&#x3E;&#x3C;/body&#x3E;&#x3C;/html&#x3E;";

        const covidMessage:string ='<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="Generator" content="Microsoft Exchange Server"><!-- converted from rtf --><style><!-- .EmailQuote { margin-left: 1pt; padding-left: 4pt; border-left: #800000 2px solid; } --></style></head><body><font face="Calibri" size="4"><span style="font-size:14pt;"><div><font color="red">Hinweis: Covid-19 Schutz-Maßnahme</font></div><div><font color="red">Meeting dürfen maximal 60 Minuten dauern – anschließend muss der Raum für 60 Minuten ohne Teilnehmer belüftet werden!</font></div><div><font color="red">Dieser Hinweis darf nicht gelöscht werden – Corporate Security!</font></div><div><font size="2"><span style="font-size:11pt;">*********************</span></font></div><div><font size="2"><span style="font-size:11pt;">&nbsp;</span></font></div><div><font size="2"><span style="font-size:11pt;">&nbsp;</span></font></div></span></font></body></html>';
        
        //const covidMessage:string ='<font face="Calibri" size="4"><span style="font-size:14pt;"><div><font color="red">Hinweis: Covid-19 Schutz-Maßnahme</font></div><div><font color="red">Meeting dürfen maximal 60 Minuten dauern – anschließend muss der Raum für 60 Minuten ohne Teilnehmer belüftet werden!</font></div><div><font color="red">Dieser Hinweis darf nicht gelöscht werden – Corporate Security!</font></div><div><font size="2"><span style="font-size:11pt;">*********************</span></font></div><div><font size="2"><span style="font-size:11pt;">&nbsp;</span></font></div><div><font size="2"><span style="font-size:11pt;">&nbsp;</span></font></div></span></font>';
        
        //var changeCalLocation: CalLocation = {
        //  displayName:"09.01.01"
        //}
        console.log("Calevent (Content type):"+this.state.calevent.body?.contentType);
        console.log("Calevent (Content):"+this.state.calevent.body?.content);

        var changeBody: CalItemBody = {
          content:covidMessage,
          contentType:'html'
        }
    

        var changeCalLocation: CalLocation = {
          displayName:this.state.newlocation
        }

        var changeCalEvent: CalEvent = {
          //subject:"Hallo",
          location:changeCalLocation,
          body:changeBody
                 
        }


        //console.log("changeCalEvent local: "+changeCalEvent.subject);
        //console.log("changeCalEvent local: "+JSON.stringify(changeCalEvent));

        //changeCalEvent.subject = "Volker";
        //changeCalEvent.isAllDay = false;
        //changeCalEvent.location?.displayName = 

        
        //console.log("changeCalEvent local: " + " Room: "+ changeCalEvent.location?.displayName);
        // changeCalEvent.location?.displayName = "01.06.003";
        //changeCalEvent.location?.displayName

        console.log("changeCalEvent local: "+JSON.stringify(changeCalEvent));



        var result = await updateCalEvent(accessToken,this.state.caleventId,changeCalEvent);
        
        
        console.log("updateCalEvent (result):"+JSON.stringify(result));
      }
      catch(err) {
        this.props.setError('ERROR', JSON.stringify(err));
      }
          
    }
    
    handleChange(event:any) {
      //console.log("handleEvent"+JSON.stringify(event.target.value));
      this.setState({newlocation: event.target.value});
    }
  
    handleSubmit(event:any) {
      //console.log('A name was submitted: ' + this.state.newlocation);
      event.preventDefault();
      this.updateEvent();
    }
   
    

  render() {
    

    //console.log("Calevent (Content type):"+this.state.calevent.body?.contentType);
    //console.log("Calevent (Content):"+this.state.calevent.body?.content);
    /*
    onlineMeetingUrl:{JSON.stringify(this.state.calevent.onlineMeetingUrl)}<br/>
        onlineMeetingUrl:{this.state.calevent.onlineMeetingUrl}<br/>
        // DE DUS - 09.02.001 (MTR)	resource	mtrdedus0902001@metronom.com
        */
       
       
/*
       console.log("Calevent (locstion):"+JSON.stringify(this.state.calevent.location?.displayName));
       console.log("Calevent (locstionType):"+JSON.stringify(this.state.calevent.location?.locationType));
       console.log("Calevent (locationUri):"+JSON.stringify(this.state.calevent.location?.locationUri ));
       console.log("Calevent (type):"+JSON.stringify(this.state.calevent.type ));
       //console.log("Calevent (OnlineMeetingInfo):"+JSON.stringify(this.state.calevent.OnlineMeetingInfo? ));
       console.log("Calevent (OnlineMeetingInfo):"+JSON.stringify(this.state.calevent.onlineMeetingUrl));
       console.log("Calevent (seriesMasterId):"+JSON.stringify(this.state.calevent.seriesMasterId ));
       console.log("Calevent (attendees):"+JSON.stringify(this.state.calevent.attendees));
       this.state.calevent.attendees?.map(
        function(attendee: Attendee){
          console.log("Calevent (attendee):"+JSON.stringify(attendee));
          console.log("Calevent (attendee):"+JSON.stringify(attendee.emailAddress?.name));
          console.log("Calevent (attendee):"+JSON.stringify(attendee.emailAddress?.address));
          
        }
       )
*/
       //var newloc = this.state.newlocation;

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
        
        <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.newlocation} onChange={this.handleChange} />
        
        </label>
        <input type="submit" value="Submit" />
      </form>

      </div>
    );
  }
}

//export default withAuthProvider;
export default withAuthProvider(Eventdetail);

/*
<form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Location" name="newlocation" ref={register} />
        {ErrorMessage.newlocation && <p>{errors.newlocation.message}</p>}
        <input type="submit" />
        </form>
        */
// {this.state.newlocation