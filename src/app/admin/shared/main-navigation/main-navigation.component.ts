import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
})
export class MainNavigationComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
