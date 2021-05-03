import { Component , OnInit ,HostListener ,ViewChild } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { PlayerConstants } from '../../../common/playerconstants';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-template15',
  templateUrl: './template15.component.html',
  styleUrls: ['./template15.component.scss']
})
export class Template15Component implements OnInit{
  private appModel: ApplicationmodelService;
   constructor(appModel: ApplicationmodelService) {
     this.appModel = appModel;
     this.assetsfolderlocation=this.appModel.assetsfolderpath;
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
   
    @ViewChild('ans')  ans: any;
    @ViewChild('narrator_voice') narrator_voice: any;
    @ViewChild('myAudiohelp') myAudiohelp: any;
    @ViewChild('audioEl') audioEl: any;
    @ViewChild('titleNavBtn') titleNavBtn: any;
    @ViewChild('container') containerBlock: any; 
    @ViewChild('fireworks')  fireworks: any;
    @ViewChild('ansBlock')  ansBlock: any;
    @ViewChild('helpbtn')  helpbtn: any;
    @ViewChild('navBlock') navBlock:any;
    @ViewChild('buzzerSound')  buzzerSound: any;
    @ViewChild('titleAudio')  titleAudio: any;
    @ViewChild('maincontent') maincontent:any;
       containgFolderPath:any;
       disableHelpBtn:boolean = false;		
       optimage:any;
       opttext:any;
       currentIdx = 0;
       blink:boolean = false;
       showIntroScreen:boolean = true;
       audio =new Audio();
       bool:boolean=false;
       timernextseg:any;
       idArray:any;
       speaker:any="";
       myoption:any=[];
       question:any="";
       feedback:any="";
       answers:any="";
       optionBlank:any="";
       Instruction:any="";
       quesInfo:any="";
       isFirstQues:boolean;
       isLastQues:boolean = false;
       isAutoplayOn:boolean;
       isLastQuesAct:boolean;
       resizeFlag:boolean;
       noOfImgs:number;
       noOfImgsLoaded:number = 0;
       loaderTimer:any;
       assetspath:any;
       assetsfolderlocation:string="";
       common_assets:any = "";
       hasEventFired:boolean = false;
 
       
       //Instruction=this._sharedService.navigatetoroute.Instruction;
       //optionslist = this._sharedService.navigatetoroute.main;
       //optionslist_main = this._sharedService.navigatetoroute.main[this.currentIdx];
       //speaker = this.optionslist[this.currentIdx].speaker;
       //myoption = this.optionslist[this.currentIdx].options;
       //question = this.optionslist[this.currentIdx].ques;
       //feedback = this.optionslist[this.currentIdx].feedback;
       //answers = this.optionslist[this.currentIdx].answers;
       //optionBlank =this.optionslist[this.currentIdx].optionsBlank;
       
         //disable next on last activity last question
         //isLastActivity = this._sharedService.isLastActivity;
       
     get basePath(): any {
        console.log('temponeComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
       if(this.appModel && this.appModel.content){
       
          return this.appModel.content.id + '';
       }
     }		
     setData(){
     if(this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data){
       let fetchedData:any =  this.appModel.content.contentData.data;
       this.speaker = fetchedData.speaker;
       this.common_assets = fetchedData.common_assets;
       this.myoption = fetchedData.options;
       console.log("myoption : "+this.myoption);
       this.question = fetchedData.ques;
       this.feedback = fetchedData.feedback;
       this.answers = fetchedData.answers;
       this.optionBlank = fetchedData.optionsBlank;
       this.isFirstQues = fetchedData.isFirstQues;
       this.isLastQues = this.appModel.isLastSection;
       this.isLastQuesAct = this.appModel.isLastSectionInCollection;
       this.isAutoplayOn = this.appModel.autoPlay;
 
       this.noOfImgs = fetchedData.imgCount;
     setTimeout(()=>{
         if(this.navBlock && this.navBlock.nativeElement){
           this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around";
         }
       },200)
     }else{
       /*this.speaker = "";
       this.myoption = [];
       this.question = "";
       this.feedback = "";
       this.answers = "";
       this.optionBlank = "";*/
     }
     
     }
     onHoverOptions(option,idx){
       //console.log("in",option);
        if(!this.narrator_voice.nativeElement.paused){
         console.log("narrator voice still playing");
        }
        else{
         option.image =option.image_hover;
         //this.ansBlock.nativeElement.className="pointer";
         this.ansBlock.nativeElement.children[idx].className = "options pointer";
        }
     }
 
     onHoveroutOptions(option,idx){
       //console.log("out",option);
       option.image =option.image_original;
       //this.ansBlock.nativeElement.className="";
       this.ansBlock.nativeElement.children[idx].className = "options";
     
       
       
     }
     onHoverhelp(option){
       //console.log("in",option);
       if(!this.narrator_voice.nativeElement.paused){
         this.helpbtn.nativeElement.className="";
         console.log("narrator voice still playing");
       }
       else{
         option.help =option.helphover;
         this.helpbtn.nativeElement.className="pointer"; 
       }
     }
 
     onHoverouthelp(option){
       //console.log("out",option);
       option.help = option.helpOriginal;
       
     }
     onHoverAageyBadheinBtn(){
         this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_hover;
     }
     onLeaveAageyBadheinBtn(){
       this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
     }
     onHoverPeecheyBtn(){
         this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_hover;
     }
     onLeavePeecheyBtn(){
       this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
     }
     onHoverZaariRakhein(){
       this.quesInfo.zaariRakhein = this.quesInfo.zaariRakhein_hover; 
     }
     onHoverOutZaariRakhein(){
       this.quesInfo.zaariRakhein = this.quesInfo.zaariRakhein_original;
     }
     
     playSound(sound) {
       // plays a sound
       if(this.myAudiohelp && this.myAudiohelp.nativeElement){
         this.myAudiohelp.nativeElement.pause();
       }
       this.audio.src =  sound;
       this.audio.load();
       this.audio.play();		
         }
     
     helpSpeaker(el : HTMLAudioElement){
       if(!this.narrator_voice.nativeElement.paused){
         console.log("narrator voice still playing");
       }
       else{
             el.pause();
             el.currentTime = 0;
             el.play();
             if(this.maincontent){
               this.maincontent.nativeElement.className = "disable_div";
             }
             el.onended =()=>{
               if(this.maincontent){
                 this.maincontent.nativeElement.className = "";
               }
             }
       }
     }
     
     stopAllSounds(e) {
       //console.log("Event", e);
      if(!this.narrator_voice.nativeElement.paused){
          e.stopPropagation();
          console.log("narrator voice still playing");
      }
      else{}
     }
     checkAnswer(option,event) {
       this.disableHelpBtn = true;
       // Analytics called for attempt counter & first option is clicked
       if(this.myAudiohelp && this.myAudiohelp.nativeElement){
         this.myAudiohelp.nativeElement.pause();
         this.myAudiohelp.nativeElement.currentTime = 0;
       }
       if(!this.narrator_voice.nativeElement.paused){
         console.log("narrator voice still playing");
       }
       else{
     
         //this._sharedService.optionclickhandler(option.id,option.imgsrc,this.optionslist_main.id);
         //this._sharedService.attempt_counter++;  // called when any option is clicked
         //console.log("attempt_counter>>>>",this._sharedService.attempt_counter);
         //if(this._sharedService.attempt_counter == 1){
         //this._sharedService.first_option_selected=option.id;
         //this._sharedService.first_option_selected_data=option.imgsrc;
         //console.log("first option selected >>>>",this._sharedService.first_option_selected,this._sharedService.first_option_selected_data);
         //}
 
       // logic to check what user has done is correct
       if(option.id==this.feedback.correct_ans_index){
 
         console.log("i have hit correct sequence");	
         this.playSound(this.feedback.write_ans_sound.path.url);
         //this.isLastQues = this.appModel.isLastSection;
           // call to play answer sound and show popup
           if(this.ans && this.ans.nativeElement && this.ans.nativeElement.src)
           this.ans.nativeElement.src=this.assetspath + '/' +this.feedback.write_ans_popup.image.url;
           
           var popup=document.getElementById("correctAns")
           popup.className ="d-flex align-items-center justify-content-center showit";
         
           let elfireworks: HTMLElement = this.fireworks.nativeElement as HTMLElement
           elfireworks.className = "d-flex align-items-center justify-content-center showit";
           
         
           // question next timeout
           this.timernextseg = setInterval(()=>{
           this.checkNextActivities();
           },500) 
   
       }
 
 
       else{
 
         console.log("when wrong answer clicked");
         
   
         // call to play answer sound
 
         if(this.buzzerSound && this.buzzerSound.nativeElement){
           this.buzzerSound.nativeElement.play();
         }
 
         //vibrate POC
         
         console.log("E:",event);
         this.optimage=event.toElement.previousElementSibling;
         this.optimage.className=this.optimage.className.concat(" animation-shake");
         this.opttext=event.toElement;
         this.opttext.className=this.opttext.className.concat(" animation-shake");
         this.ansBlock.nativeElement.className="d-flex flex-row justify-content-around pointer disable";
         
         
         this.buzzerSound.nativeElement.onended = () => {
           this.optimage.className = "img-fluid bgBlank";
           this.opttext.className = "img-fluid";
           this.idArray =[];
             for(let i of this.myoption){
             this.idArray.push(i.id);
           } 
           this.doRandomize(this.myoption);
           setTimeout(()=>{
             this.ansBlock.nativeElement.className="d-flex flex-row justify-content-around pointer";	
           },200)
         }
 
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
         var img_hover1 = array[currentIndex].image_hover;
         var text1 = array[currentIndex].image;
         var text1copy = array[currentIndex].image_original;
         
         var img_hover2 = array[randomIndex].image_hover;
         var text2 = array[randomIndex].image;
         var text2copy = array[randomIndex].image_original;
         // And swap it with the current element.
         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
         
         array[currentIndex].image_hover = img_hover1;
         array[currentIndex].image = text1;
         array[currentIndex].image_original = text1copy;
         
         array[randomIndex].image_hover = img_hover2;
         array[randomIndex].image = text2;
         array[randomIndex].image_original = text2copy;
         
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
       //var bool = false;
       while (i--) {
         /*if (a[i].id !== b[i]) 
           return false;
         */
         
         if (a[i].id == b[i]) {
           return true;
         }
       }
       return false;
     }
     
       isPaused(){
       return this.audio.paused;
     } 
     checkNextActivities(){
       if(this.isPaused()){
         this.removeEvents();
           //if(this.currentIdx == this.optionslist.length-1 && !this.isLastActivity && this._sharedService.autoplay_var==0){
             
             var popup=document.getElementById("correctAns")
             popup.className ="d-flex align-items-center justify-content-center hideit";
             //disable click on options and speaker
             
             var optionsBlock=document.getElementById("ansBlock");
             if(optionsBlock){
             optionsBlock.className = optionsBlock.className.concat(" disable");
             }
             
             if(!this.isAutoplayOn && !this.isLastQues && this.isLastQuesAct){
               this.blink = true;
             }
             if((this.isAutoplayOn && !this.isLastQues) || !((this.isLastQuesAct)) ||((this.isLastQuesAct && this.isAutoplayOn && !this.isLastQuesAct))){
               this.next();
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
           //}
           
       }
       else{
         console.log("feedback_audio still playing");
       }
     }
     // previous function
         previous(){
       if(this.common_assets && this.common_assets.peechey_jayein){
         this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
       }
       if(this.common_assets && this.common_assets.aagey_badhein){
         this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
       }	
       setTimeout(()=>{
         if(this.navBlock && this.navBlock.nativeElement){
           this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
         }
       },0)
       //console.log("prev",this.currentIdx);	
       this.blink=false;
       this.reset();
       
             this.currentIdx--;
       this.appModel.previousSection();
       //this.setData();
       this.appModel.setLoader(true);
         }
   
   
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
       if(this.common_assets && this.common_assets.peechey_jayein){
         this.common_assets.peechey_jayein = this.common_assets.peechey_jayein_original;
       }
       if(this.common_assets && this.common_assets.aagey_badhein){
         this.common_assets.aagey_badhein = this.common_assets.aagey_badhein_original;
       }	
       
       if(!this.isLastQues){
         setTimeout(()=>{
           if(this.navBlock && this.navBlock.nativeElement){
             this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
           }
         },0)
                 this.currentIdx++;                                
             
         this.appModel.nextSection();
         //this.setData();
         this.appModel.setLoader(true);
         this.removeEvents();
         this.reset();
         
       }  
     }
   
   
   
     //setEnability(flag, option_ref) {
     // sets enabled or disabled
     //	this.bool=true;
     //	if(this.optionslist.length == option_ref && this.bool ){
     //		this._sharedService.activityfinished();
     //		this.bool=false;
     //	}
     //}
 
     removeEvents() {
        // remove event handlers for all clickable items in the dom
        this.blink=false;
        clearTimeout(this.timernextseg);
         if(this.fireworks && this.fireworks.nativeElement){
           let elfireworks: HTMLElement = this.fireworks.nativeElement as HTMLElement
         elfireworks.className = "d-flex align-items-center justify-content-center hideit";
        }
   }
 
   close() {
     //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
     this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
   }
 
     reset() {
         // will reset all what user performed
       this.audio.pause();
       //this._sharedService.correct_option_attempt_counter =0;
       //this._sharedService.attempt_counter =0;
       //this._sharedService.first_option_selected =0;
       //this._sharedService.first_option_selected_data="none";
       //this._sharedService.speaker_counter =0;
       if(this.myAudiohelp && this.myAudiohelp.nativeElement)
       this.myAudiohelp.nativeElement.pause();
       var optionsBlock=document.getElementById("ansBlock");
       if(optionsBlock){
       optionsBlock.className = "d-flex flex-row justify-content-around pointer";
       }
       var popup=document.getElementById("correctAns")
       if(popup){
       popup.className ="d-flex align-items-center justify-content-center hideit";
       }
       
       if(this.ans && this.ans.nativeElement && this.ans.nativeElement.src)
       this.ans.nativeElement.src=this.assetspath + '/' +this.question.img_sentence_org.url;
     
     }
 
   
     /*resizeContainer(){
       let containerBlock: HTMLElement = this.containerBlock.nativeElement as HTMLElement
       //console.log(this.containerBlock.nativeElement);
       containerBlock.style.width = "initial";
       let targetHeight = window.innerHeight;
       let containerHeight = containerBlock.clientHeight;
       let containerWidth = containerBlock.clientWidth;
       if(containerHeight > targetHeight){
         this.resizeFlag = true;
         while (containerHeight > targetHeight) {
           containerHeight = containerHeight - (containerHeight * .01);
           containerWidth = containerWidth - (containerWidth * .01);
         }
       containerBlock.style.width = containerWidth+"px";
       }
     }*/
     
     
     closeTitleScreen(){
       this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeOutAnimation";
       setTimeout(()=>{
         this.showIntroScreen = false;
         this.next();
       },200)
       
     }
      templatevolume(vol,obj) {
       if(obj.narrator_voice && obj.narrator_voice.nativeElement){
         obj.narrator_voice.nativeElement.volume = obj.appModel.isMute?0:vol;
       }
       if(this.buzzerSound && this.buzzerSound.nativeElement){
         this.buzzerSound.nativeElement.volume = obj.appModel.isMute?0:vol;
       }
       if(obj.myAudiohelp && obj.myAudiohelp.nativeElement){
         obj.myAudiohelp.nativeElement.volume = obj.appModel.isMute?0:vol;
       }
       if(obj.titleAudio && obj.titleAudio.nativeElement){
         obj.titleAudio.nativeElement.volume = obj.appModel.isMute?0:vol;
       }			
       if(obj.audioEl && obj.audioEl.nativeElement){
         obj.audioEl.nativeElement.volume =obj.appModel.isMute?0:vol;
       }  
       if(obj.audio){
         obj.audio.volume =obj.appModel.isMute?0:vol;
       }
      }		
     checkImgLoaded(){
       this.noOfImgsLoaded++;
       if(this.noOfImgsLoaded>=this.noOfImgs){
         this.appModel.setLoader(false);
         clearTimeout(this.loaderTimer);
       }
     }
     ngOnInit() {
        /*this.assetspath=this.basePath;*/
        this.assetspath=this.basePath;
        this.appModel.functionone(this.templatevolume,this);//start end
         /*window.onresize = (e) =>{
          this.resizeContainer();
         }*/	
         if(this.appModel.isNewCollection){
         //console.log("chck:",this.appModel.isNewCollection);
         this.appModel.event = {'action': 'segmentBegins'};
         }
         
         let fetchedData:any=this.appModel.content.contentData.data;
         console.log("init:",this.appModel.content.contentData.data);
         if(fetchedData.titleScreen){
           this.quesInfo=fetchedData;
           this.showIntroScreen = true;
           this.noOfImgs = this.quesInfo.imgCount;
           //if(this.quesInfo.Instruction){
           //this.playSound(this.quesInfo.Instruction);
           /*this.timernextseg = setInterval(()=>{
           if(this.audio.paused){
             this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit";
             clearInterval(this.timernextseg);
               }
             },200)*/
           //} 
         }
         else{
           this.showIntroScreen = false;
           this.setData();
         }
         setTimeout(()=>{
           if(this.navBlock && this.navBlock.nativeElement){
             this.navBlock.nativeElement.className="d-flex flex-row align-items-center justify-content-around disable_div";
           }
         },0)
     }
     
     ngAfterViewChecked(){
        if(this.titleAudio && this.titleAudio.nativeElement){
         this.titleAudio.nativeElement.onended = () => {
         this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
         } 
        }
        /*if(!this.resizeFlag){
           this.resizeContainer();
       }*/
       this.templatevolume(this.appModel.volumeValue,this);
       
      }
 
 }