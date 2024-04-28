import { Component } from '@angular/core';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent{
  query = "";
  startIndex = 0;
  books:any;

  async searchBooks() {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${this.query}&startIndex=${this.startIndex}&maxResults=4`
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
