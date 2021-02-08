import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  color = '#2C97DF';

  swatches = [
    '#00BD9D',
    '#01A185',
    '#2C97DF',
    '#227FBB',
    '#20CE6D',
    '#17B05E',
    '#F0C504',
    '#F69D01',
    '#D65400',
    '#E94B36',
    '#C23825',
  ];

  isTrackball: boolean = false;
  isPerspective: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
