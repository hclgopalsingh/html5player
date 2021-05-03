import { Component , OnInit ,HostListener ,ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-template5',
  templateUrl: './template5.component.html',
  styleUrls: ['./template5.component.scss']
})
export class Template5Component implements OnInit{
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
		 @ViewChild('quesSound') quesSound:any;
		 
		audio =new Audio();
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
		disableHelpBtn:boolean = false;
		containgFolderPath:string = "";
		assetsPath:string = "";
		loadFlag:boolean = false;
		hasEventFired:boolean = false;
		
		
		onHoverQuestion(imgObj){
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause();
			 }
			if(imgObj.sound){ 
				this.quesSound.nativeElement.play();
			}
			imgObj.imgsrc = imgObj.imgsrc_hover;
		}
		onHoverQuestionOut(imgObj){
			imgObj.imgsrc = imgObj.imgsrc_original;
		}
		
		onHoverHelp(){
				this.quesInfo.help_btn =  this.quesInfo.help_btn_hover; 
		}
		onHoverHelpOut(){
				this.quesInfo.help_btn =  this.quesInfo.help_btn_original;  
		}
		onHoverOption(opt){
			opt.bgImgsrc = opt.bgImgsrc_hover;
		}
		onHoverOptionOut(opt){
			opt.bgImgsrc = opt.bgImgsrc_original;
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
				if(this.navBlock && this.navBlock.nativeElement){
					this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
				}
				if(this.quesInfo){
					this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
					this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
				}
				this.appModel.setLoader(true);
				if(this.optionBlock && this.optionBlock.nativeElement){
					this.optionBlock.nativeElement.className= "";
				}
				this.audio.pause();
				if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
					this.titleHelpAudio.nativeElement.pause(); 
					this.titleHelpAudio.nativeElement.currentTime = 0; 
				}
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
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
			if(this.navBlock && this.navBlock.nativeElement){
				this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
			}
			if(this.quesInfo){
				this.quesInfo.aagey_badhein = this.quesInfo.aagey_badhein_original;
			    this.quesInfo.peechey_jayein = this.quesInfo.peechey_jayein_original;
			}
			
			if(!this.isLastQues){
			if(this.maincontent && this.maincontent.nativeElement){
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
			}
			if(this.optionBlock && this.optionBlock.nativeElement){
					this.optionBlock.nativeElement.className= "";
				}
			//this.currentIdx = this.appModel.currentSection-1;
			this.audio.pause();
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause(); 
				this.titleHelpAudio.nativeElement.currentTime = 0; 
			}
			if(this.maincontent && this.maincontent.nativeElement){
					this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
				/*this.maincontent.nativeElement.style.visibility="hidden";
				setTimeout(()=>{
					this.maincontent.nativeElement.style.visibility="visible";
				},200)*/
				
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
					this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
				}
				if(this.quesSound && this.quesSound.nativeElement){
					this.quesSound.nativeElement.pause();
					this.quesSound.nativeElement.currentTime = 0;
				}
				this.titleHelpAudio.nativeElement.pause();
				this.titleHelpAudio.nativeElement.currentTime = 0;
				this.titleHelpAudio.nativeElement.play();
				this.titleHelpAudio.nativeElement.onended =()=>{
					if(this.maincontent){
						this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center";
					}
				}
			}
		}
		checkAnswer(opt,index){
			this.disableHelpBtn = true;
					// to stop help audio if playing
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause(); 
				this.titleHelpAudio.nativeElement.currentTime = 0; 
			}					
                    // logic to check what user has done is correct or wrong
					if(opt.custom_id == this.feedback.correct_ans_index){
						
						//fireworks 
						let burst: HTMLElement = this.burst.nativeElement as HTMLElement
							burst.className = "d-flex align-items-center justify-content-center showit";
						
						let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
							correctAns.className = "d-flex align-items-center justify-content-center showit correctAns";
							this.correctOpt = opt;
							//this.playSound(this.quesInfo.right_sound);
							
							
							
							
							if(this.clapSound && this.clapSound.nativeElement){
									//this.resultSound = this.quesInfo.right_sound;
									this.clapSound.nativeElement.play();
							}
							//disable option and question on right attempt
							console.log("disable option and question on right attempt");
							this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
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
							
						}else{
							//let optionBlock: HTMLElement = this.optionBlock.nativeElement as HTMLElement
							this.optionBlock.nativeElement.className = "disableDiv";
							this.optionBlock.nativeElement.children[0].children[index].className = "ansOption animation-shake";	
							if(this.buzzerSound && this.buzzerSound.nativeElement){
									this.buzzerSound.nativeElement.play();
								}
							this.buzzerSound.nativeElement.onended = () => {
								this.optionBlock.nativeElement.children[0].children[index].className = "ansOption";	
								this.idArray =[];
									for(let i of this.myoption){
									this.idArray.push(i.id);
								} 
								this.doRandomize(this.myoption);
								setTimeout(()=>{
									this.optionBlock.nativeElement.className = "";
								},200)
							}
						}
				}
				
		removeEvents(){
			 this.correctAns.nativeElement.className = "d-flex align-items-center justify-content-center hideit";
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
		  var bgImgsrchover1 = array[currentIndex].bgImgsrc_hover;
		  var bgImgsrcoriginal1 = array[currentIndex].bgImgsrc_original;
		  var optionBg1 = array[currentIndex].option_bg;
		  
		  var bgImgsrc2 = array[randomIndex].bgImgsrc;
		  var bgImgsrchover2 = array[randomIndex].bgImgsrc_hover;
		  var bgImgsrcoriginal2 = array[randomIndex].bgImgsrc_original;
		  var optionBg2 = array[randomIndex].option_bg;
		  
		  temporaryValue = array[currentIndex];
		  array[currentIndex] = array[randomIndex];
		  array[randomIndex] = temporaryValue;
		  
		  array[currentIndex].bgImgsrc = bgImgsrc1;
		  array[currentIndex].bgImgsrc_hover = bgImgsrchover1;
		  array[currentIndex].bgImgsrc_original = bgImgsrcoriginal1;
		  array[currentIndex].option_bg = optionBg1;
		  
		  array[randomIndex].bgImgsrc = bgImgsrc2;
		  array[randomIndex].bgImgsrc_hover = bgImgsrchover2;
		  array[randomIndex].bgImgsrc_original = bgImgsrcoriginal2;
		  array[randomIndex].option_bg = optionBg2;
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
			/* window.onresize = (e) =>{
				this.resizeContainer();
			}*/
			console.log("version newwwwwwwwwwwww ",this.appModel.version);
			if(this.appModel.isNewCollection){
				//console.log("chck:",this.appModel.isNewCollection);
				this.appModel.event = {'action': 'segmentBegins'};
			}
			let fetchedData:any = this.appModel.content.contentData.data;
			this.containgFolderPath = this.getBasePath(); 
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
			if(obj.audio){
				obj.audio.volume =obj.appModel.isMute?0:vol;
			}
			if(obj.quesSound){
				obj.quesSound.nativeElement.volume = obj.appModel.isMute?0:vol;
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
				let fetchedData:any = this.appModel.content.contentData.data;
				console.log(fetchedData);
				if(fetchedData && fetchedData.titleScreen){
					this.showIntroScreen = true;
				}else{
					this.showIntroScreen = false;
				}
				this.myoption = fetchedData.options;
				console.log(this.myoption);
				this.question = fetchedData.ques;
				this.feedback = fetchedData.feedback;
				this.quesInfo = fetchedData.commonassets;
				this.isFirstQues = this.quesInfo.isFirstQues;
				this.isLastQues = this.appModel.isLastSection;
				this.isLastQuesAct = this.appModel.isLastSectionInCollection;
				//this.isAutoplayOn = this.appModel.autoPlay;
				this.noOfImgs = this.quesInfo.imgCount;
			}else{
				this.myoption = [];
				this.question = "";
				this.feedback = "";
				this.quesInfo = "";
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
		
		getBasePath(){
			if(this.appModel && this.appModel.content){
				 return this.appModel.content.id + '';
			}
		}
		
	  }