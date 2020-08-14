import { Component, OnInit, ViewChild, HostListener,OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';
import { SharedserviceService } from '../../../services/sharedservice.service';
import { ThemeConstants } from '../../../common/themeconstants';
import { PlayerConstants } from '../../../common/playerconstants';
import 'jquery';


declare var $: any;

@Component({
	selector: 'ntemp18',
	templateUrl: './Ntemplate2.component.html',
	styleUrls: ['./Ntemplate2.component.css', '../../../view/css/bootstrap.min.css']

})

export class Ntemplate2 implements OnInit, OnDestroy {
	private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
		this.appModel = appModel;
		this.assetsPath = this.appModel.assetsfolderpath;
		this.appModel.navShow = 2;
		this.appModel.setLoader(true);
		// if error occured during image loading loader wil stop after 5 seconds 
      this.loaderTimer = setTimeout(() => {
        this.appModel.setLoader(false);
        this.checkforQVO();
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

	helpAudio: any = "";
	correctOpt: any;
	idArray: any = [];
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	attemptType: string = "";
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
	popupAssetsToShow:any;
	tempSubscription: Subscription;
	leftOptions: any;
	rightOptions: any;
	questionObj: any = [];
	root: any = document.documentElement;
	@ViewChild('leftSelected') leftSelected: any;
	@ViewChild('rightSelected') rightSelected: any;
	@ViewChild('optionsBlock') optionsBlock: any;
	@ViewChild('quesVORef') quesVORef: any;
	@ViewChild('rightFeedbackVO') rightFeedbackVO: any
	@ViewChild('wrongFeedbackVO') wrongFeedbackVO: any;
	@ViewChild('instructionVO') instructionVO:any;
	@ViewChild('instructionBar') instructionBar:any;
	@ViewChild('confirmModalRef') confirmModalRef:any;
	@ViewChild('popupRef') popupRef:any;
	@ViewChild('feedbackPopupAudio') feedbackPopupAudio:any;;
	@ViewChild('popupBodyRef') popupBodyRef:any;
	leftFrom: any = 0;
	leftTo: any = 0;
	topFrom: any = 0;
	topTo: any = 0;
	leftSelectedIdx: number;
	rightSelectedIdx: number;
	primarySelected: boolean = false;
	leftList: string = null;
	rightList: string = null;
	feedbackObj: any = null;
	leftMatchingIdx: number = null;
	rightMatchingIdx: number = null;

	displayAnswerTimer:number = 2.5;
	timerSubscription: Subscription;
	noOfRightAns:number = 0;
	confirmPopupAssets:any;
	feedbackAudio:any;
	leftOne:any;
	leftTwo:any;
	topOne:any;
	topTwo:any;
	leftOneRatio:any
	leftTwoRatio:any;
	topOneRatio:any;
	topTwoRatio:any;
	noofSubQues:number;
	optionBaseWidth:any;
	isShowAnswerDisplayed:boolean = false;
	leftCss1:any;
	topCss1:any;
	leftCss2:any;
	topCss2:any;
	checkForRandom:any;
	type:any
	/*Start: Theme Implementation(Template Changes)*/
	controlHandler = {
		isSubmitRequired:false,
		isReplayRequired:false
	};
	themePath:any;
	fetchedcontent:any;
	functionalityType:any;
	bgSubscription: Subscription;
	/*End: Theme Implementation(Template Changes)*/
	showAnsTimeout:number;

	ngAfterViewChecked() {
		this.templatevolume(this.appModel.volumeValue,this);
	}

	ngOnInit() {
		if (this.appModel.isNewCollection) {
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		this.containgFolderPath = this.getBasePath();
		/*Start: Theme Implementation(Template Changes)*/
		let fetchedData: any = this.appModel.content.contentData.data;
		this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
		this.functionalityType = this.appModel.content.contentLogic.functionalityType;
		this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/'+ this.fetchedcontent.theme_name ; 
		this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
		this.checkquesTab();
		/*End: Theme Implementation(Template Changes)*/
		this.appModel.globalJsonData.subscribe(data=>{
			this.showAnsTimeout = data.showAnsTimeout;
		});
		this.setData();
		this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
			if (mode == "manual") {
				//show modal for manual
				//this.appModel.notifyUserAction();
				this.appModel.stopAllTimer();
				if(this.popupRef && this.popupRef.nativeElement){
					this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
					this.popupRef.nativeElement.classList = "displayPopup modal";
					this.setFeedbackAudio();
				}
			}else if(mode=="auto"){
				//this.appModel.notifyUserAction();
				this.appModel.stopAllTimer();
				if(this.noOfRightAns!=this.popupAssets.length){
					//show modal of auto
					if(this.popupRef && this.popupRef.nativeElement){
						this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
						this.popupRef.nativeElement.classList = "displayPopup modal";
						this.confirmModalRef.nativeElement.classList = "modal";
					}
				}
				this.setFeedbackAudio();
			}
		})
		this.appModel.getConfirmationPopup().subscribe((val) =>{
			this.appModel.notifyUserAction();
			this.instructionVO.nativeElement.pause();
			this.instructionVO.nativeElement.currentTime = 0;
			if(val=="uttarDikhayein"){
				if(this.confirmModalRef && this.confirmModalRef.nativeElement){
					this.confirmModalRef.nativeElement.classList = "displayPopup modal";
				}
			}
		})

		this.appModel.windowResizeEvent.subscribe(() =>{
			this.windowResizeEvent();
		})

		this.appModel.questionEvent.subscribe(() =>{
			if(this.timerSubscription){
				this.timerSubscription.unsubscribe(); 
			}
			this.appModel.stopAllTimer();
		})

		this.appModel.nextBtnEvent().subscribe(() =>{
			if(this.appModel.isLastSectionInCollection){
				this.appModel.event = {'action': 'segmentEnds'};	
			}
			if(this.appModel.isLastSection){
					this.appModel.event = {'action': 'end'};
				}
		})

		this.appModel.postWrongAttempt.subscribe(() => {
			this.postWrongAttempt()
		});
		this.appModel.resetBlinkingTimer();
		this.appModel.handleController(this.controlHandler);
	}

	postWrongAttempt(){
		if(this.type == "left"){
			this.appModel.notifyUserAction();
			for (var i = 0; i < this.leftOptions.length; i++) {
				/*if (i != this.rightSelectedIdx && this.optionsBlock.nativeElement.children[0].children[i].classList != "options disableDiv reduceOpacity") {
					this.optionsBlock.nativeElement.children[0].children[i].classList = "options disableDiv";
				}*/
				if(i!=this.leftSelectedIdx){
					this.optionsBlock.nativeElement.children[0].children[i].classList.add("disableDivWrong");
				}
			}
		}
		if(this.type == "right"){
			for (var i = 0; i < this.rightOptions.length; i++) {
				/*if (i != this.rightSelectedIdx && this.optionsBlock.nativeElement.children[2].children[i].classList != "options disableDiv reduceOpacity") {
				}*/
				if(i != this.rightSelectedIdx ){
					this.optionsBlock.nativeElement.children[2].children[i].classList.add("disableDivWrong");
				}
			}
		}
	//	}, 500)
		this.optionsBlock.nativeElement.classList = "row mx-0"
		this.instructionBar.nativeElement.classList ="instructionBase";
	}

	/*getEditedPopupAssets() {
			for (let i = 0; i < this.popupAssets.length; i++) {
				if ((this.popupAssets[i].id.includes(this.leftOptions[this.leftSelectedIdx])) || (this.popupAssets[i].id.includes(this.rightOptions[this.rightSelectedIdx].id))) {
					let imglist: any = [];
					imglist.push(this.popupAssets[i]);
					for(let j =0;j<this.popupAssetsToShow.length;j++){
						if(this.popupAssets[i]===this.popupAssetsToShow[i]){
							this.popupAssetsToShow.splice(j,1);
						}
					}
				}
			}
	}*/
	ngOnDestroy() {
		/*Start: Theme Implementation(Template Changes)*/
		if(this.bgSubscription!=undefined){
		  this.bgSubscription.unsubscribe();
		}
		/*End: Theme Implementation(Template Changes)*/
		this.audio.pause();
		this.audio.currentTime = 0;
	}

	/*Start: Theme Implementation(Template Changes)*/
	checkquesTab() {
		if(this.fetchedcontent.commonassets.ques_control!=undefined) {
		  this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
		} else {
		  this.appModel.getJson();      
		}
	  }
	
	/*End: Theme Implementation(Template Changes)*/

	templatevolume(vol, obj) {
		if(obj.quesVORef && obj.quesVORef.nativeElement){
			obj.quesVORef.nativeElement.volume = obj.appModel.isMute?0:vol;
		}
		if(obj.instructionVO && obj.instructionVO.nativeElement){
			obj.instructionVO.nativeElement.volume = obj.appModel.isMute?0:vol;
		}
		if(obj.rightFeedbackVO && obj.rightFeedbackVO.nativeElement){
			obj.rightFeedbackVO.nativeElement.volume = obj.appModel.isMute?0:vol;
		}
		if(obj.wrongFeedbackVO && obj.wrongFeedbackVO.nativeElement){
			obj.wrongFeedbackVO.nativeElement.volume = obj.appModel.isMute?0:vol;
		}
		if(obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement){
			obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute?0:vol;
		}
		if(obj.audio){
			obj.audio.volume =obj.appModel.isMute?0:vol;
		}
	}

	setData() {
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			// let fetchedData: any = this.appModel.content.contentData.data;
			console.log(this.fetchedcontent);
			this.feedback = this.fetchedcontent.feedback;
			this.commonAssets = this.fetchedcontent.commonassets;
			//this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
			this.noOfImgs = this.commonAssets.imgCount;
			this.isFirstQues = this.commonAssets.isFirstQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			if(this.appModel.isLastSectionInCollection || this.appModel.isLastSection){
				this.appModel.setlastQuesNT();
			}
			this.optionObj = this.fetchedcontent.optionObj;
			this.leftOptions = this.optionObj.leftOptions;
			this.rightOptions = this.optionObj.rightOptions;
			this.optionCommonAssets = this.fetchedcontent.option_common_assets;
			console.log(this.optionCommonAssets);
			this.popupAssetsToShow = Object.assign([], this.popupAssets);
			if (this.fetchedcontent.quesObj && this.fetchedcontent.quesObj[0]) {
				this.questionObj = this.fetchedcontent.quesObj[0];
				console.log(this.questionObj.quesInstruction.url);
			}
			/*Start: Theme Implementation(Template Changes)*/
			this.controlHandler={
				isSubmitRequired:this.questionObj.submitRequired,
				isReplayRequired:this.questionObj.replayRequired
			}
			  
			console.log(this.controlHandler.isReplayRequired);
		  /*End: Theme Implementation(Template Changes)*/
			this.feedbackObj = this.fetchedcontent.feedback;
			this.popupAssets = this.feedbackObj.popupAssets;
			this.confirmPopupAssets = this.fetchedcontent.confirm_popup;
			this.noofSubQues =  this.feedbackObj.noOfSubQues;
			let scaleValue:any
			if(this.noofSubQues==3){
				scaleValue = 1.0;
				this.leftCss1 = 2+"%";
				this.topCss1 = 5+"%";
				this.leftCss2 = 50.9+"%";
				this.topCss2 = 5+"%";
			}else if(this.noofSubQues==4){
				scaleValue = 1.2;
				this.leftCss1 = 5.5+"%";
				this.topCss1 = 10.6+"%";
				this.leftCss2 = 53.8+"%";
				this.topCss2 = 10.6+"%";
		/*		if(window.innerWidth<1920){
					this.topCss1 = 14.2+"%";
					this.topCss2 = 14.2+"%";
				}*/
			}else if(this.noofSubQues==5){
				scaleValue = 1.5;
				this.leftCss1 = 9.5+"%";
				this.topCss1 = 18+"%";
				this.leftCss2 = 57.2+"%";
				this.topCss2 = 18+"%";
			/*	if(window.innerWidth<1920){
					this.topCss1 = 22.2+"%";
					this.topCss2 = 22.2+"%";
				}*/
			}else if(this.noofSubQues==6){
				scaleValue = 1.8;
				this.leftCss1 = 12+"%";
				this.topCss1 = 23+"%";
				this.leftCss2 = 60.5+"%";
				this.topCss2 = 23+"%";
			}
			this.root.style.setProperty('--scaleValue', scaleValue);
		}
	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	selectLeft(opt, idx) {
		this.instructionBar.nativeElement.classList ="instructionBase";
		if(this.timerSubscription && !this.timerSubscription.closed){
			this.timerSubscription.unsubscribe(); 
			this.appModel.startPreviousTimer();  
		}
		if(this.leftList=="pl" || this.leftList==undefined){
			this.resetTimerForAnswer('left');
		 }
		this.appModel.notifyUserAction();
		if (this.audio && !this.audio.paused) {
			//commenting to not pause the audio on selection.
			this.audio.pause();
			this.audio.currentTime = 0;
			for (let i = 0; i < this.leftOptions.length; i++) {
			/*	if (this.optionsBlock.nativeElement.children[0].children[i].classList != "options disableDiv reduceOpacity") {
					this.optionsBlock.nativeElement.children[0].children[i].classList = "options";
				}*/
				this.optionsBlock.nativeElement.children[0].children[i].classList.remove("disableDivAudio")
			}
			for (let i = 0; i < this.rightOptions.length; i++) {
				/*if (this.optionsBlock.nativeElement.children[2].children[i].classList != "options disableDiv reduceOpacity") {
					this.optionsBlock.nativeElement.children[2].children[i].classList = "options";
				}*/
				this.optionsBlock.nativeElement.children[2].children[i].classList.remove("disableDivAudio");
			}
		}
		this.optionsBlock.nativeElement.children[0].children[idx].classList = "options removeOptAnimation disableDiv";
		setTimeout(() => {
			this.primarySelected=true;
			if (this.primarySelected && this.leftSelectedIdx != -1 && this.leftList != "pl") {
				$(this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomInAnimation').addClass('zoomOutAnimation');
				if(this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx]){
					this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx].classList.remove("disableDiv");
					let idxpre = this.leftSelectedIdx;
					setTimeout(() =>{
						if(idxpre>-1){
							$(this.optionsBlock.nativeElement.children[0].children[idxpre]).removeClass('zoomOutAnimation');
						}
					},500)
				}
				//this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx].remove("disableDiv");
			}
			if (this.leftSelectedIdx > -1 && this.leftList == "pl") {
				$(this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomInAnimation').addClass('zoomOutAnimation');
				if(this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx]){
					this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx].classList.remove("disableDiv");
				}
				//this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx].remove("disableDiv");
			}
			if (this.leftList != "pl" && this.leftList != null) {
				this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
				if (this.rightMatchingIdx == opt.id) {
					this.instructionBar.nativeElement.classList ="instructionBase disableDiv";
					this.noOfRightAns++;
					this.removeAssetsFromPopup(opt.id+","+opt.matchingId);
					setTimeout(() => {
						this.checkForOtherVO();
						this.rightFeedbackVO.nativeElement.src = this.feedback.right_ans_sound[this.rightSelectedIdx ].url;
						this.stopOptionHoverAudio();
						this.rightFeedbackVO.nativeElement.play();
						this.rightFeedbackVO.nativeElement.onended = () => {
							setTimeout(() => {
								$(this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomInAnimation').addClass('zoomOutAnimation');
								$(this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomInAnimation').addClass('zoomOutAnimation');
								setTimeout(() => {
									$(this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomOutAnimation');
								    $(this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomOutAnimation');
									this.appModel.notifyUserAction();
									this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx].classList = "options disableDiv reduceOpacity";
									for (var i = 0; i < this.rightOptions.length; i++) {
									/*	if (this.optionsBlock.nativeElement.children[2].children[i].classList != "options disableDiv reduceOpacity") {
											this.optionsBlock.nativeElement.children[2].children[i].classList = "options";
										}*/
										this.optionsBlock.nativeElement.children[2].children[i].classList.remove("disableDivWrong");
									}
									this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx].classList.remove("disableDiv");
									this.primarySelected = false;
									this.checkForRandom =  setTimeout(()=>{
										this.idArray = [];
										let leftOptionsCopy = Object.assign([], this.leftOptions);
										for (let opt of leftOptionsCopy) {
											this.idArray.push(opt.id);
										}
										this.doRandomize(leftOptionsCopy);
										this.optionsBlock.nativeElement.classList = "row mx-0";
									},500)
									this.leftSelectedIdx = -1;
									this.rightSelectedIdx = -1;
									this.rightMatchingIdx = -1;
									this.leftMatchingIdx = -1;
									this.attemptType = "manual";
									this.blinkOnLastQues();
									this.timerSubscription.unsubscribe();
								}, 500)
							}, 500)
						}
					}, 500)
				} else {
					//this.timerSubscription.unsubscribe();
					setTimeout(() => {
						this.checkForOtherVO();
						this.type = "right"
						// this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
						this.stopOptionHoverAudio();
						this.wrongFeedbackVO.nativeElement.play();
						this.instructionBar.nativeElement.classList ="instructionBase disableDiv";
						this.wrongFeedbackVO.nativeElement.onended = () => {
							// this.optionsBlock.nativeElement.classList = "row mx-0";
							this.resetTimerForAnswer('right');
						//	setTimeout(() => {
								//setTimeout(() => {
									this.appModel.notifyUserAction();
									//this.wrongFeedbackVO.nativeElement.onended = () => {
										this.appModel.wrongAttemptAnimation();	
										//setTimeout(() => {
										//	setTimeout(() => {
			
									//	}, 500)
									//}
									// for (var i = 0; i < this.rightOptions.length; i++) {
									// 	/*if (i != this.rightSelectedIdx && this.optionsBlock.nativeElement.children[2].children[i].classList != "options disableDiv reduceOpacity") {
									// 	}*/
									// 	if(i != this.rightSelectedIdx ){
									// 		this.optionsBlock.nativeElement.children[2].children[i].classList.add("disableDivWrong");
									// 	}
									// }
								//}, 500)
								// this.optionsBlock.nativeElement.classList = "row mx-0";
								// this.instructionBar.nativeElement.classList ="instructionBase";
							//}, 500)
						}
					}, 500)
				}
			}
			this.leftSelectedIdx = idx;
			this.leftMatchingIdx = opt.matchingId;
			let rectFrom = this.optionsBlock.nativeElement.children[0].children[idx].getBoundingClientRect();
			let leftFrom = rectFrom.left;
			let topFrom = rectFrom.top;
			let rectTo = this.leftSelected.nativeElement.getBoundingClientRect();
			this.leftOne = rectTo.left - rectFrom.left;
			this.topOne = rectTo.top - rectFrom.top;
			this.leftOneRatio = this.leftOne/window.innerWidth;
			this.topOneRatio = this.topOne/window.innerWidth;
			this.optionsBlock.nativeElement.children[0].children[idx].style.zIndex = 500;
			this.optionsBlock.nativeElement.children[0].children[idx].classList = "options disableDiv";
			//$(this.optionsBlock.nativeElement.children[0].children[idx]).animate({ left: leftTo - ($(this.optionsBlock.nativeElement.children[0].children[idx]).width() / 2), top: topTo - ($(this.optionsBlock.nativeElement.children[0].children[idx]).height() / 2) }, 500);
			$(this.optionsBlock.nativeElement.children[0].children[idx]).animate({ left: this.leftOne, top: this.topOne}, 500).addClass('zoomInAnimation');
			if (this.leftList == null) {
				this.leftList = "pl";
				this.rightList = "sl";
				this.primarySelected = true;
			}
		}, 200)
	}

	selectRight(opt, idx) {
		this.instructionBar.nativeElement.classList ="instructionBase";
		if(this.timerSubscription && !this.timerSubscription.closed){
			this.timerSubscription.unsubscribe(); 
			this.appModel.startPreviousTimer();  
		}
		this.appModel.notifyUserAction();
		if(this.rightList=="pl" || this.rightList==undefined){
     this.resetTimerForAnswer('right');
		}
		
		if (this.audio && !this.audio.paused) {
			this.audio.pause();
			this.audio.currentTime = 0;
			for (let i = 0; i < this.leftOptions.length; i++) {
				/*if (this.optionsBlock.nativeElement.children[0].children[i].classList != "options disableDiv reduceOpacity") {
					this.optionsBlock.nativeElement.children[0].children[i].classList = "options";
				}*/
				this.optionsBlock.nativeElement.children[0].children[i].classList.remove("disableDivAudio");
			}
			for (let i = 0; i < this.rightOptions.length; i++) {
				/*if (this.optionsBlock.nativeElement.children[2].children[i].classList != "options disableDiv reduceOpacity") {
					this.optionsBlock.nativeElement.children[2].children[i].classList = "options";
				}*/
				this.optionsBlock.nativeElement.children[2].children[i].classList.remove("disableDivAudio");
			}
		}
		this.optionsBlock.nativeElement.children[2].children[idx].classList = "options removeOptAnimation disableDiv";
		setTimeout(() => {
			this.primarySelected=true;
			if ( this.primarySelected && this.rightSelectedIdx != -1 && this.rightList != "pl") {
				$(this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx]).animate({ left: 0, top: 0 }, 500).addClass('zoomOutAnimation').removeClass('zoomInAnimation');
				if(this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx]){
					this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx].classList.remove("disableDiv");
					let idxpre = this.rightSelectedIdx;
					setTimeout(() =>{
						if(idxpre>-1){
							$(this.optionsBlock.nativeElement.children[2].children[idxpre]).removeClass('zoomOutAnimation');
						}
					},500)
				}
			}
			if (this.rightSelectedIdx > -1 && this.rightList == "pl") {//options 
				$(this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx]).animate({ left: 0, top: 0 }, 500).addClass('zoomOutAnimation').removeClass('zoomInAnimation');
				if(this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx]){
					this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx].classList.remove("disableDiv");
				}
				this.rightMatchingIdx = opt.matchingId;
			}
			if (this.rightList != "pl" && this.rightList != null) {
				this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
				if (this.leftMatchingIdx == opt.id) {
					this.noOfRightAns++;
					this.removeAssetsFromPopup(opt.matchingId+","+ opt.id);
					setTimeout(() => {
						this.checkForOtherVO();
						this.rightFeedbackVO.nativeElement.src = this.feedback.single_right_ans[this.leftSelectedIdx ].url
						this.stopOptionHoverAudio();
						this.rightFeedbackVO.nativeElement.play();
						this.instructionBar.nativeElement.classList ="instructionBase disableDiv";
						this.rightFeedbackVO.nativeElement.onended = () => {
							setTimeout(() => {
								$(this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomInAnimation').addClass('zoomOutAnimation');
								$(this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomInAnimation').addClass('zoomOutAnimation');
								setTimeout(() => {
								    $(this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomOutAnimation');
								    $(this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomOutAnimation');
									this.appModel.notifyUserAction();
									this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx].classList = "options disableDiv reduceOpacity";
									for (var i = 0; i < this.leftOptions.length; i++) {
									/*	if (this.optionsBlock.nativeElement.children[0].children[i].classList != "options disableDiv reduceOpacity") {
											this.optionsBlock.nativeElement.children[0].children[i].classList = "options";
										}*/
										this.optionsBlock.nativeElement.children[0].children[i].classList.remove("disableDivWrong");
									}
									this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx].classList.remove("disableDiv");
									this.primarySelected = false;
									this.checkForRandom = setTimeout(()=>{
										this.idArray = [];
									let rightOptionsCopy = Object.assign([], this.rightOptions);
									for (let opt of rightOptionsCopy) {
										this.idArray.push(opt.id);
									}
										this.doRandomize(rightOptionsCopy);
										this.optionsBlock.nativeElement.classList = "row mx-0";
									},500)
									this.leftSelectedIdx = -1;
									this.rightSelectedIdx = -1;
									this.rightMatchingIdx = -1;
									this.leftMatchingIdx = -1;
									this.timerSubscription.unsubscribe();
									this.attemptType = "manual";
									this.blinkOnLastQues();
								}, 500)
							}, 500)
						}
					}, 500)
				} else {
					//this.timerSubscription.unsubscribe();
					setTimeout(() => {
						this.type = "left"
						this.checkForOtherVO();
						console.log("i am in the wrong option selected block--------->")
						this.stopOptionHoverAudio();
						this.wrongFeedbackVO.nativeElement.play();
						this.instructionBar.nativeElement.classList ="instructionBase disableDiv";
						this.wrongFeedbackVO.nativeElement.onended = () => {
							this.appModel.wrongAttemptAnimation();	
							this.resetTimerForAnswer('left');
							//setTimeout(() => {
							//	setTimeout(() => {

						//	}, 500)
						}
					}, 500)
				}
			}
			this.rightSelectedIdx = idx;
			this.rightMatchingIdx = opt.matchingId;
			let rectFrom = this.optionsBlock.nativeElement.children[2].children[idx].getBoundingClientRect();
			let leftFrom = rectFrom.left;
			let topFrom = rectFrom.top;
			let rectTo = this.rightSelected.nativeElement.getBoundingClientRect();
			this.leftTwo = rectTo.left - rectFrom.left;
			this.topTwo = rectTo.top - rectFrom.top ;
			this.leftTwoRatio = this.leftTwo/window.innerWidth;
			this.topTwoRatio = this.topTwo/window.innerWidth;
			this.optionsBlock.nativeElement.children[2].children[idx].style.zIndex = 500;
		//	$(this.optionsBlock.nativeElement.children[2].children[idx]).animate({ left: leftTo - ($(this.optionsBlock.nativeElement.children[2].children[idx]).width() / 2), top: topTo - ($(this.optionsBlock.nativeElement.children[2].children[idx]).height() / 2) }, 500);
		$(this.optionsBlock.nativeElement.children[2].children[idx]).animate({ left: this.leftTwo, top: this.topTwo}, 500).addClass('zoomInAnimation');
			if (this.rightList == null) {
				this.primarySelected = true;
				this.rightList = "pl"
				this.leftList = "sl";
			}
		}, 200)
	}

	checkForOtherVO(){
		if(this.instructionVO && this.instructionVO.nativeElement && !this.instructionVO.nativeElement.paused){
			this.instructionVO.nativeElement.pause();
			this.instructionBar.nativeElement.currentTime = 0;
		}
	}
	stopOptionHoverAudio(){
		if (this.audio && !this.audio.paused) {
			//commenting to not pause the audio on selection.
			this.audio.pause();
			this.audio.currentTime = 0;
			for (let i = 0; i < this.leftOptions.length; i++) {
			/*	if (this.optionsBlock.nativeElement.children[0].children[i].classList != "options disableDiv reduceOpacity") {
					this.optionsBlock.nativeElement.children[0].children[i].classList = "options";
				}*/
				this.optionsBlock.nativeElement.children[0].children[i].classList.remove("disableDivAudio")
			}
			for (let i = 0; i < this.rightOptions.length; i++) {
				/*if (this.optionsBlock.nativeElement.children[2].children[i].classList != "options disableDiv reduceOpacity") {
					this.optionsBlock.nativeElement.children[2].children[i].classList = "options";
				}*/
				this.optionsBlock.nativeElement.children[2].children[i].classList.remove("disableDivAudio");
			}
		}
	}
removeAssetsFromPopup(id:string){
		for(let i=0;i<this.popupAssetsToShow.length;i++){
			if(this.popupAssetsToShow[i].id ==id){
				this.popupAssetsToShow.splice(i,1);
			}
		}
	}

	blinkOnLastQues(){
		if((this.appModel.isLastSectionInCollection && this.noOfRightAns== this.feedbackObj.noOfSubQues) || (this.appModel.isLastSectionInCollection && this.isShowAnswerDisplayed)){
			this.appModel.blinkForLastQues(this.attemptType);
			this.appModel.stopAllTimer();
			this.disableScreen();
			if(!this. appModel.eventDone){
				if(this.isLastQuesAct){
					this.appModel.eventFired();
					this.appModel.event = {'action': 'segmentEnds'};
				}
				if(this.isLastQues){
					this.appModel.event = {'action': 'end'};	
				}
			}
		}else if(this.noOfRightAns== this.feedbackObj.noOfSubQues || this.isShowAnswerDisplayed){
			if(this.isShowAnswerDisplayed)
			{
				this.appModel.moveNextQues();
			}
			else { this.appModel.moveNextQues(this.attemptType);

			this.disableScreen();}
		}else{
			this.instructionBar.nativeElement.classList ="instructionBase";
		}
	}

	
	disableScreen(){
			//add class  to reduce opacity
			//this.optionsBlock.nativeElement.classList = "row mx-0 reduceOpacity";
			clearTimeout(this.checkForRandom);
			for(let i=0;i<this.leftOptions.length;i++){
				this.optionsBlock.nativeElement.children[0].children[i].classList="options reduceOpacity";
			}
			this.optionsBlock.nativeElement.children[1].children[0].classList="img-fluid reduceOpacity";
			for(let i=0;i<this.rightOptions.length;i++){
				this.optionsBlock.nativeElement.children[2].children[i].classList="options reduceOpacity";
			}
			this.instructionBar.nativeElement.classList ="instructionBase reduceOpacity";
  }

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

	checkImgLoaded() {
		if (!this.loadFlag) {
			this.noOfImgsLoaded++;
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				this.appModel.setLoader(false);
				this.loadFlag = true;
				clearTimeout(this.loaderTimer);
				this.checkforQVO();
			}
		}
	}

	checkforQVO(){
    if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
			this.quesVORef.nativeElement.src = this.questionObj.quesInstruction.url+"?someRandomSeed="+ Math.random().toString(36);
			this.appModel.handlePostVOActivity(true);
			this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
			this.instructionBar.nativeElement.classList ="instructionBase disableDiv";
			this.quesVORef.nativeElement.play();
			this.quesVORef.nativeElement.onended = () => {
				this.optionsBlock.nativeElement.classList = "row mx-0";
				this.instructionBar.nativeElement.classList ="instructionBase";
				this.appModel.handlePostVOActivity(false);
			}
		} else {
			this.appModel.handlePostVOActivity(false);
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
		var flag = this.arraysIdentical(array, this.idArray);
		if (flag) {
			this.doRandomize(array);
		}
		else {
			if (this.leftList != "pl") {
				this.leftOptions = Object.assign([], array);
			} else {
				this.rightOptions = Object.assign([], array);
			}
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

	

	playSound(soundAssets, idx, side) {
		if(this.audio && this.audio.paused){
			if (soundAssets.location == 'content') {
				this.audio.src = soundAssets.url;
			} else {
				this.audio.src = soundAssets.url;
			}
			let optionEnabled = false;
			this.audio.load();
			this.audio.play();
			this.instructionBar.nativeElement.classList ="instructionBase disableDiv";
			this.instructionVO.nativeElement.pause();
			this.instructionVO.nativeElement.currentTime = 0;
			this.audio.onended = () => {
				optionEnabled = false;
				this.instructionBar.nativeElement.classList ="instructionBase";
				for (let i = 0; i < this.leftOptions.length; i++) {
					//if (this.optionsBlock.nativeElement.children[0].children[i].classList != "options disableDiv reduceOpacity") {
						if (this.leftSelectedIdx != i) {
							this.optionsBlock.nativeElement.children[0].children[i].classList.remove("disableDivAudio");
						}
					//}
	
				}
				for (let i = 0; i < this.rightOptions.length; i++) {
				//	if (this.optionsBlock.nativeElement.children[2].children[i].classList != "options disableDiv reduceOpacity") {
						if (this.rightSelectedIdx != i) {
							this.optionsBlock.nativeElement.children[2].children[i].classList.remove("disableDivAudio");
					//	}
					}
				}
			}
			for (let i = 0; i < this.leftOptions.length; i++) {
				if (side == "left" && i == idx) {
					optionEnabled = true;
				} else {
					//if (this.optionsBlock.nativeElement.children[0].children[i].classList != "options disableDiv reduceOpacity") {
						this.optionsBlock.nativeElement.children[0].children[i].classList.add("disableDivAudio");
					//}
				}
			}
			for (let i = 0; i < this.rightOptions.length; i++) {
				if (side == "right" && idx == i ) {
					optionEnabled = true;
				} else {
					//if (this.optionsBlock.nativeElement.children[2].children[i].classList != "options disableDiv reduceOpacity") {
						this.optionsBlock.nativeElement.children[2].children[i].classList.add("disableDivAudio");
					//}
				}
			}
		}
	}

	playOptionHover(opt, idx, side) {
		this.appModel.notifyUserAction();
		if (opt && opt.imgsrc_audio && opt.imgsrc_audio.url) {
			this.playSound(opt.imgsrc_audio, idx, side);
		}
	}

	hoverRightOption(opt,idx) {
		this.removeOptionAnimation(idx, "right");
		this.playOptionHover(opt,idx, 'right');
	}
	hoverLeftOption(opt,idx) {
		this.removeOptionAnimation(idx, "left");
		this.playOptionHover(opt,idx, 'left');
	}
	houtLeftOption(idx) {
		/*if (this.optionsBlock.nativeElement.children[0].children[idx].classList == "options disableDiv") {
			this.optionsBlock.nativeElement.children[0].children[idx].classList = "options disableDiv removeOptAnimation";
		} else {
			this.optionsBlock.nativeElement.children[0].children[idx].classList = "options removeOptAnimation";
		}*/
		this.optionsBlock.nativeElement.children[0].children[idx].classList.add("removeOptAnimation");
		setTimeout(() => {
		/*	if (this.optionsBlock.nativeElement.children[0].children[idx].classList == "options disableDiv removeOptAnimation") {
				this.optionsBlock.nativeElement.children[0].children[idx].classList = "options disableDiv";
			} else {
				this.optionsBlock.nativeElement.children[0].children[idx].classList = "options";
			}*/
			//this.optionsBlock.nativeElement.children[0].children[idx].classList.remove("removeOptAnimation");
			$(this.optionsBlock.nativeElement.children[0].children[idx]).removeClass('optionAnimate').removeClass('removeOptAnimation');
		}, 200)
		
	}
	houtRightOption(idx) {
		/*if (this.optionsBlock.nativeElement.children[2].children[idx].classList == "options disableDiv") {
			this.optionsBlock.nativeElement.children[2].children[idx].classList = "options disableDiv removeOptAnimation";
		} else {
			this.optionsBlock.nativeElement.children[2].children[idx].classList = "options removeOptAnimation";
		}*/
		this.optionsBlock.nativeElement.children[2].children[idx].classList.add("removeOptAnimation");
		setTimeout(() => {
		/*	if (this.optionsBlock.nativeElement.children[2].children[idx].classList == "options disableDiv removeOptAnimation") {
				this.optionsBlock.nativeElement.children[2].children[idx].classList = "options disableDiv";
			} else {
				this.optionsBlock.nativeElement.children[2].children[idx].classList = "options";
			}*/
			//this.optionsBlock.nativeElement.children[2].children[idx].classList.remove("removeOptAnimation")
			$(this.optionsBlock.nativeElement.children[2].children[idx]).removeClass('optionAnimate').removeClass('removeOptAnimation');
		}, 200)
	}

	resetTimerForAnswer(flag:string) {
		if(this.timerSubscription){
			this.timerSubscription.unsubscribe(); 
		}
		this.appModel.stopAllTimer();
		const interval = 1000;
		const showAnsInterval = this.displayAnswerTimer*60;
		this.timerSubscription = timer(0, interval).pipe(
		  take(showAnsInterval)
		).subscribe(value =>
			this.removeSubscription((showAnsInterval - +value) * interval,flag),
		  err => {
			  //console.log("error occuered....");
		   },
		  () => {
				this.timerSubscription.unsubscribe(); 
				this.appModel.startPreviousTimer();  
				this.selectCorrectOption(flag) ;        
		  }
		)
	  }

	  removeSubscription(timer,flag){
		//this.timerSubscription.unsubscribe();  
		console.log("waiting for autoselect",timer/1000);
	  }

	  selectCorrectOption(flag){
		  if(flag=="right"){
				for(let i=0;i<this.leftOptions.length;i++){
					if(this.rightMatchingIdx==this.leftOptions[i].id){
						this.selectLeft(this.leftOptions[i],i);
					}
				}
			}
		if(flag=="left"){
			for(let i=0;i<this.rightOptions.length;i++){
				if(this.leftMatchingIdx==this.rightOptions[i].id){
					this.selectRight(this.rightOptions[i],i);
				}
			}
		}
	  }

	removeOptionAnimation(idx, side) {
		if (side == "left") {
				this.optionsBlock.nativeElement.children[0].children[idx].classList = "options optionAnimate";
			}
			if (side == "right") {
					this.optionsBlock.nativeElement.children[2].children[idx].classList = "options optionAnimate";
			}
		}

		playInstruction(){
			this.appModel.notifyUserAction();
			if(this.instructionVO.nativeElement && this.instructionVO.nativeElement.src){
				this.instructionBar.nativeElement.classList = "instructionBase disableDiv";
				this.instructionVO.nativeElement.play();
				this.instructionVO.nativeElement.onended = () =>{
					this.instructionBar.nativeElement.classList = "instructionBase";
				}
			}
		}

		hoverConfirm(){
			this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
		}

		houtConfirm(){
			this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
		}

		hoverDecline(){
			this.confirmPopupAssets.decline_btn  = this.confirmPopupAssets.decline_btn_hover;
		}
		
		houtDecline(){
			this.confirmPopupAssets.decline_btn  = this.confirmPopupAssets.decline_btn_original;
		}

		hoverCloseConfirm(){
      this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
		}
		houtCloseConfirm(){
			this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
		}

		hoverClosePopup(){
      this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_hover;
		}

		houtClosePopup(){
			this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_original;
		}

		sendFeedback(id:string,flag:string) {
			this.appModel.notifyUserAction();
			this.confirmModalRef.nativeElement.classList="modal";
			if(flag=="yes"){
				setTimeout(() =>{
					this.appModel.resetBlinkingTimer();
					this.appModel.invokeTempSubject('showModal','manual');
				},100)
			}
		}

		closeModal(){
		//	this.appModel.notifyUserAction();
			this.isShowAnswerDisplayed = true;
			this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
			if(this.leftSelectedIdx>-1){
				$(this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomInAnimation').addClass('zoomOutAnimation');
			}
			if(	this.rightSelectedIdx>-1){
				$(this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx]).animate({ left: 0, top: 0 }, 500).removeClass('zoomInAnimation').addClass('zoomOutAnimation');
			}
			if(this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children.length){
				for(let i =0;i<this.popupBodyRef.nativeElement.children.length;i++){
					this.popupBodyRef.nativeElement.children[i].classList = "options";
				}
			}
			if(this.feedbackPopupAudio && this.feedbackPopupAudio.nativeElement){
				this.feedbackPopupAudio.nativeElement.pause();
				this.feedbackPopupAudio.nativeElement.currentTime = 0;
			}
			setTimeout(()=>{
				this.popupRef.nativeElement.classList = "modal";
				this.attemptType = "nblink"
				this.blinkOnLastQues();
			},100)
			this.disableScreen();
		}

		setFeedbackAudio(){
			if(this.instructionVO && this.instructionVO.nativeElement){
				this.instructionVO.nativeElement.pause();
		    this.instructionVO.nativeElement.currentTime = 0;
			}
			if(this.rightFeedbackVO && this.rightFeedbackVO.nativeElement){
				this.rightFeedbackVO.nativeElement.pause();
		    this.rightFeedbackVO.nativeElement.currentTime = 0;
			}
			if(this.wrongFeedbackVO && this.wrongFeedbackVO.nativeElement){
				this.wrongFeedbackVO.nativeElement.pause();
		    this.wrongFeedbackVO.nativeElement.currentTime = 0;
			}
			if(this.timerSubscription){
				this.timerSubscription.unsubscribe(); 
			}
			let checkDom = setInterval(() => {
				if(this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0]){
					clearInterval(checkDom);
					this.playFeedbackAudio(0);
				}
				}, 100)
		}

		playFeedbackAudio(i:number){
			let current = i;
			if(this.popupAssets[i] && this.popupAssets[i].feedbackAudio){
				this.feedbackAudio = this.popupAssets[i].feedbackAudio;
				this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url+"?someRandomSeed="+ Math.random().toString(36);
				console.log(this.feedbackPopupAudio.nativeElement.src);
				this.feedbackPopupAudio.nativeElement.play();
				if(this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[i]){
					this.popupBodyRef.nativeElement.children[i].classList = "options optionAnimate";
				}
				this.feedbackPopupAudio.nativeElement.onended = () =>{
					this.popupBodyRef.nativeElement.children[i].classList = "options";
					++current;
					this.playFeedbackAudio(current);
			}
		}else{
		setTimeout(()=>{
			this.closeModal();
		},this.showAnsTimeout)
		}
		}

		windowResizeEvent(){
			if(this.noofSubQues==4){
				this.leftCss1 = 3+"%";
				this.topCss1 = 14.5+"%";//14.2
				this.leftCss2 = 53.5+"%";
				this.topCss2 = 14.5+"%";
				if(window.innerWidth<1920){
					this.topCss1 = 14.2+"%";
					this.topCss2 = 14.2+"%";
				}
			}else if(this.noofSubQues==5){
				this.leftCss1 = 8+"%";
				this.topCss1 = 22.3+"%"; 
				this.leftCss2 = 58.6+"%";
				this.topCss2 = 22.3+"%";
				if(window.innerWidth<1920){
					this.topCss1 = 22.2+"%";
					this.topCss2 = 22.2+"%";
				}
			}
			if(this.leftSelectedIdx>-1){
				this.leftOne = this.leftOneRatio*window.innerWidth;
				this.topOne = this.topOneRatio*window.innerWidth;
				$(this.optionsBlock.nativeElement.children[0].children[this.leftSelectedIdx]).animate({ left: this.leftOne, top: this.topOne}, 0);
			}
			if(this.rightSelectedIdx>-1){
				this.leftTwo = this.leftTwoRatio*window.innerWidth;
				this.topTwo = this.topTwoRatio*window.innerWidth;
				$(this.optionsBlock.nativeElement.children[2].children[this.rightSelectedIdx]).animate({ left: this.leftTwo, top: this.topTwo}, 0);
			}
		}
}
