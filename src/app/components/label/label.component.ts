import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class LabelComponent {
  @Input() color: string = '#F73131';
  text: string = 'Label placeholder text.';
  position: { x: number; y: number } = { x: 0, y: 0 };
  opacity: number = 0;

  constructor() {}

  public show(
    x: number,
    y: number,
    text: string,
    color?: string,
    duration?: number
  ) {
    if (color) this.color = color;

    this.text = text;
    this.position = {
      x,
      y,
    };

    this.opacity = 1;
    setTimeout(() => {
      this.opacity = 0;
    }, duration || 1000);
  }
}
