import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'forbidden-page',
  templateUrl: './forbidden.page.html',
  styleUrls: ['./forbidden.page.scss'],
})
export class ForbiddenPage {
  constructor(private router: Router) {}

  login(){
    this.router.navigate(['login']);
}
}
