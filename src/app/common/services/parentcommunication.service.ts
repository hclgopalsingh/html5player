import { Injectable } from '@angular/core';
import { InitializationAPI } from '../initializationapi';
import { InitDataReader } from '../initdatareader';

@Injectable({
  providedIn: 'root'
})
export class ParentcommunicationService {
  private initData: InitializationAPI;
  private listener;
  private success;
  private failure;
  constructor() { }
  setInitData(initData) {
    this.initData = new InitDataReader().read(JSON.parse(initData));
  }
  getInitData() {
    return this.initData;
  }
  loadData(data, listener, success, failure) {
    this.listener = listener;
    this.success = success;
    this.failure = failure;
    this.checkForInitData();
  }

  checkForInitData() {
    if(this.initData) {
      this.dataLoadedSuccess();
    }
    else {
      this.dataLoadedFailure();
    }
  }

  sendData(id: string, data: any) {
    // this.call(id, [JSON.stringify(data)]);
  }

  dataLoadedSuccess() {
    this.success(this.initData);
  }

  dataLoadedFailure() {
    throw new Error('Method not implemented.');
  }
}
