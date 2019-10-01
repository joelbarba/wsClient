import { Component } from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public wsUrl = 'ws://localhost:8001';
  public status = 0; // 0=disconnected, 1=connected
  public ws$: WebSocketSubject<any>;
  public logs: Array<{ time, dir, msg }> = [];
  public msgToSend = `{ command: 'login', data: { user: 'joel' }}`;

  constructor() {}

  connectWS() {
    this.ws$ = webSocket(this.wsUrl); // https://rxjs-dev.firebaseapp.com/api/webSocket/webSocket
    this.ws$.subscribe(
      msg => {
        console.log(msg);
        this.addLog('IN', msg);
      },
      err => {
        this.addLog('ERR', 'Connection lost ' + err);
        this.disconnectWS();
      }
    );
    console.log('Client Connected');
    this.status = 1;
    this.addLog('-', 'Connected');
  }

  disconnectWS() {
    if (this.ws$) {
      this.ws$.complete();
      console.log('Client Disconnected');
      this.addLog('-', 'Disconnected');
    }
    this.status = 0;
  }

  sendMsg() {
    if (this.ws$ && this.status === 1) {
      this.addLog('OUT', this.msgToSend);
      this.ws$.next(this.msgToSend);
    }
  }

  addLog(dir, msg) {
    const now = new Date();
    const time = now.toDateString() + ' ' + now.toTimeString().split('GMT')[0];
    this.logs.unshift({ time, dir, msg });
  }


}
