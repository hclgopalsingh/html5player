import {Injectable, Output, EventEmitter} from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedserviceService {
  
    private subject = new Subject<any>();
    private ShowAnswer = new Subject<any>();
    private IsVOPlaying = new Subject<any>();
    private AageyBadhe = new Subject<any>();
    private moveNextSubject = new Subject<any>();
    private isAageyBadhe = new Subject<any>();
    private isTimerActive = new Subject<any>();


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
  
    setVoplayingStatus(status:any){
        this.IsVOPlaying.next({data:status});
    }

    getVoPlayingStatus(){
       return this.IsVOPlaying.asObservable();
    }


    setLastQuesAageyBadheStatus(status:any){
        this.AageyBadhe.next({data:status});
    }

    getLastQuesAageyBadheStatus(){
       return this.AageyBadhe.asObservable();
    }

    setIsAggeyBadheClicked(status:any){
        this.isAageyBadhe.next({data:status});
    }

    getIsAggeyBadheClicked(){
        return this.isAageyBadhe.asObservable();
    }

    setTimeOnLastQues(Questimer:any){
        this.isTimerActive.next({data:Questimer});
    }

    getTimerOnLastQues(){
        return this.isTimerActive.asObservable();
    }
    public moveNext(){
        this.moveNextSubject.next();
      }

    get moveNextNotification(){
        return this.moveNextSubject.asObservable();
      }








      
}
