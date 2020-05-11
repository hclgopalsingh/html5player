import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-question-block',
  templateUrl: './question-block.component.html',
  styleUrls: ['./question-block.component.css']
})
export class QuestionBlockComponent implements OnInit {
  @Input() contentPath: string;
  @Input() containerType: string;
  @Input() data: any;
  @Input() dataCorrectOption: any;
  @ViewChild('blinkingBlock') blinkingBlock: any;
  @ViewChild('selectedOptionBlock') selectedOptionBlock: any;

  selectedOptionURL: String = "";
  selectedOptionBlinkURL: String = "";
  option: any;

  constructor() {

  }

  ngOnInit() {
    this.reset();
  }

  blinking(bool: boolean) {
    if (bool) {
      this.blinkingBlock.nativeElement.classList.add('show');
      this.blinkingBlock.nativeElement.classList.remove('hide');
    } else {
      this.blinkingBlock.nativeElement.classList.add('hide');
      this.blinkingBlock.nativeElement.classList.remove('show');
    }
  }

  selectedOption(option) {
    if (option) {
      this.selectedOptionBlock.nativeElement.classList.remove('hide');
      this.selectedOptionBlock.nativeElement.classList.add('show');   
      
      switch (this.containerType) {
        case "main_screen":
          this.selectedOptionURL = this.contentPath + "/" + option.img_ques_block.url;
          //this.selectedOptionBlinkURL = this.contentPath + "/" + option.img_ques_block_blink.url;
          break;
  
        case "right_wrong_popup":
          this.selectedOptionURL = this.contentPath + "/" + option.img_ques_block.url;
          this.selectedOptionBlinkURL = this.contentPath + "/" + option.img_ques_block_blink.url;
          break;
  
        case "show_answer_popup":
          this.selectedOptionURL = this.contentPath + "/" + option.img_ques_block.url;
          this.selectedOptionBlinkURL = this.contentPath + "/" + option.img_ques_block_blink.url;
          break;
      }

    } else {
      this.selectedOptionBlock.nativeElement.classList.remove('show');
      this.selectedOptionBlock.nativeElement.classList.add('hide');
    }
  }

  reset() {
    switch (this.containerType) {
      case "main_screen":
        this.blinking(true);
        this.selectedOption(null);
        break;

      case "right_wrong_popup":
        this.blinking(false);
        //this.selectedOption(this.dataCorrectOption);
        break;

      case "show_answer_popup":
        this.blinking(false);
        this.selectedOption(this.dataCorrectOption);
        break;
    }
  }
}
