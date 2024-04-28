import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {
  @Input() query="";
  startIndex = 0;
  books:any;

  constructor() { }

  ngOnInit(): void {
    this.searchBooks();
  }

  async searchBooks() {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${this.query}&startIndex=${this.startIndex}&maxResults=5`
    );
    const data = await response.json();
    this.books = data.items;
  };

  onNext() {
    this.startIndex += 6;
    this.searchBooks();
  }

  onPrev() {
    this.startIndex -= 6;
    this.searchBooks();
  }
}
