import { Component , OnInit ,HostListener ,ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-template14',
  templateUrl: './template14.component.html',
  styleUrls: ['./template14.component.scss']
})
export class Template14Component implements OnInit{
	private appModel: ApplicationmodelService;
	constructor(appModel: ApplicationmodelService) {
		this.appModel = appModel;
		this.assetsPath=this.appModel.assetsfolderpath;
		this.appModel.navShow=1;
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
		
		 @ViewChild('correctAns')  correctAns: any;
		 @ViewChild('burst')  burst: any;
		 @ViewChild('optionBlock')  optionBlock: any;
		 @ViewChild('container')  containerBlock: any;
		 @ViewChild('titleNavBtn')  titleNavBtn: any;
		 @ViewChild('helpBtn')  helpBtn: any;
		 @ViewChild('titleAudio')  titleAudio: any;
		 @ViewChild('titleHelpAudio')  titleHelpAudio: any;
		 @ViewChild('clapSound')  clapSound: any;
		 @ViewChild('buzzerSound')  buzzerSound: any;
		 @ViewChild('navBlock') navBlock:any;
		 @ViewChild('speakerBtn') speakerBtn:any;
		 @ViewChild('optionHolder') optionHolder:any;
		 @ViewChild('questionSound') questionSound:any;
		 
		audio = new Audio();
		blink:boolean = false;
		currentIdx = 0;
		quesInfo:any = "";
		optionslist :any = [];
		optionslist_main :any = "";
		myoption :any = [];
		question :any = "";
		feedback :any = "";
		isLastActivity :any = "";
		bool:boolean = false;
		showIntroScreen:boolean;
	
		helpAudio:any = "";
		correctOpt:any;
		idArray:any = [];
		isFirstQues:boolean;
		isLastQues:boolean = false;
		isAutoplayOn:boolean;
		isLastQuesAct:boolean;
		
		noOfImgs:number;
		noOfImgsLoaded:number = 0;
		loaderTimer:any;
		maxNosOpt:number;
		optionRandomArray:any = [];
		randomOptionIndex:any = [];
		quesSoundInfo:any;
		quesNo:number = 0;
		optBackup:any = [];
		timer:any;
		disableHelpBtn:boolean = false;
		containgFolderPath:string = "";
		assetsPath:string = "";
		loadFlag:boolean = false;
		hasEventFired:boolean = false;
		
		
		onHoverHelp(){
				this.quesInfo.help_btn =  this.quesInfo.help_btn_hover; 
		}
		onHoverHelpOut(){
				this.quesInfo.help_btn =  this.quesInfo.help_btn_original;  
		}
		 onHoverZaariRakhein(){
			this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_hover; 
		}
		onHoverOutZaariRakhein(){
			this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_original;
		}
		onHoverAageyBadheinBtn(){
				this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_hover;
		}
		onLeaveAageyBadheinBtn(){
			this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
		}
		onHoverPeecheyBtn(){
				this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_hover;
		}
		onLeavePeecheyBtn(){
			this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
		}
		
		onHoverOption(opt){
			opt.bgImgsrc = opt.bgImgsrc_hover;
		}
		onHoverOptionOut(opt){
			opt.bgImgsrc = opt.bgImgsrc_original;
		}
		
		
		onClickSpeaker(){
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause(); 
				this.titleHelpAudio.nativeElement.currentTime = 0; 
			}
			this.playQuestionSound(this.question[this.quesNo]);
			//this.speakerBtn.nativeElement.children[1].className = "speaker dispFlex";
		}
		onMouseOutSpeaker(){
			this.speakerBtn.nativeElement.children[1].className = "speaker";
		}
		
		 ngAfterViewChecked(){
			if(this.titleAudio && this.titleAudio.nativeElement){
				this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
				} 
			 }
			 this.templatevolume(this.appModel.volumeValue,this);
		 }
		 
		 
		closeTitleScreen(){
			this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
			setTimeout(()=>{
				this.next();
			},200)
			
		}
		
		setEnability(flag, option_ref) {
		
        }
		// previous function
			previous(){
				if(this.quesInfo){
					this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
					this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
			    }
				this.appModel.setLoader(true);
				clearTimeout(this.timer);
				this.audio.pause();
				if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
					this.titleHelpAudio.nativeElement.pause(); 
					this.titleHelpAudio.nativeElement.currentTime = 0; 
				}
				/*this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
				this.maincontent.nativeElement.style.visibility="hidden";
				setTimeout(()=>{
					this.maincontent.nativeElement.style.visibility="visible";
				},200)*/
				// remove blinking if exist
				this.blink=false;
				this.appModel.previousSection();
				//this.setData();
			}
		
       // next function
        next(){
					if(!this.hasEventFired){
						if(this.isLastQuesAct){
							this.hasEventFired = true;
							this.appModel.event = {'action': 'segmentEnds'};
						}
						if(this.isLastQues){
							this.appModel.event = {'action': 'end'};	
						}
					}
			if(this.quesInfo){
				this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
				this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
			 }
			clearTimeout(this.timer);
			if(!this.isLastQues){
				this.audio.pause();
				if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
					this.titleHelpAudio.nativeElement.pause(); 
					this.titleHelpAudio.nativeElement.currentTime = 0; 
				}
				this.appModel.nextSection();
				this.appModel.setLoader(true);
			}
		}
		
		playSound(sound) {
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause(); 
				this.titleHelpAudio.nativeElement.currentTime = 0; 
			}
			this.audio.pause();
			this.audio.src =  sound;
			this.audio.load();
			this.audio.play();
		}
		playSoundHelp(){
			if(this.questionSound && this.questionSound.nativeElement){
				this.questionSound.nativeElement.pause();
				this.questionSound.nativeElement.currentTime = 0;
				this.speakerBtn.nativeElement.children[1].className = "speaker";
			}
			/*
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				if(this.titleHelpAudio.nativeElement.paused){
					this.titleHelpAudio.nativeElement.play();
				}else{
					this.titleHelpAudio.nativeElement.pause();
					this.titleHelpAudio.nativeElement.currentTime = 0;
				}
			}
			*/
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				if(this.optionBlock){
					this.optionBlock.nativeElement.className = "optionsBlock disable_div";
				}
				this.titleHelpAudio.nativeElement.pause();
				this.titleHelpAudio.nativeElement.currentTime = 0;
				this.titleHelpAudio.nativeElement.play();
				this.titleHelpAudio.nativeElement.onended =()=>{
					if(this.optionBlock){
						this.optionBlock.nativeElement.className = "optionsBlock";
					}
				}
			}
		}
		checkAnswer(opt,index){
			this.disableHelpBtn = true;
			this.quesNo = this.quesNo + 1;
					// to stop help audio if playing
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause(); 
				this.titleHelpAudio.nativeElement.currentTime = 0; 
			}					
                    // logic to check what user has done is correct or wrong
					if(opt.custom_id == this.quesSoundInfo.index && this.quesNo == this.quesInfo.noOfQues ){
						this.setSelectedImage(opt,index);
						
						setTimeout(()=>{
							//fireworks 
						let burst: HTMLElement = this.burst.nativeElement as HTMLElement
							burst.className = "d-flex align-items-center justify-content-center showit";
						
						if(this.clapSound && this.clapSound.nativeElement){
									//this.resultSound = this.quesInfo.right_sound;
									this.clapSound.nativeElement.play();
							}
							//disable option and question on right attempt
							console.log("disable option and question on right attempt");
							this.optionBlock.nativeElement.className = "optionsBlock disable_div";
							//this.isLastQues = this.appModel.isLastSection;
								this.clapSound.nativeElement.onended = () => {
									this.removeEvents();
									if(!this.appModel.autoPlay && !this.isLastQues && this.isLastQuesAct){
										this.blink = true;
									}
									if((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) ||((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))){
										this.checkNextActivities();
									}else{
										//disable all the option
										//this.optionBlock.nativeElement.className= "disableDiv";
									}
									if(!this.hasEventFired){
										if(this.isLastQuesAct){
											this.hasEventFired = true;
											this.appModel.event = {'action': 'segmentEnds'};
										}
										if(this.isLastQues){
											this.appModel.event = {'action': 'end'};	
										}
									}
								}
						},200)
							
						} else if(opt.custom_id == this.quesSoundInfo.index && this.quesNo < this.quesInfo.noOfQues ){	
							this.setSelectedImage(opt,index);
							this.optionBlock.nativeElement.className = "optionsBlock disable_div";
							this.playQuestionSound(this.question[this.quesNo]);
						}else{
							//reset question no attempt
							this.quesNo = 0;
							//let optionBlock: HTMLElement = this.optionBlock.nativeElement as HTMLElement
							this.optionBlock.nativeElement.className = "optionsBlock disable_div";
							this.optionHolder.nativeElement.children[index].className = "options animation-shake option"+index+"";	
							if(this.buzzerSound && this.buzzerSound.nativeElement){
								this.buzzerSound.nativeElement.play();
							}
							this.buzzerSound.nativeElement.onended = () => {
								this.optionHolder.nativeElement.children[index].className = "options option"+index+"";	
								this.idArray =[];
									for(let i of this.optBackup){
									this.idArray.push(i.id);
								}
								//this.myoption.splice(0,this.myoption.length);
								//this.myoption  = JSON.parse(JSON.stringify(this.optBackup));
								this.doRandomize(this.optBackup);
								//randomize question
								this.doRandomizeQues(this.question);
								setTimeout(()=>{
									//this.optionBlock.nativeElement.className = "optionsBlock";
									this.setBubbleEmpty();
								},200)
							}
						}
				}
				
				setSelectedImage(opt,index){
					for(let i in this.optBackup){
						if(this.optBackup[i].custom_id==opt.custom_id){
							this.myoption[index].imgsrc = this.optBackup[i].imgsrc;
							break;
						}
					}
				}
				
		removeEvents(){
			 this.burst.nativeElement.className="d-flex align-items-center justify-content-center hideit"
  }

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }
		isPaused(){
			return this.audio.paused;
		}
		
		doRandomize(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex;
		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {
		  // Pick a remaining element...
		  randomIndex = Math.floor(Math.random() * currentIndex);
		  currentIndex -= 1;
		  // And swap it with the current element.
		  var bgImgsrc1 = array[currentIndex].bgImgsrc;
		  var bgImgsrc2 = array[randomIndex].bgImgsrc;
		  
		  temporaryValue = array[currentIndex];
		  array[currentIndex] = array[randomIndex];
		  array[randomIndex] = temporaryValue;
		  
		  array[currentIndex].bgImgsrc = bgImgsrc1;
		  
		  array[randomIndex].bgImgsrc = bgImgsrc2;
		  }
		 
		 var flag=this.arraysIdentical(array,this.idArray);
			console.log(flag);
			if(flag){
				 this.doRandomize(array);
			}
			else{
				setTimeout(()=>{
					console.log(this.optBackup)
					let formatOpt = JSON.parse(JSON.stringify(this.optBackup));
					for(var i in this.randomOptionIndex){
						this.myoption[this.randomOptionIndex[i]] = formatOpt[i];
					}
				},200)
			}
		}
		
		doRandomizeQues(arrayQues){
			let currentIndex = arrayQues.length, temporaryValue, randomIndex, bgImgsrc1, bgImgsrc2;
		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {
		  // Pick a remaining element...
		  randomIndex = Math.floor(Math.random() * currentIndex);
		  currentIndex -= 1;
		  // And swap it with the current element.
		  //store the background
		  if(arrayQues[currentIndex].bgImgsrc && arrayQues[randomIndex].bgImgsrc){
			 bgImgsrc1 = arrayQues[currentIndex].bgImgsrc;
		     bgImgsrc2 = arrayQues[randomIndex].bgImgsrc;
		  }
		  temporaryValue = arrayQues[currentIndex];
		  arrayQues[currentIndex] = arrayQues[randomIndex];
		  
		  arrayQues[randomIndex] = temporaryValue;
		  if(arrayQues[currentIndex].bgImgsrc && arrayQues[randomIndex].bgImgsrc){
			 arrayQues[currentIndex].bgImgsrc = bgImgsrc1;
			 arrayQues[randomIndex].bgImgsrc = bgImgsrc2; 
		  }
		  }
		  
		  return arrayQues;
		}
		
		arraysIdentical(a, b) {
			console.log("checking:",a,b);
			var i = a.length;
			var bool = false;
			while (i--) {
				if (a[i].id == b[i]) {
								return true;
				}
			}
			return false;
        }
		
		 ngOnInit() {
			 console.log("version newwwwwwwwwwwww ",this.appModel.version);
			let id = window.setTimeout(()=> {}, 0);
			while (id--) {
				window.clearTimeout(id);
			}
			this.appModel.functionone(this.templatevolume,this);//start end
			/* window.onresize = (e) =>{
				this.resizeContainer();
			}*/
			this.containgFolderPath = this.getBasePath();
			if(this.appModel.isNewCollection){
				//console.log("chck:",this.appModel.isNewCollection);
				this.appModel.event = {'action': 'segmentBegins'};
			}
			let fetchedData:any = this.appModel.content.contentData.data;
			if(fetchedData.titleScreen){
				this.quesInfo = fetchedData;
				this.noOfImgs = this.quesInfo.imgCount;
				if(this.quesInfo && this.quesInfo.titleScreen){
					this.showIntroScreen = fetchedData.titleScreen;
				}else{
					this.showIntroScreen = false;
				}
			}else{
				this.setData();
			}
		}
		  
		  
		  templatevolume(vol,obj) {
			if(obj.clapSound && obj.clapSound.nativeElement){
				obj.clapSound.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.buzzerSound && obj.buzzerSound.nativeElement){
				obj.buzzerSound.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.titleHelpAudio && obj.titleHelpAudio.nativeElement){
				obj.titleHelpAudio.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.titleAudio && obj.titleAudio.nativeElement){
				obj.titleAudio.nativeElement.volume = obj.appModel.isMute?0:vol;
			} 
			if(obj.questionSound && obj.questionSound.nativeElement){
				obj.questionSound.nativeElement.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.audio){
				obj.audio.volume =obj.appModel.isMute?0:vol;
			}
		 }
		
		setData(){	
			let navTimer = setInterval(() =>{
				if(this.navBlock && this.navBlock.nativeElement){
					clearInterval(navTimer);
					setTimeout(()=>{
					if(this.navBlock && this.navBlock.nativeElement){
						this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around"
					}
				},500)
				}
			},100)		
			if(this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data){
				
				let fetchedData:any = JSON.parse(JSON.stringify(this.appModel.content.contentData.data));
				if(fetchedData && fetchedData.titleScreen){
					this.showIntroScreen = true;
				}else{
					this.showIntroScreen = false;
				}
				//this.myoption = fetchedData.options;
				this.myoption.splice(0,this.myoption.length);
				this.optionRandomArray.splice(0,this.optionRandomArray.length);
				this.randomOptionIndex.splice(0,this.randomOptionIndex.length);
				let orig_option = this.doRandomizeQues(fetchedData.options);
				this.optBackup  = JSON.parse(JSON.stringify(fetchedData.options));
				this.question = this.doRandomizeQues(fetchedData.ques);
				this.feedback = fetchedData.feedback;
				this.quesInfo = fetchedData.commonassets;
				this.maxNosOpt = this.quesInfo.maxNosOpt;
				let emptyOpt = {"imgsrc":"", "bgImgsrc":""};
				for(let i=0;i<this.maxNosOpt;i++){
					this.optionRandomArray.push(i);
					this.myoption.push(emptyOpt);
				}
				for(let i in orig_option){
					let idx = this.getRandomInt(0,this.optionRandomArray.length-1);
					this.randomOptionIndex.push(idx);
					this.myoption[idx] = orig_option[i];
				}
				/*if(this.maxNosOpt>this.myoption.length){
					let emptyNosOpt = this.maxNosOpt - this.myoption.length;
					let emptyOpt = {"imgsrc":"", "bgImgsrc":""};
					for(let i=0;i<emptyNosOpt;i++){
						this.myoption.push(emptyOpt);
					}
				}*/
				console.log("new updated option array ", this.myoption);
				this.isFirstQues = this.quesInfo.isFirstQues;
				this.isLastQues = this.appModel.isLastSection;
				this.isLastQuesAct = this.appModel.isLastSectionInCollection;
				//this.isAutoplayOn = this.appModel.autoPlay;
				this.noOfImgs = this.quesInfo.imgCount;
				console.log(this.optBackup);
				this.setBubbleEmpty();
			}else{
				this.myoption = [];
				this.question = "";
				this.feedback = "";
				this.quesInfo = "";
			}
		}
		
		//to stop any activity when help audio is playing
		checkHelpAudio(){
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				return this.titleHelpAudio.nativeElement.paused;
			}else{
				return true;
			}
		}
		
		getRandomInt(min, max){
			let idx = Math.floor(Math.random() * (max - min + 1)) + min;
			let indReturn = this.optionRandomArray[idx];
			this.optionRandomArray.splice(idx,1);
			return indReturn;
		}
		
		setBubbleEmpty(){
			this.timer = setTimeout(()=>{
				if(this.checkHelpAudio()){
					this.setQuestion();
				}else{
						if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
							this.titleHelpAudio.nativeElement.onended = () => {
								this.setQuestion();
						} 
					}
				}
			},this.quesInfo.textRemoveTime);
		}
		
		setQuestion(){
			for(let i in this.myoption){
				this.myoption[i].imgsrc="";
			}
			setTimeout(()=>{
				this.playQuestionSound(this.question[this.quesNo]);
			},200)
		}
		
		playQuestionSound(ques){
			this.quesSoundInfo = ques;
			if(this.questionSound && this.questionSound.nativeElement){
				if(this.quesSoundInfo.sound.location=='content'){
					this.questionSound.nativeElement.src = this.containgFolderPath + '/' +this.quesSoundInfo.sound.url;
				}else{
					this.questionSound.nativeElement.src = this.assetsPath + '/' +this.quesSoundInfo.sound.url;
				}
				this.questionSound.nativeElement.play();
				this.speakerBtn.nativeElement.children[1].className = "speaker dispFlex";
				this.questionSound.nativeElement.onended = ()=>{
						this.speakerBtn.nativeElement.children[1].className = "speaker";
						if(this.optionBlock){
							this.optionBlock.nativeElement.className = "optionsBlock";
						}
				}
			}
		}
		
		checkNextActivities(){
			if(this.isPaused()){
				 this.removeEvents();
					this.next();
			}
			else{
				console.log("feedback_audio still playing");
			}
		}
		
		getBasePath(){
			if(this.appModel && this.appModel.content){
				 return this.appModel.content.id + '';
			}
		}
		
		
		checkImgLoaded(){
			if(!this.loadFlag){
				this.noOfImgsLoaded++;
				if(this.noOfImgsLoaded>=this.noOfImgs){
					this.appModel.setLoader(false);
					if(this.optionBlock){
						this.optionBlock.nativeElement.className = "optionsBlock disable_div";
					}
					this.loadFlag = true;
					clearTimeout(this.loaderTimer);
				}
			}
		}
		
		
	  }

