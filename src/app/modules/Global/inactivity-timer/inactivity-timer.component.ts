import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';

@Component({
  selector: 'checkIdol',
  template: '<ng-content></ng-content>'
})
export class InactivityTimerComponent implements OnDestroy, OnInit {
  minutesDisplay = 0;
  secondsDisplay = 0;
  mt = 0;
  st = 0;
  lastQuesTimer: number = 5;
  moveNextQuesTimer: number = 5;
  uttarDikhayeinTimer: any = 5;
  unsubscribe$: Subject<void> = new Subject();
  subscribeOnQChange: Subject<void> = new Subject();
  timerUttarDikhayein: Subscription;
  timerNextQues: Subscription;
  timerNextSegment: Subscription;
  currentRunningTimer: string = "";
  tempTimer: string = "";
  EVA: boolean = false;
  subscription: Subscription;
  Template: any;

  constructor(private appModel: ApplicationmodelService, private sharedService: SharedserviceService) {

  }

  ngOnInit() {
    this.appModel.getPostVOActs().subscribe((flag) => {
      if (flag == false) {
        this.resetTimerUttarDikhayein();
      } else {
        this.resetAllTimer();
      }
    })
    this.appModel.userActionOccured.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      if (this.timerUttarDikhayein && this.currentRunningTimer == "uttarDikhayein") {
        this.unsubscribeTimer(this.timerUttarDikhayein);
        this.resetTimerUttarDikhayein();
      }
      if (this.timerNextSegment && this.currentRunningTimer == "nextSegment") {
        this.unsubscribeTimer(this.timerNextSegment);
        this.resetTimerForNextSeg();
      }

      if (this.timerNextQues && this.currentRunningTimer == "nextQuestion") {
        this.unsubscribeTimer(this.timerNextQues);
        this.resetTimerforNextQue();
      }
      /* if(this.appModel.isLastSectionInCollection){
         this.resetTimerOnLastQues();
       }*/
    })
    /*
       dont delete move next segment
        this.appModel.moveNextNotification.subscribe(()=>{
          this.resetTimerForNextSeg();
        })
        */
    this.subscription = this.sharedService.getData().subscribe(data => {
      this.Template = data.data.TemplateType;
      if (this.Template === 'EVA') {
        this.EVA = true;
      } else {
        this.EVA = false;
      }

    });
    this.sharedService.moveNextNotification.subscribe(() => {
      this.resetTimerForNextSeg();
    });
    this.appModel.moveNewQues.subscribe(() => {
      if (this.timerNextQues) {
        this.unsubscribeTimer(this.timerNextQues);
      }
      this.resetTimerforNextQue();
    })

    this.appModel.unsubscribeTimers.subscribe(() => {
      this.tempTimer = this.currentRunningTimer;
      this.currentRunningTimer = "";
      this.resetAllTimer();
    })

    this.appModel.preRunnintTimer.subscribe(() => {
      this.currentRunningTimer = this.tempTimer;
    })


    //check later
    /*
      this.appModel.resetTimer.subscribe(()=>{
      this.lastQuesTimer = 5;
      this.uttarDikhayeinTimer = 5;
   })
    */

    /*
    this.appModel.userActionOccured.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      console.log("user click action happend.......");
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.uttarDikhayeinTimer = 1*60;
      this.resetTimerForNextSection();
        if(this.appModel.isLastSectionInCollection){
            if (this.timerSubscriptionT) {
                this.timerSubscriptionT.unsubscribe();
            }
            this.resetTimerOnLastQues();
        }
    }).unsubscribe();*/
    /*
      this.appModel.resetTimer.subscribe(()=>{
        this.resetTimerOnLastQues();
        this.resetTimerForNextSection();
      })*/
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  resetAllTimer() {
    if (this.timerUttarDikhayein) {
      this.unsubscribeTimer(this.timerUttarDikhayein);
    }
    if (this.timerNextQues) {
      this.unsubscribeTimer(this.timerNextQues);
    }
    if (this.timerNextSegment) {
      this.unsubscribeTimer(this.timerNextSegment);
    }
  }

  resetTimerUttarDikhayein() {
    this.resetAllTimer();
    this.currentRunningTimer = "uttarDikhayein";
    const interval = 1000;
    const showAnsInterval = this.uttarDikhayeinTimer * 60;
    this.timerUttarDikhayein = timer(0, interval).pipe(
      take(showAnsInterval)
    ).subscribe(value =>
      this.renderuttar((showAnsInterval - +value) * interval),
      err => { },
      () => {
        console.log("show answer after time minute", this.uttarDikhayeinTimer);
        this.appModel.invokeTempSubject("showModal", "auto");
        this.unsubscribeTimer(this.timerUttarDikhayein);
      }
    )
  }

  unsubscribeTimer(timer) {
    timer.unsubscribe();
  }

  resetTimerForNextSeg() {
    this.resetAllTimer();
    this.currentRunningTimer = "nextSegment";
    const interval = 1000;
    const moveNxtSegInterval = this.lastQuesTimer * 60;
    this.timerNextSegment = timer(0, interval).pipe(
      take(moveNxtSegInterval)
    ).subscribe(value =>
      this.renderNextSeg((moveNxtSegInterval - +value) * interval),
      err => { },
      () => {
        this.appModel.logOutUser("move next segment#######");
        this.appModel.invokeTempSubject("moveNextSeg", "");
        console.log("next segment after minute  ", this.lastQuesTimer);
        this.unsubscribeTimer(this.timerNextSegment);
      }
    )
  }

  resetTimerforNextQue() {
    this.resetAllTimer();
    this.currentRunningTimer = "nextQuestion";
    const interval = 1000;
    if (this.EVA) {
      this.moveNextQuesTimer = 1 / 6;
    }
    const moveNextQues = this.moveNextQuesTimer * 60;
    this.timerNextQues = timer(0, interval).pipe(
      take(moveNextQues)
    ).subscribe(value =>
      this.renderNextQ((moveNextQues - +value) * interval),
      err => { },
      () => {
        this.appModel.logOutUser("move next segment#######");
        this.appModel.invokeTempSubject("moveNextQues", "");
        this.appModel.resetBlinkingTimer();
        console.log("move to next question", this.moveNextQuesTimer);
        this.unsubscribeTimer(this.timerNextQues);
      }
    )
  }

  private renderNextQ(timer) {
    console.log("next question timer ", timer / 1000);
  }

  private renderNextSeg(timer) {
    console.log("next segment timer ", timer / 1000);
  }

  private renderuttar(timer) {
    console.log("next uttar timer ", timer / 1000);
  }

  private render(count) {
    this.secondsDisplay = this.getSeconds(count);
    this.minutesDisplay = this.getMinutes(count);
  }

  private renderT(count) {
    this.st = this.getSeconds(count);
    this.mt = this.getMinutes(count);
  }

  private getSeconds(ticks: number) {
    const seconds = ((ticks % 60000) / 1000).toFixed(0);
    return this.pad(seconds);
  }

  private getMinutes(ticks: number) {
    const minutes = Math.floor(ticks / 60000);
    return this.pad(minutes);
  }

  private pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }

}
