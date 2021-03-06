import { Component, OnInit, HostListener, ViewChild, OnDestroy, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs'
import 'jquery';


declare var $: any;

@Component({
  selector: 'Ntemplate23_1',
  templateUrl: '../view/layout/Ntemplate23_1.component.html',
  styleUrls: ['../view/css/Ntemplate23_1.component.css', '../view/css/bootstrap.min.css'],
  encapsulation: ViewEncapsulation.None
})

export class Ntemplate23_1 implements OnInit {
  private appModel: ApplicationmodelService;

  constructor(appModel: ApplicationmodelService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
      this.checkforQVO();
    }, 5000);

    //this.rightFeedbackVO.nativeElement.currentTime = 0;
    //this.rightFeedbackVO.nativeElement.src = "";
    //this.wrongFeedbackVO.nativeElement.src = "";
   // this.wrongFeedbackVO.nativeElement.pause();
    //this.wrongFeedbackVO.nativeElement.currentTime = 0;
  }

  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('RightModal') RightModalRef: any;
  @ViewChild('WrongModal') WrongModalRef: any;  
  @ViewChild('popupImage') popupImage: any;
  @ViewChild('rightFeedbackVO') rightFeedbackVO: any
  @ViewChild('wrongFeedbackVO') wrongFeedbackVO: any;
  @ViewChild('quesRef') QuesRef: any;
  @ViewChild('hoverquesRef') hoverQuesRef: any;
  @ViewChild('clickquesRef') clickQuesRef: any;
  @ViewChild('playerAudio') myAudio: any;
  @ViewChild('answerModalRef') answerModalRef: any;
  @ViewChild('QuestionAudio') questionAudio: any;
  @ViewChild('mytooltip') Tooltip: any;
  @ViewChild('myLine') Line: any;
  @ViewChild('stateId') StateId: any;
  @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
  @ViewChild('mySelect') MySelect: any;
  @ViewChild('MyForm') MyFormVar: any;
  @ViewChild('imgRef') imgRef: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('showAnswerRef') showAnswerRef: any;
  @ViewChild('feedbackshowPopupAudio') feedbackshowPopupAudio: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  
  
  
  
  

 
  


  audio = new Audio();
  blink: boolean = false;
  currentIdx = 0;
  commonAssets: any = "";
  optionslist: any = [];
  optionslist_main: any = "";
  myoption: any = [];
  question: any = "";
  feedback: any = "";
  narratorAudio: any;
  isLastActivity: any = "";
  checked: boolean = false;
  selected: boolean = false;
  bool: boolean = false;
  showIntroScreen: boolean;

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
  optArr1: any;
  optArr2: any;
  optionCommonAssets: any;
  ques_control: any;
  feedbackObj: any;
  popupAssets: any;
  confirmPopupAssets: any;
  noOfRightAns: any;
  rightAnspopupAssets: any;
  tempSubscription: Subscription;
  rightanspopUp: any;
  wronganspopUp: any;
  quesObj:any;
  fileUrls:string ="";
  mainSvgfile: any = "";
  initColorCircle:string = "";
  initColorRectangle:string = "";
  stateCounter:number = 0;
  maharashtraCounter:number = 0;
  Id:any;
  
  Jammu:any;
  Rajasthan:any;
  Maharashtra:any;
  MadhyaPradesh:any;
  
  Index_1:any;
  Index_2:any;
  
  storeHtml:any;
  storeEvent:any;
  elseCounter:any;
  currentState:any;
  
  triangle:any;
  mainShape:any;
  
  myStates: any = [];
  
  i:number = 0;
  j:number = 0;
  noOfSVG:number;
  edited = false;
  clickEv = false;
  answer:any;
  stateValue:any = [];
  submitFlag = true;
  checkCounter:number = 0;
  quesAudio:any;
  CorrectAudio:any;
  WrongAudio:any;
  partiallyCorrectAudio:any;
  mouseOutFlag = true;
  selectedOutlineCounter:number = 0;
  onClickFlag = false;
  overState = true;
  storeState:any = [];
  _i:any;
  myDropDownStates:any = [];
  rightAnswer:any = [];
  myRightAnswer:any = [];
  Submitcounter:number = 0;
  selectedFillPart:any = [];
  rightAnswerCounter:number = 0;
  redColorArray:any = [];
  greenColorArray:any = [];
  wrongAnswerCounter:number = 0;
  greenColorCounter:number = 0;
  RightSubmit:any = [];
  textFeildValue:any = [];
  redGreenFlag:boolean;
  accessLine:any;
  dAttr:any;
  lineColor:any;
  confirmSubmitAssets: any;
  infoPopupAssets: any;
  showAnswerCounter:number = 0;
  autoTimer:boolean = true;
  autoShowAnswerCounter:number = 1;
  groupArray:any = [];
  duplicateGroupArray:any = [];
  isValid = false;
  partiallyCorrectFlag:boolean = false;
  currentindex:number = 0;
  currentIndexofrightAnswer:number = 0;
  flag: boolean = false;
  clickedId:string;
  stateIndex:number;
  options:any=[];
  config: any ={};
  coloronHover: string;
  originalcolor: string;
  submittedArray: any =[];
  tempObj = <any>{};
  p: number = 1;
  paginationArray: any = [];
  countofClick: number = 0;
  tableofOne: boolean;
  tableofTwo: boolean;
  tableofThree: boolean;
  showtableofOne: boolean;
  showtableofTwo: boolean;
  showtableofThree: boolean;
  table1:any;
  table2:any;
  table3:any;
  selectedStateinTooltip:any;
  rightstateCounter:number =0;
  rightcapitalCounter: number = 0;
  wrongstateCounter:number =0;
  wrongcapitalCounter:number =0;
  showAnswerarray:any=[];
  copiedstates:any=[];
  attemptType: string = "";
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  partialCorrectheaderTxt_img: boolean = false;
  partialInCorrectheaderTxt_img: boolean  = false
  styleHeaderPopup:any;
  styleBodyPopup:any;
  popupType:any ="";
  optionSelected:any;
  singleClicknotAllowed:boolean=false;
  listStateHeader: any;
  listCapitalHeader: any;
  DropDownTitleUpper:any;
  DropDownTitleLower:any;

  playHoverInstruction() {
   if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      this.instruction.nativeElement.load();
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        //this.QuesRef.nativeElement.style.pointerEvents = "none";
        $(".instructionBase img").css("cursor", "pointer");
        this.instruction.nativeElement.onended = () => {
          //this.QuesRef.nativeElement.style.pointerEvents = "";
        }
      }
      
  }
  // this.questionAudio.nativeElement.src = this.quesAudio.location=="content" ? this.containgFolderPath +"/"+ this.quesAudio.url : this.assetsPath +"/"+ this.quesAudio.url;
  //  this.questionAudio.nativeElement.load();
  //  this.questionAudio.nativeElement.play();
  }

  optionHover(opt, i, j) {
   // $(this.optionsBlock.nativeElement.children[i].children[j]).addClass("scaleInAnimation");
  }

  onHoverOption(opt, i, j) {
    if (opt && opt != undefined) {
      if (this.narrator.nativeElement.paused) {
        $(this.optionsBlock.nativeElement.children[i].children[j]).addClass("scaleInAnimation");
        //opt.imgsrc = opt.imgsrc_hover;
        //if (opt.imgsrc && opt.imgsrc.location == "content") {
        //  this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.containgFolderPath + "/" + opt.imgsrc.url;
        //}
        //else {
        //  this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.assetsPath + "/" + opt.imgsrc.url;
        //}
        /*if (this.optionCommonAssets.option_base_hover && this.optionCommonAssets.option_base_hover.location == "content") {
          this.optionsBlock.nativeElement.children[i].children[j].children[1].children[0].src = this.containgFolderPath + "/" + this.optionCommonAssets.option_base_hover.url;
        } else {
          this.optionsBlock.nativeElement.children[i].children[j].children[1].children[0].src = this.assetsPath + "/" + this.optionCommonAssets.option_base_hover.url;
        }*/
        //this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transform = "scale(1.1)";
      }
    }
  }

  playHoverOption(opt, i, j) {
    if (this.optionsBlock.nativeElement.children[i].children[j].children[1].paused && this.narrator.nativeElement.paused) {
      if (opt.imgsrc_audio && opt.imgsrc_audio.location == "content") {
        this.optionsBlock.nativeElement.children[i].children[j].children[1].src = this.containgFolderPath + "/" + opt.imgsrc_audio.url;
      } else {
        this.optionsBlock.nativeElement.children[i].children[j].children[1].src = this.assetsPath + "/" + opt.imgsrc_audio.url;
      }
      this.optionsBlock.nativeElement.children[i].children[j].children[1].load();
      if (!this.instruction.nativeElement.paused) {
       // this.instruction.nativeElement.pause();
      }
      this.optionsBlock.nativeElement.children[i].children[j].children[1].play();
      if (i == 0) {
        this.optionsBlock.nativeElement.children[1].style.pointerEvents = "none";
      } else {
        this.optionsBlock.nativeElement.children[0].style.pointerEvents = "none";
      }
      for (let x = 0; x < this.optionsBlock.nativeElement.children[i].children.length; x++) {
        if (x != j) {
          this.optionsBlock.nativeElement.children[i].children[x].style.pointerEvents = "none";
        }
      }
      //this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
      this.optionsBlock.nativeElement.children[i].children[j].children[1].onended = () => {
        if (i == 0) {
          this.optionsBlock.nativeElement.children[1].style.pointerEvents = "";
        } else {
          this.optionsBlock.nativeElement.children[0].style.pointerEvents = "";
        }
        for (let x = 0; x < this.optionsBlock.nativeElement.children[i].children.length; x++) {
          if (x != j) {
            this.optionsBlock.nativeElement.children[i].children[x].style.pointerEvents = "";
          }
        }
      } 
      this.onHoverOption(opt, i, j);
    }
  }
  onHoverOptionOut(opt, i, j) {
    if (opt && opt != undefined) {
      this.OptionZoomOutAnimation(opt, i, j);
    }
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  OptionZoomOutAnimation(opt, i, j) {
    if (!this.checked && this.narrator.nativeElement.paused) {
      $(this.optionsBlock.nativeElement.children[i].children[j]).addClass("scaleOutAnimation");
      setTimeout(() => {
        $(this.optionsBlock.nativeElement.children[i].children[j]).removeClass("scaleInAnimation");
        $(this.optionsBlock.nativeElement.children[i].children[j]).removeClass("scaleOutAnimation");
      }, 500);
      //opt.imgsrc = opt.imgsrc_original;
      //if (opt.imgsrc && opt.imgsrc.location == "content") {
      //  this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.containgFolderPath + "/" + opt.imgsrc.url;
      //} else {
      //  this.optionsBlock.nativeElement.children[i].children[j].children[0].src = this.assetsPath + "/" + opt.imgsrc.url;
      //}
      //this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transform = "none";
      //this.optionsBlock.nativeElement.children[i].children[j].children[0].style.cursor = "";
    }
  }
  checkAnswer(opt, i, j) {
    if (!this.narrator.nativeElement.paused! || !this.instruction.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      this.optionsBlock.nativeElement.className += " disable_div";
      if (opt.id == this.feedback.correct_ans_index) {
        this.checked = true;
        this.selected = true;
        //this.optionsBlock.nativeElement.children[i].children[j].children[1].children[2].style.display = "block";
        this.optionsBlock.nativeElement.className += " disable_div";
        $("#instructionBar").addClass("disable_div");
        //console.log(this.popupImage);
        if (opt.imgsrc && opt.imgsrc.location == "content") {
          this.popupImage.nativeElement.src = this.containgFolderPath + "/" + opt.imgsrc.url;
        } else {
          this.popupImage.nativeElement.src = this.assetsPath + "/" + opt.imgsrc.url;
        }
        this.rightanspopUp=setTimeout(() => {
          //this.popupRef.nativeElement.classList = "displayPopup modal";
          //this.optionsBlock.nativeElement.style = "opacity:0.3";
          $("#optionsBlock .options").css("opacity", "0.3");
          $("#instructionBar").css("opacity", "0.3");
            this.rightFeedbackVO.nativeElement.play();
          
        }, 700);
        this.rightFeedbackVO.nativeElement.onended = () => {
          setTimeout(() => {
            this.closeModal();
          },2000);
        }
        
      } else {
        this.checked = true;
        this.selected = false;
        //this.optionsBlock.nativeElement.children[i].children[j].children[1].children[3].style.display = "block";
        this.optionsBlock.nativeElement.children[i].children[j].className += " disable_div";
        $("#instructionBar").addClass("disable_div");
        if (opt.imgsrc && opt.imgsrc.location == "content") {
          this.popupImage.nativeElement.src = this.containgFolderPath + "/" + opt.imgsrc.url;
        } else {
          this.popupImage.nativeElement.src = this.assetsPath + "/" + opt.imgsrc.url;
        }
        this.wronganspopUp=setTimeout(() => {
          //this.appModel.openModal("success-modal-id", this.popupAssets,'');
          //this.popupRef.nativeElement.classList = "displayPopup modal";
          
          this.optionsBlock.nativeElement.classList.value = "row mx-0";
          this.optionsBlock.nativeElement.children[i].children[j].style = "opacity:0.3";
          this.wrongFeedbackVO.nativeElement.play();
        },700);
        
        this.checked = false;
        this.wrongFeedbackVO.nativeElement.onended = () => {
          setTimeout(() => {
            this.closeModal();
            $("#optionsBlock .options").removeClass("disable_div");
            $("#optionsBlock .options").css("opacity", "unset");
          }, 2000);        
        }
      }
      this.optionsBlock.nativeElement.children[i].children[j].style.transform = "none";
    }
  }
  blinkOnLastQues() {
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
  
  MouseOver(event)
  {	 
      //var MyTextField = (document.getElementById("lfname") as HTMLInputElement);
      this.appModel.notifyUserAction();
      this.Id = event.target.getAttribute('xlink:href');
      if(this.Id!= null) {             
      if(!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.pause();
      }
      }
      console.log("this.Id = "+this.Id);

      if(this.Id == null) {
        if(this.stateIndex!= undefined && this.myStates[this.stateIndex]!=undefined && !this.myStates[this.stateIndex].clicked) {
          $(this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].setAttribute("fill",this.originalcolor);
          //this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].innerHTML = this.storeHtml;
        }
      }
      let idFound = this.myStates.find(element => element.id == this.Id || element.strokeId == this.Id);
      if(idFound && !idFound.clicked) {
        if(this.originalcolor!=undefined && this.myStates[this.stateIndex]!=undefined && !this.myStates[this.stateIndex].clicked) {
          //this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].innerHTML = this.storeHtml;
          $(this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].setAttribute("fill",this.originalcolor);
         }
         this.stateIndex =this.myStates.findIndex(element => element.id == this.Id || element.strokeId == this.Id);
         //console.log(stateIndex);
         this.originalcolor = $(this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].getAttribute("fill");
         //this.storeHtml = this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].innerHTML;
        if(this.stateIndex != -1) {
          //alert("blinking")
          //alert(this.stateIndex);
          $(this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].setAttribute("fill",this.mainSvgfile.hoverColor);
          //this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].innerHTML = this.hoverQuesRef.nativeElement.children[0].children[this.stateIndex+1].innerHTML;
          //this.play(this.stateIndex);
     }
   }

  //   for(let i = 0; i<this.myStates.length; i++)
	//   {	
	// if(this.Id == this.myStates[i].id && this.myStates[i].id != undefined)
	//  {
	// 	 this.Id = this.myStates[i].strokeId;
	// 	 this.storeEvent = $(event.target);		
	// 	 this.strokeOver();		 
	// 	 this.stateCounter = 0;
  //        this.currentState = $($($(event.target).parent().parent().last().siblings()[this.myStates.length].children[0].children[0]).attr("xlink:href"));	 
	// 	 this.reset();		 	 
	// 	 if(this.currentState != undefined)
	// 	 {
	// 	 this.currentState.attr("stroke-width", "2");
	// 	 this.currentState.attr("stroke", "#000000");		
	// 	// MyTextField.value += this.myStates[i].textField;
	// 	 this.answer = MyTextField.value;
	// 	 this.play(i);
	// 	 }
  //       break;		 
	//  } 	
	//   else {	     
	// 	 //this.reset();	
  //        //MyTextField.value = "";	
  //        //this.answer = MyTextField.value;		 
	//  }
	//  }
		
  }
  
  play(i) {
    if(this.questionAudio && this.questionAudio.nativeElement) {
      this.questionAudio.nativeElement.pause();
    }
   this.myAudio.nativeElement.src = this.myStates[i].location=="content" ? this.containgFolderPath +"/"+ this.myStates[i].audio : this.assetsPath +"/"+ this.myStates[i].audio;
   this.myAudio.nativeElement.load();
   this.myAudio.nativeElement.play();
   //this.QuesRef.nativeElement.style.pointerEvents = "none";
   //this.QuesRef.nativeElement.style.pointerEvents = "none";
   this.myAudio.nativeElement.onended = () => {
    //this.optionsBlock.nativeElement.style.pointerEvents = "auto";
    //this.QuesRef.nativeElement.style.pointerEvents = "auto";
   }
}

  
  MouseOut(event)
  {	   

    if(this.stateIndex!= undefined && this.myStates[this.stateIndex]!=undefined && !this.myStates[this.stateIndex].clicked) {
      $(this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].setAttribute("fill",this.originalcolor);
      //this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].innerHTML = this.storeHtml;
    }
	  // if(this.mouseOutFlag == true)
	  // {		
		//  this.reset();
	  // }
  }
  
  onTooltipclick() {
    console.log("tooltip closed");
    this.appModel.enableSubmitBtn(true);
    document.getElementById('dropdownviaTooltip').style.opacity = "0";
    //document.getElementById('dropdownviaTooltip').style.zIndex="unset";
    document.getElementById('dropdownviaTooltip').style.left="0%";
    document.getElementById('dropdownviaTooltip').style.top="0%";
  }

  public get sortedArray() {
    // this.copiedstates = this.myStates.slice();
    // return this.copiedstates.sort(function(a, b) {
    //   var nameA = a.capital.toUpperCase(); 
    //   var nameB = b.capital.toUpperCase(); 
    //   if (nameA < nameB) {
    //     return -1;
    //   }
    //   if (nameA > nameB) {
    //     return 1;
    //   }
    //   return 0;
    // });
    let arr=[];
    for(let i=0;i<this.myStates.length;i++) {
      arr.push(this.myStates[i].capital);
    }
    this.copiedstates = arr.filter((item,index) => arr.indexOf(item) === index);
    return this.copiedstates;
  }
  
  onClick(event)
  {	 
    if(!this.singleClicknotAllowed) {
      if(this.stateIndex!= undefined && this.myStates[this.stateIndex]!=undefined && !this.myStates[this.stateIndex].clicked) {
        $(this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].setAttribute("fill",this.originalcolor);
        //this.QuesRef.nativeElement.children[0].children[this.stateIndex+1].innerHTML = this.storeHtml;
      }
      this.appModel.enableSubmitBtn(false);  
      this.clickedId = event.target.getAttribute('xlink:href');
      console.log("this.Id = "+this.clickedId);
      let idFound = this.myStates.find(element => element.id == this.clickedId || element.strokeId == this.clickedId);
      if(idFound!=undefined) {
        this.optionSelected = idFound.optionSelected;
      }
      this.stateIndex =this.myStates.findIndex(element => element.id == this.clickedId || element.strokeId == this.clickedId);
      if(idFound && !idFound.clicked) {
        this.appModel.notifyUserAction();
        this.countofClick++;
        document.getElementById("dropdown").style.opacity="1";
        document.getElementById("dropdown").style.pointerEvents="";
        document.getElementById('dropdownviaTooltip').style.opacity = "0";
        console.log("clicked");
        idFound.clicked = true;
        this.submittedArray.push(idFound);
        this.tempObj=<any>{};
        this.tempObj.state = idFound.stateTxtimg;
        this.checkStateStatus(idFound);
        //this.tempObj.capital = "";
        this.paginationArray.push(this.tempObj);
        if(this.countofClick > this.commonAssets.itemsperPage) {
          this.countofClick = 1;
          //this.commonAssets.itemsperPage=this.commonAssets.itemsperPage+10;
          this.p++;
        }
        //let tooltipDom = document.getElementById('tooltip'+(this.stateIndex+1));
        //tooltipDom.classList.value="tooltipshow";
        $("#tooltip"+(this.stateIndex+1)).removeClass("tooltipHidden");
        $("#tooltip"+(this.stateIndex+1)).addClass("tooltipshow");
        document.getElementById("tooltip"+(this.stateIndex+1)).style.pointerEvents= "none";
        //this.Tooltip.nativeElement.style.opacity = 1;
        document.getElementById("tooltip"+(this.stateIndex+1)).style.left = this.myStates[this.stateIndex].left+"%";
        document.getElementById("tooltip"+(this.stateIndex+1)).style.top = this.myStates[this.stateIndex].top+"%";
        //let colorofState= $(document.getElementById("clickques").children[0].children[this.stateIndex+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].getAttribute("fill");
        //$(document.getElementById("mainques").children[0].children[this.stateIndex+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].setAttribute("fill",idFound.onclickColor);
        $(document.getElementById("mainques").children[0].children[this.stateIndex+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].setAttribute("fill",idFound.onclickColor);
        //$(document.getElementById("mainques").children[0].children[this.stateIndex+1]).css("pointer-events","none");
        document.getElementById('dropdown').style.pointerEvents = "";
        document.getElementById("dropdown").classList.remove("dropdownhidden");
        var statebound = document.getElementById("dropdown").children[0].getBoundingClientRect();
      
      if($( window ).width() > $("#container").width()+100)
      {
        var stateboundX = statebound.left/($("#container").width()/0.9)*100;
        var stateboundY = statebound.top/($("#container").height()*1.1)*100;
      }
      else{
        var stateboundX = statebound.left/($("#container").width())*100;
        var stateboundY = statebound.top/($("#container").height()*1.1)*100;
      }
      
      
      
        document.getElementById("line0").setAttribute("x1",(stateboundX*1 +2)+"%");
        document.getElementById("line0").setAttribute("y1",stateboundY*0.8+"%");
        document.getElementById("line0").setAttribute("x2",parseInt(this.myStates[this.stateIndex].left)+"%");
        document.getElementById("line0").setAttribute("y2",parseInt(this.myStates[this.stateIndex].top)+"%");
        document.getElementById("line0").style.opacity = "1";	
        //document.getElementById("dropdown")[0].className = "dropdown";
        //document.getElementById("mainques").style.pointerEvents = "none";
        for(let i =0;i<document.getElementById("mainques").children[0].children.length;i++) {
          if(i != (this.stateIndex+1)) {
          (document.getElementById("mainques").children[0].children[i] as HTMLElement).style.pointerEvents="none"
          } else {
            this.singleClicknotAllowed= true;
          }
          }  
      } else {
        if(idFound!=undefined) {
          console.log("new dropdown will open");
          this.appModel.enableSubmitBtn(false);
          this.selectedStateinTooltip = idFound.textField;
          //this.appModel.enableSubmitBtn(true); 
          //document.getElementById('dropdownviaTooltip').style.zIndex = "999";
          document.getElementById('dropdownviaTooltip').style.pointerEvents="";
          document.getElementById('dropdownviaTooltip').style.opacity = "1";
          document.getElementById('dropdown').style.pointerEvents = "none";
          document.getElementById('dropdownviaTooltip').style.left = this.myStates[this.stateIndex].ddTooltipleft+"%";
          document.getElementById('dropdownviaTooltip').style.top = this.myStates[this.stateIndex].ddTooltiptop+"%";
        }
      }
        
      
      
    //       this.edited = true;
    // 	this.onClickFlag = true;
    // 	//let Linee = this.Line.nativeElement.getBoundingClientRect();
    // 	 if(this.onClickFlag)
    //  {
    //  var MyTextField = (document.getElementById("lfname") as HTMLInputElement);
    //  this.Id = $(event.target).attr('xlink:href');
    //   for(let x = 0; x<this.myStates.length; x++)
    // {	
    // if(this.Id == this.myStates[x].id && this.myStates[x].id != undefined && this.myStates[x].working == "true")
    //  {
    // 	this.MySelect.nativeElement.style.pointerEvents = "auto";
    // 	this.clickEv = true;
    // 	this.mouseOutFlag = false;
    // 	 this.MySelect.nativeElement.selectedIndex = 0;
    // 	 this.questionAudio.nativeElement.pause();
    // 	 this.selectedOutlineCounter += 1;
    // 	 this.myStates[x].working = "false";
    //        this.currentindex = x;		 
    // 	 this.autoTimer = false;
    // 	 this.QuesRef.nativeElement.style.pointerEvents = "none";
    // 	 this.appModel.notifyUserAction();
    // 	 this.Tooltip.nativeElement.style.pointerEvents = "none";
    // 	this.Tooltip.nativeElement.style.opacity = 1;
    // 	this.Id = this.myStates[x].strokeId;
    // 	this.Tooltip.nativeElement.style.left = this.myStates[x].left+"%";
    // 	this.Tooltip.nativeElement.style.top = this.myStates[x].top+"%"; 
    // 	this.StateId.nativeElement.style.opacity = 1;
    // 	var statebound = this.StateId.nativeElement.getBoundingClientRect();
      
    // 	if($( window ).width() > $("#container").width()+100)
    // 	{
    // 		var stateboundX = statebound.left/($("#container").width()/0.9)*100;
    // 		var stateboundY = statebound.top/($("#container").height()*1.1)*100;
    // 	}
    // 	else{
    // 		var stateboundX = statebound.left/($("#container").width())*100;
    // 		var stateboundY = statebound.top/($("#container").height()*1.1)*100;
    // 	}
      
      
      
    // 	document.getElementById("line0").setAttribute("x1",stateboundX*1+"%");
    //     document.getElementById("line0").setAttribute("y1",stateboundY*0.8+"%");
    //     document.getElementById("line0").setAttribute("x2",parseInt(this.myStates[x].left)+"%");
    //     document.getElementById("line0").setAttribute("y2",parseInt(this.myStates[x].top)+"%");	
       
    // 	 this.rightAnswer.push(this.myStates[x].textField);
    // 	 this.storeEvent = $(event.target);
    // 	 this.selectedFillPart.push($($(this.storeEvent.parent().parent().last())));
    //         if(!this.overState)
    // 	  {
    // 		  	this.strokeOver(); 
    // 	  }			  
       
    // 	 this.stateCounter = 0;
    //        this.currentState = $($($(event.target).parent().parent().last().siblings()[this.myStates.length].children[0].children[0]).attr("xlink:href"));		 
          
    // 	 if(this.currentState != undefined)
    // 	 { 
    // 	 this.currentState.attr("stroke-width", "2");
    // 	 this.currentState.attr("stroke", "#000000");		
    // 	 MyTextField.value += this.myStates[x].textField+", ";
    // 	 this.textFeildValue.push(this.myStates[x].textField);
    // 	 this.answer = MyTextField.value;
    // 	 //this.play(x);
    // 	 this.overState = false;
    // 	 }
    //       break;		 
    //  } 	
    //   else {	     
    // 	// this.reset();	
    //       // MyTextField.value = "";	
    //        this.answer = MyTextField.value;		 
    //  }
    //  }
    // }      
    }
  }


  checkStateStatus(state) {
    if(this.feedbackObj.correct_state.includes(state.textField)) {
      this.tempObj.stateStatus = state.correctstateTxtimg;
      this.tempObj.capitalofSelectedState = state.capital;
      this.tempObj.imgcapitalofSelectedState = state.correctcapitalTxtimg;
      this.tempObj.isStatecorrect = true;
    } else {
      this.tempObj.stateStatus = state.incorrectstateTxtimg;
      this.tempObj.capitalofSelectedState = state.capital;
      this.tempObj.imgcapitalofSelectedState = state.incorrectcapitalTxtimg;
      this.tempObj.isStatecorrect = false;
    }
  }

    ondblClick(event) {
    //alert("double click");
    document.getElementById('dropdownviaTooltip').style.pointerEvents="none";
    document.getElementById('dropdownviaTooltip').style.opacity="0";
    //if(this.paginationArray.length<=1) {
      

    // } else {
    //   document.getElementById("line0").style.opacity = "1";
    //   this.appModel.enableSubmitBtn(true);
    // }
    //this.Tooltip.nativeElement.style.opacity = 0;
    // let tooltipDom = (document.getElementById("tooltip"+(this.stateIndex+1)) as HTMLInputElement)
    // tooltipDom.classList.value="tooltipHidden";
    this.Id = event.target.getAttribute('xlink:href');
    console.log("this.Id = "+this.Id);
    if(this.Id!=null) {
      $("#tooltip"+(this.stateIndex+1)).removeClass("tooltipshow");
      $("#tooltip"+(this.stateIndex+1)).addClass("tooltipHidden");
      let idFound = this.myStates.find(element => element.id == this.Id || element.strokeId == this.Id);
      this.stateIndex =this.myStates.findIndex(element => element.id == this.Id || element.strokeId == this.Id);
      if(this.stateIndex!=-1) {
        document.getElementById("line0").style.opacity = "0";
        //this.appModel.enableSubmitBtn(true);
        document.getElementById("dropdown").style.opacity="0";
    document.getElementById("dropdown").style.pointerEvents="none";
        for(let i =0;i<document.getElementById("mainques").children[0].children.length;i++) {
          if(i != (this.stateIndex+1)) {
          (document.getElementById("mainques").children[0].children[i] as HTMLElement).style.pointerEvents="";
          }
          }
          this.singleClicknotAllowed=false;
      }
      if(idFound) {
        this.countofClick--;
        $(document.getElementById("mainques").children[0].children[this.stateIndex+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].setAttribute("fill",this.originalcolor);
        idFound.clicked = false;
      }
      let indexinSubmitArr = this.submittedArray.findIndex(element => element.id == this.Id || element.strokeId == this.Id);
      if(indexinSubmitArr!=-1) {
        this.submittedArray.splice(indexinSubmitArr,1);
        this.paginationArray.splice(indexinSubmitArr,1);
        if(this.paginationArray.length == 0) {
          this.appModel.enableSubmitBtn(false);
        } else {
          this.appModel.enableSubmitBtn(true);
        }
        if(this.countofClick == 0 && this.countofClick < this.commonAssets.itemsperPage) {
          this.countofClick = 10;
          this.p--;
        }
      }
    } 
  }
  
  strokeOver()
  {
	  for(let y = 0; y<this.myStates.length; y++)
			  {
				if($($($(this.storeEvent.parent().parent().last().siblings()[y].children[0]))[0].children[0]).attr("xlink:href") == this.Id)
			  {
			  this.Index_1 = $($(this.storeEvent.parent().parent().last().siblings()[y]));
		      this.Index_2 = $($(this.storeEvent.parent().parent().last().siblings()[this.myStates.length]));
			  this.Index_1.insertAfter(this.Index_2);
			  break;
			  }			  
			  }		
  }

  checkCapitalStatus(index) {
    if(this.paginationArray[index].capitalofSelectedState == this.paginationArray[index].capital) {
         console.log("correct capital ");
         this.paginationArray[index].isCapitalcorrect = true;
         this.paginationArray[index].capitalStatus=this.myStates.find(element => element.capital == this.paginationArray[index].capitalofSelectedState).correctcapitalTxtimg;
    } else {
      console.log("incorrect capital");
      this.paginationArray[index].isCapitalcorrect = false;
      this.paginationArray[index].capitalStatus=this.myStates.find(element => element.capital == this.paginationArray[index].capital).incorrectcapitalTxtimg;
    }
  }
  
  stateName(state){
  //this.questionAudio.nativeElement.pause();
  this.appModel.notifyUserAction();
  let indexinSubmitArr: number = this.submittedArray.findIndex(element => element.id == this.clickedId || element.strokeId == this.clickedId);
  if(indexinSubmitArr!= -1) {
    this.submittedArray[indexinSubmitArr].optionSelected = state.text;
	this.optionSelected = this.submittedArray[indexinSubmitArr].optionSelected;
    //this.optionSelected =  state.text;
    this.paginationArray[indexinSubmitArr].imgcapital=this.myStates.find(element => element.capital == state.text).capitalTxtimg;
    this.paginationArray[indexinSubmitArr].capital=this.myStates.find(element => element.capital == state.text).capital;
      this.checkCapitalStatus(indexinSubmitArr);
    //let imgsrc = this.containgFolderPath + "/" + this.paginationArray[indexinSubmitArr].capital.url;
    //document.getElementsByClassName("listNames")[0].children[indexinSubmitArr].children[1].children[0].setAttribute('src',imgsrc);
    //$('.listNames')[0].children[0].children[1].children[0]
  }
  //this.stateValue.push(state.text);  
  this.submitFlag = false;
  for(let i =0;i<document.getElementById("mainques").children[0].children.length;i++) {
    if(i != (this.stateIndex+1)) {
    (document.getElementById("mainques").children[0].children[i] as HTMLElement).style.pointerEvents="";
    }
    }
    this.singleClicknotAllowed=false;
  document.getElementById("mainques").style.pointerEvents = " ";
  this.QuesRef.nativeElement.style.pointerEvents = "auto";
  //this.Tooltip.nativeElement.style.pointerEvents = "none";
  this.appModel.enableSubmitBtn(true);
  document.getElementById("dropdown").style.opacity="0";
  document.getElementById("dropdown").style.pointerEvents="none";
  document.getElementById("line0").style.opacity="0";
  //this.MySelect.nativeElement.style.pointerEvents = "none";

	//   if(state.value != this.myStates[this.currentindex].textField)
  // {
	//   this.MySelect.nativeElement.options[this.MySelect.nativeElement.selectedIndex].style.backgroundColor = "red";
  // }
  // else{
	//   this.MySelect.nativeElement.options[this.MySelect.nativeElement.selectedIndex].style.backgroundColor = "green";
  // }
 
  
  
  
  //this.clickEv = false;	
}

onSubmit()
{
	
	if(!this.submitFlag)
	{
		//alert("enter in submit");
    //this.questionAudio.nativeElement.pause();
    if(this.paginationArray.length <= this.commonAssets.itemsperPage) {
      this.tableofOne = true;
      this.tableofTwo = false;
      this.tableofThree = false;
    } else if(this.commonAssets.itemsperPage < this.paginationArray.length && this.paginationArray.length <= (this.commonAssets.itemsperPage+this.commonAssets.itemsperPage)) {
      this.tableofOne = false;
      this.tableofTwo =true;
      this.tableofThree = false;
      this.table1= this.paginationArray.slice(0,this.commonAssets.itemsperPage);
      this.table2=this.paginationArray.slice(this.commonAssets.itemsperPage,this.commonAssets.itemsperPage*2);
      //this.table3 = this.paginationArray.slice(this.commonAssets.itemsperPage*2,this.commonAssets.itemsperPage*3);
    } else {
      this.tableofOne = false;
      this.tableofTwo = false;
      this.tableofThree =true;
      this.table1= this.paginationArray.slice(0,this.commonAssets.itemsperPage);
      this.table2=this.paginationArray.slice(this.commonAssets.itemsperPage,this.commonAssets.itemsperPage*2);
      this.table3 = this.paginationArray.slice(this.commonAssets.itemsperPage*2,this.commonAssets.itemsperPage*3);
    }

        // for(let y = 0; y<this.myDropDownStates.length; y++)
			  // {
				//   if(this.myRightAnswer.includes(this.rightAnswer[y]) && this.myRightAnswer.includes(this.stateValue[y]))
				//   {		
			  //         this.Submitcounter += 1;
        //               this.rightAnswerCounter += 1;
        //               this.redGreenFlag = true;					  
				// 	  //alert("Right");
				// 	  if(this.Submitcounter == this.selectedOutlineCounter)
        //               {
				// 		  break;
        //               }					  
				//   }
				//   else{
				// 	  this.Submitcounter += 1; 
				// 	  this.wrongAnswerCounter += 1;
        //               this.redGreenFlag = false;					  
				// 	 // alert("Wrong");	  
        //               if(this.Submitcounter == this.selectedOutlineCounter)
        //               {
				// 		  break;
        //               }	
        //              continue;					
				//   }				  
			  // }
			  
			  // if(this.rightAnswerCounter != 0 ||  this.wrongAnswerCounter != 0)
				//   {					  
				// 	  this.grayOver();	
        //               for(let a = 0; a<=this.myStates.length; a++)
				// 	  {                         							 
				// 		this.redColorArray.push($($(this.storeEvent.parent().parent().last().siblings()[a].children[0].children[0]).attr("xlink:href")));
				// 		this.redColorArray[a].attr("stroke", "#FF0000"); 	
        //                 for(let b = 0; b<this.myRightAnswer.length; b++)
				// 		{
				// 			if(this.redColorArray[a].attr("data") == this.myRightAnswer[b])
				// 		{								
				// 			this.redColorArray[a].attr("stroke", "#008000");						
													
				// 		}						
				// 		}      					
						
					  
				// 	  }	
					  
				// 	  for(let ab = 0; ab<this.textFeildValue.length; ab++)
				// 	  {
				// 		  if(this.textFeildValue[ab] != this.stateValue[ab])
				// 		  {
				// 			  for(let c = 0; c<=this.myStates.length; c++)
				// 			  {
				// 				  for(let d = 0; d<this.myRightAnswer.length; d++)
				// 				  {
				// 					  if(this.duplicateGroupArray[c].attr("data") == this.myRightAnswer[d] && this.textFeildValue[ab] == this.myRightAnswer[d])
				// 					  {
				// 						  this.duplicateGroupArray[c].attr("stroke", "#FF0000");
			  //                             this.duplicateGroupArray[c].attr("stroke-width", "2");
        //                                   this.wrongAnswerCounter += 1;										  
				// 					  }
				// 				  }
				// 			  }
				// 		  }
				// 	  }                                       
					 
				//   }	
				  
				//   if(this.rightAnswerCounter == this.myRightAnswer.length && this.wrongAnswerCounter == 0)
				//   {
				// 	  this.myAudio.nativeElement.src = this.CorrectAudio.location=="content" ? this.containgFolderPath +"/"+ this.CorrectAudio.url : this.assetsPath +"/"+ this.CorrectAudio.url;
        //               this.myAudio.nativeElement.load();
        //               this.myAudio.nativeElement.play();
				// 	  this.QuesRef.nativeElement.style.pointerEvents = "none"; 
				// 	 // this.optionsBlock.nativeElement.style.opacity = 0.3;
				// 	  this.isValid = true;
				// 	  this.appModel.enableSubmitBtn(false);
				// 	  this.partiallyCorrectFlag = false;

                      					  
				//   }
				//   if(this.rightAnswerCounter >= 0 && this.wrongAnswerCounter > 0)
				//   {
				// 	  this.myAudio.nativeElement.src = this.WrongAudio.location=="content" ? this.containgFolderPath +"/"+ this.WrongAudio.url : this.assetsPath +"/"+ this.WrongAudio.url;
        //               this.myAudio.nativeElement.load();
        //               this.myAudio.nativeElement.play();
				// 	  this.QuesRef.nativeElement.style.pointerEvents = "none"; 
				// 	  this.isValid = true;
				// 	  this.appModel.enableSubmitBtn(false);
        //               this.partiallyCorrectFlag = false;					  
        //                setTimeout(() => {
				// 		   this.reverseAfterWrong();
        //                 }, 5000);	
                      						
				//   }
				//   if(this.rightAnswerCounter == this.myRightAnswer.length-1 && this.wrongAnswerCounter == 0)
				//   {
				// 	  this.myAudio.nativeElement.src = this.partiallyCorrectAudio.location=="content" ? this.containgFolderPath +"/"+ this.partiallyCorrectAudio.url : this.assetsPath +"/"+ this.partiallyCorrectAudio.url;
        //               this.myAudio.nativeElement.load();
        //               this.myAudio.nativeElement.play();
				// 	  this.QuesRef.nativeElement.style.pointerEvents = "none"; 
				// 	  this.isValid = true;
				// 	  this.appModel.enableSubmitBtn(false);
				// 	  this.partiallyCorrectFlag = true;					  
				// 	   setTimeout(() => {
				// 		   this.reverseAfterWrong();
        //                 }, 5000);
				//   }

                     						 
	}	
}


// onSubmit()
// {
	
// 	if(!this.submitFlag)
// 	{
// 		//alert("enter in submit");
// 		this.questionAudio.nativeElement.pause();
//         for(let y = 0; y<this.myDropDownStates.length; y++)
// 			  {
// 				  if(this.myRightAnswer.includes(this.rightAnswer[y]) && this.myRightAnswer.includes(this.stateValue[y]))
// 				  {		
// 			          this.Submitcounter += 1;
//                       this.rightAnswerCounter += 1;
//                       this.redGreenFlag = true;					  
// 					  //alert("Right");
// 					  if(this.Submitcounter == this.selectedOutlineCounter)
//                       {
// 						  break;
//                       }					  
// 				  }
// 				  else{
// 					  this.Submitcounter += 1; 
// 					  this.wrongAnswerCounter += 1;
//                       this.redGreenFlag = false;					  
// 					 // alert("Wrong");	  
//                       if(this.Submitcounter == this.selectedOutlineCounter)
//                       {
// 						  break;
//                       }	
//                      continue;					
// 				  }				  
// 			  }
			  
// 			  if(this.rightAnswerCounter != 0 ||  this.wrongAnswerCounter != 0)
// 				  {					  
// 					  this.grayOver();	
//                       for(let a = 0; a<=this.myStates.length; a++)
// 					  {                         							 
// 						this.redColorArray.push($($(this.storeEvent.parent().parent().last().siblings()[a].children[0].children[0]).attr("xlink:href")));
// 						this.redColorArray[a].attr("stroke", "#FF0000"); 	
//                         for(let b = 0; b<this.myRightAnswer.length; b++)
// 						{
// 							if(this.redColorArray[a].attr("data") == this.myRightAnswer[b])
// 						{								
// 							this.redColorArray[a].attr("stroke", "#008000");						
													
// 						}						
// 						}      					
						
					  
// 					  }	
					  
// 					  for(let ab = 0; ab<this.textFeildValue.length; ab++)
// 					  {
// 						  if(this.textFeildValue[ab] != this.stateValue[ab])
// 						  {
// 							  for(let c = 0; c<=this.myStates.length; c++)
// 							  {
// 								  for(let d = 0; d<this.myRightAnswer.length; d++)
// 								  {
// 									  if(this.duplicateGroupArray[c].attr("data") == this.myRightAnswer[d] && this.textFeildValue[ab] == this.myRightAnswer[d])
// 									  {
// 										  this.duplicateGroupArray[c].attr("stroke", "#FF0000");
// 			                              this.duplicateGroupArray[c].attr("stroke-width", "2");
//                                           this.wrongAnswerCounter += 1;										  
// 									  }
// 								  }
// 							  }
// 						  }
// 					  }                                       
					 
// 				  }	
				  
// 				  if(this.rightAnswerCounter == this.myRightAnswer.length && this.wrongAnswerCounter == 0)
// 				  {
// 					  this.myAudio.nativeElement.src = this.CorrectAudio.location=="content" ? this.containgFolderPath +"/"+ this.CorrectAudio.url : this.assetsPath +"/"+ this.CorrectAudio.url;
//                       this.myAudio.nativeElement.load();
//                       this.myAudio.nativeElement.play();
// 					  this.QuesRef.nativeElement.style.pointerEvents = "none"; 
// 					 // this.optionsBlock.nativeElement.style.opacity = 0.3;
// 					  this.isValid = true;
// 					  this.appModel.enableSubmitBtn(false);
// 					  this.partiallyCorrectFlag = false;

                      					  
// 				  }
// 				  if(this.rightAnswerCounter >= 0 && this.wrongAnswerCounter > 0)
// 				  {
// 					  this.myAudio.nativeElement.src = this.WrongAudio.location=="content" ? this.containgFolderPath +"/"+ this.WrongAudio.url : this.assetsPath +"/"+ this.WrongAudio.url;
//                       this.myAudio.nativeElement.load();
//                       this.myAudio.nativeElement.play();
// 					  this.QuesRef.nativeElement.style.pointerEvents = "none"; 
// 					  this.isValid = true;
// 					  this.appModel.enableSubmitBtn(false);
//                       this.partiallyCorrectFlag = false;					  
//                        setTimeout(() => {
// 						   this.reverseAfterWrong();
//                         }, 5000);	
                      						
// 				  }
// 				  if(this.rightAnswerCounter == this.myRightAnswer.length-1 && this.wrongAnswerCounter == 0)
// 				  {
// 					  this.myAudio.nativeElement.src = this.partiallyCorrectAudio.location=="content" ? this.containgFolderPath +"/"+ this.partiallyCorrectAudio.url : this.assetsPath +"/"+ this.partiallyCorrectAudio.url;
//                       this.myAudio.nativeElement.load();
//                       this.myAudio.nativeElement.play();
// 					  this.QuesRef.nativeElement.style.pointerEvents = "none"; 
// 					  this.isValid = true;
// 					  this.appModel.enableSubmitBtn(false);
// 					  this.partiallyCorrectFlag = true;					  
// 					   setTimeout(() => {
// 						   this.reverseAfterWrong();
//                         }, 5000);
// 				  }

                     						 
// 	}	
// }


  
 grayOver()
  {	 
  this.Index_1 = $($(this.storeEvent.parent().parent().last().siblings()[1]));
  this.Index_2 = $($(this.storeEvent.parent().parent().last().siblings()[(this.myStates.length)-this.selectedOutlineCounter]));
  this.Index_1.insertAfter(this.Index_2);
  for(let i = 0; i<this.selectedOutlineCounter; i++)
  {
  this.Index_1 = this.selectedFillPart[i];
  this.Index_2 = $($(this.storeEvent.parent().parent().last().siblings()[(this.myStates.length)-this.selectedOutlineCounter]));
  this.Index_1.insertAfter(this.Index_2);
  }
	  
  
  }
  
   grayOverTimer()
  {
	  for(let c=1; c<=this.myStates.length+1; c++)
	  {
          this.redColorArray.push($($(this.QuesRef.nativeElement.children[0].children[c].children[0].children[0]).attr("xlink:href")));
		  this.redColorArray[c-1].attr("stroke", "#FFFFFF"); 
		  this.Tooltip.nativeElement.style.opacity = 0;
		  document.getElementById("line0").setAttribute("x1",0+"%");
	      document.getElementById("line0").setAttribute("y1",0+"%");
	      document.getElementById("line0").setAttribute("x2",0+"%");
	      document.getElementById("line0").setAttribute("y2",0+"%");	
		  if($($(this.QuesRef.nativeElement.children[0].children[c].children[0].children[0]).attr("xlink:href")).attr("data") == "gray")
		  {
			  this.Index_1 = $(this.QuesRef.nativeElement.children[0].children[c]);
              this.Index_2 = $(this.QuesRef.nativeElement.children[0].children[this.myStates.length+1]);
              this.Index_1.insertAfter(this.Index_2);
			  	

		  }
	  }
  }
  
  reset()
  {	  
		if(this.currentState != undefined)
	    {		 
		 this.currentState.attr("stroke-width", "2");
		 this.currentState.attr("stroke", "#FFFFFF");		 
	    }		 
  }
  
  
 
  audioEnded()
  {
	//  this.QuesRef.nativeElement.style.pointerEvents = "auto";
  //    this.appModel.handlePostVOActivity(false); 	 
  }
  
  showAnswer()
  {	  
     
	 for(let a = 0; a<=this.myStates.length+1; a++)
	     {                         							 
		  this.duplicateGroupArray[a].attr("stroke", "#FFFFFF");
	
		 for(let b = 0; b<this.myRightAnswer.length; b++)
		{
			if(this.duplicateGroupArray[a].attr("data") == this.myRightAnswer[b] || this.duplicateGroupArray[a].attr("data") == this.RightSubmit[b])
		{
			
			var index1 = this.groupArray[a];
			var index2 = $($(this.QuesRef.nativeElement.children[0].children[this.myStates.length+1]));
			index1.insertAfter(index2);
			this.duplicateGroupArray[a].attr("stroke", "#008000");
			this.duplicateGroupArray[a].attr("stroke-width", "2");		 
						
		}						
		}      					
		
	  
	  } 
	  this.myAudio.nativeElement.src = this.CorrectAudio.location=="content" ? this.containgFolderPath +"/"+ this.CorrectAudio.url : this.assetsPath +"/"+ this.CorrectAudio.url;
	  this.myAudio.nativeElement.load();
	  this.myAudio.nativeElement.play();
	  this.QuesRef.nativeElement.style.pointerEvents = "none"; 
	 // this.optionsBlock.nativeElement.style.opacity = 0.3;
	  this.isValid = true;
	  this.appModel.enableSubmitBtn(false);
  }
  
  
  initiallyStoreGroups()
  {	  
    this.flag = true;
	 for(let a = 0; a<=this.myStates.length+1; a++)
	     {
	this.groupArray.push($(this.QuesRef.nativeElement.children[0].children[a]));
	//this.duplicateGroupArray.push($($(this.QuesRef.nativeElement.children[0].children[a].children[0].children[0]).attr("xlink:href")));          
		 }
	  
  } 
  
  
  reverseAfterWrong()
  {
	  for(let c=1; c<=this.myStates.length+1; c++)
	  {		 
          this.duplicateGroupArray[c].attr("stroke", "#FFFFFF");
		  this.duplicateGroupArray[c].attr("stroke-width", "2"); 
		  this.Tooltip.nativeElement.style.opacity = 0;
		  document.getElementById("line0").setAttribute("x1",0+"%");
	      document.getElementById("line0").setAttribute("y1",0+"%");
	      document.getElementById("line0").setAttribute("x2",0+"%");
	      document.getElementById("line0").setAttribute("y2",0+"%");	
		  if($($(this.QuesRef.nativeElement.children[0].children[c].children[0].children[0]).attr("xlink:href")).attr("data") == "gray")
		  {
			  this.Index_1 = $(this.QuesRef.nativeElement.children[0].children[c]);
              this.Index_2 = $(this.QuesRef.nativeElement.children[0].children[0]);
              this.Index_1.insertAfter(this.Index_2);
			  	

		  }
	  }
	  this.QuesRef.nativeElement.style.pointerEvents = "auto";	  	  
	  this.edited = false;
	  this.onClickFlag = false;	  
	  this.isValid = false;
	  this.StateId.nativeElement.style.opacity = 0;
	  
	   for(let x = 0; x<this.myStates.length; x++)
	{	
	if(this.myStates[x].id != undefined)
	 {
		 this.myStates[x].working = "true";	
        	 
	 }
	}
	for(let ab = 0; ab<this.myDropDownStates.length+1; ab++)
	{
		this.MySelect.nativeElement.options[ab].style.backgroundColor = "";
	}
	
	

  this.rightAnswer = [];
   if(this.partiallyCorrectFlag)
		 {
			 this.myStates[this.currentindex].working = "false";
             this.mouseOutFlag = false;	
             this.clickEv = true;
			 
             for(let a = 0; a<=this.myStates.length; a++)
					  {                         							 
						//this.redColorArray.push($($(this.storeEvent.parent().parent().last().siblings()[a].children[0].children[0]).attr("xlink:href")));
						//this.redColorArray[a].attr("stroke", "#FF0000"); 	
                        for(let b = 0; b<this.myRightAnswer.length; b++)
						{
							if(this.redColorArray[a].attr("data") == this.stateValue[b])
						{								
							this.redColorArray[a].attr("stroke", "#008000");	
                            this.redColorArray[a].attr("stroke-width", "2");							
													
						}						
						}      					
						
					  
					  }			 
		 }else{
this.mouseOutFlag = true;
this.clickEv = false;	
this.redColorArray = [];
this.stateValue = [];
this.selectedOutlineCounter = 0;
this.overState = true;
this.edited = false;  
  this.submitFlag = true;
  this.checkCounter = 0;
  this.onClickFlag = false; 
  this.storeState = [];
  this.Submitcounter = 0;
  this.selectedFillPart = [];
  this.rightAnswerCounter = 0;  
  this.greenColorArray = [];
  this.wrongAnswerCounter = 0;
  this.greenColorCounter = 0;
  this.textFeildValue = [];
  this.showAnswerCounter = 0;
  this.autoTimer = true;
  this.autoShowAnswerCounter = 1;
  this.isValid = false;
	}	
	  
  }
  
  ngOnInit() {
	  this.groupArray = [];
    this.duplicateGroupArray = [];
	  this.QuesRef.nativeElement.style.opacity = 0;
    this.setData();
    this.appModel.notifyUserAction();
    //for(let i = 0;i< this.fileUrls.length;i++) {
      this.getFileLoaded(this.mainSvgfile);
    //}

	  //setTimeout(() => {			
			
                				
				
         // }, 500);
		  
		  
    //this.appModel.functionone(this.templatevolume,this);
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    if (this.rightFeedbackVO != undefined || this.wrongFeedbackVO != undefined) {
      this.rightFeedbackVO.nativeElement.pause();
      this.rightFeedbackVO.nativeElement.currentTime = 0;
      this.rightFeedbackVO.nativeElement.src = "";
      this.wrongFeedbackVO.nativeElement.src = "";
      this.wrongFeedbackVO.nativeElement.pause();
      this.wrongFeedbackVO.nativeElement.currentTime = 0;
    }
    
    //this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
         // this.popupRef.nativeElement.classList = "displayPopup modal";
		 console.log("No-1");
          
          //this.setFeedbackAudio();
        }
      } else if (mode == "auto") {
        this.checked = true;
        //show modal of auto
        this.closeModel()
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          //this.popupRef.nativeElement.classList = "displayPopup modal";
		  console.log("No-2");
      this.showAnswerFeedback();
      this.showAnswerRef.nativeElement.classList="displayPopup modal";
      this.popupType = "showanswer";
      this.setPopupAssets();
		  //this.grayOverTimer();
		  //this.showAnswer();		 
      this.feedbackshowPopupAudio.nativeElement.src=this.commonAssets.showAnsAudio.location=="content" ? this.containgFolderPath +"/"+ this.commonAssets.showAnsAudio.url : this.assetsPath +"/"+ this.commonAssets.showAnsAudio.url;
      this.feedbackshowPopupAudio.nativeElement.load();
      this.feedbackshowPopupAudio.nativeElement.play();
      this.feedbackshowPopupAudio.nativeElement.onended = () => {
        this.closeModal();
        
      }
          $("#optionsBlock").css("opacity", "0.3");
          $("#instructionBar").css("opacity", "0.3");
          //this.appModel.handlePostVOActivity(true);
          // if (!this.rightFeedbackVO.nativeElement.paused || !this.wrongFeedbackVO.nativeElement.paused || !this.narrator.nativeElement.paused || !this.instruction.nativeElement.paused) {//|| !this.optionAudio.nativeElement.paused
          //   this.rightFeedbackVO.nativeElement.pause();
          //   this.wrongFeedbackVO.nativeElement.pause();
          //   this.narrator.nativeElement.pause();
          //   //this.instruction.nativeElement.pause();
          //   this.optionAudio.nativeElement.pause();
          // }
          this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
          $("#instructionBar").addClass("disable_div");
        }
        // this.rightFeedbackVO.nativeElement.onended = () => {
        //   setTimeout(() => {
        //     this.closeModal();			
        //   }, 2000);

        //   this.blinkOnLastQues();
        //   this.appModel.moveNextQues();
        //   //this.appModel.notifyUserAction();
        // }

        // this.setFeedbackAudio();
      }
    })

    this.appModel.getConfirmationPopup().subscribe((val) => {
      if(!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.pause();
      }
            if (val == "uttarDikhayein") {
                if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
                    this.confirmModalRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                    this.setPopupAssets();
                    this.popupType = "showanswer";
                }
            } else if (val == "submitAnswer") {
                if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
                  this.onSubmit();
                    this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                }
            }
        })

    this.appModel.questionEvent.subscribe(() => {
      if (this.rightanspopUp) {
        console.log("timer still exist");
        clearTimeout(this.rightanspopUp);
      }
      if (this.wronganspopUp) {
        clearTimeout(this.wronganspopUp);
      }
    });

    this.appModel.nextBtnEvent().subscribe(() =>{
			if(this.appModel.isLastSectionInCollection){
				this.appModel.event = {'action': 'segmentEnds'};	
			}
			if(this.appModel.isLastSection){
					this.appModel.event = {'action': 'exit'};
				}
    });
    
    this.appModel.postWrongAttempt.subscribe(() => {
      this.postWrongAttemplt();
    });
    this.appModel.resetBlinkingTimer();
  }

  postWrongAttemplt() {
    
  }


  getFileLoaded(filesData) {
    this.appModel.getFileString(filesData.url)
    .subscribe((data) =>{					
      var parser = new DOMParser();
      var newNode = parser.parseFromString(data, "text/xml");
      document.getElementById(filesData.svgId).appendChild(newNode.documentElement);
    });
    let loadImage = setInterval(() => { 
      if($(this.QuesRef.nativeElement.children[0]).attr("id") == "mySvg")
       {       
         var svgElement = $("#quesImgId").children("svg").first();		  
             svgElement.attr("width", "100%");
             svgElement.attr("height", "100%");
             svgElement.css("width", "auto");            
             
     if(this.quesAudio != undefined && this.quesAudio.url!="")
       {
        this.narrator.nativeElement.src = this.quesAudio.location=="content" ? this.containgFolderPath +"/"+ this.quesAudio.url : this.assetsPath +"/"+ this.quesAudio.url;
        this.narrator.nativeElement.load();
        this.narrator.nativeElement.play();
        this.QuesRef.nativeElement.style.opacity = 1;
        this.QuesRef.nativeElement.style.pointerEvents = "none";
        document.getElementById('instructionBar').style.pointerEvents ="none";  
        this.narrator.nativeElement.onended = () => {
          this.appModel.handlePostVOActivity(false);
          this.QuesRef.nativeElement.style.pointerEvents = "";
          document.getElementById('instructionBar').style.pointerEvents ="";  
        }
        
        //this.QuesRef.nativeElement.style.zIndex = 100;
        this.appModel.handlePostVOActivity(true);   
        document.getElementById("mainCanvas").style.pointerEvents = "none";
        if(!this.flag) {
         this.initiallyStoreGroups();
        }
        //this.MyFormVar.nativeElement.style.opacity = 1;
        
           } else {
            this.QuesRef.nativeElement.style.opacity = 1;
            this.appModel.handlePostVOActivity(false);
            this.QuesRef.nativeElement.style.pointerEvents = "";
            document.getElementById('instructionBar').style.pointerEvents =""; 
           }
           console.log("AA gaya");
           clearInterval(loadImage);
       }
        console.log("Nahin AAya");
       
       }, 100);
  }

  templatevolume(vol,obj) {
    if(obj.narrator && obj.narrator.nativeElement){
        obj.narrator.nativeElement.volume = obj.appModel.isMute?0:vol;
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
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
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
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
			this.narrator.nativeElement.src = this.quesObj.quesInstruction.location=="content" ? this.containgFolderPath+ "/" + this.quesObj.quesInstruction.url+"?someRandomSeed="+ Math.random().toString(36):this.assetsPath + "/" + this.quesObj.quesInstruction.url+"?someRandomSeed="+ Math.random().toString(36);
			//this.appModel.handlePostVOActivity(true);
			this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
			this.narrator.nativeElement.play();
			this.narrator.nativeElement.onended = () => {
              //this.appModel.handlePostVOActivity(false);
              this.optionsBlock.nativeElement.classList = "row mx-0";
			}
		} else {
			//this.appModel.handlePostVOActivity(false);
		}
	}

  setData() {
    this.appModel.enableSubmitBtn(false);
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      let fetchedData: any = this.appModel.content.contentData.data;
      console.log(fetchedData);
      this.feedback = fetchedData.feedback;
      this.commonAssets = fetchedData.commonassets;
      this.narratorAudio = fetchedData.commonassets.narrator;
      //this.subjectQuesControl.next(fetchedData.commonassets);
      this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
      this.ques_control = fetchedData.commonassets.ques_control;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      this.listStateHeader = this.commonAssets.listHeader.StateHeader;
      this.listCapitalHeader = this.commonAssets.listHeader.CapitalHeader;
      this.DropDownTitleUpper = this.commonAssets.listHeader.UpperTitle;
      this.DropDownTitleLower = this.commonAssets.listHeader.LowerTitle;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.optionObj = fetchedData.optionObj;
      //this.optArr1 = this.optionObj[0].optionsArr;
      //this.optArr2 = this.optionObj[1].optionsArr;
      this.optionCommonAssets = fetchedData.option_common_assets;
      console.log(this.optionCommonAssets);
      this.feedbackObj = fetchedData.feedback;
      this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
      this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
      this.quesObj = fetchedData.quesObj[0];
      this.myStates = fetchedData.statesArr;
      this.myStates.map((element) => element.clicked = false);
      let arr=[];
      for(let i=0;i<this.myStates.length;i++) {
        arr.push(this.myStates[i].capital);
      }
      let filteredarray = arr.filter((item,index) => arr.indexOf(item) === index);
      this.copiedstates = filteredarray.filter(function (el) {
        return el != "";
      });
      this.copiedstates.sort();
	  this.myDropDownStates = fetchedData.DropDownArr;
	  this.myRightAnswer = fetchedData.rigthAnswer;
	  this.RightSubmit = fetchedData.rigthAnsweronSubmit;
	  this.noOfSVG = this.commonAssets.totalSVG;
    this.confirmSubmitAssets = fetchedData.submit_confirm;
    this.infoPopupAssets = fetchedData.info_popup;
    //console.log("this.myStates = "+this.myStates.length);
    this.fileUrls = fetchedData.svgFilesArr;
    this.mainSvgfile = fetchedData.svgInfo;
    //this.hoverSvgfile = fetchedData.svgFilesArr.hoverSvgImg;
    //this.clickSvgfile = fetchedData.svgFilesArr.clickSvgImg;
    //this.hoverSvg = this.fileUrls.hoverSvgImg.url;
    //this.clickSvg = this.fileUrls.clickSvgImg.url;
	  this.quesAudio = this.commonAssets.QuestionAudio;
	  this.CorrectAudio = this.commonAssets.CorrectAudio;
	  this.WrongAudio = this.commonAssets.WrongAudio;
    this.partiallyCorrectAudio = this.commonAssets.PartiallyCorrectAudio;
    this.options = fetchedData.statesArr;
    this.config = {
      displayKey: 'capital', // if objects array passed which key to be displayed defaults to description
      search: false,
      height: '200px',
      limitTo: this.options.length,
      placeholder:'Please Select'
    };
    //this.options.push({id: 34, description: 'Adding new item'});
    // this.config = {
    //   displayKey:"description", //if objects array passed which key to be displayed defaults to description
    //   search:true //true/false for the search functionlity defaults to false,
    //   height: 'auto' //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    //   placeholder:'Select' // text to be displayed when no item is selected defaults to Select,
    //   customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    //   limitTo: options.length // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    //   moreText: 'more' // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    //   noResultsFound: 'No results found!' // text to be displayed when no items are found while searching
    //   searchPlaceholder:'Search' // label thats displayed in search input,
    //   searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    // }
	  //alert("this.fileUrl == "+this.fileUrl);
    }

  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }
  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }
  

    hoverSubmitConfirm(){
        this.confirmSubmitAssets.confirm_btn = this.confirmSubmitAssets.confirm_btn_hover;
    }
    houtSubmitConfirm(){
        this.confirmSubmitAssets.confirm_btn = this.confirmSubmitAssets.confirm_btn_original;
    }
    hoverSubmitDecline(){
        this.confirmSubmitAssets.decline_btn = this.confirmSubmitAssets.decline_btn_hover;
    }
    houtSubmitDecline(){
        this.confirmSubmitAssets.decline_btn = this.confirmSubmitAssets.decline_btn_original;
    }
	
  houtConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
  }

  hoverDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
  }

  houtDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
  }

  hoverCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
  }
  houtCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
  }

  hoverClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_hover;
  }

  houtClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_original;
  }

  hoverOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_hover;
  }

  houtOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_original;
  }

  playFeedback() {
    if((this.rightAnswerCounter == this.feedbackObj.correct_state.length) && this.wrongAnswerCounter == 0) {
      //fully correct
      this.checked = true;
      this.popupType = "correct";
      this.feedbackPopupAudio.nativeElement.src= this.commonAssets.CorrectAudio.location=="content" ? this.containgFolderPath +"/"+ this.commonAssets.CorrectAudio.url : this.assetsPath +"/"+ this.commonAssets.CorrectAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended=()=> {
        this.closeModal();
        $("#optionsBlock").css("opacity", "0.3");
        $("#optionsBlock").css("pointer-events", "none");
        document.getElementById("mainques").style.pointerEvents = "none";
        $("#instructionBar").css("opacity", "0.3");
        $("#instructionBar").css("pointer-events", "none");
        this.appModel.enableSubmitBtn(false);
        //this.appModel.handlePostVOActivity(true);
      }
    } else if(this.rightAnswerCounter == 0) {
      //fully incorrect
      this.popupType = "wrong";
      this.feedbackPopupAudio.nativeElement.src= this.commonAssets.WrongAudio.location=="content" ? this.containgFolderPath +"/"+ this.commonAssets.WrongAudio.url : this.assetsPath +"/"+ this.commonAssets.WrongAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended=()=> {
        this.closeModal();
        //this.resetActivity();
      }
    } else if((this.rightAnswerCounter < this.feedbackObj.correct_state.length) && this.wrongAnswerCounter == 0) {
      //partially correct
      this.feedbackInfoAudio.nativeElement.src= this.commonAssets.PartiallyCorrectAudio.location=="content" ? this.containgFolderPath +"/"+ this.commonAssets.PartiallyCorrectAudio.url : this.assetsPath +"/"+ this.commonAssets.PartiallyCorrectAudio.url;
      this.feedbackInfoAudio.nativeElement.load();
      this.feedbackInfoAudio.nativeElement.play();
      this.popupType = "partialCorrect";
    }
    else {
      //partiallyincorrect
      this.feedbackPopupAudio.nativeElement.src= this.commonAssets.moreOptCorrectAudio.location=="content" ? this.containgFolderPath +"/"+ this.commonAssets.moreOptCorrectAudio.url : this.assetsPath +"/"+ this.commonAssets.moreOptCorrectAudio.url;
      this.feedbackPopupAudio.nativeElement.load();
      this.feedbackPopupAudio.nativeElement.play();
      this.popupType = "partialIncorrect";
      this.feedbackPopupAudio.nativeElement.onended=()=> {
      this.closeModal(); 
      
        //this.resetActivity();
      }
    }
    this.setPopupAssets();
    
  }

  resetActivity() {
    //this.submittedArray=[];
    for(let i=0;i<this.submittedArray.length;i++) {
      this.submittedArray[i].clicked = false;
      document.getElementById(this.submittedArray[i].tooltipID).style.pointerEvents="";
      document.getElementById(this.submittedArray[i].tooltipID).style.left="0";
      document.getElementById(this.submittedArray[i].tooltipID).style.top="0";
      //document.getElementById(this.submittedArray[i].tooltipID).classList.value="tooltipHidden";
      $("#"+this.submittedArray[i].tooltipID).removeClass("tooltipshow");
      $("#"+this.submittedArray[i].tooltipID).addClass("tooltipHidden");
      let index=this.myStates.findIndex(element => element.id == this.submittedArray[i].id);
      $(document.getElementById("mainques").children[0].children[index+1].children[0].children[0].getAttribute("xlink:href"))[0].children[0].setAttribute("fill",this.originalcolor);
      }
      this.submittedArray=[];
      document.getElementById('dropdownviaTooltip').style.opacity = "0";
      document.getElementById('dropdown').style.opacity = "0";
    //document.getElementById('dropdownviaTooltip').style.zIndex = "0";
    //document.getElementById('tooltip').style.opacity = "0";
    //document.getElementById('tooltip').style.left = "0";
    //document.getElementById('tooltip').style.top = "0";
    //document.getElementById("mainCanvas").style.pointerEvents = "";
    //document.getElementById("mainCanvas").style.opacity = "0";
    for(let i =0;i<document.getElementById("mainques").children[0].children.length;i++) {
      if(i != (this.stateIndex+1)) {
      (document.getElementById("mainques").children[0].children[i] as HTMLElement).style.pointerEvents="";
      }
      }
    this.singleClicknotAllowed=false;
    document.getElementById("line0").setAttribute("x1","0");
    document.getElementById("line0").setAttribute("x2","0");
    document.getElementById("line0").setAttribute("y1","0");
    document.getElementById("line0").setAttribute("y2","0");
    document.getElementById("dropdown").classList.add("dropdownhidden");
    this.appModel.enableSubmitBtn(false);
    this.paginationArray=[];
    this.rightAnswerCounter=0;
    this.wrongAnswerCounter=0;
  }

  showAnswerFeedback() {
    this.appModel.resetBlinkingTimer();
    this.showAnswerarray=[];
    for(let i=0;i<this.feedbackObj.correct_state.length;i++) {
      let findState = this.myStates.find(element => element.textField == this.feedbackObj.correct_state[i]);
      this.showAnswerarray.push(findState);
    }
    if(this.showAnswerarray.length < this.commonAssets.itemsperPage) {
      this.showtableofOne = true;
      this.showtableofTwo = false;
      this.showtableofThree = false;
    } else if(this.commonAssets.itemsperPage < this.showAnswerarray.length && this.showAnswerarray.length < (this.commonAssets.itemsperPage+this.commonAssets.itemsperPage)) {
      this.showtableofOne = false;
      this.showtableofTwo =true;
      this.showtableofThree = false;
      this.table1=[];
      this.table2=[];
      this.table1= this.showAnswerarray.slice(0,this.commonAssets.itemsperPage);
      this.table2=this.showAnswerarray.slice(this.commonAssets.itemsperPage,this.commonAssets.itemsperPage*2);
      //this.table3 = this.paginationArray.slice(this.commonAssets.itemsperPage*2,this.commonAssets.itemsperPage*3);
    } else {
      this.showtableofOne = false;
      this.showtableofTwo = false;
      this.showtableofThree =true;
      this.table1=[];
      this.table2=[];
      this.table3=[];
      this.table1= this.showAnswerarray.slice(0,this.commonAssets.itemsperPage);
      this.table2=this.showAnswerarray.slice(this.commonAssets.itemsperPage,this.commonAssets.itemsperPage*2);
      this.table3 = this.showAnswerarray.slice(this.commonAssets.itemsperPage*2,this.commonAssets.itemsperPage*3);
    }
  }

  showFeedback(id: string, flag: string) {
    if (id == "submit-modal-id") {
      this.confirmSubmitRef.nativeElement.classList = "modal";
    }
    if (id == "info-modal-id") {
      this.infoModalRef.nativeElement.classList = "modal";
      this.rightAnswerCounter=0;
      if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
        this.feedbackInfoAudio.nativeElement.pause();
        this.feedbackInfoAudio.nativeElement.currentTime = 0;
      }
    }
    if(id == "showAnswer-modal-id" && flag == "answer") {
      this.checked=true;
      this.attemptType = "auto";
      this.confirmModalRef.nativeElement.classList = "modal";
      this.showAnswerFeedback();
      this.showAnswerRef.nativeElement.classList="displayPopup modal";
      this.popupType = "showanswer";
      this.setPopupAssets();
      this.appModel.notifyUserAction();
      this.feedbackshowPopupAudio.nativeElement.src=this.commonAssets.showAnsAudio.location=="content" ? this.containgFolderPath +"/"+ this.commonAssets.showAnsAudio.url : this.assetsPath +"/"+ this.commonAssets.showAnsAudio.url;
      this.feedbackshowPopupAudio.nativeElement.load();
      this.feedbackshowPopupAudio.nativeElement.play();
      this.feedbackshowPopupAudio.nativeElement.onended = () => {
        this.closeModal();
      }
      $("#optionsBlock").css("opacity", "0.3");
      $("#optionsBlock").css("pointer-events", "none");
      document.getElementById("mainques").style.pointerEvents = "none";
      $("#instructionBar").css("opacity", "0.3");
      $("#instructionBar").css("pointer-events", "none");
      //this.appModel.handlePostVOActivity(true);
      this.appModel.enableSubmitBtn(false);
    }
    if(id == "showAnswer-modal-id" && flag == "no") {
      this.confirmModalRef.nativeElement.classList = "modal";
      this.appModel.notifyUserAction();
    }
    if (flag == "yes") {
      this.onSubmit();
        for(let i=0;i<this.paginationArray.length;i++) {
          if(this.paginationArray[i].isStatecorrect && this.paginationArray[i].isCapitalcorrect) {
          this.rightAnswerCounter++;
          } else {
          this.wrongAnswerCounter++;
          }
          }
          if((this.rightAnswerCounter < this.feedbackObj.correct_state.length) && this.wrongAnswerCounter == 0){
            this.infoModalRef.nativeElement.classList = "displayPopup modal";
            this.playFeedback();
            //this.rightAnswerCounter=0;
          } else {
            this.attemptType = "manual";
            this.playFeedback();
            this.popupRef.nativeElement.classList = "displayPopup modal";
          }
        
      //}
    }
     else if(id == "showAnswer-modal-id" && flag == "no") {
      this.showAnswerRef.nativeElement.classList="modal";
     }
    //  else {
    //   this.appModel.notifyUserAction();
    // }
  }

  closeModal() {
    if (!this.feedbackshowPopupAudio.nativeElement.paused) {
      this.feedbackshowPopupAudio.nativeElement.pause();
      this.feedbackshowPopupAudio.nativeElement.currentTime = 0;
    }
    if (!this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    this.showAnswerRef.nativeElement.classList="modal";
    this.popupRef.nativeElement.classList = "modal";
    //this.appModel.notifyUserAction();
    if (this.checked) {
      this.blinkOnLastQues();
      $("#optionsBlock").css("opacity", "0.3");
      $("#optionsBlock").css("pointer-events", "none");
      document.getElementById("mainques").style.pointerEvents = "none";
      $("#instructionBar").css("opacity", "0.3");
      $("#instructionBar").css("pointer-events", "none");
      this.appModel.enableSubmitBtn(false);
      //this.appModel.handlePostVOActivity(true);
    }
    if (!this.checked) {
      this.resetActivity();
      this.appModel.wrongAttemptAnimation();
      setTimeout(() => {
       // $("#instructionBar").removeClass("disable_div");
      }, 1000);
      //$("#optionsBlock .options").removeClass("disable_div");
      //$("#optionsBlock .options").css("opacity", "unset");
    }
    }

  setPopupAssets(){
     
      console.log("this.popupType------------->",this.popupType)
      if(this.popupType == "wrong"){
          this.rightanspopUpheader_img = false;
          this.wronganspopUpheader_img = true;
          this.showanspopUpheader_img = false;
          this.partialCorrectheaderTxt_img = false;
          this.partialInCorrectheaderTxt_img = false;
          this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
          this.styleBodyPopup = this.feedbackObj.wrong_style_body;
      }
      if(this.popupType == "partialCorrect"){
          this.rightanspopUpheader_img = false;
          this.wronganspopUpheader_img = false;
          this.showanspopUpheader_img = false;
          this.partialCorrectheaderTxt_img = true;
          this.partialInCorrectheaderTxt_img = false;
          this.styleHeaderPopup = this.feedbackObj.style_header;
          this.styleBodyPopup = this.feedbackObj.style_body;
      }
      if(this.popupType == "partialIncorrect"){
        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = false;
        this.showanspopUpheader_img = false;
        this.partialCorrectheaderTxt_img = true;
        this.partialInCorrectheaderTxt_img = false;
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
    }
      if(this.popupType == "correct"){
          this.rightanspopUpheader_img = true;
          this.wronganspopUpheader_img = false;
          this.showanspopUpheader_img = false;
          this.partialCorrectheaderTxt_img = false;
          this.partialInCorrectheaderTxt_img = false;
          this.styleHeaderPopup = this.feedbackObj.style_header;
          this.styleBodyPopup = this.feedbackObj.style_body;
      }
      if(this.popupType == "showanswer"){
          this.rightanspopUpheader_img = false;
          this.wronganspopUpheader_img = false;
          this.showanspopUpheader_img = true;
          this.partialCorrectheaderTxt_img = false;
          this.partialInCorrectheaderTxt_img = false;
          this.styleHeaderPopup = this.feedbackObj.style_header;
          this.styleBodyPopup = this.feedbackObj.style_body;
      }


  }

  closeModel(){
    //infoModalRef, confirmReplayRef, feedbackPopupRef, confirmSubmitRef, confirmModalRef,
    this.infoModalRef.nativeElement.classList = "modal"
    this.infoModalRef.nativeElement.classList = "modal" 
    this.confirmSubmitRef.nativeElement.classList = "modal" 
    this.confirmModalRef.nativeElement.classList = "modal"
}


}
