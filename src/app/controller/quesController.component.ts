import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { SharedserviceService } from '../services/sharedservice.service';


import 'jquery';


declare var $: any;

@Component({
  selector: 'quesCtrl',
  templateUrl: '../view/layout/quesController.component.html',
  styleUrls: ['../view/css/quesController.component.css', '../view/css/bootstrap.min.css'],

})

export class QuesController implements OnInit {
  @ViewChild("quesBlockChild") quesBlockChild: any;
  @ViewChild('nextBtn') nextBtn: any;
  appModel: ApplicationmodelService;
  subscriptionQuesNos: Subscription;
  subscriptionQuesIndex: Subscription;
  subscriptionControlAssets: Subscription;
  firstQusubscription: Subscription;
  blinkerSubscription: Subscription;
  controlAssets: any;
  isFirstQuestion: any = false;
  subcriptionUttarDikhayein: Subscription;
  assetsPath: any;
  containgFolderPath: any;
  quesTabs: any = [];
  quesCtrl: any;
  timeInterval: any;
  hideShowAnswer:boolean = true;
	disablePrev:boolean = true;
	disableNext:boolean = true;
  disableTabs:boolean = true;
  EVA:boolean = false;
  EnableShowAnswer:boolean = false;
  Template: any;
  EVAQid:any;
  subscription: Subscription;
  UttarDikhayeinTooltip:any;
  blink:any;
  
  constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;

    this.subscription = this.Sharedservice.getData().subscribe(data => { this.Template = data.data.TemplateType; 
      if(this.Template === 'EVA'){
        this.EVA = true;
      }else{
        this.EVA = false;
      }

    });


 
  }
  pointObjArr: any[] = [];
  questionNo: number = 0;
  noOfQues: number;
  disableUttarDikhayeinBtn: boolean = true;
  inactiveUserTimer1: number = 5;
  blinkFlag: boolean = false;
  enableSubmitBtn: boolean = false;
  enableReplayBtn: boolean = false;
  enableNavBtns: boolean = false;
  isVideoPlaying:boolean = false;
  isLastQuesAageyBadhe:boolean = false;
  isLastQues:boolean = false;
  ngOnInit() {


    this.subscriptionQuesNos = this.appModel.getNoOfQues().subscribe(num => {
      console.log("number of questions", num);
      this.noOfQues = num;
      this.pointObjArr.splice(0, this.pointObjArr.length);
      for (let i = 0; i < 8; i++) {
        let obj = { "disabled": true, index: -1 };
        if (i < num) {
          obj.disabled = false;
        }
        obj.index = i;
        this.pointObjArr.push(obj);
      }
    })
    this.subscriptionQuesIndex = this.appModel.getQuesionIdx().subscribe(idx => {
      this.questionNo = idx;
      console.log("selected question index", this.questionNo); 
    })

    

       
      // **** Disable aagey badhe button while on last question
    this.subscriptionControlAssets = this.appModel.getQuesControlAssets().subscribe(controlAssets => {
      this.quesCtrl = controlAssets;
      this.isLastQues = this.quesCtrl.isLastQues;


        //*********  Move to next segment after 5 min of last question attempt */
        this.Sharedservice.getTimerOnLastQues().subscribe(data => {
          if (data.data && this.EVA && !this.appModel.nextSectionTimer) {
            this.appModel.nextSectionTimer = setTimeout(() => {
              this.appModel.nextSectionEVA(this.isLastQues);
            }, 5 * 60 * 1000);
          }
        });


      // **** Enable show answer button
      this.subscription = this.Sharedservice.getShowAnsEnabled().subscribe(data => { 
        this.EnableShowAnswer = data.data;
        if(this.EnableShowAnswer === true){
          this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_original;
          this.UttarDikhayeinTooltip = "उत्तर दिखाएँ";
        }else{
          this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
          this.UttarDikhayeinTooltip="";
        }
      });
      if(this.EVA) {
        this.quesTabs = this.quesCtrl.quesTabs;
      } else {
        this.quesTabs = this.quesCtrl.quesTabs.slice(0, this.noOfQues);
      }


    


      console.log(this.quesCtrl);
      console.log("no of tabs should be ", this.quesTabs.length);

      this.assetsPath = this.appModel.assetsfolderpath;
      this.containgFolderPath = this.appModel.content.id;
    })

    this.blinkerSubscription = this.appModel.getblinkingNextBtn().subscribe(resetBlink=> {
      if(resetBlink) {
        this.blinkFlag = false;
        clearInterval(this.timeInterval);
        this.timeInterval = undefined;
        this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
      }
    });

    this.firstQusubscription = this.appModel.getIsFirstQuestion().subscribe(flag => {
      this.isFirstQuestion = flag;
    })

    this.subcriptionUttarDikhayein = this.appModel.getPostVOActs().subscribe(flag => {
      this.disableUttarDikhayeinBtn = flag;
    })

    this.appModel.lastQues.subscribe(() => {
      if (!this.timeInterval) {
        this.setBlinkOnLastQuestion();
      }
    })

    this.appModel.enableFlagSubmit.subscribe((flag) => {
      this.enableSubmitBtn = flag

  })
  
  this.appModel.enableFlagNav.subscribe((flag) => {
    console.log("nav wala flaggg")
    this.enableNavBtns = flag
  })


	this.appModel.enableFlagReplay.subscribe((flag) => {
		this.enableReplayBtn = flag
    })
    
    this.appModel.isVideoStraming.subscribe((flag) =>{
      this.isVideoPlaying = flag;
      if(flag==false){
        this.quesCtrl.replay_btn = this.quesCtrl.replay_btn_original;
      }
    })
    this.appModel.controllerHandler.subscribe((controllerObj) =>{
      this.controlHandle(controllerObj);
    })
  }


  hoverUttarDikhayeinEVA() {
    if(this.EnableShowAnswer){
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_hover;
    }else{
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
    }   
  }

  houtUttarDikhayeinEVA() {
    if(this.EnableShowAnswer){
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_original;
    }  else{
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
    }  
    
  }

  hoveronSubmitBtn() {

  }

  hleaveSubmitBtn() {

  }


  selectQuestion(index) {
    if (this.appModel.titleFlag) {
      this.appModel.selectQues(index + 1);
    } else {
      this.appModel.selectQues(index);
    }
    clearInterval(this.timeInterval);
    this.timeInterval = undefined;
    this.blinkFlag = false;
    this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
    /*if(this.controlAssets.ques_idx_hover && this.controlAssets.ques_idx_hover.location=="content"){
        this.quesBlockChild.nativeElement.children[index].children[0].src = this.containgFolderPath + "/" + this.controlAssets.ques_idx_hover.url;
    }else{
        this.quesBlockChild.nativeElement.children[index].children[0].src = this.assetsPath + "/" + this.controlAssets.ques_idx_hover.url;
    }*/
    /*	for(let i =0;i<this.quesTabs.length;i++){
            this.quesBlockChild.nativeElement.children[index].children[0].style.opacity = "1";
            this.quesBlockChild.nativeElement.children[index].children[1].style.opacity = "1";
            this.quesBlockChild.nativeElement.children[index].children[2].style.opacity = "1";
        }*/
  }


  confirmAction(action) {
    if(this.EnableShowAnswer && this.EVA) {
      this.appModel.confirmPopup(action);
    }
    if(!this.EVA) {
      this.appModel.confirmPopup(action);
    }
  }

  hoverUttarDikhayein() {
    this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_hover;
  }

  houtUttarDikhayein() {
    this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_original;
  }

  hoverQuesIdx(idx) {
    /*if(this.controlAssets.ques_idx_hover && this.controlAssets.ques_idx_hover.location=="content"){
        this.quesBlockChild.nativeElement.children[idx].children[0].src = this.containgFolderPath + "/" + this.controlAssets.ques_idx_hover.url;
    }else{
        this.quesBlockChild.nativeElement.children[idx].children[0].src = this.assetsPath + "/" + this.controlAssets.ques_idx_hover.url;
    }*/
  }

  houtQuesIdx(idx) {
    /*if(this.controlAssets.ques_idx_hover && this.controlAssets.ques_idx_hover.location=="content"){
        this.quesBlockChild.nativeElement.children[idx].children[0].src = this.containgFolderPath + "/" + this.controlAssets.ques_idx_original.url;
    }else{
        this.quesBlockChild.nativeElement.children[idx].children[0].src = this.assetsPath + "/" + this.controlAssets.ques_idx_original.url;
    }*/
  }


  previous() {
    clearInterval(this.timeInterval);
    this.timeInterval = undefined;
    this.blinkFlag = false;
    
    this.EnableShowAnswer=false;
    if(this.EVA) {
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
    } else {
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_original;
    }
    this.appModel.previousSection();

    this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
    this.quesCtrl.peechey_jayein = this.quesCtrl.peechey_jayein_original;
  }


  hoverPreBtn() {
    this.quesCtrl.peechey_jayein = this.quesCtrl.peechey_jayein_hover;
  }
  next() {
    if(this.appModel && !this.appModel.isLastSection){
       clearInterval(this.timeInterval);
      this.timeInterval = undefined;
      this.blinkFlag = false;
      this.EnableShowAnswer = false;
      if(this.EVA) {
        this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
      } else {
        this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_original;
      }
      //this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
      this.UttarDikhayeinTooltip="";
      this.appModel.nextSection();
      this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
    }
  }


  hleavePreBtn() {
    if(this.EVA && this.isFirstQuestion) {
      this.quesCtrl.peechey_jayein = this.quesCtrl.peechey_jayein_disabled;
    }
    else {
      this.quesCtrl.peechey_jayein = this.quesCtrl.peechey_jayein_original;
    }
  }


  hoverNextBtn() {
    if (!this.blinkFlag) {
      if(!this.blink) {
        this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_hover;
      }
    }
  }


  hleaveNextBtn() {
    if (!this.blinkFlag) {
      if (!this.blink) {
        if (this.EVA && this.isLastQues && !this.quesCtrl.blinkingStatus) {
          this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_disabled;
        }
        else {
          this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
        }
      }
    }
  }

  hoverSubmitBtn() {
    this.quesCtrl.submit_btn = this.quesCtrl.submit_btn_hover;
  }

  houtSubmitBtn() {
    this.quesCtrl.submit_btn = this.quesCtrl.submit_btn_original;
  }


  hoverReplayBtn() {
    this.quesCtrl.replay_btn = this.quesCtrl.replay_btn_hover;
  }

  houtReplayBtn() {
    if(!this.isVideoPlaying){
      this.quesCtrl.replay_btn = this.quesCtrl.replay_btn_original;
    }
  }

  setBlinkOnLastQuestion() {
    if(this.EVA) {
      // if(this.EnableShowAnswer === true){
         this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
         this.nextBtn.nativeElement.classList.remove("disableBtn");
         this.quesCtrl.blinkingStatus=true;
        // }
    } else {
      this.blinkFlag = true;
      let flag = true;
      this.timeInterval = setInterval(() => {
        if (flag) {
          this.quesCtrl.aagey_badhein = this.quesCtrl.blink_btn1;
          flag = false;
        } else {
          this.quesCtrl.aagey_badhein = this.quesCtrl.blink_btn2;
          flag = true;
        }
      }, 300)
    }
  }

  controlHandle(controlObj){
    console.log("object of controller");
    console.log(controlObj);
    this.disableNext = controlObj.isNext;
    this.disablePrev = controlObj.isPrev;
    this.hideShowAnswer = controlObj.isShowAns;
    this.disableTabs = controlObj.isTab;
  }
  ngOnDestroy() {
    this.blinkerSubscription.unsubscribe();
  }
}
