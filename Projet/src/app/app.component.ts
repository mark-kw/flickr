import { Component, OnInit } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { FlickrService } from './services/flickr.service';
import { ɵHttpInterceptingHandler } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tab_images = [];
  val1: any;
  val2: any;
  val3: any;
  keyword: string;
  cpt :any;
  display : boolean = false;
  filter : boolean = false;
  tab_filter: any;

  constructor(private flickrService: FlickrService){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  search(value: any, cpt:any){
    this.tab_filter = [];
    if(this.filter){
      this.tab_filter = [{name: "val1", value: new Date(this.val1).getTime()/1000},
      {name: "val2", value: new Date(this.val2).getTime()/1000},
      {name: "val3", value: this.val3}
      ];
    }
    if (value && this.display == false)
      this.display = !this.display;
    this.cpt = cpt;
    if (this.cpt <= 0) this.cpt = 1;
    this.keyword = value.toLowerCase();
    if (this.keyword && this.keyword.length > 0){
      this.flickrService.search(this.keyword,this.cpt,this.tab_filter)
      .toPromise()
      .then(result => {
        this.tab_images = result;
      });
    }
  }

  show(){
    this.filter  = !this.filter;
  }

  onchange(even){
    this.val1 = even;
  }
  onchange2(even){
    this.val2 = even;
  }
  onchange3(even){
    if (even == "outdoors")
      this.val3 = 2;
    else if (even == "indoors")
      this.val3 = 1;
    else
      this.val3 = 0;
  }
}

