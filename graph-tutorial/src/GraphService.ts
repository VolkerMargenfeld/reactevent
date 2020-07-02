// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import moment from 'moment';
// <graphServiceSnippet1>
var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken: string) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done: any) => {
      done(null, accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken: string) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api('/me').get();
  return user;
}
// </graphServiceSnippet1>

// <getEventsSnippet>
export async function getEvents(accessToken: string) {
  const client = getAuthenticatedClient(accessToken);

  var timequery = "startDateTime="+ moment.utc().toISOString() + "&endDateTime=" + moment.utc().add(7, 'd').toISOString();
  //var timequery = "startDateTime="+ "2020-07-01T00:00:00-00:00" + "&endDateTime=" + "2020-07-10T00:00:00-00:00";

  const events = await client
    //.api('/me/events')
    //.api('/me/calendar/calendarView?startDateTime=2020-07-01T00:00:00-00:00&endDateTime=2020-07-10T00:00:00-00:00')
    .api('/me/calendar/calendarView?' + timequery) 
    .select('id,subject,organizer,start,end')
    //.orderby('createdDateTime DESC')
    .orderby('start/dateTime ASC')
    .get();

  return events;
}

export async function getCalEvent(accessToken: string, caleventId: any) {
  const client = getAuthenticatedClient(accessToken);

  var timequery = "startDateTime="+ moment.utc().toISOString() + "&endDateTime=" + moment.utc().add(7, 'd').toISOString();
  //var timequery = "startDateTime="+ "2020-07-01T00:00:00-00:00" + "&endDateTime=" + "2020-07-10T00:00:00-00:00";
console.log("cgraphService-aleventId:"+caleventId);

var query = JSON.stringify(caleventId);

  const calevent = await client
    //.api('/me/events')
    //.api('/me/calendar/calendarView?startDateTime=2020-07-01T00:00:00-00:00&endDateTime=2020-07-10T00:00:00-00:00')
    //.api('/me/calendar/calendarView?' + timequery) 
    .api('/me/events/'+query)
    //.select('id,subject,organizer,start,end')
    //.orderby('createdDateTime DESC')
    //.orderby('start/dateTime ASC')
    .get();

  return calevent;
}
// </getEventsSnippet>
