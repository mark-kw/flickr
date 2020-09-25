import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-image',
  templateUrl: './info-image.component.html',
  styleUrls: ['./info-image.component.css']
})
export class InfoImageComponent implements OnInit {
  @Input() tab = {};
  @Input() tmp = {};
  @Input() display :boolean;
  desc : string = this.tab["description"];
  constructor() { }

  ngOnInit(): void {}



}
