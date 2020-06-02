import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { PlayerConstants } from '../common/playerconstants';
import 'jquery';
import { Subscription } from 'rxjs'
import { setInterval, clearInterval } from 'timers';


declare var $: any;

@Component({
	selector: 'temp16',
	templateUrl: '../view/layout/Ntemplate16.component.html',
	styleUrls: ['../view/css/Ntemplate16.component.css', '../view/css/bootstrap.min.css'],

})

export class Ntemplate16 implements OnInit {
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
	@ViewChild('correctAns') correctAns: any;
	@ViewChild('burst') burst: any;
	@ViewChild('optionBlock') optionBlock: any;
	@ViewChild('container') containerBlock: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('maincontent') maincontent: any;
	@ViewChild('helpBtn') helpBtn: any;
	@ViewChild('titleAudio') titleAudio: any;
	@ViewChild('titleHelpAudio') titleHelpAudio: any;
	@ViewChild('clapSound') clapSound: any;
	@ViewChild('buzzerSound') buzzerSound: any;
	@ViewChild('navBlock') navBlock: any;
	@ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer: any;
	@ViewChild('wrongFeedback') wrongFeedback: any;
	@ViewChild('narrator') narrator: any;
	@ViewChild('instruction') instruction: any;
	@ViewChild('confirmModalRef') confirmModalRef: any;
	@ViewChild('mainVideo') mainVideo: any;
	@ViewChild('confirmReplayRef') confirmReplayRef: any;
	@ViewChild("optionImage") optionImage: any;

	countdown:number = 10;
	audio = new Audio();
	blink: boolean = false;
	currentIdx = 0;
	quesInfo: any = "";
	optionslist: any = [];
	optionslist_main: any = "";
	myoption: any = [];
	question: any = "";
	feedback: any = "";
	idArray: any = [];
	showIntroScreen: boolean = true;
	ansList: any = [];
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isAutoplayOn: boolean;
	isLastQuesAct: boolean;
	showFormat: boolean;
	selectedAns: any = [];
	blinkState1: any = "";
	blinkState2: any = "";
	blinkIndex: number = 0;
	optionToSelect: any;
	noOfRightAns: number = 0;
	commonAssets: any;
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	confirmPopupAssets: any;
	disableHelpBtn: boolean = false;
	containgFolderPath: string = "";
	assetsPath: string = "";
	loadFlag: boolean = false;
	hasEventFired: boolean = false;
	wrongImgOption: any;
	feedbackPopup: any;
	rightPopup: any;
	ifWrongAns: boolean = false;
	wrongPopup: any;
	popUpObj: any;
	aksharOnDisplay; any;
	attemptType: string = "";
	quesObj: any;
	tempSubscription: Subscription;
	feedbackObj:any;
	isPlayVideo: boolean;
	videoReplayd: boolean;
	replayconfirmAssets: any;
	tempTimer:any;
	wrongTimer:any;
	closed:boolean = false;
	PlayPauseFlag:boolean = true;
	controlHandler = {
		isShowAns:false,
		isTab:true
	 };
	playHoverInstruction() {
		this.appModel.notifyUserAction();
		if (!this.narrator.nativeElement.paused) {
			console.log("narrator/instruction voice still playing");
		} else {
			console.log("play on Instruction");
			if (this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.play();
				this.instruction.nativeElement.onended = () => {
					// $("#ansBlock .options").removeClass("disable_div");
					// $("#ansBlock").css("pointer-events", 'auto');
				}
				$(".instructionBase img").css("cursor", "pointer");
				// $("#ansBlock .options").addClass("disable_div");
				// $("#ansBlock").css("pointer-events", 'none');
			}

		}
	}

	hoverDecline() {
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
	}

	houtDecline() {
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
	}

	onHoverHelp() {
		this.quesInfo.help_btn = this.quesInfo.help_btn_hover;
	}
	onHoverHelpOut() {
		this.quesInfo.help_btn = this.quesInfo.help_btn_original;
	}
	hoverConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
	}

	houtConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
	}
	hoverCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
	}
	houtCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
	}

	onHoverZaariRakhein() {
		this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_hover;
	}
	onHoverOutZaariRakhein() {
		this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_original;
	}
	onHoverAageyBadheinBtn() {
		this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_hover;
	}
	onLeaveAageyBadheinBtn() {
		this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
	}
	onHoverPeecheyBtn() {
		this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_hover;
	}
	onLeavePeecheyBtn() {
		this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
	}

	houtonReplayDecline() {
		this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_original;
	  }

	hoveronReplayConfirm() {
		this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_hover;
	  }
	
	  houtonReplayConfirm() {
		this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
	  }

	  hoveronReplayDecline() {
		this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_hover;
	  }

	onHoverOption(opt, index) {
		//console.log(this.optionBlock.nativeElement);
		//this.optionBlock.nativeElement.children[1].children[index].children[0].src = this.quesInfo.opt_bgImgsrc_hover;
		opt.bgImgsrc = opt.bgImgsrc_hover;
		//this.quesInfo.opt_bgImgsrc = this.quesInfo.opt_bgImgsrc_hover;
		if (opt.sound) {
			this.playSound(opt.sound);
		}
	}

	optionHover(opt, i) {
		this.appModel.notifyUserAction();
		$(this.optionImage.nativeElement.children[i]).addClass("scaleInAnimation");
	  }

	// onHoverOptionOut(opt, index) {
	// 	if (opt.imgsrc != "") {
	// 		opt.bgImgsrc = opt.bgImgsrc_original;
	// 	}

	// 	//this.optionBlock.nativeElement.children[1].children[index].children[0].src = this.quesInfo.original_opt_bgImgsrc;
	// }

	ngAfterViewChecked() {
		if (this.titleAudio && this.titleAudio.nativeElement) {
			this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
			}
		}
		/* this.titleAudio.nativeElement.onvolumechange(()=>{
			 
			 console.log(this.titleAudio.nativeElement.volume);
		 })*/
		this.templatevolume(this.appModel.volumeValue, this);
		

	}

	
	runCounter(){
		console.log(document.getElementById("circle1"))
		this.appModel.enableReplayBtn(false)
		console.log("this.quesInfo.formatTimeout",this.quesInfo.formatTimeout)
		this.countdown = (this.quesInfo.formatTimeout)/1000;
		if(document.getElementById("circle1")){
			document.getElementById("circle1").style.animationDuration = this.countdown+ 's';
		}
	
		let timeTicking = setInterval(() =>{	
		console.log("this.countdown",this.countdown)
		if(this.countdown < 0 ){
				clearInterval(timeTicking);
		}
		else 		this.countdown = --this.countdown 

		}, 1000);
	}

	closeTitleScreen() {
		this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
		setTimeout(() => {
			this.next();
		}, 200)

	}

	
	// previous function
	previous() {
		this.isLastQues = false;

		if (this.quesInfo) {
			this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
			this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
		}
		this.appModel.setLoader(true);
		if (this.maincontent && this.maincontent.nativeElement) {
			this.maincontent.nativeElement.className = "";
		}
		if (this.optionBlock && this.optionBlock.nativeElement) {
			this.optionBlock.nativeElement.className = "d-flex align-items-center justify-content-center";
		}
		this.audio.pause();
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
		}
		/*this.maincontent.nativeElement.style.visibility="hidden";
		setTimeout(()=>{
			this.maincontent.nativeElement.style.visibility="visible";
		},200)*/
		// remove blinking if exist
		this.blink = false;
		this.appModel.previousSection();
		//this.setData();
	}

	// next function
	next() {
		if (!this.hasEventFired) {
			if (this.isLastQuesAct) {
				this.hasEventFired = true;
				this.appModel.event = { 'action': 'segmentEnds' };
			}
			if (this.isLastQues) {
				this.appModel.event = { 'action': 'end' };
			}
		}
		if (this.quesInfo) {
			this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
			this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
		}

		if (!this.isLastQues) {
			if (this.maincontent && this.maincontent.nativeElement) {
				this.maincontent.nativeElement.className = "";
			}
			if (this.optionBlock && this.optionBlock.nativeElement) {
				this.optionBlock.nativeElement.className = "d-flex align-items-center justify-content-center";
			}
			//this.currentIdx = this.appModel.currentSection-1;
			this.audio.pause();
			if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
				this.titleHelpAudio.nativeElement.pause();
				this.titleHelpAudio.nativeElement.currentTime = 0;
			}
			this.appModel.nextSection();
			this.appModel.setLoader(true);
			//this.setData();
		}
	}
	playSound(sound) {
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
		}
		this.audio.pause();
		this.audio.src = sound;
		this.audio.load();
		this.audio.play();
	}
	playSoundHelp() {
		if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
			if (this.maincontent) {
				this.maincontent.nativeElement.className = "disable_div";
			}
			this.titleHelpAudio.nativeElement.pause();
			this.titleHelpAudio.nativeElement.currentTime = 0;
			this.titleHelpAudio.nativeElement.play();
			this.titleHelpAudio.nativeElement.onended = () => {
				if (this.maincontent) {
					this.maincontent.nativeElement.className = "";
				}
			}
		}
	}

	checkRightAnswer(opt) {
		if (opt.custom_id == this.optionToSelect.custom_id) {
			return true;
		} else {
			return false;
		}
	}

	checkAnswer(opt, index) {
		this.controlHandler.isTab = false;
		this.appModel.handleController(this.controlHandler);
		this.maincontent.nativeElement.className = "disable_div";
		this.onHoverOptionOut(opt,index);
		this.appModel.notifyUserAction();
		this.disableHelpBtn = true;
		this.titleHelpAudio.nativeElement.pause();
		this.titleHelpAudio.nativeElement.currentTime = 0;
		this.instruction.nativeElement.pause();
		this.instruction.nativeElement.currentTime = 0;
		this.appModel.handlePostVOActivity(true);
		this.appModel.enableReplayBtn(false);
		// logic to check what user has done is correct or wrong
		if (this.checkRightAnswer(opt)) {
			this.blinkState1 = "";
			this.blinkState2 = "";
			this.noOfRightAns++;
			this.ansList.push(opt);
			//Analytics
			if (this.noOfRightAns == this.feedback.correct_ans_index.length) {
				this.appModel.enableReplayBtn(false)
				this.controlHandler.isTab = false;
				this.appModel.handleController(this.controlHandler);
				//highlight options
				this.appModel.handlePostVOActivity(true)
				this.optionBlock.nativeElement.className = "optionsBlock disable_div";
				{
					this.ansList.forEach(element => {
						element.filled_img = element.filled_img_green
					});
				}
				opt.bgImgsrc = opt.bgImgsrc_empty;
				opt.imgsrc = "";
				//fireworks 
				setTimeout(() => {
					if (this.clapSound && this.clapSound.nativeElement) {
						this.clapSound.nativeElement.play();
					}
					//disable option and question on right attempt
					
					this.clapSound.nativeElement.onended = () => {
						//new code
					this.maincontent.nativeElement.className = "disable_div";
					this.optionBlock.nativeElement.className = "optionsBlock disable_div disable-click";
					this.controlHandler.isTab = true;
					this.appModel.handleController(this.controlHandler);
							$("#optionsBlock ").addClass("disable-click disable-click");
							$("#instructionBar").addClass("disable_div disable-click");
						setTimeout(() => {
							this.controlHandler.isTab = true;
							this.appModel.handleController(this.controlHandler);
							this.attemptType = "manual";
							//disable option and question on right attempt
							console.log("disable option and question on right attempt");
							this.appModel.handlePostVOActivity(false)
							this.blinkOnLastQues()
						}, 200)
					}
				}, 200)

			} else {
				opt.bgImgsrc = opt.bgImgsrc_empty;
				opt.imgsrc = "";
				this.blinkIndex++;

				if (this.clapSound && this.clapSound.nativeElement) {
					this.optionBlock.nativeElement.className = "optionsBlock disable_div";
					this.clapSound.nativeElement.play();
				}
				this.clapSound.nativeElement.onended = () => {
					this.appModel.handlePostVOActivity(false);
					this.appModel.enableReplayBtn(true);
					this.controlHandler.isTab = true;
					this.appModel.handleController(this.controlHandler);
					this.maincontent.nativeElement.className = "";
					this.optionBlock.nativeElement.className = "optionsBlock";
					if (this.blinkIndex < this.feedback.correct_ans_index.length) {
						let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
						for (var i in this.myoption) {
							if (this.myoption[i].custom_id == rightOptIdx) {
								this.optionToSelect = this.myoption[i];
							}
						}
						//this.optionToSelect = this.myoption[rightOptIdx];
						setTimeout(() => {
							this.blinkState1 = this.optionToSelect.blink_state1;
							this.blinkState2 = this.optionToSelect.blink_state2;
						}, 200)
						this.aksharOnDisplay = this.optionToSelect.aksharImg.url;
	
					}
				}
				
			}
		} else {
			//new code

			// var rightOption = this.myoption[this.feedback.correct_ans_index[this.blinkIndex]]
			this.popUpObj = opt;
			this.ifWrongAns = true;
			this.feedbackPopup = this.wrongPopup;
			this.appModel.enableReplayBtn(false);
			this.wrongImgOption = opt  //setting wrong image options
			this.optionBlock.nativeElement.className = "optionsBlock disable_div";
			let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
			correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";

			//this.appModel.stopAllTimer();
			//play wrong feed back audio

			setTimeout(() => {
				if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
					this.wrongFeedback.nativeElement.play();
				}
			}, 50)

			
			this.wrongFeedback.nativeElement.onended = () => {
				
					this.wrongTimer = setTimeout(() => {
						this.correctAns.nativeElement.classList = "modal";
						this.appModel.notifyUserAction();
						if(!this.closed){
						this.appModel.wrongAttemptAnimation();
						this.maincontent.nativeElement.className = "";
						this.appModel.handlePostVOActivity(false);
						this.appModel.enableReplayBtn(true);
						this.controlHandler.isTab = true;
						this.appModel.handleController(this.controlHandler);	
						}
					}, 2000);
				
			}
		}
	}

	resetSelectedState() {
		this.ansList.splice(0, this.ansList.length);
		this.noOfRightAns = 0;
		this.blinkIndex = 0;
		this.blinkState1 = "";
		this.blinkState2 = "";
		this.aksharOnDisplay = "";
		let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];

		for (let i in this.myoption) {
			this.myoption[i].imgsrc = this.myoption[i].imgsrc_original;
			this.myoption[i].bgImgsrc = this.myoption[i].bgImgsrc_original;
			if (this.myoption[i].custom_id == rightOptIdx) {
				this.optionToSelect = this.myoption[i];
			}
		}

		setTimeout(() => {
			this.blinkState1 = this.optionToSelect.blink_state1;
			this.blinkState2 = this.optionToSelect.blink_state2;
		}, 200)
		this.aksharOnDisplay = this.optionToSelect.aksharImg.url;

	}

	removeEvents() {
		this.correctAns.nativeElement.className = "d-flex align-items-center justify-content-center hideit"
	}

	close() {
		//this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
		this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
	}
	isPaused() {
		return this.audio.paused;
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
		console.log(flag);
		if (flag) {
			this.doRandomize(array);
		}
		else {

		}
	}

	arraysIdentical(a, b) {
		console.log("checking:", a, b);
		var i = a.length;
		var bool = false;
		while (i--) {
			if (a[i].id == b[i]) {
				return true;
			}
		}
		return false;
	}

	get basePath(): any {
		// console.log('temponeComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
		if (this.appModel && this.appModel.content) {

			return this.appModel.content.id + '';
		}
	}


	PlayPauseVideo(){
		if(this.PlayPauseFlag)
		{
		  this.mainVideo.nativeElement.pause();
		  this.quesObj.quesPlayPause = this.quesObj.quesPlay;
		  this.PlayPauseFlag = false;
		}
		else{
		  this.mainVideo.nativeElement.play();
		  this.quesObj.quesPlayPause = this.quesObj.quesPause;
		  this.PlayPauseFlag = true;
		}
		
	  }

	 /* endedHandleronSkip() {    
		this.isPlayVideo = false;   
		this.appModel.navShow = 2;  
		this.appModel.videoStraming(false);
		this.appModel.notifyUserAction();   
	}*/

	endedHandleronSkip() {
		  this.isPlayVideo = false;
		  this.appModel.enableReplayBtn(true);
		  this.appModel.videoStraming(false);
		  this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
		  this.appModel.navShow = 2;
		  //this.appModel.setLoader(true);
		  //this.appModel.startPreviousTimer();
		  console.log("this.activityStarted",this.activityStarted)
		 	if(!this.activityStarted){

			 
			setTimeout(()=>{
					this.runCounter()
			},200)
		  setTimeout(() => {
			this.showFormat = false;
			console.log("!showIntroScreen && showFormat,", this.showIntroScreen , this.showFormat)
			let navTimer = setInterval(() => {
				if (this.navBlock && this.navBlock.nativeElement) {
					clearInterval(navTimer);
					setTimeout(() => {
						if (this.navBlock && this.navBlock.nativeElement) {
							this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around"
						}
					}, 500)
				}
			}, 100)
			this.noOfImgsLoaded = 0;
			this.appModel.setLoader(true);
			this.loaderTimer = setTimeout(() => {
				this.appModel.setLoader(false);
			}, 5000)

		}, this.quesInfo.formatTimeout)
	}
		
	  }

	hoverSkip(){
		// this.skipFlag = false;
		this.quesObj.quesSkip = this.quesObj.quesSkipHover;
	   }  

	   houtSkip(){
		this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
	  }

	ngOnInit() {
		let that = this;
        // $( "#navBlock" ).click(function() {
        //     if (!that.instruction.nativeElement.paused)
        //     {
        //       that.instruction.nativeElement.pause();
        //       that.instruction.nativeElement.currentTime = 0;
        //     }
        //   });
		//this.appModel.handleController(this.controlHandler);
		this.appModel.handlePostVOActivity(true);
		this.appModel.enableReplayBtn(false);
		this.appModel.functionone(this.templatevolume, this);//start end
		/*window.onresize = (e) =>{
		   this.resizeContainer();
	   }*/

		if (this.appModel.isNewCollection) {
			//console.log("chck:",this.appModel.isNewCollection);
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		let fetchedData: any = this.appModel.content.contentData.data;
		this.containgFolderPath = this.getBasePath();
		console.log("fetch data from six " + this.appModel.content.contentData.data);
		if (fetchedData.titleScreen) {
			this.quesInfo = fetchedData;
			if (this.quesInfo && this.quesInfo.titleScreen) {
				this.showIntroScreen = fetchedData.titleScreen;
				this.noOfImgs = this.quesInfo.imgCount;
			} else {
				this.showIntroScreen = false;
			}
		} else {
			this.setData();
		}

		this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
			if (mode == "manual") {
				//show modal for manual
				this.appModel.notifyUserAction();
				console.log("mode manuall", mode)

			} else if (mode == "auto") {
				console.log("mode manual2", mode)
				this.showAnswer();
			}
		})
		this.appModel.getConfirmationPopup().subscribe((val) => {

			if (val == "uttarDikhayein") {

				if ( this.instruction && !this.instruction.nativeElement.paused) {
					this.instruction.nativeElement.currentTime = 0;
					this.instruction.nativeElement.pause();
				}

				if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
					console.log("confirmPopupAssets", this.confirmPopupAssets, this.assetsPath, this.getBasePath())
					this.confirmModalRef.nativeElement.classList = "displayPopup modal";
					this.appModel.notifyUserAction();
				}
			}
			if (val == "replayVideo") {
				this.appModel.videoStraming(true);
				if ( this.instruction && !this.instruction.nativeElement.paused) {
					this.instruction.nativeElement.currentTime = 0;
					this.instruction.nativeElement.pause();
				}
				this.activityStarted = true;
				if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
				  $("#optionsBlock .options").addClass("disable_div");
				  this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
				  this.PlayPauseFlag = true;
                  this.quesObj.quesPlayPause = this.quesObj.quesPause;
                  this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
				}
			  }
		})
		this.appModel.postWrongAttempt.subscribe(() => {
			this.postWrongAttempt()
		});
		this.appModel.resetBlinkingTimer();
	}

	postWrongAttempt() {
		this.optionBlock.nativeElement.className = "optionsBlock";
		this.maincontent.nativeElement.className = "";
		this.appModel.handlePostVOActivity(false);
		this.appModel.enableReplayBtn(true);
		this.controlHandler.isTab = true;
		setTimeout(() => {
		this.closed = false;
		},2000)
		
	}

	

	onHoverOptionOut(opt, i) {
		if (opt && opt != undefined) {
			opt.bgImgsrc = opt.bgImgsrc_original;
		  this.OptionZoomOutAnimation(opt, i);
		}
	  }
	

	
	  OptionZoomOutAnimation(opt, i) {
		if (this.narrator.nativeElement.paused) {
		  $(this.optionImage.nativeElement.children[i]).addClass("scaleOutAnimation");
		  setTimeout(() => {
			$(this.optionImage.nativeElement.children[i]).removeClass("scaleInAnimation");
			$(this.optionImage.nativeElement.children[i]).removeClass("scaleOutAnimation");
		  }, 500);
		}
	  }


	templatevolume(vol, obj) {
		if (obj.clapSound && obj.clapSound.nativeElement) {
			obj.clapSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.buzzerSound && obj.buzzerSound.nativeElement) {
			obj.buzzerSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.titleHelpAudio && obj.titleHelpAudio.nativeElement) {
			obj.titleHelpAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.titleAudio && obj.titleAudio.nativeElement) {
			obj.titleAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.audio) {
			obj.audio.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.wrongFeedback && obj.wrongFeedback.nativeElement) {
			obj.wrongFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.narrator && obj.narrator.nativeElement) {
			obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.titleHelpAudio && obj.titleHelpAudio.nativeElement) {
			obj.titleHelpAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.instruction && obj.instruction.nativeElement) {
			obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.mainVideo && obj.mainVideo.nativeElement) {
			obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		  }
	}


	setData() {

		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			let fetchedData: any = this.appModel.content.contentData.data;
			console.log(fetchedData);
			if (fetchedData && fetchedData.titleScreen) {
				this.showIntroScreen = true;
			} else {
				this.showIntroScreen = false;
			}
			this.showFormat = true;
			this.myoption = JSON.parse(JSON.stringify(fetchedData.options))
			console.log(this.myoption);
			this.question = fetchedData.ques;
			this.quesInfo = fetchedData.commonassets;
			this.commonAssets = fetchedData.commonassets;
			this.isFirstQues = this.quesInfo.isFirstQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			this.noOfImgs = this.quesInfo.imgCount;
			this.feedback = fetchedData.feedback;
			this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
			this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
			this.wrongPopup = this.feedback.wrongFeedback;
			this.feedbackPopup = this.wrongPopup;
			this.quesObj = fetchedData.quesObj;
			this.feedbackObj = fetchedData.feedback;
			this.replayconfirmAssets = fetchedData.feedback.replay_confirm;

			//this.isAutoplayOn = this.appModel.autoPlay;
			this.blinkIndex = 0;
			let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
			for (var i in this.myoption) {
				if (this.myoption[i].custom_id == rightOptIdx) {
					this.optionToSelect = this.myoption[i];
				}
			}
			if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
				this.isPlayVideo = true;
				//sessionStorage.setItem("isPlayVideo", "true");
			  } else {
				this.isPlayVideo = false;
				setTimeout(()=>{
					this.runCounter();
				},200)
				 this.tempTimer = setTimeout(() => {
					this.showFormat = false;
					console.log("!showIntroScreen && showFormat,", this.showIntroScreen , this.showFormat)
					let navTimer = setInterval(() => {
						if (this.navBlock && this.navBlock.nativeElement) {
							clearInterval(navTimer);
							setTimeout(() => {
								if (this.navBlock && this.navBlock.nativeElement) {
									this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around"
								}
							}, 500)
						}
					}, 100)
					this.noOfImgsLoaded = 0;
					this.appModel.setLoader(true);
					this.loaderTimer = setTimeout(() => {
						this.appModel.setLoader(false);
					}, 5000)
					this.controlHandler.isShowAns = true;
					//this.appModel.enableReplayBtn(true);
					this.appModel.handleController(this.controlHandler);

				}, this.quesInfo.formatTimeout)

			  }
			setTimeout(() => {
				this.blinkState1 = this.optionToSelect.blink_state1;
				this.blinkState2 = this.optionToSelect.blink_state2;
			}, 200)
			this.aksharOnDisplay = this.optionToSelect.aksharImg.url;
			console.log("!showIntroScreen && showFormat,", this.showIntroScreen , this.showFormat)
			

		} else {
			this.blinkState1 = "";
			this.blinkState2 = "";
			this.myoption = [];
			this.question = "";
			this.feedback = "";
			this.quesInfo = "";
			this.ansList.splice(0, this.ansList.length);
			if (!this.isLastQues) {
				this.appModel.setLoader("loader");
			}
		}
	}

	checkNextActivities() {
		if (this.isPaused()) {
			this.removeEvents();
			this.next();
		}
		else {
			console.log("feedback_audio still playing");
		}
	}

	checkImgLoaded() {
		if (!this.loadFlag) {
			this.noOfImgsLoaded++;
			console.log("this.noOfImgsLoaded",this.noOfImgsLoaded, this.noOfImgs)
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				this.appModel.setLoader(false);
				this.loadFlag = true;
				clearTimeout(this.loaderTimer);
				this.checkforQVO();

			}
		}
	}

	showReplay(ref, flag: string, action?: string) {
		ref.classList = "modal";
		this.appModel.notifyUserAction();
		if (flag == "yes") {
		  this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
		  if (action == "replay") {
			//this.isPlayVideo = true;
			this.replayVideo();
		  }
		} else if (flag == "no") {
		  this.appModel.videoStraming(false);
		  this.appModel.enableReplayBtn(true);
		  setTimeout(() => {
			$("#instructionBar").removeClass("disable_div");
			$("#optionsBlock .options").removeClass("disable_div");
		  }, 1000);
		}
	  }

	activityStarted: boolean = false

	checkforQVO() {
		if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
			this.narrator.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
			this.appModel.handlePostVOActivity(true);
			this.appModel.enableReplayBtn(false);
			this.optionBlock.nativeElement.className = "optionsBlock disable_div";
			$("#instructionBar").addClass("disable_div");
			// this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			this.narrator.nativeElement.play();
			this.activityStarted = true;
			this.narrator.nativeElement.onended = () => {
				//this.startAnsShowTimer()
				//this.setBubbleEmpty();
				//this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
				// this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
				this.optionBlock.nativeElement.className = "optionsBlock";
				$("#instructionBar").removeClass("disable_div");
				this.appModel.handlePostVOActivity(false);
				this.appModel.enableReplayBtn(true);
			}
		} else {
			this.appModel.handlePostVOActivity(false);
			this.appModel.enableReplayBtn(true);
		}
	}

	checkSingleImgLoaded() {
		this.appModel.setLoader(false);
	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	sendFeedback(id: string, flag: string) {
		console.log(id);
		console.log(flag);
		this.confirmModalRef.nativeElement.classList = "modal";
		this.correctAns.nativeElement.classList = "modal";
		this.optionBlock.nativeElement.className = "optionsBlock";
		this.appModel.notifyUserAction();
		if (flag == "yes") {
			//show answer
			
			this.showAnswer();
		} else {

		//do nothing
		 }
	}

	wrongAnsClose(){
		this.closed = true;
		this.correctAns.nativeElement.classList = "modal";
		this.correctAns.nativeElement.classList = "modal";
		this.appModel.notifyUserAction();
		this.appModel.wrongAttemptAnimation();	
		
	}

	blinkOnLastQues() {
		this.appModel.enableReplayBtn(false);
		if (this.appModel.isLastSectionInCollection) {
			this.appModel.blinkForLastQues(this.attemptType);
			this.appModel.stopAllTimer();
			if (!this.appModel.eventDone) {
				if (this.isLastQuesAct) {
					this.appModel.eventFired();
					this.appModel.event = { 'action': 'segmentEnds' };
				}
				if (this.isLastQues) {
					this.appModel.event = { 'action': 'exit' };
				}
			}

		} else {
			this.appModel.moveNextQues(this.attemptType);
		}
	}


	showAnswer() {
		this.ansList.length = 0;
		this.blinkState1 = "";
		this.blinkState2 = "";
		this.optionBlock.nativeElement.className = "optionsBlock disable_div";
		this.controlHandler.isTab = false;
		this.controlHandler.isShowAns = true;
		this.appModel.handleController(this.controlHandler);
		this.appModel.handlePostVOActivity(true)
		this.appModel.enableReplayBtn(false);
		this.maincontent.nativeElement.className = "disable_div";
		$("#optionsBlock ").removeClass("disable-click");
		this.feedback.correct_ans_index.forEach(element1 => {
			this.myoption.forEach(element2 => {
				if(element2.custom_id == element1)
				{
					this.ansList.push(element2);
					element2.bgImgsrc = element2.bgImgsrc_empty;
					element2.imgsrc = "";
				}
			});
		});

		this.attemptType = "no animation";
		this.confirmModalRef.nativeElement.classList="modal";
		this.confirmReplayRef.nativeElement.classList="modal";
		this.appModel.resetBlinkingTimer();
		setTimeout(() => {
			$("#instructionBar").addClass("disable_div");
			$("#optionsBlock ").addClass("disable-click");
			this.optionBlock.nativeElement.className = "optionsBlock disable_div disable-click";
			$("#instructionBar").addClass("disable_div disable-click");
			// this.checkNextActivities();
			this.blinkOnLastQues()
			this.controlHandler.isTab = true;
			this.appModel.handleController(this.controlHandler);
			this.appModel.handlePostVOActivity(false)

		}, 5000)
	}

	checkVideoLoaded() {
		if (!this.videoReplayd) {
		  this.appModel.setLoader(false);
		  this.appModel.navShow = 1;
		  this.isPlayVideo = true;
		  this.appModel.isVideoPlayed = true;
		  this.appModel.stopAllTimer();
		}
	  }
	
	  endedHandler() {
		if (!this.videoReplayd) {
		  this.isPlayVideo = false;
		  this.appModel.navShow = 2;
		  this.appModel.setLoader(true);
		  //this.appModel.startPreviousTimer();
		  setTimeout(()=>{			
				this.runCounter()
		  },200)
		  setTimeout(() => {
			this.showFormat = false;
			console.log("!showIntroScreen && showFormat,", this.showIntroScreen , this.showFormat)
			let navTimer = setInterval(() => {
				if (this.navBlock && this.navBlock.nativeElement) {
					clearInterval(navTimer);
					setTimeout(() => {
						if (this.navBlock && this.navBlock.nativeElement) {
							this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around"
						}
					}, 500)
				}
			}, 100)
			this.noOfImgsLoaded = 0;
			this.appModel.setLoader(true);
			this.loaderTimer = setTimeout(() => {
				this.appModel.setLoader(false);
			}, 5000)
			this.controlHandler.isShowAns = true;
			this.appModel.enableReplayBtn(true);
			this.appModel.handleController(this.controlHandler);
		}, this.quesInfo.formatTimeout)


		}
	  }

	  replayVideo() {
		this.videoReplayd = true;
		this.activityStarted =true;
		this.isPlayVideo = true;
		this.appModel.enableSubmitBtn(false);
		$("#optionsBlock .options").addClass("disable_div");
		$(".instructionBase").addClass("disable_div");
		this.appModel.navShow = 1;
		//this.mainVideo.nativeElement.src = this.quesObj.quesVideo.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesVideo.urlOgv + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesVideo.urlOgv + "?someRandomSeed=" + Math.random().toString(36);
		setTimeout(() => {
		  this.mainVideo.nativeElement.play();
		  //this.appModel.stopAllTimer();
		  this.mainVideo.nativeElement.onended = () => {
			//this.appModel.enableSubmitBtn(true);
			this.appModel.navShow = 2;
			$("#optionsBlock .options").removeClass("disable_div");
			$(".instructionBase").removeClass("disable_div");
			this.isPlayVideo = false;
			this.appModel.videoStraming(false);
			this.appModel.notifyUserAction();
		  }
		}, 500)
	  }

	  ngOnDestroy() {
		console.log("current template is being destroyed");
		clearTimeout(this.tempTimer);
		clearTimeout(this.wrongTimer);
		
	}







}
