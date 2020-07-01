import { CommonloaderService } from './commonloader.service';
import { Content } from './content';
import { ContentCollection } from './contentcollection';
import { DataloaderService } from './dataloader.service';
import { ExternalcommunicationService } from './externalcommunication.service';
import { HttphandlerService } from './httphandler.service';
import { InitializationAPI, Helper, Info } from './initializationapi';
import { DataHandler } from './interfaces/dataHandler';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SharedserviceService } from '../services/sharedservice.service';


declare var $: any;
@Injectable()
export class ApplicationmodelService {
  private externalCommunication: ExternalcommunicationService;
  private dataLoader: DataloaderService;
  private dataHandler: DataHandler;
  private httpHandler: HttphandlerService;
  private initValues: InitializationAPI;
  private currentActive: number; // nugget
  private commonLoader: CommonloaderService;
  private contentCollection: ContentCollection;
  private router: Router;
  private subject: Subject<string>;
  public notification: Observable<string>;
  private config: any;
  private currentSection: number; // question
  public volumeValue = 1;
  private showLoader = false;
  public isMute: boolean = false;
  private previewMode: boolean = false;
  refernceStore: any;
  assetsfolderpath = '.';
  isTitleExist: boolean = false;
  private videoType: string = "";
  private videoLoaded: boolean = false;
  _userActionOccured: Subject<void> = new Subject();
  _resetTimer: Subject<void> = new Subject();
  _firstQues = new Subject<any>();
  _postVOSubject = new Subject<any>();
  _lastQues = new Subject<any>();
  _submitBtnSub = new Subject<any>();
  _navBtnSub = new Subject<any>();
  _replayBtnSub = new Subject<any>();
  _videoStraming = new Subject<any>();
  _controllerHandle = new Subject<any>();
  _nextBtnEvent = new Subject<any>();
  _autoplay = new BehaviorSubject<any>(false);
  _videoLoadedSub = new Subject<any>();
  _otherTempSub = new Subject<any>();
  _animationAssets = new Subject<any>();
  _wrongAttemptAnimation = new Subject<any>();
  _autoPlaySubject = new Subject<any>();
  _blinkingSubject = new Subject<any>();
  //_resetTimerOnNewSeg = new Subject<any>();
  private attemptsNT8: any = [];
  private rightAttempt: any = [];
  private liveScoreNT8: any;
  private feedbackNT8: any = [];
  isVideoPlayed: boolean = false;
  EVA: boolean = false;
  subscription: Subscription;
  Template: any;
  private nextCollectionCounterEVA: number = 0;
  tPath: any="" ;
  theme_name: any = '';
  constructor(router: Router, httpHandler: HttphandlerService, commonLoader: CommonloaderService,
    dataLoader: DataloaderService, externalCommunication: ExternalcommunicationService, private http: HttpClient, private Sharedservice: SharedserviceService) {
    this.httpHandler = httpHandler;
    this.commonLoader = commonLoader;
    this.router = router;
    this.subscription = this.Sharedservice.getData().subscribe(data => {
    this.Template = data.data.TemplateType;
      if (this.Template === 'EVA') {
        this.EVA = true;
      } else {
        this.EVA = false;
      }

    });

    this.config = [
      ['/video', '/videoext', 0],
      ['/tempone', '/temponeext', 0],
      ['/temptwo', '/temptwoext', 0],
      ['/tempthree', '/tempthreeext', 0],
      ['/tempfour', '/tempfourext', 0],
      ['/tempfive', '/tempfiveext', 0],
      ['/tempsix', '/tempsixext', 0],
      ['/tempseven', '/tempsevenext', 0],
      ['/tempeight', '/tempeightext', 0],
      ['/tempnine', '/tempnineext', 0],
      ['/tempten', '/temptenext', 0],
      ['/temp11', '/temp11ext', 0],
      ['/temptwelve', '/temptwelveext', 0],
      ['/temp13', '/temp13ext', 0],
      ['/temp14', '/temp14ext', 0],
      ['/tempfifteen', '/tempfifteenext', 0],
      ['/temp16', '/temp16ext', 0],
      ['/ntemp5', '/ntemp5ext', 0],
      ['/ntemp2', '/ntemp2ext', 0],
      ['/ntemp8', '/ntemp8ext', 0],
      ['/ntemp3', '/ntemp3ext', 0],
      ['/ntemp1', '/ntemp1ext', 0],
      ['/ntemp4', '/ntemp4ext', 0],
      ['/ntitle', '/ntitleext', 0],
      ['/ntemp9', '/ntemp9ext', 0],
      ['/ntemp6', '/ntemp6ext', 0],
      ['/ntemp7', '/ntemp7ext', 0],
      ['/ntemp18', '/ntemp18ext', 0],
      ['/ntemp24', '/ntemp24ext', 0],
      ['/ntemp23_1', '/ntemp23_1ext', 0],
      ['/ntemp21', '/ntemp21ext', 0],
      ['/ntemp17', '/ntemp17ext', 0],
      ['/ntemp18_1', '/ntemp18_1ext', 0],
      ['/ntemp24_1', '/ntemp24_1ext', 0],
      ['/ntemp19', '/ntemp19ext', 0],
      ['/ntemp13', '/ntemp13ext', 0],
      ['/ntemp10', '/ntemp10ext', 0],
      ['/ntemp20', '/ntemp20ext', 0],
      ['/ntemp11', '/ntemp11ext', 0],
      ['/ntemp12', '/ntemp12ext', 0],
      ['/ntemp16', '/ntemp16ext', 0],
      ['/ntemp23', '/ntemp23ext', 0],
      ['/ntemp15', '/ntemp15ext', 0],
      ['/ntemp22', '/ntemp22ext', 0],
      ['/evatemp15', '/evatemp15ext', 0],
      ['/evatemp3', '/evatemp3ext', 0],
      ['/evatemp1', '/evatemp1ext', 0],
      ['/ntemp14', '/ntemp14ext', 0],
      ['/evatemp8', '/evatemp8ext', 0],
      ['/evatemp2', '/evatemp2ext', 0],
	  ['/evatemp4', '/evatemp4ext', 0]
    ];
    this.externalCommunication = externalCommunication;
    this.dataLoader = dataLoader;
    this.subject = new Subject<string>();
    this.notification = this.subject.asObservable();
    this.init();
  }

  private subjectQuestionNos = new Subject<any>();
  private subjectQuestionIdx = new Subject<any>();
  subjectQuesControl = new Subject<any>();
  subjectThemePath = new Subject<any>();
  popupSubject = new Subject<any>();
  moveNextSubject = new Subject<any>();
  moveNextQuesSubject = new Subject<any>();
  popupConfirmSubject = new Subject<any>();
  cancelTimerSubject = new Subject<any>();
  startPreTimer = new Subject<any>();
  windowResizeSubject = new Subject<any>();
  questionChangeEvent = new Subject<any>();
  _submitAns = new Subject<any>();
  _restartAct = new Subject<any>();
  _postWrongVO = new Subject<any>();
  subjectCommonControl = new Subject<any>();
  eventDone: boolean = false;
  lastQuesNT: boolean = false;
  autoPlayFlag: boolean = false;
  _avtiveBG = new Subject<any>();
  activeBg:any = "";
  get initVal() {
    return this.initValues.files[this.currentActive].startAt;
  }

  //private init(): void {
  //  console.info('ApplicationmodelService: init');
  //  if (this.autoPlayFlag) {
  //    this.httpHandler.get('./assets/config/init.json', this.initLoaded.bind(this), this.initFailed.bind(this));
  //  } else {
  //    var mp3 = 'data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

  //    var ogg = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA=';
  //    var audio = new Audio();
  //    var src = audio.canPlayType('audio/ogg') ? ogg : mp3;
  //    audio.autoplay = true;
  //    audio.volume = 0;
  //    audio.src = src;
  //    let audioPromise = audio.play();
  //    if (audioPromise !== undefined) {
  //      audioPromise.then(_ => {
  //        // Autoplay started!
  //        console.log("Your browser support autoplay....");
  //        this.autoPlayFlag = true;
  //        audio.pause();
  //        audio.currentTime = 0;
  //        // load startup config
  //        this.httpHandler.get('./assets/config/init.json', this.initLoaded.bind(this), this.initFailed.bind(this));
  //      }).catch(error => {
  //        console.log("no autoplay working");
  //        this._autoPlaySubject.next();
  //        throw new Error("Autoplay not working! start application by clicking on play button...");
  //      });
  //    }
  //  }
  //}
  templatevolume(vol, obj) {
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.optionAudio && obj.optionAudio.nativeElement) {
      obj.optionAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.rightFeedbackVO && obj.rightFeedbackVO.nativeElement) {
      obj.rightFeedbackVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.wrongFeedbackVO && obj.wrongFeedbackVO.nativeElement) {
      obj.wrongFeedbackVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
      obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackshowPopupAudio && obj.feedbackshowPopupAudio.nativeElement) {
      obj.feedbackshowPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackInfoAudio && obj.feedbackInfoAudio.nativeElement) {
      obj.feedbackInfoAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackpartialPopupAudio && obj.feedbackpartialPopupAudio.nativeElement) {
      obj.feedbackpartialPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.quesVORef && obj.quesVORef.nativeElement) {
      obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.QuestionVideo && obj.QuestionVideo.nativeElement) {
      obj.QuestionVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.QuestionAudio && obj.QuestionAudio.nativeElement) {
      obj.QuestionAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
  }
  private init(): void {
    console.info('ApplicationmodelService: init');

    // load startup config
    this.httpHandler.get('./assets/config/init.json', this.initLoaded.bind(this), this.initFailed.bind(this));
  }

  get content(): Content {
    if (this.contentCollection && this.contentCollection.collection && this.contentCollection.collection[this.currentSection]) {
      return this.contentCollection.collection[this.currentSection];
    }
  }

  getIsFirstQuestion() {
    return this._firstQues.asObservable();
  }


  set event(value: any) {
    console.log('ApplicationmodelService: event - value=', value);
    console.log('@@@@@@@@@@@@@@@@', value.action);
    const data = {
      'sessionId': this.initValues.sessionId,
      'segmentId': this.initValues.files[this.currentActive].segmentId,
      'event': value
    };

    this.dataHandler.sendData('eventFromPlayer', data);
  }

  private initLoaded(data): void {
    console.log('ApplicationmodelService: initLoaded - data = ', data);
    if (
      data == null
      || data.environment == null
      || data.environment.lms == null
      || data.environment.standalone == null
    ) {
      throw new Error('ApplicationmodelService: initLoaded - Incorrect startup config: init.json');
    }


    if (data.environment.lms.enabled) {
      console.info('ApplicationmodelService: initLoaded - environment.lms.enabled = true');
      this.dataHandler = this.externalCommunication;
      this.dataHandler.loadData(data.environment.lms, this.listener.bind(this), this.baseLoaded.bind(this), this.baseFailed.bind(this));
    } else if (data.environment.standalone.enabled) {
      console.info('ApplicationmodelService: initLoaded - environment.standalone.enabled = true');
      this.dataHandler = this.dataLoader;
      this.dataHandler.loadData(data.environment.standalone,
        this.listener.bind(this), this.baseLoaded.bind(this), this.baseFailed.bind(this));
    } else {
      throw new Error('ApplicationmodelService: initLoaded - Incorrect startup config: init.json');
    }
  }


  private baseLoaded(data): void {
    console.log('ApplicationmodelService: baseLoaded - data = ', data);
    this.initValues = data;
    this.videoType = data.videoType;
    this.currentActive = 0;
    this.load(this.initValues.files[this.currentActive]);
    console.log("preview mode enabled", this.initValues.playerPreview);
    this.refernceStore.setPreviewMode(this.initValues.playerPreview);
  }

  private baseFailed(error): void {

  }

  private listener(data: Info) {
    console.log('ApplicationmodelService: listener - data = ', data);
    let observ = this.subject.observers[this.subject.observers.length - 1];
    this.subject.observers.splice(0, this.subject.observers.length);
    this.subject.observers.push(observ);
    this.subject.next(data.id);
  }
  private initFailed(error): void {
    console.error('ApplicationmodelService: initFailed - error = ', error);
  }

  private load(value: Helper): void {
    console.log('ApplicationmodelService: load - value = ', value);
    this.commonLoader.createContent(value, this.loadCompleted.bind(this), this.loadFailed.bind(this), this.setAutoplay.bind(this));

  }

  private loadCompleted(c: ContentCollection): void {
    console.log('ApplicationmodelService: loadCompleted - c = ', c);
    this.contentCollection = c;
    this.currentSection = 0;
    let noOfQues;
    let dataObj = this.contentCollection.collection[0].contentData.data;
    console.log("dataObj--------------->", dataObj)
    if (dataObj["titleScreen"]) {
      noOfQues = this.contentCollection.collection.length - 1;
      this.refernceStore.setTitleFlag(true);
      this.isTitleExist = true;
    } else {
      noOfQues = this.contentCollection.collection.length;
      this.isTitleExist = false;
      this.refernceStore.setTitleFlag(false);
    }
    if (noOfQues > -1) {
      this.subjectQuestionNos.next(noOfQues);
    }
    this.runContent();
  }

  private setAutoplay(autoplay: boolean) {
    this._autoplay.next(autoplay);
    if (this.navShow == 0) {

    } else if (this.navShow == 1) {
      // this._autoplay.next(autoplay);
    }
  }

  getAutoPlay(): Observable<any> {
    return this._autoplay.asObservable();
  }

  getNoOfQues(): Observable<any> {
    return this.subjectQuestionNos.asObservable();
  }

  public previousSection(): void {
    this.currentSection--;
    console.log('ApplicationmodelService: previousSection - currentSection=',
      this.currentSection, 'contentCollection.collection.length', this.contentCollection.collection.length);
    if (this.currentSection < 0) {
      this.previousCollection();
    } else {
      this.runContent();
    }
  }

  public nextSection(): void {
    this.refernceStore.setTitleFlag(false);
    this.segmentBeginvariable = false;
    this.currentSection++;
    if (!this.eventDone && this.lastQuesNT) {
      let observ = this._nextBtnEvent.observers[this._nextBtnEvent.observers.length - 1];
      this._nextBtnEvent.observers.splice(0, this._nextBtnEvent.observers.length);
      this._nextBtnEvent.observers.push(observ);
      this.eventDone = true;
      this.lastQuesNT = false;
      this._nextBtnEvent.next();
    }
    console.log('ApplicationmodelService: nextSection - currentSection=',
      this.currentSection, 'contentCollection.collection.length', this.contentCollection.collection.length);
    if (this.currentSection > this.contentCollection.collection.length - 1) {
      this.nextCollection();
      this.isVideoPlayed = false;
    } else {
      this.runContent();
    }
  }

  nextBtnEvent(): Observable<any> {
    return this._nextBtnEvent.asObservable();
  }

  eventFired() {
    this.eventDone = true;
  }

  private previousCollection(): void {
    this.currentActive--;
    console.log('ApplicationmodelService: previousCollection - currentActive=',
      this.currentActive, 'initValues.files.length', this.initValues.files.length);
    if (this.currentActive >= 0) {
      this.load(this.initValues.files[this.currentActive]);
    } else {
      // start
      this.currentActive = this.currentSection = 0;
    }
  }

  private nextCollection(): void {
    this.segmentBeginvariable = true;
    this.currentActive++;
    //this._resetTimerOnNewSeg.next();
    console.log('ApplicationmodelService: nextCollection - currentActive=',
      this.currentActive, 'initValues.files.length', this.initValues.files.length);
    if (this.currentActive > this.initValues.files.length - 1) {
      // finished
      this.currentActive = this.initValues.files.length - 1;
      this.currentSection = this.contentCollection.collection.length - 1;
      console.info('ApplicationmodelService: nextCollection - currentActive, currentSection reset');
    } else {
      this.load(this.initValues.files[this.currentActive]);
      console.log('ApplicationmodelService: nextCollection - currentActive=',
        this.currentActive, 'this.initValues.files[this.currentActive]', this.initValues.files[this.currentActive]);
      this.eventDone = false;
    }
    /* 
   // ****check later**** //
    this.setQuestionNo();
     let data = this.content.contentData.data;
     let firsQflag = data['commonassets'].isFirstQues;
     this._firstQues.next(firsQflag);*/
  }

  private segmentBeginvariable: boolean = true;

  get isNewCollection(): boolean {
    return this.segmentBeginvariable;
  }


  private loadFailed(error): void {
    console.error('ApplicationmodelService: loadFailed - error = ', error);
  }

  private runContent(): void {
    const functionalityType = this.contentCollection.collection[this.currentSection].contentLogic.functionalityType;
    this.navigateToRoute(this.config[functionalityType][this.config[functionalityType][2]]);
    this.updateConfig(functionalityType);

    if (functionalityType == 17 || functionalityType == 18 || functionalityType == 19 || functionalityType == 20 || functionalityType == 21 || functionalityType == 22 || functionalityType == 24 || functionalityType == 25 || functionalityType == 26 || functionalityType == 27 || functionalityType == 28 || functionalityType == 29 || functionalityType == 30 || functionalityType == 31 || functionalityType == 32 || functionalityType == 33 || functionalityType == 34 || functionalityType == 35 || functionalityType == 36 || functionalityType == 37 || functionalityType == 38 || functionalityType == 39 || functionalityType == 40 || functionalityType == 41 || functionalityType == 42 || functionalityType == 43 || functionalityType == 44 || functionalityType == 45 || functionalityType == 46 || functionalityType == 47 || functionalityType == 48 || functionalityType == 49 || functionalityType == 50) {
      this.setQuestionNo();
      let data = this.content.contentData.data;
      let firsQflag = data['commonassets'].isFirstQues;
      console.log("data['theme_name']",data);
      if(data['theme_name'] && data['theme_name'].length > 0 ){
      this.theme_name = data['theme_name']
      this.setThemeName = data['theme_name']
      //get tabs.json file
      this.getJson();
      } else {
        this.theme_name=undefined;
      }
      this._firstQues.next(firsQflag);
      //this.notifyUserAction();
    }
    this.questionChangeEvent.next();
    // this._resetTimer.next();\

  }

  private updateConfig(value: number): void {

    this.config[value][2] = (this.config[value][2] === 0) ? 1 : 0;
  }
  private navigateToRoute(value: string): void {

    this.router.navigateByUrl(value);
  }

  get autoPlay(): boolean {
    return this.isAutoPlay();
  }

  getVideoType(): string {
    return this.videoType;
  }

  get isFirstSection(): boolean {
    return (
      (this.currentActive <= 0) && (this.currentSection <= 0)
    );
  }
  get isLastSectionInCollection(): boolean {
    if (this.contentCollection && this.contentCollection.collection) {
      return (
        (this.currentSection >= this.contentCollection.collection.length - 1)
      );
    } else {
      return false;
    }

  }

  public setQuestionNo() {
    if (this.isTitleExist && (this.currentSection - 1 > -1)) {
      this.subjectQuestionIdx.next(this.currentSection - 1);
    } else {
      this.subjectQuestionIdx.next(this.currentSection);
    }
  }

  getQuesionIdx(): Observable<any> {
    return this.subjectQuestionIdx.asObservable();
  }


  get isLastSection(): boolean {
    return (
      (this.currentActive >= this.initValues.files.length - 1) &&
      (this.currentSection >= this.contentCollection.collection.length - 1)
    );
  }

  autoPlayUpdated = false;
  autoPlayCurrent = false;

  public isAutoPlay(): boolean {
    if (this.autoPlayUpdated) {
      return this.autoPlayCurrent;
    } else if (this.contentCollection && this.contentCollection.autoplay) {
      return this.contentCollection.autoplay;
    } else {
      return true;
    }
  }
  public updateAutoPlay(value: boolean) {
    this.autoPlayUpdated = true;
    this.autoPlayCurrent = value;
  }
  navShow: number = 1;
  // start
  myabc: any;
  ref: any;
  public functionone(abc, abj) {
    this.myabc = abc;
    this.ref = abj;
  }

  public functiontwo(abc2) {
    if (abc2 == undefined && this.myabc) {
      this.myabc(this.volumeValue, this.ref);
    }
    if (abc2 != undefined) {
      this.volumeValue = abc2;
    }
    if (this.myabc && abc2) {
      this.myabc(abc2, this.ref);
    }
  }

  public getLoader() {
    return this.showLoader;
  }
  public setLoader(loaderFlag) {
    this.showLoader = loaderFlag;
    if (this.showLoader == false) {
      this._otherTempSub.next();
    }
  }

  get isTempLoaded() {
    return this._otherTempSub.asObservable();
  }

  public setVideoLoaded(videoFlag) {
    this.videoLoaded = videoFlag;
    this._videoLoadedSub.next();
  }

  get isVideoLoaded() {
    return this._videoLoadedSub.asObservable();
  }



  get getVideoLoaded() {
    return this.videoLoaded;
  }

  get getLoaderFlag() {
    return this.showLoader;
  }

  public getPreviewMode(ref) {
    this.refernceStore = ref;
  }

  public getforwardEnableFlag() {
    return this.initValues.forwardEnabled;
  }

  get version() {
    if (this.contentCollection && this.contentCollection.collection
      && this.contentCollection.collection[this.currentSection] &&
      this.contentCollection.collection[this.currentSection].contentLogic &&
      this.contentCollection.collection[this.currentSection].contentLogic.versionNumber) {
      return this.contentCollection.collection[this.currentSection].contentLogic.versionNumber;
    }
  }

  public selectQues(questionIdx) {
    this.segmentBeginvariable = false;
    this.currentSection = questionIdx;
    this.runContent();

  }

  get questionEvent() {
    return this.questionChangeEvent.asObservable();
  }

  public get titleFlag() {
    return this.isTitleExist;
  }


  get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable() };
  get resetTimer(): Observable<void> { return this._resetTimer.asObservable() };
  /*get userActionOnLastQues(): Observable<void> { 
    if(this.test){
      return this._userActionOccured.asObservable() 
    }else{

    }
  };f
*/

  notifyUserAction() {
    this._userActionOccured.next();
  }

  /*resetTimerOnNextSeg() {
    return this._resetTimerOnNewSeg.asObservable();
  }*/

  loginUser() {
    console.log('user login');
  }

  logOutUser(msg) {
    console.log(msg);
  }

  setQuesControlAssets(controlAssets) {
    this.subjectQuesControl.next(controlAssets);
  }

  getQuesControlAssets() {
    return this.subjectQuesControl.asObservable();
  }

  setCommonControlAssets(controlAssets) {
    this.subjectCommonControl.next(controlAssets);
  }

  getCommonControlAssets() {
    return this.subjectCommonControl.asObservable();
  }



  setThemeName(theme) {
    this.subjectThemePath.next(theme);
  }

  getThemeName() {
    return this.subjectThemePath.asObservable();
  }

  // getThemePath() {
  //   return "./assets/themes/elementary/"+ this.theme_name+'/type_'+this.content.contentLogic.functionalityType;
  // }

  public invokeTempSubject(msg, mode) {
    if (msg == "showModal") {
      let observ = this.popupSubject.observers[this.popupSubject.observers.length - 1];
      this.popupSubject.observers.splice(0, this.popupSubject.observers.length);
      this.popupSubject.observers.push(observ);
      this.popupSubject.next(mode);
    } else if (msg == "moveNextSeg") {
      this.nextCollection();
    } else if (msg == "moveNextQues") {
      this.nextSection();
    }
  }
  /*
  move next segment timer  dont delete
    public moveNext(){
      this.moveNextSubject.next();
    }
    */
  public moveNextQues(flag?: string) {
    if (this.currentSection < this.contentCollection.collection.length - 1) {
      if (flag == "manual") {
        this.setAnimation(flag);
      } else {
        let observ = this.moveNextQuesSubject.observers[this.moveNextQuesSubject.observers.length - 1];
        this.moveNextQuesSubject.observers.splice(0, this.moveNextQuesSubject.observers.length);
        this.moveNextQuesSubject.observers.push(observ);
        this.moveNextQuesSubject.next();
        if (flag != "noBlink" && !this.EVA) {
          this.blinkForLastQues();
        }
      }
    } else {
      this.stopAllTimer();
      if (this.isLastSectionInCollection) {
        if (flag != "noBlink") {
          this.blinkForLastQues();
        }
      }
      /*
      move next segment timer  dont delete
         this.moveNext();
      */
    }
  }

  setAnimation(flag) {
    let data = this.content.contentData.data;
    if (data['commonassets'].animation && ((data['commonassets'].animation.img && data['commonassets'].animation.img.url) || data['commonassets'].animation.timeout)) {
      let assts = {
        animationImg: "",
        audio: "",
        timer: ""
      };
      let pathPre = data['commonassets'].animation.location == "content" ? this.content.id : ".";
      let animationImg = data['commonassets'].animation.img && data['commonassets'].animation.img.url ? data['commonassets'].animation.img.url : "";
      let audio = data['commonassets'].animation.audio && data['commonassets'].animation.audio.url ? data['commonassets'].animation.audio.url : "";
      assts.animationImg = animationImg != "" ? pathPre + "/" + animationImg : "";
      assts.audio = audio != "" ? pathPre + "/" + audio : "";
      assts.timer = data['commonassets'].animation.timeout;
      this._animationAssets.next(assts);
    } else {
      this._animationAssets.next(undefined);
    }
  }
  /*
  move next segment timer  dont delete
    get moveNextNotification(){
      return this.moveNextSubject.asObservable();
    }
  */
  get moveNewQues() {
    return this.moveNextQuesSubject.asObservable();
  }

  confirmPopup(action) {
    this.popupConfirmSubject.next(action);
  }


  getNotification() {
    return this.popupSubject.asObservable();
  }

  getConfirmationPopup() {
    return this.popupConfirmSubject.asObservable();
  }

  /*checkNextActs() {
    if (this.timer == 5) {
      if (this.currentSection < this.contentCollection.collection.length - 1) {
        this.nextSection();
      }
    }
  }*/

  handlePostVOActivity(flag) {
    this._postVOSubject.next(flag);
  }

  getPostVOActs() {
    return this._postVOSubject.asObservable();
  }

  blinkForLastQues(flag?: string) {
    if (flag == "manual") {
      this.setAnimation(flag);
    } else {
      this._lastQues.next();
    }
  }

  get lastQues() {
    return this._lastQues.asObservable();
  }

  stopAllTimer() {
    this.cancelTimerSubject.next();
  }

  get unsubscribeTimers() {
    return this.cancelTimerSubject.asObservable();
  }

  startPreviousTimer() {
    this.startPreTimer.next();
  }

  get preRunnintTimer() {
    return this.startPreTimer.asObservable();
  }

  windowResizeTriggerd() {
    this.windowResizeSubject.next();
  }

  get windowResizeEvent() {
    return this.windowResizeSubject.asObservable();
  }

  saveAttempt(attempt, rightAttempt) {
    let idx: number;
    if (this.isTitleExist) {
      idx = this.currentSection - 1;
    } else {
      idx = this.currentSection;
    }
    // this.attemptsNT8.push(attempt);
    this.attemptsNT8[idx] = attempt;
    if (this.rightAttempt && this.rightAttempt.length > 0) {
      for (let i in rightAttempt) {
        this.rightAttempt[i] = this.rightAttempt[i] + rightAttempt[i];
      }
    } else {
      this.rightAttempt = rightAttempt;
    }
  }

  get attempt() {
    let attemptMade = Object.assign([], this.attemptsNT8);
    this.attemptsNT8.splice(0, this.attemptsNT8.length);
    let obj = {
      "attemptMade": attemptMade,
      "rightAttempt": this.rightAttempt
    }
    console.log(obj, 'jyoti initialize');
    return obj;



  }

  initializeAtemptMade() {
    if (this.attemptsNT8 && this.attemptsNT8.length) {
      this.attemptsNT8.splice(0, this.attemptsNT8.length);
    }
    if (this.isTitleExist) {
      this.attemptsNT8 = new Array(this.contentCollection.collection.length - 1);
    } else {
      this.attemptsNT8 = new Array(this.contentCollection.collection.length);
    }
  }

  initializeFeedbackArray(num: number) {
    if (this.feedbackNT8 && this.feedbackNT8.length) {
      this.feedbackNT8.splice(0, this.feedbackNT8.length);
    }
    if (this.isTitleExist) {
      this.feedbackNT8 = new Array(num - 1);
    } else {
      this.feedbackNT8 = new Array(num);
    }
  }
  enableSubmitBtn(flag) {
    this._submitBtnSub.next(flag);
  }

  enableReplayBtn(flag) {
    this._replayBtnSub.next(flag);
  }

  get enableFlagSubmit() {
    return this._submitBtnSub.asObservable();
  }

  get enableFlagReplay() {
    return this._replayBtnSub.asObservable();
  }

  setLiveScore(scoreObj) {
    this.liveScoreNT8 = scoreObj;
  }

  getLiveScoreObj() {
    return this.liveScoreNT8;
  }

  saveFeedbackNT8(feedback) {
    let idx: number;
    if (this.isTitleExist) {
      idx = this.currentSection - 1;
    } else {
      idx = this.currentSection;
    }
    this.feedbackNT8[idx] = feedback;
  }

  get feedbackArray() {
    return this.feedbackNT8;
  }

  videoStraming(flag: boolean) {
    this._videoStraming.next(flag);
  }

  get isVideoStraming() {
    return this._videoStraming.asObservable();
  }

  handleController(obj) {
    console.log("handle controller", obj);
    this._controllerHandle.next(obj);
  }

  get controllerHandler() {
    return this._controllerHandle.asObservable();
  }

  showController(showAns, prev, next, tabs) {
    let controllerHandle = {
      showAns: true,
      prev: true,
      next: true,
      tabs: true
    }
    this._controllerHandle.next(controllerHandle);
  }

  setlastQuesNT() {
    this.lastQuesNT = true;
  }

  get animationAssets() {
    return this._animationAssets.asObservable();
  }

  wrongAttemptAnimation() {
    let data = this.content.contentData.data;
    if (data['commonassets'].wrongAnimationAssts && ((data['commonassets'].wrongAnimationAssts.img && data['commonassets'].wrongAnimationAssts.img.url) || data['commonassets'].wrongAnimationAssts.timeout)) {
      let assets = {
        animationImg: "",
        audio: "",
        timer: ""
      };

      let pathPre = data['commonassets'].wrongAnimationAssts.location == "content" ? this.content.id : ".";
      let animationImg = data['commonassets'].wrongAnimationAssts.img && data['commonassets'].wrongAnimationAssts.img.url ? data['commonassets'].wrongAnimationAssts.img.url : "";
      let audio = data['commonassets'].wrongAnimationAssts.audio && data['commonassets'].wrongAnimationAssts.audio.url ? data['commonassets'].wrongAnimationAssts.audio.url : "";
      assets.animationImg = animationImg != "" ? pathPre + "/" + animationImg : "";
      assets.audio = audio != "" ? pathPre + "/" + audio : "";
      assets.timer = data['commonassets'].wrongAnimationAssts.timeout;
      this._wrongAttemptAnimation.next(assets);
    } else {
      this._wrongAttemptAnimation.next(undefined);
    }
  }
  getFileString(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' })
  }

  get wrongAnimationAsts() {
    return this._wrongAttemptAnimation.asObservable();
  }

  handlePostWrongFeedback() {
    let observ = this._postWrongVO.observers[this._postWrongVO.observers.length - 1];
    this._postWrongVO.observers.splice(0, this._postWrongVO.observers.length);
    this._postWrongVO.observers.push(observ);
    this._postWrongVO.next();
  }

  get postWrongAttempt() {
    return this._postWrongVO.asObservable();
  }

  startApplication() {
    this.autoPlayFlag = true;
    this.init();
  }
  get autoPlayBtn() {
    return this._autoPlaySubject.asObservable();
  }
  getblinkingNextBtn() {
    return this._blinkingSubject.asObservable();
  }
  resetBlinkingTimer() {
    this._blinkingSubject.next(true);
  }

  enableNavBtn(flag) {
    this._navBtnSub.next(flag);
  }

  get enableFlagNav() {
    return this._navBtnSub.asObservable();
  }


  //////******EVA - Automatic move to next segment after last question attempt*******/////

  public nextSectionEVA(): void {
    this.nextCollectionCounterEVA++;
    this.refernceStore.setTitleFlag(false);
    this.segmentBeginvariable = false;
    if (this.nextCollectionCounterEVA === 1) {
      this.currentSection = this.contentCollection.collection.length;
    }
    console.log('ApplicationmodelService: nextSection - currentSection=',
      this.currentSection, 'contentCollection.collection.length', this.contentCollection.collection.length);
    if (this.currentSection > this.contentCollection.collection.length - 1) {
      if (this.nextCollectionCounterEVA === 1) {
        this.nextCollectionEva();
        this.resetEVACollectionCounter();
      }
      this.isVideoPlayed = false;
    } else {
      // this.subjectQuestionIdx.next(this.contentCollection.collection.length - 2);
      // this.runContent()
    }
  }

  //****RESET COUNTER AFTER 1st MOVEMENT****** */
  private resetEVACollectionCounter() {
    setTimeout(() => {
      this.nextCollectionCounterEVA = 0;
    }, 5000);
  }

  
  //****GO TO NEXT COLLECTION****** */
  private nextCollectionEva(): void {
    this.segmentBeginvariable = true;
    this.currentActive++;
    console.log('ApplicationmodelService: nextCollection - currentActive=',
      this.currentActive, 'initValues.files.length', this.initValues.files.length);
    if (this.currentActive > this.initValues.files.length - 1) {
      this.selectQues(this.contentCollection.collection.length - 1);
      console.info('ApplicationmodelService: nextCollection - currentActive, currentSection reset');
    } else {
      this.load(this.initValues.files[this.currentActive]);
      // this.nextCollectionCounterEVA = 0;
      console.log('ApplicationmodelService: nextCollection - currentActive=',
        this.currentActive, 'this.initValues.files[this.currentActive]', this.initValues.files[this.currentActive]);
      this.eventDone = false;
    }
  }

  public getPath(type){
    if (this.theme_name){
    let basePath = "./assets/themes/elementary/"
    if(type == "tabs"){
      return basePath + this.theme_name +'/global/tabs'
    //set path
    }
    if(type == "buttons"){
      return basePath + this.theme_name +'/global/buttons'
    }
  }
    else return false
  }

  getJson(){
    this.httpHandler.get('./assets/themes/elementary/'+ this.theme_name+'/global/tabs.json', this.globalLoaded.bind(this), this.globalnotLoaded.bind(this));
  }

  globalLoaded(data){
    this.setCommonControlAssets(data)
    console.log("datajson", data)
    console.log("currentBackground", data.quesTabs[this.currentSection-1].background)
    if(data.quesTabs && data.quesTabs[this.currentSection-1] && data.quesTabs[this.currentSection-1].background)
    {
      this.setActiveBG(data.quesTabs[this.currentSection-1].background) ;
    }
    console.log("this.currentSection",this.currentSection)
  }

  globalnotLoaded(data){
  console.log(data)

  }

  getActiveBG() {
    return this._avtiveBG.asObservable();
  }
  
  setActiveBG(val) {
    this._avtiveBG.next(val);
  }
}


