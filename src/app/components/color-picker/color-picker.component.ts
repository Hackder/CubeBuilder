import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
  @Input() color: string = '#fff';
  @Output() colorChange = new EventEmitter<string>();

  pickerVisible = false;

  get isBlack(): boolean {
    const col = this.color.slice(1);
    const r = parseInt(col.slice(0, 2), 16);
    const g = parseInt(col.slice(2, 4), 16);
    const b = parseInt(col.slice(4, 6), 16);

    const brightness = r * 0.299 + g * 0.587 + b * 0.144;

    return brightness > 186;
  }

  change(event) {
    this.color = event.color.hex;
    this.colorChange.emit(this.color);
  }

  constructor() {}
}
