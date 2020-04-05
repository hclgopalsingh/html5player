import {Injectable} from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SharedserviceService {
  
    private subject = new Subject<any>();

    sendData(data: any) {
        this.subject.next({ data: data });
    }

    clearData() {
        this.subject.next();
    }

    getData(): Observable<any> {
        return this.subject.asObservable();
    }



}
