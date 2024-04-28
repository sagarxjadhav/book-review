import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MongodbApiService } from 'src/app/service/mongodb-api.service';

@Component({
  selector: 'app-review-edit',
  templateUrl: './review-edit.component.html',
  styleUrls: ['./review-edit.component.scss']
})
export class ReviewEditComponent implements OnInit{
  review_id: string | null = null;
  googleId: string | null = null;

  authors = "";
  description = "";
  googleLink = "";
  imageLink = "";
  title = "";

  shortDescription = true;
  submitted = false;
  reviewForm: FormGroup;

  constructor(
    public modalRef: MdbModalRef<ReviewEditComponent>,
    private _mongodbApiService: MongodbApiService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.getBookDetails();
    this.getReview();
    this.editForm();
  }

  editForm() {
    this.reviewForm = this.fb.group({
      googleId: ['', [Validators.required]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      review: ['', [Validators.required]]
    });
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

  onDescriptionSizeChange(): void {
    this.shortDescription = !this.shortDescription;
  }

  get myForm() {
    // Getter to access form control
    return this.reviewForm.controls;
  }

  getReview() {
    this._mongodbApiService.getReview(this.review_id).subscribe((data) => {
      this.reviewForm.setValue({
        googleId: data['googleId'],
        rating: data['rating'],
        review: data['review']
      });
    });
  }

  onSubmit() {
    console.log(this.reviewForm.value);

    this.submitted = true;
    if (!this.reviewForm.valid) {
      console.log("reviewForm failed");
      return false;
    } else {
      console.log("reviewForm success");
      return this._mongodbApiService.updateReview(this.review_id, this.reviewForm.value).subscribe({
        complete: () => {
          this._mongodbApiService.reviewsChanged.next(this.googleId);
          console.log('Review updated created!')
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }

}
