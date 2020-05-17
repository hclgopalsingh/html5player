import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../model/applicationmodel.service';
import { Subject, Observable, Subscription } from 'rxjs'
import 'jquery';
import { style } from '@angular/animations';
import { PlayerConstants } from '../common/playerconstants';


declare var $: any;

@Component({
  selector: 'ntemp6',
  templateUrl: '../view/layout/Ntemplate6.component.html',
  styleUrls: ['../view/css/Ntemplate6.component.css', '../view/css/bootstrap.min.css'],

})

export class Ntemplate6 implements OnInit {
  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
      //this.appModel.handlePostVOActivity(false);
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


  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('popupImage') popupImage: any;
  @ViewChild('rightFeedbackVO') rightFeedbackVO: any
  @ViewChild('wrongFeedbackVO') wrongFeedbackVO: any;
  @ViewChild('matra') Matra:any;
  @ViewChild('options') Options:any;
  @ViewChild('DuplicateOption') duplicateOption:any;
  @ViewChild('confirmSubmitRef') confirmSubmitRef: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('answerModalRef') answerModalRef: any;
  @ViewChild('WrongAnswerModalRef') wrongAnswerModalRef: any;  
  @ViewChild('matraPopUp') MatraPopUp: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('quesVORef') quesVORef: any;
  @ViewChild('mainContainer') mainContainer: any;
  @ViewChild('instructionBar') instructionBar: any;
  @ViewChild('instructionVO') instructionVO: any;
  @ViewChild('Speaker') Myspeaker: any;
  @ViewChild('WrongMatraPopUp') wrongMatraPopUp: any;
  //@ViewChild('DuplicateOption') duplicateOption: any;
  @ViewChild('PopUpDuplicateOption') popUpDuplicateOption: any;
  @ViewChild('optionsClickable') optionsClickable: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  
  
  
  

  



  audio = new Audio();
  blink: boolean = false;
  currentIdx = 0;
  commonAssets: any = "";
  speaker:any;
  optionBase:any;
  optionslist: any = [];
  optionslist_main: any = "";
  myoption: any = [];
  question: any = "";
  feedback: any = "";
  narratorAudio: any;
  isLastActivity: any = "";
  checked: boolean = false;
  bool: boolean = false;
  showIntroScreen: boolean;
  refQuesObj: any;
  QuesArr: any;
  optPosObj:any;
  refQuesArr: any = [];
  optionObj: any= [];
  optionInitPosArr:any = [];
  isValid: boolean = false;
  isValidOption: boolean = true;
  isNotValid: boolean = true;
  isNotValidOption: boolean = true;

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
  answerObj:any;
  answerArr:any = [];
  optArr1: any;
  optArr2: any;
  optionCommonAssets: any;
  ques_control: any;
  feedbackObj: any;
  popupAssets: any;
  confirmPopupAssets: any;
  noOfRightAns: any;
  tempSubscription: Subscription;
  i:any;
  j:any;
  matrasInitPosition:any;
  matrasInitPositionXarr:any = [];
  matrasInitPositionYarr:any = [];
  OptionsPositions:any;
  target:any;
  optionElement:any;
  optionElementRect:any;
  optionElementPercentLeft:any;
  optionElementPercentTop:any;

  duplicateOptionElement:any;
  duplicateOptionElementRect:any;

  matraElement:any;
  matraElementRect:any;

  PopupMatraElement:any;
  PopupMatraElementRect:any;

  duplicateElement:any;
  duplicateElementRect:any;

  OptionInitPositionXarr:any = [];
  OptionInitPositionYarr:any = [];
  matraNumber:number = 0;
  currentOptionNumber:number = 0;
  heightDuplicateOption:number = 0;
  currentMatraNumber:number = 0;

  matraPercentLeft:any;
  matraPercentTop:any;

  PopUpMatraPercentLeft:any;
  PopUpMatraPercentTop:any;

  optionPercentTop:any;

  widthOfElement:any;

  MatraLeft:number = 0;
  matraCounter:number = 0;
  controlHandler = {
		isTab:true
	 };
  categoryA: any = {
        "correct": [],
        "incorrect": []
    };
    categoryB: any = {
        "correct": [],
        "incorrect": []
    };
    isWrongAttempted: boolean = false;
    isAllRight: boolean = false;
    category: any;
    options: any = [];
    confirmAssets: any;
    confirmReplayAssets:any;
    optionElementId:string;
    videoReplayd:boolean = false;
    isPlayVideo:boolean = true;
    isVideoLoaded:boolean = false;
    questionObj: any;
    selectableOpts: number;
    randomArray: any;
    maxRandomNo: number;
    timerDelayActs:any;
    optionHolder: any = [];
    completeRandomArr: any = [];
    moveTo: any;
    moveFrom: any;
    moveLeftTo: any;
    movetop: any;
    moveleft: any;
    moveTopTo: any;
    leftSelectedIdx: number = 0;
    blinkSide: string = "";
    startCount: number = 0;
    rightSelectedIdx: number = 0;
    currentOptionNumberjson:any;
    currentMatraNumberjson: any;
  optionArr: any = [];
  optionsAssets: any;
  index: any;
  percentLeft: any;
  percentTop: any;
  refQuesCopy: any;
  flag: boolean = false;
  left: number;
  count: number = 0;
  moveHeight: any;
  clicked: boolean = false;
  attemptType: string = "";
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  quesObj: any;
  PlayPauseFlag:boolean = true;
  skipFlag:boolean = true;
  styleHeaderPopup:any;
  styleBodyPopup:any;

  defaultLetterConfig = [
    {
      id: "L1",
      url: "assets/images/letters/hindi/akshar/aa.png",
      location:"assets",
      style: ""
    },
    {
      id: "L2",
      url: "assets/images/letters/hindi/akshar/ad.png",
      location: "assets",
      style: ""
    },
    {
      id: "L3",
      url: "assets/images/letters/hindi/akshar/ada.png",
      location: "assets",
      style: ""
    },
    {
      id: "L4",
      url: "assets/images/letters/hindi/akshar/aha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L5",
      url: "assets/images/letters/hindi/akshar/ai.png",
      location: "assets",
      style: ""
    },
    {
      id: "L6",
      url: "assets/images/letters/hindi/akshar/Ang.png",
      location: "assets",
      style: ""
    },
    {
      id: "L7",
      url: "assets/images/letters/hindi/akshar/adda.png",
      location: "assets",
      style: ""
    },
    {
      id: "L8",
      url: "assets/images/letters/hindi/akshar/au.png",
      location: "assets",
      style: ""
    },
    {
      id: "L9",
      url: "assets/images/letters/hindi/akshar/b.png",
      location: "assets",
      style: ""
    },
    {
      id: "L10",
      url: "assets/images/letters/hindi/akshar/ba.png",
      location: "assets",
      style: ""
    },
    {
      id: "L11",
      url: "assets/images/letters/hindi/akshar/bh.png",
      location: "assets",
      style: ""
    },
    {
      id: "L12",
      url: "assets/images/letters/hindi/akshar/bha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L13",
      url: "assets/images/letters/hindi/akshar/ch.png",
      location: "assets",
      style: ""
    },
    {
      id: "L14",
      url: "assets/images/letters/hindi/akshar/cha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L15",
      url: "assets/images/letters/hindi/akshar/chh.png",
      location: "assets",
      style: ""
    },
    {
      id: "L16",
      url: "assets/images/letters/hindi/akshar/chha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L17",
      url: "assets/images/letters/hindi/akshar/d.png",
      location: "assets",
      style: ""
    },
    {
      id: "L18",
      url: "assets/images/letters/hindi/akshar/da.png",
      location: "assets",
      style: ""
    },
    {
      id: "L19",
      url: "assets/images/letters/hindi/akshar/dd.png",
      location: "assets",
      style: ""
    },
    {
      id: "L20",
      url: "assets/images/letters/hindi/akshar/dda.png",
      location: "assets",
      style: ""
    },
    {
      id: "L21",
      url: "assets/images/letters/hindi/akshar/ddh.png",
      location: "assets",
      style: ""
    },
    {
      id: "L22",
      url: "assets/images/letters/hindi/akshar/ddha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L23",
      url: "assets/images/letters/hindi/akshar/dh.png",
      location: "assets",
      style: ""
    },
    {
      id: "L24",
      url: "assets/images/letters/hindi/akshar/dha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L25",
      url: "assets/images/letters/hindi/akshar/ee.png",
      location: "assets",
      style: ""
    },
    {
      id: "L26",
      url: "assets/images/letters/hindi/akshar/eeyin.png",
      location: "assets",
      style: ""
    },
    {
      id: "L27",
      url: "assets/images/letters/hindi/akshar/f.png",
      location: "assets",
      style: ""
    },
    {
      id: "L28",
      url: "assets/images/letters/hindi/akshar/fa.png",
      location: "assets",
      style: ""
    },
    {
      id: "L29",
      url: "assets/images/letters/hindi/akshar/g.png",
      location: "assets",
      style: ""
    },
    {
      id: "L30",
      url: "assets/images/letters/hindi/akshar/ga.png",
      location: "assets",
      style: ""
    },
    {
      id: "L31",
      url: "assets/images/letters/hindi/akshar/gh.png",
      location: "assets",
      style: ""
    },
    {
      id: "L32",
      url: "assets/images/letters/hindi/akshar/gha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L33",
      url: "assets/images/letters/hindi/akshar/gya.png",
      location: "assets",
      style: ""
    },
    {
      id: "L34",
      url: "assets/images/letters/hindi/akshar/h.png",
      location: "assets",
      style: ""
    },
    {
      id: "L35",
      url: "assets/images/letters/hindi/akshar/ha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L36",
      url: "assets/images/letters/hindi/akshar/i.png",
      location: "assets",
      style: ""
    },
    {
      id: "L37",
      url: "assets/images/letters/hindi/akshar/j.png",
      location: "assets",
      style: ""
    },
    {
      id: "L38",
      url: "assets/images/letters/hindi/akshar/ja.png",
      location: "assets",
      style: ""
    },
    {
      id: "L39",
      url: "assets/images/letters/hindi/akshar/jha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L40",
      url: "assets/images/letters/hindi/akshar/k.png",
      location: "assets",
      style: ""
    },
    {
      id: "L41",
      url: "assets/images/letters/hindi/akshar/ka.png",
      location: "assets",
      style: ""
    },
    {
      id: "L42",
      url: "assets/images/letters/hindi/akshar/kh.png",
      location: "assets",
      style: ""
    },
    {
      id: "L43",
      url: "assets/images/letters/hindi/akshar/kha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L44",
      url: "assets/images/letters/hindi/akshar/ksh.png",
      location: "assets",
      style: ""
    },
    {
      id: "L45",
      url: "assets/images/letters/hindi/akshar/ksha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L46",
      url: "assets/images/letters/hindi/akshar/l.png",
      location: "assets",
      style: ""
    },
    {
      id: "L47",
      url: "assets/images/letters/hindi/akshar/la.png",
      location: "assets",
      style: ""
    },
    {
      id: "L48",
      url: "assets/images/letters/hindi/akshar/m.png",
      location: "assets",
      style: ""
    },
    {
      id: "L49",
      url: "assets/images/letters/hindi/akshar/ma.png",
      location: "assets",
      style: ""
    },
    {
      id: "L50",
      url: "assets/images/letters/hindi/akshar/n.png",
      location: "assets",
      style: ""
    },
    {
      id: "L51",
      url: "assets/images/letters/hindi/akshar/na.png",
      location: "assets",
      style: ""
    },
    {
      id: "L52",
      url: "assets/images/letters/hindi/akshar/o.png",
      location: "assets",
      style: ""
    },
    {
      id: "L53",
      url: "assets/images/letters/hindi/akshar/oo.png",
      location: "assets",
      style: ""
    },
    {
      id: "L54",
      url: "assets/images/letters/hindi/akshar/p.png",
      location: "assets",
      style: ""
    },
    {
      id: "L55",
      url: "assets/images/letters/hindi/akshar/pa.png",
      location: "assets",
      style: ""
    },
    {
      id: "L56",
      url: "assets/images/letters/hindi/akshar/ra.png",
      location: "assets",
      style: ""
    },
    {
      id: "L57",
      url: "assets/images/letters/hindi/akshar/r.png",
      location: "assets",
      style: ""
    },
    {
      id: "L58",
      url: "assets/images/letters/hindi/akshar/ri.png",
      location: "assets",
      style: ""
    },
    {
      id: "L59",
      url: "assets/images/letters/hindi/akshar/s.png",
      location: "assets",
      style: ""
    },
    {
      id: "L60",
      url: "assets/images/letters/hindi/akshar/sa.png",
      location: "assets",
      style: ""
    },
    {
      id: "L61",
      url: "assets/images/letters/hindi/akshar/sh.png",
      location: "assets",
      style: ""
    },
    {
      id: "L62",
      url: "assets/images/letters/hindi/akshar/sha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L63",
      url: "assets/images/letters/hindi/akshar/shh.png",
      location: "assets",
      style: ""
    },
    {
      id: "L64",
      url: "assets/images/letters/hindi/akshar/shha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L65",
      url: "assets/images/letters/hindi/akshar/t.png",
      location: "assets",
      style: ""
    },
    {
      id: "L66",
      url: "assets/images/letters/hindi/akshar/ta.png",
      location: "assets",
      style: ""
    },
    {
      id: "L67",
      url: "assets/images/letters/hindi/akshar/th.png",
      location: "assets",
      style: ""
    },
    {
      id: "L68",
      url: "assets/images/letters/hindi/akshar/tha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L69",
      url: "assets/images/letters/hindi/akshar/thh.png",
      location: "assets",
      style: ""
    },
    {
      id: "L70",
      url: "assets/images/letters/hindi/akshar/thha.png",
      location: "assets",
      style: ""
    },
    {
      id: "L71",
      url: "assets/images/letters/hindi/akshar/tr.png",
      location: "assets",
      style: ""
    },
    {
      id: "L72",
      url: "assets/images/letters/hindi/akshar/tra.png",
      location: "assets",
      style: ""
    },
    {
      id: "L73",
      url: "assets/images/letters/hindi/akshar/tt.png",
      location: "assets",
      style: ""
    },
    {
      id: "L74",
      url: "assets/images/letters/hindi/akshar/tta.png",
      location: "assets",
      style: ""
    },
    {
      id: "L75",
      url: "assets/images/letters/hindi/akshar/u.png",
      location: "assets",
      style: ""
    },
    {
      id: "L76",
      url: "assets/images/letters/hindi/akshar/v.png",
      location: "assets",
      style: ""
    },
    {
      id: "L77",
      url: "assets/images/letters/hindi/akshar/va.png",
      location: "assets",
      style: ""
    },
    {
      id: "L78",
      url: "assets/images/letters/hindi/akshar/y.png",
      location: "assets",
      style: ""
    },
    {
      id: "L79",
      url: "assets/images/letters/hindi/akshar/ya.png",
      location: "assets",
      style: ""
    },

    {
       id: "M1",
      url: "assets/images/letters/hindi/matra/aa.png",
      imgsrc_audio: "option1.ogg",
      audio_location: "content",
      position:"right",
      location: "assets",
      style: '',
      letters: [
        {
          id: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "L20",
            "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39",
            "L40", "L41", "L42", "L43", "L44", "L45", "L46", "L47", "L48", "L49", "L50", "L51", "L52", "L53", "L54", "L55", "L56", "L57", "L58",
            "L59", "L60", "L61", "L62", "L63", "L64", "L65", "L66", "L67", "L68", "L69", "L70", "L71", "L72", "L73", "L74", "L75", "L76", "L77",
            "L78", "L79"],
          style: { "left": "-2" }
        }
      ]
    },
    {
      id: "M2",
      url: "assets/images/letters/hindi/matra/ai.png",
      imgsrc_audio: "option2.ogg",
      audio_location: "content",
      position: "top",
      location: "assets",
      style: '',
      letters: [
        {
          id: ["L1"],
          style: { "left": "4" }
        },
        {
          id: ["L3", "L26"],
          style: { "left": "1.5" }
        },
        {
          id: ["L20", "L32"],
          style: { "left": "0.8" }
        },
        {
          id: ["L10", "L18", "L22", "L24", "L35", "L49", "L51"],
          style: { "left": "0" }
        },
        {
          id: ["L12", "L79"],
          style: { "left": "0.3" }
        },
        {
          id: ["L14", "L16"],
          style: { "left": "1.0" }
        },
        {
          id: ["L28", "L41", "L55"],
          style: { "left": "-0.3" }
        },
        {
          id: ["L30", "L45"],
          style: { "left": "0.5" }
        },
        {
          id: ["L33", "L39"],
          style: { "left": "1.6" }
        },
        {
          id: ["L36"],
          style: { "left": "-0.4" }
        },
        {
          id: ["L38"],
          style: { "left": "2.0" }
        },
        {
          id: ["L43"],
          style: { "left": "2.7" }
        },
        {
          id: ["L47"],
          style: { "left": "1.4" }
        },
        {
          id: ["L56"],
          style: { "left": "-1" }
        },
        {
          id: ["L60"],
          style: { "left": "1.4" }
        },
        {
          id: ["L62"],
          style: { "left": "1.3" }
        },
        {
          id: ["L64"],
          style: { "left": "-0.5" }
        },
        {
          id: ["L66", "L68"],
          style: { "left": "-0.1" }
        },
        {
          id: ["L70"],
          style: { "left": "0.6" }
        },
        {
          id: ["L72"],
          style: { "left": "0.7" }
        },
        {
          id: ["L74"],
          style: { "left": "0.2" }
        },
        {
          id: ["L77"],
          style: { "left": "-0.2" }
        },
        {
          id: ["L2", "L4", "L5", "L6", "L7", "L8", "L9", "L11", "L13", "L15", "L17",
            "L19", "L21", "L23", "L25", "L27", "L29", "L31", "L34", "L37", "L40",
            "L42", "L44", "L46", "L48", "L50", "L52", "L53", "L54", "L57", "L58",
            "L59", "L61", "L63", "L65", "L67", "L69", "L71", "L73", "L76", "L78"],
          style: { "left": "0" }
        }
      ]
    },
    {
      id: "M3",
      url: "assets/images/letters/hindi/matra/an.png",
      imgsrc_audio: "option3.ogg",
      audio_location: "content",
      position: "top",
      location: "assets",
      style: "",
      letters: [
        {
          id: ["L1"],
          style: { "left": "5.6" }
        },
        {
          id: ["L3"],
          style: { "left": "3.3" }
        },
        {
          id: ["L10", "L18", "L22", "L24", "L35", "L55"],
          style: { "left": "2.7" }
        },
        {
          id: ["L12", "L49"],
          style: { "left": "3.1" }
        },
        {
          id: ["L14"],
          style: { "left": "3.9" }
        },
        {
          id: ["L16", "L32"],
          style: { "left": "3.8" }
        },
        {
          id: ["L20", "L45"],
          style: { "left": "3.5" }
        },
        {
          id: ["L26"],
          style: { "left": "4.2" }
        },
        {
          id: ["L28", "L41"],
          style: { "left": "2.4" }
        },
        {
          id: ["L30", "L51", "L74", "L75"],
          style: { "left": "3.2" }
        },
        {
          id: ["L33", "L39", "L62"],
          style: { "left": "4.3" }
        },
        {
          id: ["L36", "L56"],
          style: { "left": "2.2" }
        },
        {
          id: ["L38"],
          style: { "left": "5.0" }
        },
        {
          id: ["L43"],
          style: { "left": "5.4" }
        },
        {
          id: ["L47", "L60"],
          style: { "left": "4.4" }
        },
        {
          id: ["L64"],
          style: { "left": "2.5" }
        },
        {
          id: ["L66", "L68"],
          style: { "left": "2.9" }
        },
        {
          id: ["L70"],
          style: { "left": "3.6" }
        },
        {
          id: ["L72"],
          style: { "left": "3.7" }
        },
        {
          id: ["L77"],
          style: { "left": "2.8" }
        },
        {
          id: ["L79"],
          style: { "left": "3.4" }
        },
        {
          id: ["L2", "L4", "L5", "L6", "L7", "L8", "L9", "L11", "L13", "L15", "L17",
            "L19", "L21", "L23", "L25", "L27", "L29", "L31", "L34", "L37", "L40",
            "L42", "L44", "L46", "L48", "L50", "L52", "L53", "L54", "L57", "L58",
            "L59", "L61", "L63", "L65", "L67", "L69", "L71", "L73", "L76", "L78"],
          style: { "left": "0" }
        }
      ]
    },
    {
      id: "M4",
      url: "assets/images/letters/hindi/matra/au.png",
      imgsrc_audio: "option4.ogg",
      audio_location: "content",
      position: "right",
      location: "assets",
      style: '',
      letters: [
        {
          id: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "L20",
            "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39",
            "L40", "L41", "L42", "L43", "L44", "L45", "L46", "L47", "L48", "L49", "L50", "L51", "L52", "L53", "L54", "L55", "L56", "L57", "L58",
            "L59", "L60", "L61", "L62", "L63", "L64", "L65", "L66", "L67", "L68", "L69", "L70", "L71", "L72", "L73", "L74", "L75", "L76", "L77",
            "L78", "L79"],
          style: { "left": "-4" }
        }
      ]
    },
    {
      id: "M5",
      url: "assets/images/letters/hindi/matra/ee.png",
      imgsrc_audio: "option5.ogg",
      audio_location: "content",
      position: "right",
      location: "assets",
      style: "",
      letters: [
        {
          id: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "L20",
            "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39",
            "L40", "L41", "L42", "L43", "L44", "L45", "L46", "L47", "L48", "L49", "L50", "L51", "L52", "L53", "L54", "L55", "L56", "L57", "L58",
            "L59", "L60", "L61", "L62", "L63", "L64", "L65", "L66", "L67", "L68", "L69", "L70", "L71", "L72", "L73", "L74", "L75", "L76", "L77",
            "L78", "L79"],
          style: { "left": "-4" }
        }
      ]
    },
    {
      id: "M6",
      url: "assets/images/letters/hindi/matra/i.png",
      imgsrc_audio: "option1.ogg",
      audio_location: "content",
      position: "left",
      location: "assets",
      style: '',
      letters: [
        {
          id: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "L20",
            "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39",
            "L40", "L41", "L42", "L43", "L44", "L45", "L46", "L47", "L48", "L49", "L50", "L51", "L52", "L53", "L54", "L55", "L56", "L57", "L58",
            "L59", "L60", "L61", "L62", "L63", "L64", "L65", "L66", "L67", "L68", "L69", "L70", "L71", "L72", "L73", "L74", "L75", "L76", "L77",
            "L78", "L79"],
          style: { "left": "-1.2" }
        }
      ]
    },
    {
      id: "M7",
      url: "assets/images/letters/hindi/matra/Lower_bindi.png",
      imgsrc_audio: "option2.ogg",
      audio_location: "content",
      position: "bottom",
      location: "assets",
      style: '',
      letters: [
        {
          id: ["L1"],
          style: { "left": "3.1" }
        },
        {
          id: ["L3"],
          style: { "left": "2.6" }
        },
        {
          id: ["L12"],
          style: { "left": "1.5" }
        },
        {
          id: ["L10", "L18", "L35"],
          style: { "left": "1.1" }
        },
        {
          id: ["L14", "L16"],
          style: { "left": "2.3" }
        },
        {
          id: ["L18", "L22", "L24"],
          style: { "left": "2.1" }
        },
        {
          id: ["L20"],
          style: { "left": "3.0" }
        },
        {
          id: ["L26"],
          style: { "left": "2.7" }
        },
        {
          id: ["L28", "L41"],
          style: { "left": "0.9" }
        },
        {
          id: ["L30", "L51"],
          style: { "left": "1.7" }
        },
        {
          id: ["L32"],
          style: { "left": "2.0" }
        },
        {
          id: ["L33"],
          style: { "left": "3.2" }
        },

        {
          id: ["L36", "L56"],
          style: { "left": "0.7" }
        },
        {
          id: ["L38", "L39", "L62"],
          style: { "left": "3.3" }
        },
        {
          id: ["L43"],
          style: { "left": "3.9" }
        },
        {
          id: ["L45"],
          style: { "left": "2.5" }
        },
        {
          id: ["L47"],
          style: { "left": "2.9" }
        },
        {
          id: ["L49"],
          style: { "left": "1.6" }
        },
        {
          id: ["L55"],
          style: { "left": "1.2" }
        },
        {
          id: ["L60"],
          style: { "left": "3.4" }
        },
        {
          id: ["L64"],
          style: { "left": "1.0" }
        },
        {
          id: ["L66", "L75"],
          style: { "left": "2.4" }
        },
        {
          id: ["L68", "L70"],
          style: { "left": "2.1" }
        },
        {
          id: ["L72", "L74"],
          style: { "left": "2.2" }
        },
        {
          id: ["L77"],
          style: { "left": "1.3" }
        },
        {
          id: ["L79"],
          style: { "left": "1.9" }
        },
        {
          id: ["L2", "L4", "L5", "L6", "L7", "L8", "L9", "L11", "L13", "L15", "L17",
            "L19", "L21", "L23", "L25", "L27", "L29", "L31", "L34", "L37", "L40",
            "L42", "L44", "L46", "L48", "L50", "L52", "L53", "L54", "L57", "L58",
            "L59", "L61", "L63", "L65", "L67", "L69", "L71", "L73", "L76", "L78"],
          style: { "left": "0" }
        }
      ]
    },
    {
      id: "M8",
      url: "assets/images/letters/hindi/matra/o.png",
      imgsrc_audio: "option3.ogg",
      audio_location: "content",
      position: "right",
      location: "assets",
      style: { "marginRight": "-53px" },
      letters: [
        {
          id: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "L20",
            "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39",
            "L40", "L41", "L42", "L43", "L44", "L45", "L46", "L47", "L48", "L49", "L50", "L51", "L52", "L53", "L54", "L55", "L56", "L57", "L58",
            "L59", "L60", "L61", "L62", "L63", "L64", "L65", "L66", "L67", "L68", "L69", "L70", "L71", "L72", "L73", "L74", "L75", "L76", "L77",
            "L78", "L79"],
          style: { "left": "-3" }
        }
      ]
    },
    {
      id: "M9",
      url: "assets/images/letters/hindi/matra/oo.png",
      imgsrc_audio: "option4.ogg",
      audio_location: "content",
      position: "bottom",
      location: "assets",
      style: "",
      letters: [
        {
          id: ["L1"],
          style: { "left": "3.4" }
        },
        {
          id: ["L3"],
          style: { "left": "2.9" }
        },
        {
          id: ["L20"],
          style: { "left": "1.8" }
        },
        {
          id: ["L16"],
          style: { "left": "1.1" }
        },
        {
          id: ["L10", "L18"],
          style: { "left": "1.9" }
        },
        {
          id: ["L12"],
          style: { "left": "2.3" }
        },
        {
          id: ["L14"],
          style: { "left": "3.1" }
        },
        {
          id: ["L22", "L36", "L68"],
          style: { "left": "1.0" }
        },
        {
          id: ["L24"],
          style: { "left": "2.2" }
        },
        {
          id: ["L26"],
          style: { "left": "3.5" }
        },
        {
          id: ["L28", "L41"],
          style: { "left": "1.7" }
        },
        {
          id: ["L30", "L51"],
          style: { "left": "2.5" }
        },
        {
          id: ["L32", "L45"],
          style: { "left": "2.8" }
        },
        {
          id: ["L33", "L47", "L60"],
          style: { "left": "3.7" }
        },
        {
          id: ["L35", "L56"],
          style: { "left": "1.5" }
        },
        {
          id: ["L38"],
          style: { "left": "4.1" }
        },
        {
          id: ["L39", "L79"],
          style: { "left": "2.7" }
        },
        {
          id: ["L43"],
          style: { "left": "4.7" }
        },
        {
          id: ["L49"],
          style: { "left": "2.4" }
        },
        {
          id: ["L55"],
          style: { "left": "2.0" }
        },
        {
          id: ["L62"],
          style: { "left": "3.6" }
        },
        {
          id: ["L64"],
          style: { "left": "1.8" }
        },
        {
          id: ["L66"],
          style: { "left": "1.2" }
        },
        {
          id: ["L70", "L72"],
          style: { "left": "3.0" }
        },
        {
          id: ["L74"],
          style: { "left": "2.5" }
        },
        {
          id: ["L75"],
          style: { "left": "2.2" }
        },
        {
          id: ["L77"],
          style: { "left": "2.1" }
        },
        {
          id: ["L2", "L4", "L5", "L6", "L7", "L8", "L9", "L11", "L13", "L15", "L17",
            "L19", "L21", "L23", "L25", "L27", "L29", "L31", "L34", "L37", "L40",
            "L42", "L44", "L46", "L48", "L50", "L52", "L53", "L54", "L57", "L58",
            "L59", "L61", "L63", "L65", "L67", "L69", "L71", "L73", "L76", "L78"],
          style: { "left": "0" }
        }

      ]
    },
    {
      id: "M10",
      url: "assets/images/letters/hindi/matra/R_matraa_2.png",
      imgsrc_audio: "option5.ogg",
      audio_location: "content",
      position: "top",
      location: "assets",
      style: "",
      letters: [
        {
          id: ["L1"],
          style: { "left": "6.1" }
        },
        {
          id: ["L3"],
          style: { "left": "3.6" }
        },
        {
          id: ["L10", "L18", "L22", "L24", "L35"],
          style: { "left": "2.1" }
        },
        {
          id: ["L12"],
          style: { "left": "2.5" }
        },
        {
          id: ["L14", "L16"],
          style: { "left": "3.3" }
        },
        {
          id: ["L20", "L32", "L45"],
          style: { "left": "3.0" }
        },
        {
          id: ["L26"],
          style: { "left": "3.7" }
        },
        {
          id: ["L28", "L41"],
          style: { "left": "1.9" }
        },
        {
          id: ["L30", "L51", "L74"],
          style: { "left": "2.7" }
        },
        {
          id: ["L33", "L39", "L62"],
          style: { "left": "3.8" }
        },
        {
          id: ["L36", "L56"],
          style: { "left": "1.7" }
        },
        {
          id: ["L38"],
          style: { "left": "4.3" }
        },
        {
          id: ["L43"],
          style: { "left": "4.9" }
        },
        {
          id: ["L47", "L60"],
          style: { "left": "3.9" }
        },
        {
          id: ["L49"],
          style: { "left": "2.6" }
        },
        {
          id: ["L55"],
          style: { "left": "2.2" }
        },
        {
          id: ["L56"],
          style: { "left": "1.7" }
        },
        {
          id: ["L64"],
          style: { "left": "2.0" }
        },
        {
          id: ["L66", "L75"],
          style: { "left": "2.4" }
        },
        {
          id: ["L68"],
          style: { "left": "2.1" }
        },
        {
          id: ["L70"],
          style: { "left": "3.1" }
        },
        {
          id: ["L72"],
          style: { "left": "3.2" }
        },
        {
          id: ["L77"],
          style: { "left": "2.3" }
        },
        {
          id: ["L79"],
          style: { "left": "2.9" }
        },
        {
          id: ["L2", "L4", "L5", "L6", "L7", "L8", "L9", "L11", "L13", "L15", "L17",
            "L19", "L21", "L23", "L25", "L27", "L29", "L31", "L34", "L37", "L40",
            "L42", "L44", "L46", "L48", "L50", "L52", "L53", "L54", "L57", "L58",
            "L59", "L61", "L63", "L65", "L67", "L69", "L71", "L73", "L76", "L78"],
          style: { "left": "0" }
        }
      ]
    },
    {
      id: "M11",
      url: "assets/images/letters/hindi/matra/R_matraa_3.png",
      imgsrc_audio: "option1.ogg",
      audio_location: "content",
      position: "bottom_spcialCase",
      location: "assets",
      style: "",
      letters: [
        {
          id: ["L1"],
          style: { "left": "2.4" }
        },
        {
          id: ["L3"],
          style: { "left": "1.9" }
        },
        {
          id: ["L20"],
          style: { "left": "0.8" }
        },
        {
          id: ["L16"],
          style: { "left": "0.1" }
        },
        {
          id: ["L10", "L18"],
          style: { "left": "0.9" }
        },
        {
          id: ["L12"],
          style: { "left": "1.3" }
        },
        {
          id: ["L14"],
          style: { "left": "2.1" }
        },
        {
          id: ["L18", "L22", "L68"],
          style: { "left": "-0.1" }
        },
        {
          id: ["L24"],
          style: { "left": "1.2" }
        },
        {
          id: ["L26"],
          style: { "left": "2.5" }
        },
        {
          id: ["L28", "L41"],
          style: { "left": "0.7" }
        },
        {
          id: ["L30", "L51"],
          style: { "left": "1.5" }
        },
        {
          id: ["L32", "L45"],
          style: { "left": "1.8" }
        },
        {
          id: ["L33", "L39", "L47"],
          style: { "left": "2.7" }
        },
        {
          id: ["L35", "L56"],
          style: { "left": "0.5" }
        },
        {
          id: ["L36"],
          style: { "left": "-1.5" }
        },
        {
          id: ["L38"],
          style: { "left": "3.1" }
        },
        {
          id: ["L43"],
          style: { "left": "3.7" }
        },
        {
          id: ["L49"],
          style: { "left": "1.4" }
        },
        {
          id: ["L55"],
          style: { "left": "1.0" }
        },
        {
          id: ["L60"],
          style: { "left": "2.7" }
        },
        {
          id: ["L62"],
          style: { "left": "2.6" }
        },
        {
          id: ["L64"],
          style: { "left": "0.8" }
        },
        {
          id: ["L66"],
          style: { "left": "0.2" }
        },
        {
          id: ["L70", "L72"],
          style: { "left": "2.0" }
        },
        {
          id: ["L74"],
          style: { "left": "1.5" }
        },
        {
          id: ["L75"],
          style: { "left": "1.2" }
        },
        {
          id: ["L77"],
          style: { "left": "1.1" }
        },
        {
          id: ["L79"],
          style: { "left": "1.7" }
        },
        {
          id: ["L2", "L4", "L5", "L6", "L7", "L8", "L9", "L11", "L13", "L15", "L17",
            "L19", "L21", "L23", "L25", "L27", "L29", "L31", "L34", "L37", "L40",
            "L42", "L44", "L46", "L48", "L50", "L52", "L53", "L54", "L57", "L58",
            "L59", "L61", "L63", "L65", "L67", "L69", "L71", "L73", "L76", "L78"],
          style: { "left": "0" }
        }

      ]
    },
    {
      id: "M12",
      url: "assets/images/letters/hindi/matra/R_matraa_4.png",
      imgsrc_audio: "option2.ogg",
      audio_location: "content",
      position: "bottom",
      location: "assets",
      style: "",
      letters: [         
        {
          id: ["L3"],
          style: { "left": "1.2" }
        },
        {
          id: ["L10"],
          style: { "left": "0" }
        },
        {
          id: ["L12"],
          style: { "left": "0" }
        },
        {
          id: ["L14"],
          style: { "left": "1" }
        },
        {
          id: ["L18", "L22"],
          style: { "left": "-0.1" }
        },
        {
          id: ["L24"],
          style: { "left": "0.2" }
        },
        {
          id: ["L26"],
          style: { "left": "1.5" }
        },
        {
          id: ["L28", "L41"],
          style: { "left": "-0.2" }
        },
        {
          id: ["L30", "L51"],
          style: { "left": "0.5" }
        },
        {
          id: ["L45"],
          style: { "left": "0.8" }
        },
        {
          id: ["L33", "L47"],
          style: { "left": "1.7" }
        },
        {
          id: ["L36"],
          style: { "left": "-1.5" }
        },
        {
          id: ["L38"],
          style: { "left": "2.1" }
        },
        {
          id: ["L43"],
          style: { "left": "2.7" }
        },
        {
          id: ["L49"],
          style: { "left": "0.4" }
        },
        {
          id: ["L55"],
          style: { "left": "0" }
        },
        {
          id: ["L60"],
          style: { "left": "1.7" }
        },
        {
          id: ["L62"],
          style: { "left": "1.6" }
        },
        {
          id: ["L64"],
          style: { "left": "0" }
        },
        {
          id: ["L66"],
          style: { "left": "0.2" }
        },
        {
          id: ["L70", "L72"],
          style: { "left": "1.0" }
        },
        {
          id: ["L74"],
          style: { "left": "0.5" }
        },
        {
          id: ["L75"],
          style: { "left": "1.2" }
        },
        {
          id: ["L77"],
          style: { "left": "0.1" }
        },
        {
          id: ["L79"],
          style: { "left": "0.7" }
        },
        {
          id: ["L1", "L2", "L4", "L5", "L6", "L7", "L8", "L9", "L11", "L13", "L15", "L16", "L17",
            "L19", "L20", "L21", "L23", "L25", "L27", "L29", "L31", "L32", "L34", "L35", "L36", "L37", "L39", "L40",
            "L42", "L44", "L46", "L48", "L50", "L52", "L53", "L54", "L56", "L57", "L58",
            "L59", "L61", "L63", "L65", "L66", "L67", "L68", "L69", "L71", "L73", "L75", "L76", "L78"],
          style: { "left": "0" }
        }
      ]
    },
    {
      id: "M13",
      url: "assets/images/letters/hindi/matra/u.png",
      imgsrc_audio: "option3.ogg",
      audio_location: "content",
      position: "bottom",
      location: "assets",
      style: "",
      letters: [
        {
          id: ["L1", "L3", "L4"],
          style: { "left": "1.5" }
        },
        {
          id: ["L29", "L63"],
          style: { "left": "-1" }
        },
        {
          id: ["L2", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L13", "L15", "L16", "L17", "L19", "L20", "L21", "L22", "L23", "L24", "L25", "L27", "L28", "L31", "L34", "L35", "L36", "L37", "L40", "L41", "L42", "L44", "L46", "L48", "L49", "L50", "L53", "L54", "L55", "L56", "L57", "L59", "L61", "L64", "L65", "L66", "L67", "L68", "L69", "L71", "L73", "L75", "L76", "L77", "L78"],
          style: { "left": "0" }
        },
        {
          id: ["L12", "L18", "L30", "L51", "L58", "L74", "L79"],
          style: { "left": "0.5" }
        },
        {
          id: ["L14", "L32", "L45", "L70", "L72"],
          style: { "left": "1" }
        },
        {
          id: ["L26", "L33", "L39", "L47", "L52", "L62"],
          style: { "left": "1.5" }
        },
        {
          id: ["L38", "L60"],
          style: { "left": "2" }
        },
        {
          id: ["L43"],
          style: { "left": "2.7" }
        }
      ]
    },
	{
      id: "M14",
      url: "assets/images/letters/hindi/matra/a.png",
      imgsrc_audio: "option3.ogg",
      audio_location: "content",
      position: "top",
      location: "assets",
      style: "",
      letters: [
        {
          id: ["L3", "L4"],
          style: { "left": "1.5" }
        },
        {
          id: ["L9", "L11", "L23", "L54", "L63", "L76"],
          style: { "left": "-1" }
        },
        {
          id: ["L29"],
          style: { "left": "-1.5" }
        },
        {
          id: ["L2", "L5", "L10", "L13", "L25", "L27", "L28", "L31", "L36", "L37", "L40", "L41", "L42", "L44", "L46", "L48", "L50", "L53", "L56", "L57", "L59", "L61", "L69", "L71", "L73", "L78"],
          style: { "left": "0" }
        },
        {
          id: ["L34", "L35", "L55", "L64", "L77"],
          style: { "left": "0.3" }
        },
        {
          id: ["L12", "L17", "L18", "L21", "L22", "L24", "L49", "L65", "L66", "L67", "L68", "L75"],
          style: { "left": "0.5" }
        },
        {
          id: ["L30", "L51", "L58", "L74", "L79"],
          style: { "left": ".8" }
        },
        {
          id: ["L6", "L7", "L8", "L32", "L45"],
          style: { "left": "1" }
        },
        {
          id: ["L14", "L15", "L16", "L19", "L20", "L70", "L72",],
          style: { "left": "1.3" }
        },
        {
          id: ["L26", "L39", "L52"],
          style: { "left": "1.5" }
        },
        {
          id: ["L62"],
          style: { "left": "1.8" }
        },
        {
          id: ["L47"],
          style: { "left": "1.9" }
        },
        {
          id: ["L33", "L38", "L60"],
          style: { "left": "2" }
        },
        {
          id: ["L43"],
          style: { "left": "3" }
        },
        {
          id: ["L1"],
          style: { "left": "4.4" }
        }
      ]
    },
    {
      id: "M15",
      url: "assets/images/letters/hindi/matra/R_matraa_1.png",
      imgsrc_audio: "option3.ogg",
      audio_location: "content",
      position: "bottom",
      location: "assets",
      style: "",
      letters: [
        {
          id: ["L1", "L3", "L4", "L26", "L39", "L52", "L62"],
          style: { "left": "2.7" }
        },
        {
          id: ["L29"],
          style: { "left": "-1" }
        },
        {
          id: ["L2", "L5", "L9", "L11", "L13", "L23", "L25", "L31", "L36", "L44", "L48", "L50", "L54", "L56", "L57", "L59", "L61", "L63", "L69", "L71", "L73", "L76", "L78"],
          style: { "left": "0" }
        },
        {
          id: ["L34", "L35"],
          style: { "left": "0.5" }
        },
        {
          id: ["L27", "L28", "L65", "L66", "L67", "L68"],
          style: { "left": "0.8" }
        },
        {
          id: ["L14", "L37", "L40", "L41", "L42", "L46", "L75"],
          style: { "left": "1" }
        },
        {
          id: ["L10", "L21", "L22", "L55", "L64",],
          style: { "left": "1.1" }
        },
        {
          id: ["L77",],
          style: { "left": "1.2" }
        },
        {
          id: ["L24",],
          style: { "left": "1.4" }
        },
        {
          id: ["L7", "L12", "L15", "L16", "L19", "L20"],
          style: { "left": "1.5" }
        },
        {
          id: ["L49", "L53",],
          style: { "left": "1.6" }
        },
        {
          id: ["L30", "L51", "L74",],
          style: { "left": "1.7" }
        },
        {
          id: ["L17", "L18", "L58", "L79",],
          style: { "left": "1.8" }
        },
        {
          id: ["L32", "L45"],
          style: { "left": "2" }
        },
        {
          id: ["L70"],
          style: { "left": "2.1" }
        },
        {
          id: ["L72"],
          style: { "left": "2.2" }
        },
        {
          id: ["L14"],
          style: { "left": "2.3" }
        },
        {
          id: ["L6", "L8",],
          style: { "left": "2.6" }
        },
        {
          id: ["L60", "L33", "L47"],
          style: { "left": "2.9" }
        },
        {
          id: ["L38"],
          style: { "left": "3.3" }
        },
        {
          id: ["L43"],
          style: { "left": "3.8" }
        }
      ]
    }
  ];
 

  playHoverInstruction() {
    this.instruction.nativeElement.currentTime = 0;
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      console.log("play on Instruction");
      //this.instruction.nativeElement.load();
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        //document.getElementById("coverTop").style.display = "block";
        this.instruction.nativeElement.onended = () => {
          //document.getElementById("coverTop").style.display = "none";
        }
        $(".instructionBase").css("cursor", "pointer");
    }
  }
}

endedHandleronSkip() {    
  this.isPlayVideo = false;   
  this.appModel.navShow = 2;  
  this.appModel.videoStraming(false);
  this.appModel.notifyUserAction();   
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

hoverSkip(){
// this.skipFlag = false;
this.quesObj.quesSkip = this.quesObj.quesSkipHover;
}
houtSkip(){
this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
}

  onHoverOption(opt, i) {
    if (opt && opt != undefined) {
      if (this.instructionVO.nativeElement.paused) {
        $(this.optionsClickable.nativeElement.children[0].children[i].children[0]).addClass("scaleInAnimation");
      }
    }
  }

  isPaused(){
    for (let i = 0; i < this.optionArr.length; i++) {
     if(!this.optionsClickable.nativeElement.children[0].children[i].children[2].paused){
      return false;
     }
    }
    return true
  }

  lastidx:any ;

  playHoverOption(opt, i) {
    this.appModel.notifyUserAction();
    if (!this.instructionVO.nativeElement.paused) {
      this.instructionVO.nativeElement.currentTime = 0;
      this.instructionVO.nativeElement.pause();
    }
    if (this.optionsClickable.nativeElement.children[0].children[i].children[2].paused && this.quesVORef.nativeElement.paused && this.isPaused() && this.lastidx!= i) {
      for(let j = 0 ; j < this.optionArr.length ; j++)
        {
        if(!this.optionsClickable.nativeElement.children[0].children[j].children[2].paused)
        {
          this.optionsClickable.nativeElement.children[0].children[j].children[2].pause();
        }
      }
      $(this.optionsClickable.nativeElement.children[0].children[i].children[0]).addClass("scaleInAnimation");
      this.lastidx = i;
      if (opt.imgsrc_audio && opt.audio_location == "content") {
        this.optionsClickable.nativeElement.children[0].children[i].children[2].src = this.containgFolderPath + "/" + opt.imgsrc_audio;
      }
      this.optionAudio.nativeElement.load();
      
      this.optionsClickable.nativeElement.children[0].children[i].children[2].volume = this.appModel.isMute ? 0 : this.appModel.volumeValue
      this.optionsClickable.nativeElement.children[0].children[i].children[2].play();
      this.onHoverOption(opt, i);
    }
  }

  onHoverOptionOut(opt, i) {
    if (opt && opt != undefined) {
      this.OptionZoomOutAnimation(opt, i);
    }
    this.lastidx = undefined;
  }

  optionHover(opt, i) {
  this.playHoverOption(opt, i)  
  
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }


  OptionZoomOutAnimation(opt, i) {
    if (!this.checked && this.quesVORef.nativeElement.paused) {
      $(this.optionsClickable.nativeElement.children[0].children[i].children[0]).addClass("scaleOutAnimation");
      setTimeout(() => {
        $(this.optionsClickable.nativeElement.children[0].children[i].children[0]).removeClass("scaleInAnimation");
        $(this.optionsClickable.nativeElement.children[0].children[i].children[0]).removeClass("scaleOutAnimation");
      }, 500)
    }
  }
 
  checkAnswer(opt, id) {
    this.appModel.enableReplayBtn(false);
    this.appModel.enableNavBtn(true);
    this.controlHandler.isTab = false;
    this.appModel.handleController(this.controlHandler);
    //$( "#navBlock" ).addClass("disableNavBtn")
    this.appModel.handlePostVOActivity(true);
    this.count = 0;
    $(".instructionBase").addClass('disable_div');
    $('.speaker').addClass('disable_div');
    this.optionsClickable.nativeElement.classList = "row mx-0 disable_div"
    console.log("option clicked");
    this.currentOptionNumber = id;
    this.appModel.notifyUserAction();
    this.moveFrom = this.optionsClickable.nativeElement.children[0].children[id].children[1].getBoundingClientRect();
    if (opt.position == "right") {
      this.refQuesCopy = this.QuesArr.slice();
      this.refQuesCopy.splice(this.index + 1, 0, opt.id);
    }
    if (opt.position == "left" || opt.position == "top" || opt.position == "bottom" || opt.position == "bottom_spcialCase") {
      this.refQuesCopy = this.QuesArr.slice();
      this.refQuesCopy.splice(this.index, 0, opt.id);
    }

    this.onClickAnimation(opt, id);

    if (this.refQuesCopy.join('') == this.feedback.correct_ans_array.join('')) {
      this.flag = true;
      console.log("Answer is right");
      this.styleHeaderPopup = this.confirmAssets.style_header;
      this.styleBodyPopup = this.confirmAssets.style_body;
       setTimeout(() => {
         this.sendFeedback(undefined, 'yes', 'rightAnswer');
       }, 2000);
    } else {
      console.log("Answer is wrong");
      this.styleHeaderPopup = this.confirmAssets.wrong_style_header;
      this.styleBodyPopup = this.confirmAssets.wrong_style_body;
       setTimeout(() => { 
         this.sendFeedback(undefined, 'yes', 'wrongAnswer');
       }, 2000);
    }
  }

  onClickAnimation(option, id) {
    console.log("start Animation");
    if (option.position == "right") {
      this.Matra.nativeElement.children[this.index].insertAdjacentHTML("afterend", "<img style='opacity:0;height:78%;width:4%'></img>");
      for (var i = 0; i < option.letters.length; i++) {
        if (option.letters[i].id.includes(this.refQuesCopy[this.index])) {
          this.left = ((($(window).width() - $("#container").width()) / $(window).width()) / 7) + parseFloat(option.letters[i].style["left"]);
        }
      }
      this.Matra.nativeElement.children[this.index].classList.value = '';
    } else if (option.position == "left") {
      this.Matra.nativeElement.children[this.index].insertAdjacentHTML("beforebegin", "<img style='opacity:0;height:78%;width:4%'></img>");
      for (var i = 0; i < option.letters.length; i++) {
        if (option.letters[i].id.includes(this.refQuesCopy[this.index + 1])) {
          this.left = ((($(window).width() - $("#container").width()) / $(window).width()) / 7) + parseFloat(option.letters[i].style["left"]);
          break;
        }
      }
      this.Matra.nativeElement.children[this.index + 1].classList.value = '';
    } else if (option.position == "top" || option.position == "bottom" || option.position == "bottom_spcialCase") {
      this.Matra.nativeElement.children[this.index].classList.value = '';
      for (var i = 0; i < option.letters.length; i++) {
        if (option.letters[i].id.includes(this.refQuesCopy[this.index + 1])) {
          this.left = ((($(window).width() - $("#container").width()) / $(window).width()) / 7) + parseFloat(option.letters[i].style["left"]);
        }
      }
    }
    
    this.duplicateOptionElementRect = this.duplicateOption.nativeElement.children[id].getBoundingClientRect();
      for(var i = 0; i<this.optionInitPosArr.length; i++)
      {
          if(i == id)
          {
             this.percentLeft = (this.optionInitPosArr[i].leftPos)+"%";
             this.percentTop =  (this.optionInitPosArr[i].rightPos)+"%";
          }
    }
    $(this.duplicateOption.nativeElement.children[id]).animate({ left: this.percentLeft, top: this.percentTop }, 0);
    this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.zIndex = 100;
    this.optionsClickable.nativeElement.children[0].children[id].children[1].style.opacity = 0;
    this.duplicateOption.nativeElement.children[id].style.opacity = 1;
    this.moveFrom = this.duplicateOption.nativeElement.children[id].getBoundingClientRect();
    if (option.position == "right") {
      this.moveTo = this.Matra.nativeElement.children[this.index + 1].getBoundingClientRect();
    } else if (option.position == "left" || option.position == "top" || option.position == "bottom" || option.position == "bottom_spcialCase") {
      this.moveTo = this.Matra.nativeElement.children[this.index].getBoundingClientRect();
    }
    this.moveleft = (this.moveTo.left / ($("#container").width() /* ($(window).width() - $("#container").width())*/) * 100) + 1 + this.left - ((($(window).width() - $("#container").width()) / 2) / $("#container").width())*100 + "%";
    if (option.position == "bottom") {
      this.movetop = (this.moveTo.top / $("#container").width() * 100) - 3.5 + "%";
    } else if (option.position == "bottom_spcialCase") {
      this.movetop = (this.moveTo.top / $("#container").width() * 100) - 1 + "%";
    } else if (option.position == "left" || option.position == "right") {
      this.movetop = (this.moveTo.top / $("#container").width() * 100) - 3.2845 + "%";
    }
     else {
      this.movetop = (this.moveTo.top / $("#container").width() * 100) - 3 + "%";
    }
    $(this.duplicateOption.nativeElement.children[id]).animate({ left: this.moveleft, top: this.movetop}, 1000);
  }

  onClickAnimationManually(option, id,letterNumber) {
    console.log("start Animation");
    if (option.position == "right") {
      this.Matra.nativeElement.children[letterNumber-1].insertAdjacentHTML("afterend", "<img style='opacity:0;height:78%;width:4%'></img>");
      for (var i = 0; i < option.letters.length; i++) {
        if (option.letters[i].id.includes(this.refQuesArr[letterNumber-1].id)) {
          this.left = ((($(window).width() - $("#container").width()) / $(window).width()) / 7) + parseFloat(option.letters[i].style["left"]);
          break;
        }
      }
    } else if (option.position == "left") {
      this.Matra.nativeElement.children[letterNumber - 1].insertAdjacentHTML("beforebegin", "<img style='opacity:0;height:78%;width:4%;'></img>");
      for (var i = 0; i < option.letters.length; i++) {
        if (option.letters[i].id.includes(this.refQuesArr[letterNumber - 1].id)) {
          this.left = ((($(window).width() - $("#container").width()) / $(window).width()) / 7) + parseFloat(option.letters[i].style["left"]);
          break;
        }
      }
    } else if (option.position == "top" || option.position == "bottom" || option.position == "bottom_spcialCase") {
      for (var i = 0; i < option.letters.length; i++) {
        if (option.letters[i].id.includes(this.refQuesArr[letterNumber - 1].id)) {
          this.left = ((($(window).width() - $("#container").width()) / $(window).width()) / 7) + parseFloat(option.letters[i].style["left"]);
          break;
        }
      }
    }

    this.duplicateOptionElementRect = this.duplicateOption.nativeElement.children[id].getBoundingClientRect();
    for (var i = 0; i < this.optionInitPosArr.length; i++) {
      if (i == id) {
        this.percentLeft = (this.optionInitPosArr[i].leftPos) + "%";
        this.percentTop = (this.optionInitPosArr[i].rightPos) + "%";
      }
    }
    $(this.duplicateOption.nativeElement.children[id]).animate({ left: this.percentLeft, top: this.percentTop }, 0);
    this.duplicateOption.nativeElement.children[id].style.zIndex = 1;
    this.optionsClickable.nativeElement.children[0].children[id].children[1].style.opacity = 0;
    this.duplicateOption.nativeElement.children[id].style.opacity = 1;
    this.moveFrom = this.duplicateOption.nativeElement.children[id].getBoundingClientRect();
    if (option.position == "right") {
      this.moveTo = this.Matra.nativeElement.children[letterNumber].getBoundingClientRect();
    } else if (option.position == "left" || option.position == "top" || option.position == "bottom" || option.position == "bottom_spcialCase") {
      this.moveTo = this.Matra.nativeElement.children[letterNumber-1].getBoundingClientRect();
    }
    this.moveleft = (this.moveTo.left / ($("#container").width() /* ($(window).width() - $("#container").width())*/) * 100) + 1 + this.left - ((($(window).width() - $("#container").width()) / 2) / $("#container").width()) * 100 + "%";
    if (option.position == "bottom") {
      this.movetop = (this.moveTo.top / $("#container").width() * 100) - 3 + "%";
    } else if (option.position == "bottom_spcialCase") {
      this.movetop = (this.moveTo.top / $("#container").width() * 100) - 1 + "%";
    } else if (option.position == "left" || option.position == "right") {
      this.movetop = (this.moveTo.top / $("#container").width() * 100) - 3.20 + "%";
    }
    else {
      this.movetop = (this.moveTo.top / $("#container").width() * 100) - 3 + "%";
    }
    $(this.duplicateOption.nativeElement.children[id]).animate({ left: this.moveleft, top: this.movetop }, 0);
  }

  checkAnswerMatra(event,id) {
    if (!this.instructionVO.nativeElement.paused) {
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0
    }
    if (!event.id.includes("M")) {
      this.appModel.notifyUserAction();
      this.clicked = true;
      document.getElementById("coverTop").style.display = "block";
      document.getElementById("coverBtm").style.display = "none";
      this.index = id;
      this.Matra.nativeElement.children[id].classList.value = 'outline';
    }
  }


  //  MatraPopUpLoaded(i)
  //{ 
  //   if ( i % 3 == 0) {
  //     this.MatraPopUp.nativeElement.children[i].style.display = "block";
  //     if(this.currentOptionNumberjson == 0)
  //     {
  //        this.MatraPopUp.nativeElement.children[this.currentMatraNumberjson+2].style.display = "block";
  //     }
  //     if(this.currentOptionNumberjson == 3)
  //     {
  //       this.MatraPopUp.nativeElement.children[this.currentMatraNumberjson+1].style.display = "block";
  //     }
       
  //   }
  //   else{this.MatraPopUp.nativeElement.children[i].style.display = "none";}   
  //}

  //WrongMatraPopUpLoaded(i)
  //{
  //  if ( i % 3 == 0) {
  //     this.wrongMatraPopUp.nativeElement.children[i].style.display = "block";       
  //   }
  //   else{
  //     this.wrongMatraPopUp.nativeElement.children[i].style.display = "none";      
  //    } 
  //}

//DuplicateOptionLoaded(i)
//{
// this.popUpDuplicateOption.nativeElement.children[i].style.display = "none";
//}
  

  

  //OptionLoaded(event, i)
  //{

  //  setTimeout(() => { 
  //     this.duplicateOption.nativeElement.children[i].style.opacity = 0;           
  //      }, 0); 
 
  //}

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
          this.appModel.event = { 'action': 'end' };
        }
      }
    } else {
      this.appModel.moveNextQues(this.attemptType);
    }  
  }

  ngOnInit() {
    let that = this;
        $( "#navBlock" ).click(function() {
            if (!that.instructionVO.nativeElement.paused)
            {
              that.instructionVO.nativeElement.pause();
              that.instructionVO.nativeElement.currentTime = 0;
            }
          });
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
        this.containgFolderPath = this.getBasePath();
        this.setData();
        this.appModel.functionone(this.templatevolume, this);//start end
    this.appModel.getNotification().subscribe(mode => {
            if (mode == "manual") {
                console.log("manual mode ", mode);
            } else if (mode == "auto") {
              console.log("auto mode", mode);
              this.attemptType = "";
              this.styleHeaderPopup = this.confirmAssets.style_header;
              this.styleBodyPopup = this.confirmAssets.style_body;
              this.showFeedback('yes');
            }
        })
    this.appModel.getConfirmationPopup().subscribe((val) => {

      if (val == "uttarDikhayein") {
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          if (this.Myspeaker && this.Myspeaker.nativeElement) {
            this.Myspeaker.nativeElement.pause();
            this.Myspeaker.nativeElement.currentTime = 0;
            $('.speakerWave').removeClass("dispFlex");
          }
          if (this.instructionVO && this.instructionVO.nativeElement) {
            this.instructionVO.nativeElement.pause();
            this.instructionVO.nativeElement.currentTime = 0;
            $('.speaker').removeClass('disable_div');
          }
          this.appModel.notifyUserAction();
        }
      } else if (val == "submitAnswer") {
        if (this.confirmSubmitRef && this.confirmSubmitRef.nativeElement) {
          this.confirmSubmitRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
        }
      } else if (val == "replayVideo") {
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
          this.appModel.notifyUserAction();
          this.PlayPauseFlag = true;
          this.quesObj.quesPlayPause = this.quesObj.quesPause;
          this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
        }
      }
    });

    this.appModel.nextBtnEvent().subscribe(() => {
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.event = { 'action': 'segmentEnds' };
      }
      if (this.appModel.isLastSection) {
        this.appModel.event = { 'action': 'end' };
      }
    });
    this.appModel.postWrongAttempt.subscribe(() => {
      this.postWrongAttemplt();
    });
    //$( "#navBlock" ).removeClass("disableNavBtn")
    this.appModel.enableNavBtn(false);
    this.controlHandler.isTab = true;
    this.appModel.handleController(this.controlHandler);
    this.appModel.resetBlinkingTimer();
  }

  postWrongAttemplt() {
    //this.resetAttempt();
    this.controlHandler.isTab = true;
    this.appModel.handleController(this.controlHandler);
    this.appModel.enableNavBtn(false);
    $( "#navBlock" ).removeClass("disableNavBtn")
  }

  ngOnDestory() {
    this.refQuesArr = [];
    this.QuesArr = [];
  }



 templatevolume(vol, obj) {
        if (obj.quesVORef && obj.quesVORef.nativeElement) {
            obj.quesVORef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
            obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        } 
        if (obj.instructionVO && obj.instructionVO.nativeElement) {
            obj.instructionVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.feedbackAudio && obj.feedbackAudio.nativeElement) {
            obj.feedbackAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if (obj.audio) {
            obj.audio.volume = obj.appModel.isMute ? 0 : vol;
        }
        if(obj.mainVideo && obj.mainVideo.nativeElement){
            this.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
        if(obj.Myspeaker && obj.Myspeaker.nativeElement){
          this.Myspeaker.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
        }
    }

    replayVideo(){      
        this.videoReplayd = true;
        this.isPlayVideo = true;
        this.appModel.stopAllTimer();
        setTimeout(() =>{
        this.mainVideo.nativeElement.play();
        this.mainVideo.nativeElement.onended = () =>{
            this.isPlayVideo = false;
            console.log("video eneded in replay function");
            this.appModel.startPreviousTimer();
            this.appModel.notifyUserAction();
        }
        },500)
    }

      hoverReplayConfirm() {
        this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_hover;
    }

     houtReplayConfirm() {
        this.confirmReplayAssets.confirm_btn = this.confirmReplayAssets.confirm_btn_original;
    }

     hoverReplayDecline() {
        this.confirmReplayAssets.decline_btn = this.confirmReplayAssets.decline_btn_hover;
    }

     houtReplayDecline() {
        this.confirmReplayAssets.decline_btn = this.confirmReplayAssets.decline_btn_original;
    }

    hoverReplayCloseConfirm() {

    }

    houtReplayCloseConfirm() {

    }

      checkVideoLoaded(){
        if (!this.videoReplayd) {
            this.isVideoLoaded = true;
            this.appModel.setLoader(false);
            this.appModel.navShow = 1;
            this.isPlayVideo = true;
            this.appModel.isVideoPlayed = true;
          }else{
            this.isVideoLoaded = true;
          }
    }

  endedHandler() {
        if (!this.videoReplayd) {
            this.isPlayVideo = false;
            this.appModel.navShow = 2;
          this.appModel.enableReplayBtn(true);
          this.appModel.handlePostVOActivity(false);

        }
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
   } else {
     this.checkforQVO();
   }
    }

 playInstruction() {
   this.appModel.notifyUserAction();
        if (this.instructionVO.nativeElement && this.instructionVO.nativeElement.src) {
            this.Myspeaker.nativeElement.pause();
            this.Myspeaker.nativeElement.currentTime = 0;
          this.instructionVO.nativeElement.play();
          // document.getElementById("coverTop").style.display = "block";
          // document.getElementById("coverBtm").style.display = "block";
          
          this.instructionVO.nativeElement.onended = () => {
            if (!this.clicked) {
              document.getElementById("coverTop").style.display = "none";
            }
              if (this.clicked) {
                document.getElementById("coverBtm").style.display = "none";
              }
              
            }
        }
    }

    playSpeaker(ev) {
      this.appModel.notifyUserAction();
      this.instructionVO.nativeElement.pause();
      this.instructionVO.nativeElement.currentTime = 0;       
      this.Myspeaker.nativeElement.play();
      document.getElementById("coverTop").style.display = "block";
      document.getElementById("coverBtm").style.display = "block";
      $('.instructionBase').addClass('disable_div');
      this.Myspeaker.nativeElement.onended = () => {
        if (!this.clicked) {
          document.getElementById("coverTop").style.display = "none";
        } 
        if (this.clicked) {
          document.getElementById("coverBtm").style.display = "none";
        }
        $('.instructionBase').removeClass('disable_div');
      }
      $('.speakerWave').addClass("dispFlex");    
    }

    endedSpeakerAudio()
    {
      $('.speakerWave').removeClass("dispFlex"); 
    }

  setData() {
  
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      let fetchedData: any = this.appModel.content.contentData.data;
      console.log(fetchedData);
      this.feedback = fetchedData.feedback;
      this.commonAssets = fetchedData.commonassets;
     // this.speaker = fetchedData.commonassets.speaker.url;
      this.optionBase = fetchedData.commonassets.optionBase.url;
      this.narratorAudio = fetchedData.commonassets.narrator;
      //this.subjectQuesControl.next(fetchedData.commonassets);
      this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
      this.ques_control = fetchedData.commonassets.ques_control;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      this.optionsAssets = fetchedData.optionsObj;
      for (let j = 0; j < this.optionsAssets.length; j++) {
        this.optionArr.push(this.optionsAssets[j].optionID);
      }
      //this.optionArr = fetchedData.optionsObj.optionID;
      for (let i = 0; i < this.optionArr.length; i++) {
        for (let j = 0; j < this.defaultLetterConfig.length; j++) {
          if (this.optionArr[i] == this.defaultLetterConfig[j].id) {
            this.optionObj.push(this.defaultLetterConfig[j]);
            break;
          }
        }
      }
      this.answerObj = fetchedData.AnswerObj;  
      this.refQuesObj = fetchedData.refQuesObj;
      this.QuesArr = this.refQuesObj.quesIdConfig;
      for (let i = 0; i < this.QuesArr.length; i++) {
        for (let j = 0; j < this.defaultLetterConfig.length; j++) {
          if (this.QuesArr[i] == this.defaultLetterConfig[j].id) {
            this.refQuesArr.push(this.defaultLetterConfig[j]);
            break;
          }
        }
      }
      this.optPosObj =  fetchedData.optionInitPosObj;
      //this.refQuesArr = this.refQuesObj[0].refQuesArr; 
      this.optionInitPosArr = this.optPosObj[0].optionInitPosArr;
     // this.optArr1 = this.optionObj[0].optionsArr;        
      this.optionCommonAssets = fetchedData.option_common_assets;
      console.log(this.optionCommonAssets);
      this.feedbackObj = fetchedData.feedback;
      this.currentOptionNumberjson = this.feedbackObj.correct_option_number;
      this.currentMatraNumberjson = this.feedbackObj.correct_matra_number;
      this.isValid = true;
      this.isNotValid = false;
      //this.popupAssets = fetchedData.feedback;
      this.confirmPopupAssets = fetchedData.feedback.confirm_popup;
      this.confirmAssets = fetchedData.show_answer_confirm;
      this.confirmReplayAssets = fetchedData.replay_confirm;
       this.questionObj = fetchedData.quesObj;
       this.quesObj = fetchedData.quesObj;
        //this.selectableOpts = JSON.parse(JSON.stringify(this.questionObj.noOfOptions));
         if(this.questionObj && this.questionObj.quesVideo && this.questionObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed){
             this.isPlayVideo = true;
             this.videoReplayd = false;
         }else{
            this.isPlayVideo = false;
        }
      //for(this.i = 0;this.i<this.answerObj[0].AnswerArr.length; this.i++)
      //{
      // this.answerArr.push(this.answerObj[0].AnswerArr[this.i].imgsrc.url);
      //}     
      //console.log("----->>>>>>"+this.answerArr);
    }
}

endedAudio(){
document.getElementById("coverTop").style.display = "none";
document.getElementById("coverBtm").style.display = "block"; 
}

  checkforQVO() {  
        this.isVideoLoaded = true;
        if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
            this.quesVORef.nativeElement.src = this.questionObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.questionObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
          this.mainContainer.nativeElement.classList = "bodyContent disable_div";
          this.instructionBar.nativeElement.classList = "instructionBase disable_div";
            this.quesVORef.nativeElement.play();
            this.appModel.enableReplayBtn(false);
            this.appModel.enableSubmitBtn(false);
            this.appModel.handlePostVOActivity(true);
            this.quesVORef.nativeElement.onended = () => {
                this.mainContainer.nativeElement.classList = "bodyContent";
                this.instructionBar.nativeElement.classList = "instructionBase";
                //this.startActivity();
                this.appModel.handlePostVOActivity(false);
                this.appModel.enableReplayBtn(true);
            }
        } else {
        this.timerDelayActs = setTimeout(() =>{
                //this.startActivity();
                this.appModel.handlePostVOActivity(false);
                this.appModel.enableReplayBtn(true);
               
            },1000)
        }
    }

    //   startActivity() {
    //   // this.getRandomIndxBlink(this.selectableOpts);
    //}

    /* getRandomIndxBlink(no) {
        let randomIdx = Math.floor((Math.random() * no));
        console.log("random index ", randomIdx);
        if (this.optionHolder.left_random_index.includes(this.completeRandomArr[randomIdx])) {
            this.completeRandomArr.splice(randomIdx, 1);
            this.moveTo = this.mainContainer.nativeElement.children[0].children[0].children[1].children[this.leftSelectedIdx].getBoundingClientRect();
            console.log(this.moveTo);
            this.blinkSide = "left";
            this.startCount = 1;
           // this.blinkHolder();
            this.selectableOpts--;

        } else if (this.optionHolder.right_random_index.includes(this.completeRandomArr[randomIdx])) {
            this.completeRandomArr.splice(randomIdx, 1);
            this.moveTo = this.mainContainer.nativeElement.children[0].children[1].children[1].children[this.rightSelectedIdx].getBoundingClientRect();
            console.log(this.moveTo);
            this.blinkSide = "right";
            this.startCount = 1;
           // this.blinkHolder();
            this.selectableOpts--;
        }
    }*/

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }
  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }

  showhoverConfirm() {
    this.confirmAssets.confirm_btn = this.confirmAssets.confirm_btn_hover;
  }

  houtConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
  }

  showhoutConfirm() {
    this.confirmAssets.confirm_btn = this.confirmAssets.confirm_btn_original;
  }

  hoverDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
  }

  showhoverDecline() {
    this.confirmAssets.decline_btn = this.confirmAssets.decline_btn_hover;
  }

  houtDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
  }

  showhoutDecline() {
    this.confirmAssets.decline_btn = this.confirmAssets.decline_btn_original;
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

  showFeedback(flag: string) {
    this.attemptType = "manual";
    if (this.index != undefined) {
      //this.Matra.nativeElement.children[this.index].style.outline = '';
      //this.Matra.nativeElement.children[this.index].classList.value = "";
    }
    
    if (flag == "yes") {
      this.confirmModalRef.nativeElement.classList = "modal";
      this.confirmReplayRef.nativeElement.classList="modal";
      this.answerModalRef.nativeElement.classList = "displayPopup modal";
      if(this.index!=undefined) {
        this.Matra.nativeElement.children[this.index].classList.value="";
      }     
      this.onClickAnimationManually(this.optionObj[this.currentMatraNumberjson], this.currentMatraNumberjson, this.currentOptionNumberjson);
        // this.sendFeedback(this.AnswerModalRef, 'no','showAnswer');  
      this.sendFeedback(this.currentMatraNumberjson, 'yes', 'showAnswer');
      //setTimeout(() => {
      //  this.resetwithoutAttempt(this.optionObj[this.currentMatraNumberjson], this.currentMatraNumberjson);
      //}, 3750);
    }
    if (flag == "no") {
      if (!this.clicked) {
        document.getElementById("coverTop").style.display = "none";
        document.getElementById("coverBtm").style.display = "block";
      }
      else {
        document.getElementById("coverTop").style.display = "block";
        document.getElementById("coverBtm").style.display = "none";
      }
      this.appModel.notifyUserAction();
      this.confirmModalRef.nativeElement.classList = "modal";
    }
  }

  sendFeedback(id, flag: string, action?: string) {
    this.count = 0;
    if (!this.clicked) {
      document.getElementById("coverTop").style.display = "none";
      document.getElementById("coverBtm").style.display = "block";
    }
    else {
      document.getElementById("coverTop").style.display = "block";
      document.getElementById("coverBtm").style.display = "none";
    }
    this.appModel.notifyUserAction();
    //this.answerModalRef.nativeElement.classList = "displayPopup modal";
    $(".bodyContent").css("opacity", "1.0");
    if (id != undefined) {
      this.currentOptionNumber = id;
    }
    if (action == 'wrongAnswer') {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = true;
      this.showanspopUpheader_img = false;
      this.Matra.nativeElement.classList.value = "refQues refQuesPopUp";
      this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.top = parseFloat(this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.top) + 20 + "%";
      this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.zIndex = 1000;
      this.duplicateOption.nativeElement.children[this.currentOptionNumber].classList = "img-fluid duplicateOptionImg opacityCls"
      if (this.optionsAssets[this.currentOptionNumber].imgwrongfeedback_audio && this.optionsAssets[this.currentOptionNumber].imgwrongfeedback_audio.url) {
        this.feedbackPopupAudio.nativeElement.src = this.optionsAssets[this.currentOptionNumber].imgwrongfeedback_audio.location == "content" ? this.containgFolderPath + "/" + this.optionsAssets[this.currentOptionNumber].imgwrongfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.optionsAssets[this.currentOptionNumber].imgwrongfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
      }
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
      //$( "#navBlock" ).removeClass("disableNavBtn")
      this.appModel.enableNavBtn(false);
      this.controlHandler.isTab = true;
      this.appModel.handleController(this.controlHandler);
        setTimeout(() => {
          if (this.count == 0) {
            this.closeModal();
          }
          //this.resetAttempt(opt);
        }, 2000);
      }
    }
    if (action == "rightAnswer") {
      this.flag = true;
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      this.Matra.nativeElement.classList.value = "refQues refQuesPopUp";
      if (id != undefined) {
        this.attemptType = "";
        this.duplicateOption.nativeElement.children[id].style.top = parseFloat(this.duplicateOption.nativeElement.children[id].style.top) + 20 + "%";
        this.duplicateOption.nativeElement.children[id].style.zIndex = 1000;
        this.duplicateOption.nativeElement.children[id].classList = "img-fluid duplicateOptionImg opacityCls duplicateOptionGreen"
      } else {
        this.attemptType = "manual";
        this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.top = parseFloat(this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.top) + 20 + "%";
        this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.zIndex = 1000;
        this.duplicateOption.nativeElement.children[this.currentOptionNumber].classList = "img-fluid duplicateOptionImg opacityCls duplicateOptionGreen"
      }
      
      if (this.optionsAssets[this.currentOptionNumber].imgrightfeedback_audio && this.optionsAssets[this.currentOptionNumber].imgrightfeedback_audio.url) {
        this.feedbackPopupAudio.nativeElement.src = this.optionsAssets[this.currentOptionNumber].imgrightfeedback_audio.location == "content" ? this.containgFolderPath + "/" + this.optionsAssets[this.currentOptionNumber].imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.optionsAssets[this.currentOptionNumber].imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
      }
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        $( "#navBlock" ).removeClass("disableNavBtn")
        this.appModel.enableNavBtn(false);
        this.controlHandler.isTab = true;
        this.appModel.handleController(this.controlHandler);
        setTimeout(() => {
          if (this.count == 0) {
            this.closeModal();
            this.blinkOnLastQues();
          }
          this.appModel.moveNextQues();
          if(this.duplicateOption.nativeElement && this.duplicateOption.nativeElement.children[id]){
            this.duplicateOption.nativeElement.children[id].style.opacity = 0;
          }
          //console.log(this.attempt);
          //this.answerModalRef.nativeElement.classList = "modal";
          $(".bodyContent").css("opacity", "0.3");
          $(".instructionBar").css("opacity", "0.3");
          $(".bodyContent").addClass("disable_div");
          $(".instructionBase").addClass("disable_div");
        }, 2000);
      }
    }
    if (action == "showAnswer") {
      this.styleHeaderPopup = this.confirmAssets.style_header;
      this.styleBodyPopup = this.confirmAssets.style_body;
      this.flag = true;
      this.appModel.resetBlinkingTimer();
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = true;
      this.Matra.nativeElement.classList.value = "refQues refQuesPopUp";
      if (id != undefined) {
        this.attemptType = "";
        this.duplicateOption.nativeElement.children[id].style.top = parseFloat(this.duplicateOption.nativeElement.children[id].style.top) + 20 + "%";
        this.duplicateOption.nativeElement.children[id].style.zIndex = 1000;
        this.duplicateOption.nativeElement.children[id].classList = "img-fluid duplicateOptionImg opacityCls duplicateOptionGreen"
      } else {
        this.attemptType = "manual";
        this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.top = parseFloat(this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.top) + 20 + "%";
        this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.zIndex = 1000;
        this.duplicateOption.nativeElement.children[this.currentOptionNumber].classList = "img-fluid duplicateOptionImg opacityCls duplicateOptionGreen"
      }
      
      if (this.optionsAssets[this.currentOptionNumber].showAnswerfeedback_audio && this.optionsAssets[this.currentOptionNumber].showAnswerfeedback_audio.url) {
        this.feedbackPopupAudio.nativeElement.src = this.optionsAssets[this.currentOptionNumber].showAnswerfeedback_audio.location == "content" ? this.containgFolderPath + "/" + this.optionsAssets[this.currentOptionNumber].showAnswerfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.optionsAssets[this.currentOptionNumber].showAnswerfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
      }
      this.feedbackPopupAudio.nativeElement.play();
      this.feedbackPopupAudio.nativeElement.onended = () => {
        setTimeout(() => {
          if (this.count == 0) {
            this.closeModal();
            this.blinkOnLastQues();
          }
          this.appModel.moveNextQues();
          this.duplicateOption.nativeElement.children[id].style.opacity = 0;
          //console.log(this.attempt);
          //this.answerModalRef.nativeElement.classList = "modal";
          $(".bodyContent").css("opacity", "0.3");
          $(".instructionBar").css("opacity", "0.3");
          $(".bodyContent").addClass("disable_div");
          $(".instructionBase").addClass("disable_div");
        }, 2000);
      }
    }

    if (flag == "yes") {
      this.confirmModalRef.nativeElement.classList = "modal";
      this.answerModalRef.nativeElement.classList = "displayPopup modal";
    }
    if (flag == "no") {
      this.appModel.notifyUserAction();
      if (this.index != undefined) {
        //this.Matra.nativeElement.children[this.index].style.outline = '';
        //this.Matra.nativeElement.children[this.index].classList.value = "";
      }

      id.classList = "modal";
      if (this.flag) {
        $(".bodyContent").css("opacity", "0.3");
        $(".instructionBar").css("opacity", "0.3");
        $(".bodyContent").addClass("disable_div");
        $(".instructionBase").addClass("disable_div");
      }
    }
    if (action == "replay") {
      this.appModel.navShow = 2;
      this.confirmReplayRef.nativeElement.classList = "modal";
      this.answerModalRef.nativeElement.classList = "modal";
      this.replayVideo();
        }
  }

  resetAttempt(opt) {
    this.count = 1;
    this.optionsClickable.nativeElement.children[0].children[this.currentOptionNumber].children[1].style.opacity = 1;
    this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.opacity = 0;
    this.duplicateOption.nativeElement.children[this.currentOptionNumber].classList = "img-fluid duplicateOptionImg opacityCls duplicateOptionBlack";
    $(this.duplicateOption.nativeElement.children[this.currentOptionNumber]).animate({ left: "0%", top: "0%" }, 0);
    if (opt.position == "right") {
      this.refQuesCopy.splice(this.index + 1, 1)
      this.Matra.nativeElement.children[this.index + 1].remove();
    }
    else if (opt.position == "left") {
      this.Matra.nativeElement.children[this.index].remove();
      this.refQuesCopy.splice(this.index, 1)
    } else if (opt.position == "top" || opt.position == "bottom" || opt.position == "bottom_spcialCase") {
      this.refQuesCopy.splice(this.index, 1)
      this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.opacity = 0;
    }
  }

  resetwithoutAttempt(opt, rightMatraNumber) {
    this.count = 1;
    this.optionsClickable.nativeElement.children[0].children[rightMatraNumber].children[1].style.opacity = 1;
    this.duplicateOption.nativeElement.children[rightMatraNumber].style.opacity = 0;
    this.duplicateOption.nativeElement.children[this.currentOptionNumber].classList = "img-fluid duplicateOptionImg opacityCls duplicateOptionBlack";
    $(this.duplicateOption.nativeElement.children[rightMatraNumber]).animate({ left: "0%", top: "0%" }, 0);
    if (opt.position == "right") {
      this.Matra.nativeElement.children[this.currentOptionNumberjson].remove();
    }
    else if (opt.position == "left") {
      //$(this.duplicateOption.nativeElement.children[this.currentOptionNumber]).animate({ left: "0%", top: "0%" }, 0);
      this.Matra.nativeElement.children[this.currentOptionNumberjson-1].remove();
      //this.refQuesCopy.splice(rightMatraNumber, 1)
    } else if (opt.position == "top" || opt.position == "bottom" || opt.position == "bottom_spcialCase") {
      //this.refQuesCopy.splice(rightMatraNumber, 1)
      this.duplicateOption.nativeElement.children[rightMatraNumber].style.opacity = 0;
    }
  }

  closeModal() {
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    this.appModel.notifyUserAction();
    $('.speaker').removeClass('disable_div');
    this.optionsClickable.nativeElement.classList = "row mx-0"
    this.duplicateOption.nativeElement.children[this.currentMatraNumberjson].style.zIndex = 1000;
    this.duplicateOption.nativeElement.children[this.currentMatraNumberjson].style.top = parseFloat(this.duplicateOption.nativeElement.children[this.currentMatraNumberjson].style.top) - 20 + "%";
    this.Matra.nativeElement.classList.value = "refQues";
    this.answerModalRef.nativeElement.classList = "modal";
    //if (!this.flag) {
    //}
    if (this.flag) {
      this.blinkOnLastQues();
      this.resetwithoutAttempt(this.optionObj[this.currentMatraNumberjson], this.currentMatraNumberjson);
      $(".bodyContent").css("opacity", "0.3");
      $(".instructionBar").css("opacity", "0.3");
      $(".bodyContent").addClass("disable_div");
      $(".instructionBase").addClass("disable_div");
      this.appModel.enableReplayBtn(false);
    } else {
      this.clicked = false;
      this.appModel.wrongAttemptAnimation();
      document.getElementById("coverTop").style.display = "none";
      document.getElementById("coverBtm").style.display = "block";
      this.appModel.enableReplayBtn(true);
      this.appModel.handlePostVOActivity(false);

      $('.instructionBase').removeClass("disable_div");
      this.resetAttempt(this.optionObj[this.currentOptionNumber]);
    }
  }

  closeModalManually() {
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    this.appModel.notifyUserAction();
    this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.zIndex = 1000;
    this.duplicateOption.nativeElement.children[this.currentOptionNumber].classList = "img-fluid duplicateOptionImg opacityCls duplicateOptionBlack";
    this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.top = parseFloat(this.duplicateOption.nativeElement.children[this.currentOptionNumber].style.top) - 20 + "%";
    this.Matra.nativeElement.classList.value = "refQues";
    this.answerModalRef.nativeElement.classList = "modal";
    if (this.flag) {
      this.blinkOnLastQues();
      this.resetwithoutAttempt(this.optionObj[this.currentMatraNumberjson], this.currentMatraNumberjson);
      $(".bodyContent").css("opacity", "0.3");
      $(".instructionBar").css("opacity", "0.3");
      $(".bodyContent").addClass("disable_div");
      $(".instructionBase").addClass("disable_div");
    } else {
      this.resetAttempt(this.optionObj[this.currentOptionNumber]);
    }
  }


}

