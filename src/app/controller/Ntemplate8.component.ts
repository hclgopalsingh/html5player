import { Component, OnInit, ViewChild, HostListener,OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { mapTo, reduce, take, tap, filter, map, share, withLatestFrom } from 'rxjs/operators'
import { timer } from 'rxjs/observable/timer';
import { PlayerConstants } from '../common/playerconstants';
import 'jquery';
import { defer } from 'rxjs/observable/defer';
import { interval } from 'rxjs/observable/interval';


declare var $: any;

@Component({
	selector: 'ntemp18',
	templateUrl: '../view/layout/Ntemplate8.component.html',
	styleUrls: ['../view/css/Ntemplate8.component.css', '../view/css/bootstrap.min.css']

})

export class Ntemplate8 implements OnInit {
	private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService) {
		this.appModel = appModel;
		this.assetsPath = this.appModel.assetsfolderpath;
		this.appModel.navShow = 2;
		this.appModel.setLoader(true);
		// if error occured during image loading loader wil stop after 5 seconds 
      this.loaderTimer = setTimeout(() => {
        this.appModel.setLoader(false);
      }, 5000);

      this.appModel.notification.subscribe(
        (data) => {
          console.log('Component: constructor - data=', data);
          switch (data) {
            case PlayerConstants.CMS_PLAYER_CLOSE:
              //console.log('VideoComponent: constructor - cmsPlayerClose');
              this.close();
              break;

            default:
              console.log('Component: constructor - default');
              break;
          }
        }
      );
	}


	audio = new Audio();
	blink: boolean = false;
	currentIdx = 0;
	commonAssets: any = "";
	optionslist: any = [];
	optionslist_main: any = "";
	myoption: any = [];
	question: any = "";
	feedback: any = "";
	isLastActivity: any = "";
	bool: boolean = false;
	showIntroScreen: boolean;
	allowSkip:boolean = false;
	helpAudio: any = "";
	correctOpt: any;
	idArray: any = [];
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;

	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	disableHelpBtn: boolean = false;
	containgFolderPath: string = "";
	assetsPath: string = "";
	loadFlag: boolean = false;
	optionObj: any;
	optionCommonAssets: any;
	popupAssets: any;
	popupAssetsToShow: any;
	tempSubscription: Subscription;
	leftOptions: any;
	rightOptions: any;
	questionObj: any = [];
	root: any = document.documentElement;
	videoType: any;
	noOfRightAns: number = 0;
	teamUp:any;
	teamDown:any;
	teamRight:any;
	teamLeft:any;
	timerSubscription:Subscription;
	displayTimer:any;
	otherAssets:any;
	teamCommonAssets:any;
	currentMinute:number = 0;
	topSelectedIdx:number = -1;
	bottomSelectedIdx:number = -1;
	leftSelectedIdx:number = -1;
	rightSelectedIdx:number = -1;
	isPlayVideo:boolean = true;
	timerObj = {};
	currentTime:number = 0;
	timeLimitGiven:number = 0;
	videoReplayd:boolean = false;
	totalTime:number = 0;
	showAnswerConfirm:any;
	submitAnswerConfirm:any;
	replayConfirm:any;
	confirmAssets:any;
	scoreCardAssets:any;
	attemptSoFar:any;
	objAttempt:any = {
		"teamUp":{},
		"teamDown":{},
		"teamLeft":{},
		"teamRight":{}
	};
	totalRightAttempts:any =[];
	teamScore:any = {
		"teamUp":undefined,
		"teamDown":undefined,
		"teamLeft":undefined,
		"teamRight":undefined
	}
	totalCorrect:any = [];
	noOfTeams:number = 0;
	noOfQues:number;
	liveScoreObj = {
		"teamUpLiveScore":[],
		"teamDownLiveScore":[],
		"teamLeftLiveScore":[],
		"teamRightLiveScore":[]
	};

	feedbackAnswer: any={
		"ques":{},
		"teamUp":{},
		"teamDown":{},
		"teamLeft":{},
		"teamRight":{	}
	};
	controlHandler = {
		isShowAns:false,
		isPrev:false,
		isNext:false,
		isTab:false
	 };
	quesIndx:number;
	liveScore:any;
	liveScoreObjCopy:any;
	feedbackSoFor:any;
	/*feedbackNxt:any;
	feedbackPre:any;*/
	feedbackAssts:any;
	currentFeedback:number = 0;
	teamObj:any;
	actsTimeout:boolean = false;

	@ViewChild('mainVideo') mainVideo: any;
	@ViewChild('teamUpRef') teamUpRef: any;
	@ViewChild('teamDownRef') teamDownRef: any;
	@ViewChild('teamLeftRef') teamLeftRef: any;
	@ViewChild('teamRightRef') teamRightRef: any;
	@ViewChild('teamUpGrade') teamUpGrade: any;
	@ViewChild('teamDownGrade') teamDownGrade: any;
	@ViewChild('teamLeftGrade') teamLeftGrade: any;
	@ViewChild('teamRightGrade') teamRightGrade: any;
	@ViewChild('quesVORef') quesVORef:any;
	@ViewChild('mainContainer') mainContainer:any;
	@ViewChild('confirmModalRef') confirmModalRef:any;
	@ViewChild('confirmSubmitRef') confirmSubmitRef:any;
	@ViewChild('confirmReplayRef') confirmReplayRef:any;
	@ViewChild('scoreBoardModal') scoreBoardModal:any;
	@ViewChild('feedbackModal') feedbackModal:any;


	ngAfterViewChecked() {
		this.templatevolume(this.appModel.volumeValue, this);
	}

	ngOnInit() {
		if (this.appModel.isNewCollection) {
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		this.containgFolderPath = this.getBasePath();
		this.setData();
		this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
			if (mode == "manual") {
				//this.appModel.openModal('success-modal-id', this.popupAssets, mode);
				//open popup feedback
			} else if (mode == "auto") {
				if (this.noOfRightAns != this.popupAssets.length) {
				//	this.appModel.openModal('success-modal-id', this.popupAssets, mode);
				//open modal with some condition
				}
			}
		})
		this.appModel.getConfirmationPopup().subscribe((val) =>{
			let fetchedData: any = this.appModel.content.contentData.data;
			this.replayConfirm = fetchedData.replay_confirm;
			this.submitAnswerConfirm = fetchedData.submit_confirm;
			if(val=="submitAnswer"){
				this.confirmAssets = fetchedData.submit_confirm;
				if(this.confirmSubmitRef && this.confirmSubmitRef.nativeElement){
					this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
				}
			}else if(val=="replayVideo"){
				this.appModel.videoStraming(true);
				this.confirmAssets = fetchedData.replay_confirm;
				if(this.confirmReplayRef && this.confirmReplayRef.nativeElement){
					this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
				}
			}
		})
		this.appModel.getThemepath().subscribe(path =>{
			console.log("path--------------->",path)
		})
		this.appModel.handleController(this.controlHandler);
		console.log(this.appModel.tPath,"this.appModel.tPath")
		this.appModel.nextBtnEvent().subscribe(() =>{
			if(this.appModel.isLastSectionInCollection){
				this.appModel.event = {'action': 'segmentEnds'};	
			}
			if(this.appModel.isLastSection){
					this.appModel.event = {'action': 'end'};
				}
		})
	}
	
	ngOnDestroy(){
		this.controlHandler.isNext = true;
		this.controlHandler.isPrev = true;
		this.controlHandler.isShowAns = true;
		this.controlHandler.isTab = true;
		this.appModel.handleController(this.controlHandler);
		this.appModel.enableSubmitBtn(false);
		this.appModel.enableReplayBtn(false);
	}

	templatevolume(vol, obj) {
		if (obj.quesVORef && obj.quesVORef.nativeElement) {
			obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.mainVideo && obj.mainVideo.nativeElement) {
			obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.rightFeedbackVO && obj.rightFeedbackVO.nativeElement) {
			obj.rightFeedbackVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.wrongFeedbackVO && obj.wrongFeedbackVO.nativeElement) {
			obj.wrongFeedbackVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.audio) {
			obj.audio.volume = obj.appModel.isMute ? 0 : vol;
		}
	}

	setData() {
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			let fetchedData: any = this.appModel.content.contentData.data;
			this.feedback = fetchedData.feedback;
			this.commonAssets = fetchedData.commonassets;
			this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
			this.noOfImgs = this.commonAssets.imgCount;
			this.isFirstQues = this.commonAssets.isFirstQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			if(this.isLastQuesAct || this.isLastQues){
				this.appModel.setlastQuesNT();
		}
			this.popupAssets = fetchedData.feedback.imgList;
			this.popupAssetsToShow = Object.assign([], this.popupAssets);
			this.questionObj = fetchedData.quesObj;
			this.timeLimitGiven = this.questionObj.timeLimit*60;
			this.renderTime(0,this.timeLimitGiven*1000);
			this.quesIndx = this.questionObj.quesIdx;
			this.feedbackAnswer.ques = this.feedback.ques_img;
			/*this.feedbackNxt = JSON.parse(JSON.stringify(this.feedback.feedback_nav));
			this.feedbackPre = JSON.parse(JSON.stringify(this.feedback.feedback_nav));*/
			if(this.questionObj.isVideo){
				//this.teamUpRef.nativeElement.classList="teamUp d-flex flex-row disableDiv";
				//this.teamDownRef.nativeElement.classList="teamDown d-flex flex-row disableDiv";
				//this.teamLeftRef.nativeElement.classList="teamLeft disableDiv";
				//this.teamRightRef.nativeElement.classList="teamRight disableDiv";
			}
			this.videoType = this.appModel.getVideoType();
			this.teamCommonAssets = fetchedData.teams.common_assets;
			this.teamObj = fetchedData.teams;
			//console.log(this.teamCommonAssets.color_timer[0].url);
			if(fetchedData.teams && fetchedData.teams.teamUp){
				this.teamUp = fetchedData.teams.teamUp;
				this.totalRightAttempts.push(0);
				this.noOfTeams++;
				//this.getCorrectfeedback('teamUp');
				this.checkLiveScore('teamUp');
				this.teamScore.teamUp = 0;
			}
			if(fetchedData.teams && fetchedData.teams.teamDown){
				this.teamDown = fetchedData.teams.teamDown;
				this.totalRightAttempts.push(0);
				this.noOfTeams++;
				//this.getCorrectfeedback('teamDown');
				this.checkLiveScore('teamDown');
				this.teamScore.teamDown = 0;
			}
			if(fetchedData.teams && fetchedData.teams.teamLeft){
				this.teamLeft = fetchedData.teams.teamLeft;
				this.totalRightAttempts.push(0);
				this.noOfTeams++;
				//this.getCorrectfeedback('teamLeft');
				this.checkLiveScore('teamLeft');
				this.teamScore.teamLeft = 0;
			}
			if(fetchedData.teams && fetchedData.teams.teamRight){
				this.teamRight = fetchedData.teams.teamRight;
				this.totalRightAttempts.push(0);
				this.noOfTeams++;
				this.teamScore.teamRight = 0;
			//	this.getCorrectfeedback('teamRight');
				this.checkLiveScore('teamRight');
			}
			this.otherAssets = fetchedData.otherAssets;
			this.scoreCardAssets = fetchedData.popupAssets;
			if(this.quesIndx>0){
				this.liveScoreObj = this.appModel.getLiveScoreObj();
				this.liveScoreObjCopy = JSON.parse(JSON.stringify(this.liveScoreObj));
			}
			if(this.quesIndx==0){
				this.appModel.initializeAtemptMade();
				this.appModel.initializeFeedbackArray(this.noOfTeams);
			}
		}
	}
	checkLiveScore(teamSide){
		let fetchedData: any = JSON.parse(JSON.stringify(this.appModel.content.contentData.data));
		if(this.quesIndx==0 && teamSide=="teamUp"){
			//this.liveScoreObj.teamUpLiveScore =   Object.assign([], fetchedData.live_score[this.questionObj.noOfQues]);
			this.liveScoreObj.teamUpLiveScore = JSON.parse(JSON.stringify(fetchedData.live_score[this.questionObj.noOfQues]));
		}
		if(this.quesIndx==0 && teamSide=="teamDown"){
			this.liveScoreObj.teamDownLiveScore = JSON.parse(JSON.stringify(fetchedData.live_score[this.questionObj.noOfQues]));
		}
		if(this.quesIndx==0 && teamSide=="teamLeft"){
			this.liveScoreObj.teamLeftLiveScore = JSON.parse(JSON.stringify(fetchedData.live_score[this.questionObj.noOfQues]));
		}
		if(this.quesIndx==0 && teamSide=="teamRight"){
			this.liveScoreObj.teamRightLiveScore = JSON.parse(JSON.stringify(fetchedData.live_score[this.questionObj.noOfQues]));
		}
		if(this.quesIndx==0){
			this.appModel.setLiveScore(this.liveScoreObj);
		}else{
			this.liveScoreObj = 	this.appModel.getLiveScoreObj();
		}
		console.log(this.liveScoreObj);
		if(this.quesIndx==0){
			this.liveScoreObjCopy = JSON.parse(JSON.stringify(this.liveScoreObj));
		}
	}

	videoEnded(){
			
	}

	audioEnded(){
		
	}

	startActivity(){
		this.mainContainer.nativeElement.classList="consoleBase";
		this.resetTimerForAnswer();
	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	removeAssetsFromPopup(id: string) {
		for (let i = 0; i < this.popupAssetsToShow.length; i++) {
			if (this.popupAssetsToShow[i].id == id) {
				this.popupAssetsToShow.splice(i, 1);
			}
		}
	}

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

	checkImgLoaded() {
		if (!this.loadFlag) {
			this.noOfImgsLoaded++;
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				setTimeout(() =>{
					this.loadFlag = true;
				this.appModel.setLoader(false);
				clearTimeout(this.loaderTimer);
				if(this.questionObj && this.questionObj.isNewQues){
					this.appModel.enableSubmitBtn(false);
					this.appModel.enableReplayBtn(false);
					setTimeout(() => {
						this.mainVideo.nativeElement.play();
							this.mainVideo.nativeElement.onended = () =>{
							this.appModel.enableSubmitBtn(true);
							this.appModel.enableReplayBtn(true);
							setTimeout(() =>{
								this.isPlayVideo = false;
								this.startActivity();
							},200)
						}
					}, 500);

				}else{
					this.appModel.setLoader(false);
					this.appModel.enableSubmitBtn(true);
					this.appModel.enableReplayBtn(true);
					this.isPlayVideo = false;
					this.startActivity();
				}
				},500)
				
				}
		}
	}

	doRandomize(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
	}

	arraysIdentical(arr1, arr2) {
		var i = arr1.length;
		var bool = false;
		while (i--) {
			if (arr1[i].id == arr2[i]) {
				return true;
			}
		}
		return false;
	}

	playSound(soundAssets, idx, teamRef,team) {
		if(this.audio && this.audio.paused){
			let selectedIdx = -1;
			if(team=="teamUp"){
				if(this.teamDownRef && this.teamDownRef.nativeElement && this.teamDownRef.nativeElement.children[0]){
					$(this.teamDownRef.nativeElement.children[0]).addClass("disableDiv");
				}
				if(this.teamLeftRef && this.teamLeftRef.nativeElement && this.teamLeftRef.nativeElement.children[0]){
					$(this.teamLeftRef.nativeElement.children[0]).addClass("disableDiv");
				}
				if(this.teamRightRef && this.teamRightRef.nativeElement && this.teamRightRef.nativeElement.children[0]){
					$(this.teamRightRef.nativeElement.children[0]).addClass("disableDiv");
				}
				if(this.topSelectedIdx>-1){
					selectedIdx = this.topSelectedIdx;
				}
			
			}else if(team=="teamDown"){
				if(this.teamUpRef && this.teamUpRef.nativeElement && this.teamUpRef.nativeElement.children[0]){
					$(this.teamUpRef.nativeElement.children[0]).addClass("disableDiv");
				}
				
				if(this.teamLeftRef && this.teamLeftRef.nativeElement && this.teamLeftRef.nativeElement.children[0]){
					$(this.teamLeftRef.nativeElement.children[0]).addClass("disableDiv");
				}
				
				if(this.teamRightRef && this.teamRightRef.nativeElement && this.teamRightRef.nativeElement.children[0]){
					$(this.teamRightRef.nativeElement.children[0]).addClass("disableDiv");
				}
				if(this.bottomSelectedIdx>-1){
					selectedIdx = this.bottomSelectedIdx;
				}
			}else if(team=="teamLeft"){
				if(this.teamUpRef && this.teamUpRef.nativeElement && this.teamUpRef.nativeElement.children[0]){
					$(this.teamUpRef.nativeElement.children[0]).addClass("disableDiv");
				}
				if(this.teamDownRef && this.teamDownRef.nativeElement && this.teamDownRef.nativeElement.children[0]){
					$(this.teamDownRef.nativeElement.children[0]).addClass("disableDiv");
				}
				if(this.teamRightRef && this.teamRightRef.nativeElement && this.teamRightRef.nativeElement.children[0]){
					$(this.teamRightRef.nativeElement.children[0]).addClass("disableDiv");
				}
				if(this.leftSelectedIdx>-1){
					selectedIdx = this.leftSelectedIdx;
				}
			}
			else if(team=="teamRight"){
				if(this.teamUpRef && this.teamUpRef.nativeElement && this.teamUpRef.nativeElement.children[0]){
					$(this.teamUpRef.nativeElement.children[0]).addClass("disableDiv");
				}
				if(this.teamDownRef && this.teamDownRef.nativeElement && this.teamDownRef.nativeElement.children[0]){
					$(this.teamDownRef.nativeElement.children[0]).addClass("disableDiv");
				}
				if(this.teamLeftRef && this.teamLeftRef.nativeElement && this.teamLeftRef.nativeElement.children[0]){
					$(this.teamLeftRef.nativeElement.children[0]).addClass("disableDiv");
				}
				if(this.rightSelectedIdx>-1){
					selectedIdx = this.rightSelectedIdx;
				}
			}
			if(teamRef.children[0] && teamRef.children[0].children){
				for(let i=0;i<teamRef.children[0].children.length;i++){
					if(idx!=i){
						teamRef.children[0].children[i].classList.add("disableDiv");
					}
				}
			}
			if (soundAssets.location == 'content') {
				this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
			} else {
				this.audio.src = soundAssets.url;
			}
			this.audio.load();
			this.audio.play();
			//for(let i= 0;i<teamRef.nativeElement)
			this.audio.onended = () => {
				if(this.teamUp){
					if(this.teamUpRef && this.teamUpRef.nativeElement && this.teamUp.isStillActive && this.teamUpRef.nativeElement.children[0]){
						this.teamUpRef.nativeElement.children[0].classList="optionsBlock ";
					}
				}
				if(this.teamDown){
					if(this.teamDownRef && this.teamDownRef.nativeElement && this.teamDown.isStillActive && this.teamDownRef.nativeElement.children[0]){
						this.teamDownRef.nativeElement.children[0].classList="optionsBlock ";
						
					}
				}
				if(this.teamLeft){
					if(this.teamLeftRef && this.teamLeftRef.nativeElement && this.teamLeft.isStillActive && this.teamLeftRef.nativeElement.children[0]){
						this.teamLeftRef.nativeElement.children[0].classList="optionsBlock text-center ";
					}
				}
				if(this.teamRight){
					if(this.teamRightRef && this.teamRightRef.nativeElement && this.teamRight.isStillActive && this.teamRightRef.nativeElement.children[0]){
						this.teamRightRef.nativeElement.children[0].classList="optionsBlock text-center";
					}
				}
				if(teamRef.children[0] && teamRef.children[0].children){
					for(let i=0;i<teamRef.children[0].children.length;i++){
						if(idx!=i && selectedIdx!=i){
							teamRef.children[0].children[i].classList.remove("disableDiv");;
						}
					}
				}
			}
		}
	 }

	playOptionHover(opt, idx, teamRef,team) {
		if (opt && opt.mouse_over_audio && opt.mouse_over_audio.url) {
			this.playSound(opt.mouse_over_audio, idx, teamRef,team);
		}
	}

	removeSubscription() {
		this.timerSubscription.unsubscribe();  
	}

	resetTimerForAnswer() {
		const interval = 1000;
		const showAnsInterval = this.timeLimitGiven;
		this.timerSubscription = timer(0, interval).pipe(
		  take(showAnsInterval)
		).subscribe(value =>
			this.renderTime(value,(showAnsInterval - +value) * interval),
		  err => {
			  console.log("error occuered....");
		   },
		  () => {
			console.log("success occuered...."); 
			this.currentMinute = 10;   
			this.displayTimer = "00:00"  
			this.actsTimeout = true; 
			//this.setTimerGrade();   
			this.actsCompleted();   
			if(!this.isPlayVideo){
				this.checkAttemptedOpt(); 
			}                           
		  }
		)
		}

		actsCompleted(){
			this.mainContainer.nativeElement.classList="consoleBase disableDiv";
		}
		
		renderTime(currentTime, time){
			this.currentTime = currentTime;
			this.displayTimer = this.getMinutes(time)+ ":" +this.getSeconds(time);
			if(this.getOnlyMinutes(currentTime)!=this.currentMinute){
				this.currentMinute = this.getOnlyMinutes(currentTime);
			//	this.setTimerGrade();
			}
		}

		private getSeconds(ticks: number) {
			const seconds = ((ticks % 60000) / 1000).toFixed(0);
			return this.pad(seconds);
		}
	
		private getMinutes(ticks: number) {
			const minutes = Math.floor(ticks / 60000);
			return this.pad(minutes);
		}

		private getOnlyMinutes(ticks: number) {
			return Math.floor(ticks / 60);
		}

		private pad(digit: any) {
			return digit <= 9 ? '0' + digit : digit;
		}

		hoverOption(opt){
			opt.opt_normal = opt.opt_hover;
		}

		houtOption(opt){
			opt.opt_normal = opt.opt_original;
		}

		setTimerGrade(){
			if(this.currentMinute>=1){
				if(this.teamUp.isStillActive){
					this.teamUpGrade.nativeElement.src = this.teamCommonAssets.color_timer[this.currentMinute-1].location=="content" ? this.containgFolderPath+ "/" + this.teamCommonAssets.color_timer[this.currentMinute-1].url :this.assetsPath + "/" + this.teamCommonAssets.color_timer[this.currentMinute-1].url;
				}
				if(this.teamDown.isStillActive){
					this.teamDownGrade.nativeElement.src = this.teamCommonAssets.color_timer[this.currentMinute-1].location=="content" ? this.containgFolderPath+ "/" + this.teamCommonAssets.color_timer[this.currentMinute-1].url :this.assetsPath + "/" + this.teamCommonAssets.color_timer[this.currentMinute-1].url;
				}
				if(this.teamLeft.isStillActive){
					this.teamLeftGrade.nativeElement.src = this.teamCommonAssets.color_timer[this.currentMinute-1].location=="content" ? this.containgFolderPath+ "/" + this.teamCommonAssets.color_timer[this.currentMinute-1].url :this.assetsPath + "/" + this.teamCommonAssets.color_timer[this.currentMinute-1].url;	
				}
				if(this.teamRight.isStillActive){
					this.teamRightGrade.nativeElement.src = this.teamCommonAssets.color_timer[this.currentMinute-1].location=="content" ? this.containgFolderPath+ "/" + this.teamCommonAssets.color_timer[this.currentMinute-1].url :this.assetsPath + "/" + this.teamCommonAssets.color_timer[this.currentMinute-1].url;
				}
			}
		}

		hoverConfirm(){
			this.confirmAssets.confirm_btn = this.confirmAssets.confirm_btn_hover;
		}

		houtConfirm(){
			this.confirmAssets.confirm_btn = this.confirmAssets.confirm_btn_original;
		}

		hoverDecline(){
			this.confirmAssets.decline_btn  = this.confirmAssets.decline_btn_hover;
		}
		
		houtDecline(){
			this.confirmAssets.decline_btn  = this.confirmAssets.decline_btn_original;
		}

		hoverCloseConfirm(){
      this.confirmAssets.close_btn = this.confirmAssets.close_btn_hover;
		}
		houtCloseConfirm(){
			this.confirmAssets.close_btn = this.confirmAssets.close_btn_original;
		}

		hoverstopVideo(){
			this.otherAssets.video_stop  = this.otherAssets.video_stop_hover;
		}
		
		houtstopVideo(){
			this.otherAssets.video_stop  = this.otherAssets.video_stop_original;
		}

	/*	resetActivity(){
			const action= {
				"isWrongAttempt":false,
				"isRightAttempt":false,
				"isQuesSkipped":false,
				"isTimeCompleted":false
			};
			this.mainContainer.nativeElement.classList="consoleBase disableDiv";
			if(this.questionObj.isVideo){
				this.mainVideo.nativeElement.pause();
				this.mainVideo.nativeElement.currentTime = 0;
				setTimeout(()=>{
					this.mainVideo.nativeElement.play();
				},1000)
			}else if(this.questionObj.isImage){
				this.quesVORef.nativeElement.pause();
				this.quesVORef.nativeElement.currentTime = 0;
				setTimeout(()=>{
					this.quesVORef.nativeElement.play();
				},1000)
			}
			if(this.timerSubscription){
				this.timerSubscription.unsubscribe();
			}
			this.displayTimer = "10:00";
			this.teamUpGrade.nativeElement.src = "";
			this.teamDownGrade.nativeElement.src = "";
			this.teamLeftGrade.nativeElement.src = "";
			this.teamRightGrade.nativeElement.src = "";
			this.teamUpRef.nativeElement.classList="rowTop";
			this.teamDownRef.nativeElement.classList="rowBtm";
			this.teamLeftRef.nativeElement.classList="colLeft h-100";
			this.teamRightRef.nativeElement.classList="colRight h-100";
			if(this.topSelectedIdx>-1){
				this.teamUpRef.nativeElement.children[0].children[this.topSelectedIdx].style.transform = "scale(1.0)";
				this.topSelectedIdx = undefined;
			}
			if(this.bottomSelectedIdx>-1){
				this.teamUpRef.nativeElement.children[0].children[this.bottomSelectedIdx].style.transform = "scale(1.0)";
				this.bottomSelectedIdx = undefined;
			}
			if(this.leftSelectedIdx>-1){
				this.teamUpRef.nativeElement.children[0].children[this.leftSelectedIdx].style.transform = "scale(1.0)";
				this.leftSelectedIdx = undefined;
			}
			if(this.rightSelectedIdx>-1){
				this.teamUpRef.nativeElement.children[0].children[this.rightSelectedIdx].style.transform = "scale(1.0)";
				this.rightSelectedIdx = undefined;
			}
			this.teamUp.isStillActive = true;
			this.teamDown.isStillActive = true;
			this.teamLeft.isStillActive = true;
			this.teamRight.isStillActive = true;

			this.teamUp.action = action;
			this.teamDown.action = action;
			this.teamLeft.action = action;
			this.teamRight.action = action;
		}
		*/

		replayVideo(){
			this.totalTime = this.currentTime+ this.totalTime;
			this.videoReplayd = true;
			this.isPlayVideo = true;
			this.appModel.enableSubmitBtn(false);
			this.mainContainer.nativeElement.classList = "consoleBase disableDiv";
			this.allowSkip = true;
			setTimeout(() =>{
			this.mainVideo.nativeElement.play();
			this.mainVideo.nativeElement.onended = () =>{
				this.appModel.enableSubmitBtn(true);
			//	this.resumeActivity();
				this.isPlayVideo = false;
				this.mainContainer.nativeElement.classList = "consoleBase";
				this.appModel.videoStraming(false);
				if(this.actsTimeout){
					this.checkAttemptedOpt();
				}
			}
			},500)
		}

		/*
		resumeActivity(){
			this.isPlayVideo = false;
			if(this.currentTime>0){
				this.timeLimitGiven = this.questionObj.timeLimit*60 - this.totalTime;
			}
			this.resetTimerForAnswer();
		}
*/
		checkAnswer(teamName, opt,index){
			console.log(this.appModel.getLiveScoreObj());
			this.appModel.enableReplayBtn(false);
			let obj ={
					"url":this.scoreCardAssets.right_thumb.url,
					"location": this.scoreCardAssets.right_thumb.location,
					"rightAttempt":true,
					"action":""
				};
			if(teamName=="teamup"){
				this.topSelectedIdx = index;
				//this.teamUp.isStillActive = false;
				if(opt.index==this.feedback.teamUpCorrect.idx){
					this.objAttempt.teamUp = obj;
					this.totalRightAttempts[0] = 1;
					this.liveScoreObj.teamUpLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamUpLiveScore[this.quesIndx].green;
				}else{
					this.objAttempt.teamUp = this.scoreCardAssets.wrong_thumb;
					this.liveScoreObj.teamUpLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamUpLiveScore[this.quesIndx].red;
				}

				console.log(this.appModel.getLiveScoreObj());
				this.highLightOpt(this.teamUpRef.nativeElement.children[0],index);
			}else if(teamName=="teamdown"){
				this.bottomSelectedIdx = index;
				//this.teamDown.isStillActive = false;
				if(opt.index==this.feedback.teamDownCorrect.idx){
					this.objAttempt.teamDown = obj;
					this.totalRightAttempts[1] = 1;
					this.liveScoreObj.teamDownLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamDownLiveScore[this.quesIndx].green;
				}else{
					this.objAttempt.teamDown = this.scoreCardAssets.wrong_thumb;
					this.liveScoreObj.teamDownLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamDownLiveScore[this.quesIndx].red;
				}
				this.highLightOpt(this.teamDownRef.nativeElement.children[0],index);
				this.teamDownRef.nativeElement.classList="rowBtm disableOpt";
			}else if(teamName=="teamleft"){
				this.leftSelectedIdx = index;
				//this.teamLeft.isStillActive = false;
				if(opt.index==this.feedback.teamLeftCorrect.idx){
					this.objAttempt.teamLeft = obj;
					this.totalRightAttempts[2] = 1;
					this.liveScoreObj.teamLeftLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamLeftLiveScore[this.quesIndx].green;
				}else{
					this.objAttempt.teamLeft = this.scoreCardAssets.wrong_thumb;
					this.liveScoreObj.teamLeftLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamLeftLiveScore[this.quesIndx].red;
				}
				this.highLightOpt(this.teamLeftRef.nativeElement.children[0],index);
				this.teamLeftRef.nativeElement.classList="colLeft h-100 disableOpt";
			}else if(teamName="teamright"){
				this.rightSelectedIdx = index;
				//this.teamRight.isStillActive = false;
				if(opt.index==this.feedback.teamRightCorrect.idx){
					this.objAttempt.teamRight = obj;
					this.totalRightAttempts[3] = 1;
					this.liveScoreObj.teamRightLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamRightLiveScore[this.quesIndx].green;
				}else{
					this.objAttempt.teamRight = this.scoreCardAssets.wrong_thumb;
					this.liveScoreObj.teamRightLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamRightLiveScore[this.quesIndx].red;
				}
				this.highLightOpt(this.teamRightRef.nativeElement.children[0],index);
				this.teamRightRef.nativeElement.classList="colRight h-100 disableOpt";
			}
		}

		highLightOpt(elem,index){
			for(let i=0;i<elem.children.length;i++){
				if(i!=index){
					elem.children[i].classList = "faintOpt";
				}else{
					elem.children[i].classList = "disableDiv";
				}
			}
		}

		passQuestion(teamName,ref){
			this.appModel.enableReplayBtn(false);
			ref.src = this.otherAssets.pass_btn_red.location=="content" ? this.containgFolderPath+ "/" + this.otherAssets.pass_btn_red.url:this.assetsPath + "/" + this.otherAssets.pass_btn_red.url;
			ref.classList.add("disableDiv");
			if(teamName=="teamup"){
				this.teamUp.isStillActive = false;
				this.removeOptClasses(this.teamUpRef.nativeElement.children[0]);
				this.teamUpRef.nativeElement.children[0].classList="optionsBlock disableTeam";
				this.objAttempt.teamUp = this.scoreCardAssets.pass_icon;
				this.liveScoreObj.teamUpLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamUpLiveScore[this.quesIndx].grey;
			}else if(teamName=="teamdown"){
				this.teamDown.isStillActive = false;
				this.removeOptClasses(this.teamDownRef.nativeElement.children[0]);
				this.teamDownRef.nativeElement.children[0].classList="optionsBlock disableTeam";
				this.objAttempt.teamDown = this.scoreCardAssets.pass_icon;
				this.liveScoreObj.teamDownLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamDownLiveScore[this.quesIndx].grey;
			}else if(teamName=="teamleft"){
				this.teamLeft.isStillActive = false;
				this.removeOptClasses(this.teamLeftRef.nativeElement.children[0]);
				this.teamLeftRef.nativeElement.children[0].classList="optionsBlock text-center disableTeam";
				this.objAttempt.teamLeft = this.scoreCardAssets.pass_icon;
				this.liveScoreObj.teamLeftLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamLeftLiveScore[this.quesIndx].grey;
			}else if(teamName="teamright"){
				this.teamRight.isStillActive = false;
				this.removeOptClasses(this.teamRightRef.nativeElement.children[0]);
				this.teamRightRef.nativeElement.children[0].classList="optionsBlock text-center disableTeam";
				this.objAttempt.teamRight = this.scoreCardAssets.pass_icon;
				this.liveScoreObj.teamRightLiveScore[this.quesIndx].live_no = 	this.liveScoreObj.teamRightLiveScore[this.quesIndx].grey;
			}
		}

		removeOptClasses(elem){
			for(let i=0;i<elem.children.length;i++){
				elem.children[i].classList = "";
			}
		}

		getPausableTimer(timeout: number, pause: BehaviorSubject<boolean>): { stepTimer: Observable<any>, completeTimer: Observable<any> } {
			const pausableTimer$ = defer(() => {
			  let seconds = 1;
			  return interval(1000).pipe(
				withLatestFrom(pause),
				filter(([v, paused]) => !paused),
				take(timeout),
				map(() => seconds++)
			  )
			}).pipe(share());
		
			return { stepTimer: pausableTimer$, completeTimer: pausableTimer$.pipe(reduce((x, y) => y)) }
		  }

		  sendFeedback(ref,flag:string,action ?:string) {
			ref.classList="modal";
			if(flag=="yes"){
			/*	setTimeout(() =>{
					this.appModel.invokeTempSubject('showModal','manual');
				},100)*/
				this.openModal(action);
			}else if(flag=="no"){
				this.appModel.videoStraming(false);
			}
		}

		openModal(action){
			if(action=="submitAnswer"){
				this.checkAttemptedOpt();
				//this.timerSubscription.unsubscribe();
				this.removeSubscription();
			}
			if(action=="replay"){
				this.replayVideo();
			}
		}

		checkAttemptedOpt(){
			if(this.teamUp){
				this.removeOptClasses(this.teamUpRef.nativeElement.children[0]);
				this.teamUpRef.nativeElement.classList="rowTop disableTeam";
				if(this.objAttempt.teamUp && !this.objAttempt.teamUp.url){
					this.objAttempt.teamUp = this.scoreCardAssets.not_attempted;
				}
			}
				if(this.teamDown){
				this.removeOptClasses(this.teamDownRef.nativeElement.children[0]);
				this.teamDownRef.nativeElement.classList="rowBtm disableTeam";
					if(this.objAttempt.teamDown && !this.objAttempt.teamDown.url){
						this.objAttempt.teamDown = this.scoreCardAssets.not_attempted;
					}
				}
				if(this.teamLeft){
					this.removeOptClasses(this.teamLeftRef.nativeElement.children[0]);
				    this.teamLeftRef.nativeElement.classList="colLeft h-100 disableTeam";
					if(this.objAttempt.teamLeft && !this.objAttempt.teamLeft.url){
						this.objAttempt.teamLeft = this.scoreCardAssets.not_attempted;
					}
				}
				if(this.teamRight){
					this.removeOptClasses(this.teamRightRef.nativeElement.children[0]);
				    this.teamRightRef.nativeElement.classList="colRight h-100 disableTeam";
					if(this.objAttempt.teamRight && !this.objAttempt.teamRight.url){
						this.objAttempt.teamRight = this.scoreCardAssets.not_attempted;
					}
				}
			this.appModel.saveAttempt(this.objAttempt,this.totalRightAttempts);
			this.appModel.setLiveScore(this.liveScoreObj);
			let feedbackArray
			let feedbackObj:any = {
				"ques_img":"",
				"correct_options":{
					"teamName":"",
					"rightAns":""
				}
			}
			if(this.feedback && this.feedback.ques_feedback && this.feedback.ques_feedback.ques_img){
				this.feedback.ques_feedback.ques_img = this.feedback.ques_feedback.ques_img.location=="content" ? this.containgFolderPath + "/" + this.feedback.ques_feedback.ques_img.url : this.assetsPath + "/" + this.feedback.ques_feedback.ques_img.url;
			}
			if(this.feedback && this.feedback.feedback_base){
				this.feedback.feedback_base = this.feedback.feedback_base.location=="content" ? this.containgFolderPath + "/" + this.feedback.feedback_base.url : this.assetsPath + "/" + this.feedback.feedback_base.url;
			}
			if(this.feedback && this.feedback.ques_feedback && this.feedback.ques_feedback.correct_options){
				for(let i=0; i< this.feedback.ques_feedback.correct_options.length;i++){
					if(this.feedback.ques_feedback.correct_options[i].name){
						let teamName = this.feedback.ques_feedback.correct_options[i].name;
						this.feedback.ques_feedback.correct_options[i].name = this.teamObj[teamName].teamName.location=="content" ? this.containgFolderPath + "/" + this.teamObj[teamName].teamName.url : this.assetsPath + "/" +  this.teamObj[teamName].teamName.url;
					}
					 if(this.feedback.ques_feedback.correct_options[i].correct_opt){
						this.feedback.ques_feedback.correct_options[i].correct_opt = this.feedback.ques_feedback.correct_options[i].correct_opt.location=="content" ? this.containgFolderPath + "/" + this.feedback.ques_feedback.correct_options[i].correct_opt.url : this.assetsPath + "/" + this.feedback.ques_feedback.correct_options[i].correct_opt.url;
					}
				}
			}
			console.log(this.feedback.ques_feedback);
			this.appModel.saveFeedbackNT8(this.feedback);
			if(this.questionObj.isLastQues){
			 this.attemptSoFar = this.appModel.attempt.attemptMade;
			 for(let i=0;i<this.totalRightAttempts.length;i++){
				 this.totalCorrect.push(0);
			 }
			 console.log(this.attemptSoFar);
			 for(let i=0;i<this.attemptSoFar.length;i++){
				 for(let j in this.attemptSoFar[i]){
					 if(j=="teamUp" && this.attemptSoFar[i][j].rightAttempt){
							this.totalCorrect[0] = this.totalCorrect[0]? this.totalCorrect[0] + 1: 1;
							this.teamScore.teamUp = this.teamScore.teamUp? this.teamScore.teamUp + 1: 1;
					 }
					 if(j=="teamDown" && this.attemptSoFar[i][j].rightAttempt){
						this.totalCorrect[1] = this.totalCorrect[1]? this.totalCorrect[1] + 1: 1
						this.teamScore.teamDown = this.teamScore.teamDown? this.teamScore.teamDown + 1: 1;
					}
					if(j=="teamLeft" && this.attemptSoFar[i][j].rightAttempt){
						this.totalCorrect[2] = this.totalCorrect[2]? this.totalCorrect[2] + 1: 1
						this.teamScore.teamLeft = this.teamScore.teamLeft? this.teamScore.teamLeft + 1: 1;
					}
					if(j=="teamRight" && this.attemptSoFar[i][j].rightAttempt){
						this.totalCorrect[3] = this.totalCorrect[3]? this.totalCorrect[3] + 1: 1
						this.teamScore.teamRight = this.teamScore.teamRight? this.teamScore.teamRight + 1: 1;
					}
				 }
			 }

			 for(let i in this.scoreCardAssets.teams){
				console.log(this.scoreCardAssets.correct_imgs[this.teamScore[this.scoreCardAssets.correct_imgs[i].teamName]]);
			 }
			 console.log(this.teamScore);
			 setTimeout(() =>{
				this.scoreBoardModal.nativeElement.classList="modal displayPopup";
				this.liveScoreObj = this.appModel.getLiveScoreObj();
				this.liveScoreObjCopy = JSON.parse(JSON.stringify(this.liveScoreObj));
				this.feedbackSoFor = this.appModel.feedbackArray;
				console.log(this.feedbackSoFor);
			 },500)
			}else{
				this.appModel.nextSection();
			}
		}

		hoverCloseScoreBoard(){
			this.scoreCardAssets.close_btn = this.scoreCardAssets.close_btn_hover;
		}

		houtCloseScoreBoard(){
			this.scoreCardAssets.close_btn = this.scoreCardAssets.close_btn_original;
		}

		closeScoreBoard(){
			this.scoreBoardModal.nativeElement.classList="modal";
			this.feedbackAssts = this.feedbackSoFor[this.currentFeedback];
			setTimeout(() =>{
				this.feedbackModal.nativeElement.classList="modal displayPopup";
			},500)
		}

		endedHandleronSkip() {
			this.isPlayVideo = false;
			this.appModel.enableReplayBtn(true);
			this.appModel.videoStraming(false);
			this.appModel.enableSubmitBtn(true);
			this.appModel.navShow = 2;
			this.mainContainer.nativeElement.classList="consoleBase";
			this.isPlayVideo = false;
		}

	/*	openFeedbackPopup(){
			this.checkNextActivities();
		}*/

		nextFeedback(){
			this.currentFeedback++;
			if(this.currentFeedback < this.feedbackSoFor.length){
				this.feedbackAssts = this.feedbackSoFor[this.currentFeedback];
			}
		}

		prevFeedback(){
			this.currentFeedback--;
			if(this.currentFeedback < this.feedbackSoFor.length-1){
				this.feedbackAssts = this.feedbackSoFor[this.currentFeedback];
			}
		}

		checkNextActivities(){
			this.appModel.enableSubmitBtn(false);
		}
		hoverPass(ref){
			ref.src = this.otherAssets.pass_btn_hover.location=="content" ? this.containgFolderPath+ "/" + this.otherAssets.pass_btn_hover.url:this.assetsPath + "/" + this.otherAssets.pass_btn_hover.url;
		}
		houtPass(ref,team){
			if(team=="teamUp" && this.teamUp && this.teamUp.isStillActive){
				ref.src = this.otherAssets.pass_btn_original.location=="content" ? this.containgFolderPath+ "/" + this.otherAssets.pass_btn_original.url:this.assetsPath + "/" + this.otherAssets.pass_btn_original.url;
			}else if(team=="teamDown" && this.teamDown && this.teamDown.isStillActive){
				ref.src = this.otherAssets.pass_btn_original.location=="content" ? this.containgFolderPath+ "/" + this.otherAssets.pass_btn_original.url:this.assetsPath + "/" + this.otherAssets.pass_btn_original.url;
			}else if(team=="teamLeft" && this.teamLeft && this.teamLeft.isStillActive){
				ref.src = this.otherAssets.pass_btn_original.location=="content" ? this.containgFolderPath+ "/" + this.otherAssets.pass_btn_original.url:this.assetsPath + "/" + this.otherAssets.pass_btn_original.url;
			}else if(team=="teamRight" && this.teamRight && this.teamRight.isStillActive){
				ref.src = this.otherAssets.pass_btn_original.location=="content" ? this.containgFolderPath+ "/" + this.otherAssets.pass_btn_original.url:this.assetsPath + "/" + this.otherAssets.pass_btn_original.url;
			}
		}

		hoverFeedbackNxt(){
			this.feedback.feedback_next_btn = this.feedback.feedback_next_btn_hover;
		}
		hoverFeedbackPre(){
			this.feedback.feedback_back_btn = this.feedback.feedback_back_btn_hover;
		}
		hleaveFeedbackNxt(){
			this.feedback.feedback_next_btn = this.feedback.feedback_next_btn_original;
		}
		hleaveFeedbackPre(){
			this.feedback.feedback_back_btn = this.feedback.feedback_back_btn_original;
		}

		closeFeedbackModal(){
			this.feedbackModal.nativeElement.classList="modal";
			this.controlHandler.isNext = true;
			this.appModel.handleController(this.controlHandler);
			this.appModel.enableSubmitBtn(false);
			this.appModel.enableReplayBtn(false);
			setTimeout(()=>{
				this.appModel.blinkForLastQues();
				if(!this. appModel.eventDone){
					if(this.isLastQuesAct){
						this.appModel.eventFired();
						this.appModel.event = {'action': 'segmentEnds'};
					}
					if(this.isLastQues){
						this.appModel.event = {'action': 'end'};	
					}
				}
			},200)
		}
}
