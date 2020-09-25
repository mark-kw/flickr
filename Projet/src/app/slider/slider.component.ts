import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlickrService } from '../services/flickr.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  @Input() images = [];
  @Input() loca = [];
  @Input() display:boolean;
  @Output() myEvent = new EventEmitter();

  display_info:boolean = false;

  infoImage = {};
  constructor(private flickrService: FlickrService, private AppComponent: AppComponent) { }

  ngOnInit(): void {
  }

  getInfo(id: string){
    if (this.images.length > 0 && this.display_info == false)
      this.display_info = !this.display_info;
    if (id.length > 0){
      this.flickrService.getInfo(id)
      .toPromise()
      .then(result => {
        this.infoImage = result;
        this.loca = result["localisation"];
        this.flickrService.getSize(id,this.infoImage)
        .toPromise()
        .then(res => {
          this.infoImage["dimension"] = res["dimension"];
        })
        console.log(this.loca);
        console.log(this.infoImage);
      });
    }
  }
  nextPage(){
    this.AppComponent.search(this.AppComponent.keyword,++this.AppComponent.cpt);
  }
  prevPage(){
    this.AppComponent.search(this.AppComponent.keyword,--this.AppComponent.cpt);
  }
}
