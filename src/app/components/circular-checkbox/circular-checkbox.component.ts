import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-circular-checkbox',
  templateUrl: './circular-checkbox.component.html',
  styleUrls: ['./circular-checkbox.component.scss'],
})
export class CircularCheckboxComponent {
  @Input() checked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  constructor() {}

  toggleChecked() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
