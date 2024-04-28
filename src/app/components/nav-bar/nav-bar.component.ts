import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  @Output() librarySectionClick = new EventEmitter();
  onBookListClick(librarySection: string) {
    this.librarySectionClick.emit(librarySection);
  }
}
