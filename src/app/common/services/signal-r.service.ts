import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public hubConnection: signalR.HubConnection;

  constructor() { }

  public startConnection = () => {
    debugger;
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('http://localhost:10651/signalr')
                            .build();
    this.hubConnection
      .start()
      .then(() => {
        debugger;
        console.log('Connection started');

        //Add listeners
        this.addListeners();

        // call player ready
        this.call('playerReady', null);

      })
      .catch(err => {
         console.log('Error while starting connection: ' + err);
      })
  }

  private addListeners(){
    this.addTransferChartDataListener();
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      //this.data = data;
      console.log(data);
    });
  }

  call(name: string, value: any[]) {
    console.log('Signal-R service: call - name=', name, 'value=', value);
    if (!value || value.length <= 0) {
      // invoke a server side method
      this.hubConnection.invoke(name).then((data: any[]) => {
        console.log('Signal-R service: call - data=', data);
      });

    } else {
      // invoke a server side method, with parameters
      this.hubConnection.invoke(name, ...value).then((data: any[]) => {
        console.log('Signal-R service: call - data=', data);
      });
    }
  }


}
