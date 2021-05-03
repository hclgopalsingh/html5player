import { Component , OnInit ,HostListener ,ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-template6',
  templateUrl: './template6.component.html',
  styleUrls: ['./template6.component.scss']
})
export class Template6Component implements OnInit{
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
	 @ViewChild('maincontent')  maincontent: any;
	 @ViewChild('helpBtn')  helpBtn: any;
	 @ViewChild('titleAudio')  titleAudio: any;
	 @ViewChild('titleHelpAudio')  titleHelpAudio: any;
	 @ViewChild('clapSound')  clapSound: any;
	 @ViewChild('buzzerSound')  buzzerSound: any;
	 @ViewChild('navBlock') navBlock:any;
	 @ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer:any;
		
	audio =new Audio();
	blink:boolean = false;
	currentIdx = 0;
	quesInfo:any = "";
	optionslist :any = [];
	optionslist_main :any = "";
	myoption :any = [];
	question :any = "";
	feedback :any = "";
	idArray:any = [];
	showIntroScreen:boolean = true;
	ansList:any = [];
	isFirstQues:boolean;
	isLastQues:boolean = false;
	isAutoplayOn:boolean;
	isLastQuesAct:boolean;
	showFormat:boolean;	 
	selectedAns:any = [];
	blinkState1:any="";
	blinkState2:any= "";
	blinkIndex:number = 0;
	optionToSelect:any;
	noOfRightAns:number = 0;
	
	noOfImgs:number;
	noOfImgsLoaded:number = 0;
	loaderTimer:any;
	
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
		
	onHoverOption(opt,index){
		//console.log(this.optionBlock.nativeElement);
		//this.optionBlock.nativeElement.children[1].children[index].children[0].src = this.quesInfo.opt_bgImgsrc_hover;
		opt.bgImgsrc = opt.bgImgsrc_hover;
		//this.quesInfo.opt_bgImgsrc = this.quesInfo.opt_bgImgsrc_hover;
		if(opt.sound){ 
			this.playSound(opt.sound);
		}
	}
	onHoverOptionOut(opt,index){
		if(opt.imgsrc!=""){
			opt.bgImgsrc = opt.bgImgsrc_original;
		}
		
		//this.optionBlock.nativeElement.children[1].children[index].children[0].src = this.quesInfo.original_opt_bgImgsrc;
	}
	
		 ngAfterViewChecked(){
			  if(this.titleAudio && this.titleAudio.nativeElement){
				this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
				} 
			 }
			/* this.titleAudio.nativeElement.onvolumechange(()=>{
				 
				 console.log(this.titleAudio.nativeElement.volume);
			 })*/
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
				this.isLastQues = false;
				
				if(this.quesInfo){
					this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
					this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
				}
				this.appModel.setLoader(true);
				if(this.maincontent && this.maincontent.nativeElement){
				this.maincontent.nativeElement.className = "";
				}
				if(this.optionBlock && this.optionBlock.nativeElement){
					this.optionBlock.nativeElement.className= "d-flex align-items-center justify-content-center";
				}
				this.audio.pause();
				if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
					this.titleHelpAudio.nativeElement.pause(); 
					this.titleHelpAudio.nativeElement.currentTime = 0; 
				}
				/*this.maincontent.nativeElement.style.visibility="hidden";
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
			
			if(!this.isLastQues){
			if(this.maincontent && this.maincontent.nativeElement){
				this.maincontent.nativeElement.className = "";
			}
			if(this.optionBlock && this.optionBlock.nativeElement){
					this.optionBlock.nativeElement.className= "d-flex align-items-center justify-content-center";
				}
			//this.currentIdx = this.appModel.currentSection-1;
			this.audio.pause();
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause(); 
				this.titleHelpAudio.nativeElement.currentTime = 0; 
			}
            this.appModel.nextSection();
			this.appModel.setLoader(true);
			//this.setData();
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
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				if(this.maincontent){
					this.maincontent.nativeElement.className = "disable_div";
				}
				this.titleHelpAudio.nativeElement.pause();
				this.titleHelpAudio.nativeElement.currentTime = 0;
				this.titleHelpAudio.nativeElement.play();
				this.titleHelpAudio.nativeElement.onended =()=>{
					if(this.maincontent){
						this.maincontent.nativeElement.className = "";
					}
				}
			}
		}
		
		checkRightAnswer(opt){
			if(opt.custom_id==this.optionToSelect.custom_id){
				return true;
			}else{
				return false;
			}
		}
		checkAnswer(opt,index){ 
			this.disableHelpBtn = true;
			this.titleHelpAudio.nativeElement.pause(); 
			this.titleHelpAudio.nativeElement.currentTime = 0; 
		// logic to check what user has done is correct or wrong
			if(this.checkRightAnswer(opt)){
				this.blinkState1 = "";
				this.blinkState2 = "";
				this.noOfRightAns++;
				this.ansList.push(opt);
			//Analytics
			if(this.noOfRightAns==this.feedback.correct_ans_index.length){
				opt.bgImgsrc = opt.bgImgsrc_empty;
				opt.imgsrc = "";
				//this.optionBlock.nativeElement.children[0].children[index].className="selected_state";
				//fireworks 
				setTimeout(()=>{
					this.burst.nativeElement.className = "d-flex align-items-center justify-content-center showit";
				
					//let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
					this.correctAns.nativeElement.className = "d-flex align-items-center justify-content-center showit correctAns"
					//this.correctAns.nativeElement.children[0].className = "d-flex align-items-center justify-content-center showit correctAns dispFlex";
					
					//this.playSound(this.quesInfo.right_sound);
					if(this.clapSound && this.clapSound.nativeElement){
						//this.resultSound = this.quesInfo.right_sound;
						this.clapSound.nativeElement.play();
					 }
					//disable option and question on right attempt
					console.log("disable option and question on right attempt");
					console.log(this.maincontent.nativeElement);
					this.maincontent.nativeElement.className = "disable_div";
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
							this.optionBlock.nativeElement.className= "disableDiv";
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
				
			}else{
				opt.bgImgsrc = opt.bgImgsrc_empty;
				opt.imgsrc = "";
				this.blinkIndex++;
				if(this.blinkIndex<this.feedback.correct_ans_index.length){
					let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
					for(var i in this.myoption){
						if(this.myoption[i].custom_id==rightOptIdx){
							this.optionToSelect = this.myoption[i];
						}
					}
					//this.optionToSelect = this.myoption[rightOptIdx];
					setTimeout(()=>{
							this.blinkState1 = this.optionToSelect.blink_state1;
							this.blinkState2 = this.optionToSelect.blink_state2;
					},200)
				}
			}	
			}else{
			
			this.optionBlock.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			//this.optionBlock.nativeElement.children[1].children[index].className = "options animation-shake";	
			this.optionBlock.nativeElement.children[0].children[1].children[0].children[index].className = "options animation-shake";
			//this.playSound(this.quesInfo.wrong_sound);
			if(this.buzzerSound && this.buzzerSound.nativeElement){
					//this.resultSound = this.quesInfo.wrong_sound;
					this.buzzerSound.nativeElement.play();
				}
			this.buzzerSound.nativeElement.onended = () => {
					this.resetSelectedState();
					this.optionBlock.nativeElement.children[0].children[1].children[0].children[index].className = "options";
					//this.optionBlock.nativeElement.children[1].children[index].className = "options";	
					this.idArray =[];
					for(let i of this.myoption){
						this.idArray.push(i.id);
					}
				this.doRandomize(this.myoption);
				setTimeout(()=>{
					this.optionBlock.nativeElement.className = "d-flex align-items-center justify-content-center";
				},200)
			}
		}
	}
	
	resetSelectedState(){
		this.ansList.splice(0,this.ansList.length);
		this.noOfRightAns = 0;
		this.blinkIndex = 0;
		this.blinkState1 = "";
		this.blinkState2 = "";
		let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
				
		for(let i in this.myoption){
			this.myoption[i].imgsrc = this.myoption[i].imgsrc_original;
			this.myoption[i].bgImgsrc = this.myoption[i].bgImgsrc_original;
			if(this.myoption[i].custom_id==rightOptIdx){
				this.optionToSelect = this.myoption[i];
			}
		}
		
		setTimeout(()=>{
			this.blinkState1 = this.optionToSelect.blink_state1;
			this.blinkState2 = this.optionToSelect.blink_state2;
		},200)
	}
				
		removeEvents(){
			this.burst.nativeElement.className = "d-flex align-items-center justify-content-center hideit";
			this.correctAns.nativeElement.className = "d-flex align-items-center justify-content-center hideit" 
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
		  
		  
		  temporaryValue = array[currentIndex];
		  array[currentIndex] = array[randomIndex];
		  array[randomIndex] = temporaryValue;
		  }
		 var flag=this.arraysIdentical(array,this.idArray);
			console.log(flag);
			if(flag){
				 this.doRandomize(array);
			}
			else{
							
			}	
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
			 this.appModel.functionone(this.templatevolume,this);//start end
			 /*window.onresize = (e) =>{
				this.resizeContainer();
			}*/
			
			if(this.appModel.isNewCollection){
				//console.log("chck:",this.appModel.isNewCollection);
				this.appModel.event = {'action': 'segmentBegins'};
			}
			let fetchedData:any = this.appModel.content.contentData.data;
			this.containgFolderPath = this.getBasePath();
			console.log("fetch data from six "+this.appModel.content.contentData.data);
			if(fetchedData.titleScreen){
				this.quesInfo = fetchedData;
				if(this.quesInfo && this.quesInfo.titleScreen){
					this.showIntroScreen = fetchedData.titleScreen;
					this.noOfImgs = this.quesInfo.imgCount;
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
			if(obj.audio){
				obj.audio.volume = obj.appModel.isMute?0:vol;
			}
			if(obj.optionBlock && obj.optionBlock.nativeElement){
				for(let i in obj.myoption){
					if(obj.optionBlock.nativeElement.children[0] && obj.optionBlock.nativeElement.children[0].children[1] && obj.optionBlock.nativeElement.children[0].children[1].children[0] 
						&& obj.optionBlock.nativeElement.children[0].children[1].children[0].children[i] && obj.optionBlock.nativeElement.children[0].children[1].children[0].children[i].children[3]){
						obj.optionBlock.nativeElement.children[0].children[1].children[0].children[i].children[3].volume = obj.appModel.isMute?0:vol;
					}
				}
			}
		 }
		  
		
		setData(){	
			
			if(this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data){
				let fetchedData:any = this.appModel.content.contentData.data;
				console.log(fetchedData);
				if(fetchedData && fetchedData.titleScreen){
					this.showIntroScreen = true;
				}else{
					this.showIntroScreen = false;
				}
				this.showFormat = true;
				this.myoption = fetchedData.options;
				console.log(this.myoption);
				this.question = fetchedData.ques;
				this.feedback = fetchedData.feedback;
				this.quesInfo = fetchedData.commonassets;
				this.isFirstQues = this.quesInfo.isFirstQues;
				this.isLastQues = this.appModel.isLastSection;
				this.isLastQuesAct = this.appModel.isLastSectionInCollection;
				this.noOfImgs = this.quesInfo.imgCount;
				//this.isAutoplayOn = this.appModel.autoPlay;
				this.blinkIndex = 0;
				let rightOptIdx = this.feedback.correct_ans_index[this.blinkIndex];
					for(var i in this.myoption){
						if(this.myoption[i].custom_id==rightOptIdx){
							this.optionToSelect = this.myoption[i];
						}
					}
				setTimeout(()=>{
					this.blinkState1 = this.optionToSelect.blink_state1;
					this.blinkState2 = this.optionToSelect.blink_state2;
				},200)
				
				setTimeout(()=>{
				this.showFormat = false;
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
				this.noOfImgsLoaded = 0;
				this.appModel.setLoader(true);
				this.loaderTimer = setTimeout(()=>{
					this.appModel.setLoader(false);
				},5000)
				
			},this.quesInfo.formatTimeout)
				
			}else{
				this.blinkState1 = "";
				this.blinkState2 = "";
				this.myoption = [];
				this.question = "";
				this.feedback = "";
				this.quesInfo = "";
				this.ansList.splice(0,this.ansList.length);
				if(!this.isLastQues){
					this.appModel.setLoader("loader");
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
		
		checkImgLoaded(){
			if(!this.loadFlag){
				this.noOfImgsLoaded++;
				if(this.noOfImgsLoaded>=this.noOfImgs){
					this.appModel.setLoader(false);
					this.loadFlag = true;
					clearTimeout(this.loaderTimer);
				}
			}
		}
		checkSingleImgLoaded(){
			this.appModel.setLoader(false);
		}
		
		getBasePath(){
			if(this.appModel && this.appModel.content){
				 return this.appModel.content.id + '';
			}
		}

	  }
