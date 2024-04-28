import { Component, Input, OnInit } from '@angular/core';
import { ReviewCreateComponent } from '../../review-create/review-create.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MongodbApiService } from 'src/app/service/mongodb-api.service';
import { ReviewEditComponent } from '../../review-edit/review-edit.component';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit {
  modalRef: MdbModalRef<ReviewCreateComponent> | null = null;

  @Input() googleId: string;
  @Input() rating?: string;
  @Input() review?: string;
  @Input() review_id?: string;

  authors = "";
  description = "";
  googleLink = "";
  imageLink = "";
  title = "";

  constructor(
    private modalService: MdbModalService,
    private _mongodbApiService:MongodbApiService
    ) {}

  ngOnInit() {
    this.getBookDetails();
  }

  async getBookDetails() {
    let thumbnailLink = "";

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${this.googleId}`
    );
    const data = await response.json();
    this.authors = data.volumeInfo.authors;
    this.description = (data.volumeInfo.description);
    this.googleLink = data.volumeInfo.canonicalVolumeLink;
    this.title = data.volumeInfo.title;

    thumbnailLink = data.volumeInfo.imageLinks;
    if(thumbnailLink) {
      this.imageLink = data.volumeInfo.imageLinks.smallThumbnail;
    } else {
      this.imageLink = "https://books.google.com/googlebooks/images/no_cover_thumb.gif";
    }
  }

  public setStyle(): any {
    //linear-gradient( #78e7b540, rgba(0, 0, 0, 0 ));
    let styles = {
      'background': `linear-gradient( ${this.generateRandomColor()}, rgba(0, 0, 0, 0 ))`
    };
    return styles;
  }

  generateRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}40`;
  }

  openReviewCreateModal() {
    this.modalRef = this.modalService.open(ReviewCreateComponent, {
      data: {
        googleId: this.googleId,
      }
    });
  }

  openReviewEditModal() {
    this.modalRef = this.modalService.open(ReviewEditComponent, {
      data: {
        googleId: this.googleId,
        review_id: this.review_id
      }
    });
  }

  onDelete() {
    this._mongodbApiService.deleteReview(this.review_id).subscribe();
    this._mongodbApiService.reviewsChanged.next(this.googleId);
  }
}
