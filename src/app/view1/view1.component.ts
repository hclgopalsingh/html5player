import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view1',
  templateUrl: './view1.component.html',
  styleUrls: ['./view1.component.scss']
})
export class View1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
    console.log("shiksha-player view1 component ngOnInit");
  }

}
