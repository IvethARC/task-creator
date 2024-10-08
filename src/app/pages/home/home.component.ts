import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor( private router: Router ) {}

  openFormNewTask() {
    this.router.navigate(['/new-task'])
  }
  openListTask() {
    this.router.navigate(['/list-task'])
  }
}
