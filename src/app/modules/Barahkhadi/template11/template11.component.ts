import { Component , OnInit ,HostListener ,ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-template11',
  templateUrl: './template11.component.html',
  styleUrls: ['./template11.component.scss']
})
export class Template11Component implements OnInit{
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
		 @ViewChild('connectingLine') connectingLine:any;
		 @ViewChild('quesImage') quesImage:any;
		 
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
		//isAutoplayOn:boolean;
		isLastQuesAct:boolean;
		
		ansDivIndex:number;
		lineColor:any;
		
		rightAnsSelected:boolean = false;
		
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
		onHoverOption(opt){
			opt.bgImgsrc = opt.bgImgsrc_hover;
		}
		onHoverOptionOut(opt){
			opt.bgImgsrc = opt.bgImgsrc_original;
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
				this.removeEvents();
				if(this.optionBlock && this.optionBlock.nativeElement){
					this.optionBlock.nativeElement.className= "ansBlock";
				}
				this.audio.pause();
				if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
					this.titleHelpAudio.nativeElement.pause(); 
					this.titleHelpAudio.nativeElement.currentTime = 0; 
				}
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-between";
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
				this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-between";
			}
			if(this.optionBlock && this.optionBlock.nativeElement){
					this.optionBlock.nativeElement.className= "ansBlock";
				}
			this.audio.pause();
			if(this.titleHelpAudio && this.titleHelpAudio.nativeElement){
				this.titleHelpAudio.nativeElement.pause(); 
				this.titleHelpAudio.nativeElement.currentTime = 0; 
			}
			if(this.maincontent && this.maincontent.nativeElement){
					this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-between";
				
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
					this.maincontent.nativeElement.className = "d-flex align-items-center disable_div";
				}
				this.titleHelpAudio.nativeElement.pause();
				this.titleHelpAudio.nativeElement.currentTime = 0;
				this.titleHelpAudio.nativeElement.play();
				this.titleHelpAudio.nativeElement.onended =()=>{
					if(this.maincontent){
						this.maincontent.nativeElement.className = "d-flex align-items-center";
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
						
						this.ansDivIndex = index;
						this.lineColor = 'green';
						this.connectLine(document.getElementById("refImage"),document.getElementById("vikalp"+index),"");
						setTimeout(()=>{
						//fireworks 
						let burst: HTMLElement = this.burst.nativeElement as HTMLElement
							burst.className = "d-flex align-items-center justify-content-between showit";
						
						let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
							correctAns.className = "d-flex align-items-center justify-content-between correctAns";
							this.correctOpt = opt;
							this.rightAnsSelected = true;
							
							setTimeout(()=>{
								this.connectLine(document.getElementById("refImageAns"),document.getElementById("sahiVikalpId"),"ansLine");
							},200)
							
						},500)
							if(this.clapSound && this.clapSound.nativeElement){
									this.clapSound.nativeElement.play();
							}
							//disable option and question on right attempt
							console.log("disable option and question on right attempt");
							this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-between disable_div";
							this.isLastQues = this.appModel.isLastSection;
							this.clapSound.nativeElement.onended = () => {
									this.removeEvents();
									this.ansDivIndex = null;
									if(!this.appModel.autoPlay && !this.isLastQues && this.isLastQuesAct){
										this.blink = true;
									}
									if((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) ||((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))){
										this.checkNextActivities();
									}else{
										
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
							this.ansDivIndex = index;
							this.lineColor = 'red';
							this.connectLine(document.getElementById("refImage"),document.getElementById("vikalp"+index),"");
							this.optionBlock.nativeElement.className = "disableDiv ansBlock";
							this.optionBlock.nativeElement.children[index].className = "options animation-shake";	
							if(this.buzzerSound && this.buzzerSound.nativeElement){
								this.buzzerSound.nativeElement.play();
							}
							this.buzzerSound.nativeElement.onended = () => {
								this.optionBlock.nativeElement.children[index].className = "options";	
								this.idArray =[];
									for(let i of this.myoption){
									this.idArray.push(i.id);
								} 
								 let line = document.getElementById("newLine");
								 line.parentNode.removeChild(line);
								this.ansDivIndex = null;
								this.doRandomize(this.myoption);
								setTimeout(()=>{
									this.optionBlock.nativeElement.className = "ansBlock";
								},200)
							}
						}
				}
				
	 getOffset( el ) {
		let rect = el.getBoundingClientRect();
		return {
			left: rect.left + window.pageXOffset,
			top: rect.top + window.pageYOffset,
			width: rect.width || el.offsetWidth,
			height: rect.height || el.offsetHeight
		};
	}
				
connectLine(div1,div2,flag){
    let thickness = window.innerWidth*.01;
	let off1 = this.getOffset(div1);
    let off2 = this.getOffset(div2);
    // bottom right
    let x1 = off1.left + off1.width;
    let y1 = off1.top + off1.height/2;
    // top right
    let x2 = off2.left;
    let y2 = off2.top + off2.height/2;
    // distance
    let length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    // center
    let cx = ((x1 + x2) / 2) - (length / 2);
    let cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    let angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
	let htmlLine:any;
    // make hr
	if(flag=="ansLine"){
		 htmlLine = "<div id ='newLineAns' style='padding:0px; z-index:1000;  pointer-events:none; margin:0px; height:" + thickness + "px; background-color:" + this.lineColor + "; line-height:1px; border-radius:5px;position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
	}else{
		 htmlLine = "<div id ='newLine' style='padding:0px; pointer-events:none; margin:0px; height:" + thickness + "px; background-color:" + this.lineColor + "; line-height:1px; border-radius:5px;position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
	}
    let line = document.createElement('div');
	line.innerHTML = htmlLine;
   document.getElementById("shikshaOuterDivId").appendChild(line);
}
				
		removeEvents(){
			 let line = document.getElementById("newLine");
			 if(line){
				line.parentNode.removeChild(line); 
			 }
			  let lineAns = document.getElementById("newLineAns");
			  if(lineAns){
				 lineAns.parentNode.removeChild(lineAns); 
			  }
			 this.correctAns.nativeElement.className = "align-items-center justify-content-between hideit";
			 this.burst.nativeElement.className="d-flex align-items-center justify-content-between hideit"
				this.rightAnsSelected = false;
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
				 if(this.ansDivIndex!=null){
					this.drawConnectingLine(this.div1,this.div2);
				 }
			}*/
			this.containgFolderPath = this.getBasePath();
			if(this.appModel.isNewCollection){
				this.appModel.event = {'action': 'segmentBegins'};
			}
			let fetchedData:any = this.appModel.content.contentData.data;
			if(fetchedData.titleScreen){
				this.quesInfo = fetchedData;
				this.noOfImgs = this.quesInfo.imgCount;
				this.myoption = fetchedData.options;
				if(this.quesInfo && this.quesInfo.titleScreen){
					this.showIntroScreen = fetchedData.titleScreen;
				}else{
					this.showIntroScreen = false;
				}
			}else{
				this.setData();
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
				this.noOfImgs = this.quesInfo.imgCount;
				this.isFirstQues = this.quesInfo.isFirstQues;
				this.isLastQues = this.appModel.isLastSection;
				this.isLastQuesAct = this.appModel.isLastSectionInCollection;
				//this.isAutoplayOn = this.appModel.autoPlay;
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
		 }
	  }