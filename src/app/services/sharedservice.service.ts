import {Injectable, Output, EventEmitter} from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedserviceService {
  
    private subject = new Subject<any>();
    private Qsubject = new Subject<any>();
    private ShowAnswer = new Subject<any>();


    sendData(data: any) {
        this.subject.next({ data: data });
    }

    clearData() {
        this.subject.next();
    }

    getData(): Observable<any> {
        return this.subject.asObservable();
    }

    setShowAnsEnabled(status:any){
        this.ShowAnswer.next({data:status});
    }

    getShowAnsEnabled(){
        return this.ShowAnswer.asObservable();
    }
    // setCurrentQuestion(Qid: any){
    //     this.Qsubject.next({ Qid: Qid });
    // }

    // getCurrentQuestion(): Observable<any> {
    //     return this.Qsubject.asObservable();
    // }


}
