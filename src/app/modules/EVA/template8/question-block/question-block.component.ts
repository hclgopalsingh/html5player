import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { QuestionBlockVO } from '../../../../model/eva/template8/questionblockVO';
import { Constants } from '../../../../model/eva/template8/constants';


@Component({
  selector: 'app-question-block',
  templateUrl: './question-block.component.html',
  styleUrls: ['./question-block.component.css']
})
export class QuestionBlockComponent implements OnInit {
  selectedOptionURL: String = "";
  selectedOptionBlinkURL: String = "";
  option: any;
  _data: QuestionBlockVO = new QuestionBlockVO();

  @Input() contentPath: string;

  get data(): QuestionBlockVO {
    return this._data;
  }

  @Input('data')
  set data(value: QuestionBlockVO) {
    this._data = value;

    this.updateView();
  }

  @Input() dataCorrectOption: any;

  @ViewChild('blinkingBlock') blinkingBlock: any;
  @ViewChild('selectedOptionBlock') selectedOptionBlock: any;
  @ViewChild('selectedOptionBlockBlink') selectedOptionBlockBlink: any;
  @ViewChild('questionBase') questionBase: any;
  @ViewChild('questionStatement') questionStatement: any;
  @Output() load = new EventEmitter();

  constructor() {

  }

  ngOnInit() {
    this.reset();
  }

  updateView(): void {
    if (this.data.bQuestionBlinking == false) {
      this.selectedOptionBlock.nativeElement.classList.add('hide');
      this.selectedOptionBlockBlink.nativeElement.classList.add('hide');
    }

    if (this.data.bSelectedOptionBlinking == false) {
      this.blinkingBlock.nativeElement.classList.add('hide');
    }
  }

  blinkingBox(value: boolean) {
    if (value) {
      this.blinkingBlock.nativeElement.classList.remove('hide');
      this.selectedOptionBlock.nativeElement.classList.add("hide");
      this.selectedOptionBlockBlink.nativeElement.classList.add("hide");
    } else {
      this.blinkingBlock.nativeElement.classList.add('hide');
      this.selectedOptionBlock.nativeElement.classList.remove("hide");
      this.selectedOptionBlockBlink.nativeElement.classList.remove("hide");
    }
  }

  optionBlinking(value: boolean) {
    this.selectedOptionBlock.nativeElement.classList.remove('hide');
    this.selectedOptionBlockBlink.nativeElement.classList.remove('hide');
  }

  selectedOption(option) {

    if (option) {
      switch (this.data.containerType) {
        case Constants.CONTAINER_MAIN_SCREEN:

          if (this.data.bSelectedOptionBlinking == true) {
            this.selectedOptionURL = this.contentPath + "/" + option.img_ques_block.url;
            this.selectedOptionBlinkURL = this.contentPath + "/" + option.img_ques_block_blink.url;

            this.selectedOptionBlock.nativeElement.classList.remove('hide');
            this.selectedOptionBlockBlink.nativeElement.classList.remove('hide');
          }
          break;

        case Constants.CONTAINER_FEEDBACK_POPUP:

          if (this.data.bSelectedOptionBlinking == true) {
            this.selectedOptionURL = this.contentPath + "/" + option.img_ques_block.url;
            this.selectedOptionBlinkURL = this.contentPath + "/" + option.img_ques_block_blink.url;

            this.selectedOptionBlock.nativeElement.classList.remove('hide');
            this.selectedOptionBlockBlink.nativeElement.classList.remove('hide');
          }
          break;

        case Constants.CONTAINER_SHOW_ANSWER_POPUP:
          this.selectedOptionURL = this.contentPath + "/" + option.img_ques_block.url;
          this.selectedOptionBlinkURL = this.contentPath + "/" + option.img_ques_block_blink.url;
          break;
      }

    } else {
      this.selectedOptionBlock.nativeElement.classList.remove('show');
      this.selectedOptionBlock.nativeElement.classList.add('hide');
    }
  }

  checkImgLoaded() {
    this.load.emit();
  }

  reset() {
    switch (this.data.containerType) {
      case Constants.CONTAINER_MAIN_SCREEN:
        if (this.data.bQuestionBlinking == false) {
          this.blinkingBox(false);
          this.blinkingBlock.nativeElement.classList.add('hide');
        } else {
          this.blinkingBox(true);
          this.blinkingBlock.nativeElement.classList.remove('hide');
        }

        this.selectedOption(null);
        break;

      case Constants.CONTAINER_FEEDBACK_POPUP:
        this.blinkingBox(false);
        this.selectedOptionBlockBlink.nativeElement.classList.add('right_wrong_popup');
        this.selectedOptionBlock.nativeElement.classList.add('right_wrong_popup');
        this.blinkingBlock.nativeElement.classList.add('right_wrong_popup');
        this.questionBase.nativeElement.classList.add('right_wrong_popup');
        this.questionStatement.nativeElement.classList.add('right_wrong_popup');
        break;

      case Constants.CONTAINER_SHOW_ANSWER_POPUP:
        this.selectedOptionBlockBlink.nativeElement.classList.add('right_wrong_popup');
        this.selectedOptionBlock.nativeElement.classList.add('right_wrong_popup');
        this.blinkingBlock.nativeElement.classList.add('right_wrong_popup');
        this.questionBase.nativeElement.classList.add('right_wrong_popup');
        this.questionStatement.nativeElement.classList.add('right_wrong_popup');
        this.blinkingBox(false);
        break;
    }

    if (this.data.bSelectedOptionBlinking == false) {
      debugger;
      this.selectedOptionBlock.nativeElement.classList.add('hide');
      this.selectedOptionBlockBlink.nativeElement.classList.add('hide');
    }

  }
}
