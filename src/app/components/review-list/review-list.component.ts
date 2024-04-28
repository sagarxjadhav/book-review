import { Component } from '@angular/core';
import { MongodbApiService } from 'src/app/service/mongodb-api.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent{
  reviews:any = [];
  reviewsChanged: string;

  constructor(private _mongodbApiService:MongodbApiService) {
    this._mongodbApiService.reviewsChanged.subscribe(value => {
      this.reviewsChanged = value ;
      this.readReviews();
    });
  }

  readReviews(){
    this._mongodbApiService.getReviews().subscribe((data) => {
      this.reviews = data;
    })
  }
}
