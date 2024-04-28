import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MongodbApiService } from 'src/app/service/mongodb-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-create',
  templateUrl: './review-create.component.html',
  styleUrls: ['./review-create.component.scss']
})
export class ReviewCreateComponent implements OnInit{
  googleId: string | null = null;;
  authors = "";
  description = "";
  googleLink = "";
  imageLink = "";
  title = "";

  shortDescription = true;
  reviewForm: FormGroup;

  constructor(
    public modalRef: MdbModalRef<ReviewCreateComponent>,
    private _mongodbApiService: MongodbApiService,
    public fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.getBookDetails();
    this.mainForm();
    this.reviewForm.patchValue({
      googleId: this.googleId
    });
  }

  mainForm() {
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

  onSubmit() {
    // Set GoogleId
    console.log(this.reviewForm.value);

    if (!this.reviewForm.valid) {
      console.log("reviewForm failed");
      return false;
    } else {
      console.log("reviewForm success");
      return this._mongodbApiService.createReview(this.reviewForm.value).subscribe({
        complete: () => {
          this._mongodbApiService.reviewsChanged.next(this.googleId);
          console.log('Review successfully created!');
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }
}

