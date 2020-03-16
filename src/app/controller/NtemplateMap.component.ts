import { Component, OnInit, HostListener, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs'
import 'jquery';


declare var $: any;

@Component({
  selector: 'NtemplateMap',
  templateUrl: '../view/layout/NtemplateMap.component.html',
  styleUrls: ['../view/css/NtemplateMap.component.css', '../view/css/bootstrap.min.css'],

})

export class NtemplateMap implements OnInit {
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
  @ViewChild('playerAudio') myAudio: any;
  @ViewChild('answerModalRef') answerModalRef: any;
  @ViewChild('QuestionAudio') questionAudio: any;
  @ViewChild('mytooltip') Tooltip: any;
  @ViewChild('myLine') Line: any;
  @ViewChild('stateId') StateId: any;
  @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
  @ViewChild('mySelect') MySelect: any;
  @ViewChild('MyForm') MyFormVar: any;
  
  
  
  
  
  


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
  fileUrl:string ="";
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
  showAnswerCounter:number = 0;
  autoTimer:boolean = true;
  autoShowAnswerCounter:number = 1;
  groupArray:any = [];
  duplicateGroupArray:any = [];
  isValid = false;
  partiallyCorrectFlag:boolean = false;
  currentindex:number = 0;
  currentIndexofrightAnswer:number = 0;

  playHoverInstruction() {
   /* if (!this.narrator.nativeElement.paused!) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      //this.instruction.nativeElement.load();
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        $(".instructionBase img").css("cursor", "pointer");
      }
      
  }*/
  this.questionAudio.nativeElement.src = this.quesAudio.location=="content" ? this.containgFolderPath +"/"+ this.quesAudio.url : this.assetsPath +"/"+ this.quesAudio.url;
   this.questionAudio.nativeElement.load();
   this.questionAudio.nativeElement.play();
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
      this.appModel.blinkForLastQues();
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
      this.appModel.moveNextQues();
    }
  }


  
  MouseOver(event)
  {	 
     if(!this.clickEv)
	 {
	 var MyTextField = (document.getElementById("lfname") as HTMLInputElement);
	 this.Id = $(event.target).attr('xlink:href');
	 console.log("this.Id = "+this.Id);
    for(let i = 0; i<this.myStates.length; i++)
	{	
	if(this.Id == this.myStates[i].id && this.myStates[i].id != undefined)
	 {
		 this.Id = this.myStates[i].strokeId;
		 this.storeEvent = $(event.target);		
		 this.strokeOver();		 
		 this.stateCounter = 0;
         this.currentState = $($($(event.target).parent().parent().last().siblings()[this.myStates.length].children[0].children[0]).attr("xlink:href"));	 
		 this.reset();		 	 
		 if(this.currentState != undefined)
		 {
		 this.currentState.attr("stroke-width", "2");
		 this.currentState.attr("stroke", "#000000");		
		// MyTextField.value += this.myStates[i].textField;
		 this.answer = MyTextField.value;
		 this.play(i);
		 }
        break;		 
	 } 	
	  else {	     
		 //this.reset();	
         //MyTextField.value = "";	
         //this.answer = MyTextField.value;		 
	 }
	 }
  }
		
  }
  
  play(i){
   this.questionAudio.nativeElement.pause();
   this.myAudio.nativeElement.src = this.myStates[i].location=="content" ? this.containgFolderPath +"/"+ this.myStates[i].audio : this.assetsPath +"/"+ this.myStates[i].audio;
   this.myAudio.nativeElement.load();
   this.myAudio.nativeElement.play();
}

  
  MouseOut(event)
  {	   
	  if(this.mouseOutFlag == true)
	  {		
		 this.reset();
	  }
  }
  
  
   onClick(event)
  {	     
        
		
        this.edited = true;
		this.onClickFlag = true;
		//let Linee = this.Line.nativeElement.getBoundingClientRect();
		 if(this.onClickFlag)
	 {
	 var MyTextField = (document.getElementById("lfname") as HTMLInputElement);
	 this.Id = $(event.target).attr('xlink:href');
    for(let x = 0; x<this.myStates.length; x++)
	{	
	if(this.Id == this.myStates[x].id && this.myStates[x].id != undefined && this.myStates[x].working == "true")
	 {
		this.MySelect.nativeElement.style.pointerEvents = "auto";
		this.clickEv = true;
		this.mouseOutFlag = false;
		 this.MySelect.nativeElement.selectedIndex = 0;
		 this.questionAudio.nativeElement.pause();
		 this.selectedOutlineCounter += 1;
		 this.myStates[x].working = "false";
         this.currentindex = x;		 
		 this.autoTimer = false;
		 this.QuesRef.nativeElement.style.pointerEvents = "none";
		 this.appModel.notifyUserAction();
		 this.Tooltip.nativeElement.style.pointerEvents = "none";
		this.Tooltip.nativeElement.style.opacity = 1;
		this.Id = this.myStates[x].strokeId;
		this.Tooltip.nativeElement.style.left = this.myStates[x].left+"%";
		this.Tooltip.nativeElement.style.top = this.myStates[x].top+"%"; 
		this.StateId.nativeElement.style.opacity = 1;
		var statebound = this.StateId.nativeElement.getBoundingClientRect();
		
		if($( window ).width() > $("#container").width()+100)
		{
			var stateboundX = statebound.left/($("#container").width()/0.9)*100;
			var stateboundY = statebound.top/($("#container").height()*1.1)*100;
		}
		else{
			var stateboundX = statebound.left/($("#container").width())*100;
			var stateboundY = statebound.top/($("#container").height()*1.1)*100;
		}
		
		
		
		document.getElementById("line0").setAttribute("x1",stateboundX*1+"%");
	    document.getElementById("line0").setAttribute("y1",stateboundY*0.8+"%");
	    document.getElementById("line0").setAttribute("x2",parseInt(this.myStates[x].left)+"%");
	    document.getElementById("line0").setAttribute("y2",parseInt(this.myStates[x].top)+"%");	
		 
		 this.rightAnswer.push(this.myStates[x].textField);
		 this.storeEvent = $(event.target);
		 this.selectedFillPart.push($($(this.storeEvent.parent().parent().last())));
          if(!this.overState)
		  {
			  	this.strokeOver(); 
		  }			  
		 
		 this.stateCounter = 0;
         this.currentState = $($($(event.target).parent().parent().last().siblings()[this.myStates.length].children[0].children[0]).attr("xlink:href"));		 
		 	 
		 if(this.currentState != undefined)
		 { 
		 this.currentState.attr("stroke-width", "2");
		 this.currentState.attr("stroke", "#000000");		
		 MyTextField.value += this.myStates[x].textField+", ";
		 this.textFeildValue.push(this.myStates[x].textField);
		 this.answer = MyTextField.value;
		 this.play(x);
		 this.overState = false;
		 }
        break;		 
	 } 	
	  else {	     
		// this.reset();	
        // MyTextField.value = "";	
         this.answer = MyTextField.value;		 
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
  
  stateName(state){
  this.questionAudio.nativeElement.pause();
  this.stateValue.push(state.value);  
  this.submitFlag = false;
  this.QuesRef.nativeElement.style.pointerEvents = "auto";
  this.Tooltip.nativeElement.style.pointerEvents = "none";
  this.appModel.enableSubmitBtn(true);
  this.MySelect.nativeElement.style.pointerEvents = "none";

	  if(state.value != this.myStates[this.currentindex].textField)
  {
	  this.MySelect.nativeElement.options[this.MySelect.nativeElement.selectedIndex].style.backgroundColor = "red";
  }
  else{
	  this.MySelect.nativeElement.options[this.MySelect.nativeElement.selectedIndex].style.backgroundColor = "green";
  }
 
  
  
  
  //this.clickEv = false;	
}

onSubmit()
{
	
	if(!this.submitFlag)
	{
		//alert("enter in submit");
		this.questionAudio.nativeElement.pause();
        for(let y = 0; y<this.myDropDownStates.length; y++)
			  {
				  if(this.myRightAnswer.includes(this.rightAnswer[y]) && this.myRightAnswer.includes(this.stateValue[y]))
				  {		
			          this.Submitcounter += 1;
                      this.rightAnswerCounter += 1;
                      this.redGreenFlag = true;					  
					  //alert("Right");
					  if(this.Submitcounter == this.selectedOutlineCounter)
                      {
						  break;
                      }					  
				  }
				  else{
					  this.Submitcounter += 1; 
					  this.wrongAnswerCounter += 1;
                      this.redGreenFlag = false;					  
					 // alert("Wrong");	  
                      if(this.Submitcounter == this.selectedOutlineCounter)
                      {
						  break;
                      }	
                     continue;					
				  }				  
			  }
			  
			  if(this.rightAnswerCounter != 0 ||  this.wrongAnswerCounter != 0)
				  {					  
					  this.grayOver();	
                      for(let a = 0; a<=this.myStates.length; a++)
					  {                         							 
						this.redColorArray.push($($(this.storeEvent.parent().parent().last().siblings()[a].children[0].children[0]).attr("xlink:href")));
						this.redColorArray[a].attr("stroke", "#FF0000"); 	
                        for(let b = 0; b<this.myRightAnswer.length; b++)
						{
							if(this.redColorArray[a].attr("data") == this.myRightAnswer[b])
						{								
							this.redColorArray[a].attr("stroke", "#008000");						
													
						}						
						}      					
						
					  
					  }	
					  
					  for(let ab = 0; ab<this.textFeildValue.length; ab++)
					  {
						  if(this.textFeildValue[ab] != this.stateValue[ab])
						  {
							  for(let c = 0; c<=this.myStates.length; c++)
							  {
								  for(let d = 0; d<this.myRightAnswer.length; d++)
								  {
									  if(this.duplicateGroupArray[c].attr("data") == this.myRightAnswer[d] && this.textFeildValue[ab] == this.myRightAnswer[d])
									  {
										  this.duplicateGroupArray[c].attr("stroke", "#FF0000");
			                              this.duplicateGroupArray[c].attr("stroke-width", "2");
                                          this.wrongAnswerCounter += 1;										  
									  }
								  }
							  }
						  }
					  }                                       
					 
				  }	
				  
				  if(this.rightAnswerCounter == this.myRightAnswer.length && this.wrongAnswerCounter == 0)
				  {
					  this.myAudio.nativeElement.src = this.CorrectAudio.location=="content" ? this.containgFolderPath +"/"+ this.CorrectAudio.url : this.assetsPath +"/"+ this.CorrectAudio.url;
                      this.myAudio.nativeElement.load();
                      this.myAudio.nativeElement.play();
					  this.QuesRef.nativeElement.style.pointerEvents = "none"; 
					 // this.optionsBlock.nativeElement.style.opacity = 0.3;
					  this.isValid = true;
					  this.appModel.enableSubmitBtn(false);
					  this.partiallyCorrectFlag = false;

                      					  
				  }
				  if(this.rightAnswerCounter >= 0 && this.wrongAnswerCounter > 0)
				  {
					  this.myAudio.nativeElement.src = this.WrongAudio.location=="content" ? this.containgFolderPath +"/"+ this.WrongAudio.url : this.assetsPath +"/"+ this.WrongAudio.url;
                      this.myAudio.nativeElement.load();
                      this.myAudio.nativeElement.play();
					  this.QuesRef.nativeElement.style.pointerEvents = "none"; 
					  this.isValid = true;
					  this.appModel.enableSubmitBtn(false);
                      this.partiallyCorrectFlag = false;					  
                       setTimeout(() => {
						   this.reverseAfterWrong();
                        }, 5000);	
                      						
				  }
				  if(this.rightAnswerCounter == this.myRightAnswer.length-1 && this.wrongAnswerCounter == 0)
				  {
					  this.myAudio.nativeElement.src = this.partiallyCorrectAudio.location=="content" ? this.containgFolderPath +"/"+ this.partiallyCorrectAudio.url : this.assetsPath +"/"+ this.partiallyCorrectAudio.url;
                      this.myAudio.nativeElement.load();
                      this.myAudio.nativeElement.play();
					  this.QuesRef.nativeElement.style.pointerEvents = "none"; 
					  this.isValid = true;
					  this.appModel.enableSubmitBtn(false);
					  this.partiallyCorrectFlag = true;					  
					   setTimeout(() => {
						   this.reverseAfterWrong();
                        }, 5000);
				  }

                     						 
	}	
}
  
  
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
	 this.QuesRef.nativeElement.style.pointerEvents = "auto";
     this.appModel.handlePostVOActivity(false); 	 
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
     
	 for(let a = 0; a<=this.myStates.length+1; a++)
	     {
	this.groupArray.push($(this.QuesRef.nativeElement.children[0].children[a]));
	this.duplicateGroupArray.push($($(this.QuesRef.nativeElement.children[0].children[a].children[0].children[0]).attr("xlink:href")));          
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
	  //setTimeout(() => {			
			this.appModel.getFileString(this.fileUrl)
				.subscribe((data) =>{					
					var parser = new DOMParser();
					var newNode = parser.parseFromString(data, "text/xml");
					document.getElementById("quesImgId").appendChild(newNode.documentElement);
				})	
                				
				
         // }, 500);		  
		  
		  
		  
		 let loadImage = setInterval(() => { 
	if($(this.QuesRef.nativeElement.children[0]).attr("id") == "mySvg")
	{
		var svgElement = $("#quesImgId").children("svg").first();		  
				svgElement.attr("width", "100%");
				svgElement.attr("height", "100%");
				svgElement.css("width", "auto");
				
				
				if(this.quesAudio != undefined)
		  {
   this.questionAudio.nativeElement.src = this.quesAudio.location=="content" ? this.containgFolderPath +"/"+ this.quesAudio.url : this.assetsPath +"/"+ this.quesAudio.url;
   this.questionAudio.nativeElement.load();
   this.questionAudio.nativeElement.play();
   this.QuesRef.nativeElement.style.pointerEvents = "none"; 
   this.QuesRef.nativeElement.style.opacity = 1;
   this.appModel.handlePostVOActivity(true);   
   document.getElementById("mainCanvas").style.pointerEvents = "none";
   this.initiallyStoreGroups();
   this.MyFormVar.nativeElement.style.opacity = 1;
   
		  }
		  console.log("AA gaya");
		  clearInterval(loadImage);
	}
	 console.log("Nahin AAya");
	
  }, 100);
		  
		  
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
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          //this.popupRef.nativeElement.classList = "displayPopup modal";
		  console.log("No-2");
		  
		  this.grayOverTimer();
		  this.showAnswer();		 
		  
          $("#optionsBlock .options").css("opacity", "0.3");
          $("#instructionBar").css("opacity", "0.3");
          if (!this.rightFeedbackVO.nativeElement.paused || !this.wrongFeedbackVO.nativeElement.paused || !this.narrator.nativeElement.paused || !this.instruction.nativeElement.paused) {//|| !this.optionAudio.nativeElement.paused
            this.rightFeedbackVO.nativeElement.pause();
            this.wrongFeedbackVO.nativeElement.pause();
            this.narrator.nativeElement.pause();
            //this.instruction.nativeElement.pause();
            this.optionAudio.nativeElement.pause();
          }
          if (this.rightAnspopupAssets.imgsrc && this.rightAnspopupAssets.imgsrc.location == "content") {
            this.popupImage.nativeElement.src = this.containgFolderPath + "/" + this.rightAnspopupAssets.imgsrc.url;
          } else {
            this.popupImage.nativeElement.src = this.assetsPath + "/" + this.rightAnspopupAssets.imgsrc.url;
          }
          this.rightFeedbackVO.nativeElement.play();
          this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
          $("#instructionBar").addClass("disable_div");
        }
        this.rightFeedbackVO.nativeElement.onended = () => {
          setTimeout(() => {
            this.closeModal();			
          }, 2000);

          this.blinkOnLastQues();
          this.appModel.moveNextQues();
          //this.appModel.notifyUserAction();
        }

        // this.setFeedbackAudio();
      }
    })

    this.appModel.getConfirmationPopup().subscribe((val) => {
            if (val == "uttarDikhayein") {
                if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
                    this.confirmModalRef.nativeElement.classList = "displayPopup modal";
                    this.appModel.notifyUserAction();
                }
            } else if (val == "submitAnswer") {
                if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
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
		})
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
	  this.myDropDownStates = fetchedData.DropDownArr;
	  this.myRightAnswer = fetchedData.rigthAnswer;
	  this.RightSubmit = fetchedData.rigthAnsweronSubmit;
	  this.noOfSVG = this.commonAssets.totalSVG;
	  this.confirmSubmitAssets = fetchedData.submit_confirm;
	  //console.log("this.myStates = "+this.myStates.length);
	  this.fileUrl = this.commonAssets.triangleImg.url;
	  this.quesAudio = this.commonAssets.QuestionAudio;
	  this.CorrectAudio = this.commonAssets.CorrectAudio;
	  this.WrongAudio = this.commonAssets.WrongAudio;
	  this.partiallyCorrectAudio = this.commonAssets.PartiallyCorrectAudio;
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

  sendFeedback(ref, flag: string) {
    this.confirmModalRef.nativeElement.classList = "modal";
	if(ref.id == "confirmModal" && flag == "answer")
	{
		this.appModel.notifyUserAction();
		this.grayOverTimer();
		this.showAnswer();
		this.questionAudio.nativeElement.pause();
	
	}
	if (flag == "yes") {
		this.appModel.enableSubmitBtn(false);
		this.onSubmit();
		this.questionAudio.nativeElement.pause();
      // this.RightModalRef.nativeElement.classList = "displayPopup modal";
    }
	if (flag == "no") {
		this.appModel.notifyUserAction();
		this.questionAudio.nativeElement.pause();
      // this.RightModalRef.nativeElement.classList = "displayPopup modal";
    }
	ref.classList = "modal";
    if (flag == "yes") {
		this.questionAudio.nativeElement.pause();
      setTimeout(() => {
        this.appModel.invokeTempSubject('showModal', 'manual');
        if (this.rightAnspopupAssets.imgsrc && this.rightAnspopupAssets.imgsrc.location == "content") {
          this.popupImage.nativeElement.src = this.containgFolderPath + "/" + this.rightAnspopupAssets.imgsrc.url;
        } else {
          this.popupImage.nativeElement.src = this.assetsPath + "/" + this.rightAnspopupAssets.imgsrc.url;
        }
        this.rightFeedbackVO.nativeElement.play();
      }, 100);
      //this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
     // $("#instructionBar").addClass("disable_div");
     // $("#optionsBlock .options").css("opacity", "0.3");
      //$("#instructionBar").css("opacity", "0.3");
      this.checked = true;
      this.rightFeedbackVO.nativeElement.onended = () => {
        setTimeout(() => {
          this.closeModal();
        }, 2000);
        //this.blinkOnLastQues();
       // this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
       // $("#instructionBar").addClass("disable_div");
       // this.appModel.notifyUserAction();
       // this.appModel.moveNextQues();
      }
    } else {
      this.appModel.notifyUserAction();
      $("#instructionBar").removeClass("disable_div");
    }
  }

  closeModal() {
    if (!this.rightFeedbackVO.nativeElement.paused) {
      this.rightFeedbackVO.nativeElement.pause();
      this.rightFeedbackVO.nativeElement.currentTime = 0;
    }
    if (!this.wrongFeedbackVO.nativeElement.paused) {
      this.wrongFeedbackVO.nativeElement.pause();
      this.wrongFeedbackVO.nativeElement.currentTime = 0;
    }
    this.popupRef.nativeElement.classList = "modal";
    this.appModel.notifyUserAction();
    if (this.checked) {
      this.blinkOnLastQues();
    }
    if (!this.checked) {
      setTimeout(() => {
       // $("#instructionBar").removeClass("disable_div");
      }, 1000);
      //$("#optionsBlock .options").removeClass("disable_div");
      //$("#optionsBlock .options").css("opacity", "unset");
    }
    }
  }


