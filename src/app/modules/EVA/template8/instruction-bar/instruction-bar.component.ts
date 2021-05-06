import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-instruction-bar',
  templateUrl: './instruction-bar.component.html',
  styleUrls: ['./instruction-bar.component.scss']
})
export class InstructionBarComponent implements OnInit {
  @Input() assetsPath: string;
  @Input() contentPath: string;
  @Input() data:any;
  @Input() instructiontext:string="";
  @Output() loadImage = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  checkImgLoaded() {
    this.loadImage.emit();
  }

}
