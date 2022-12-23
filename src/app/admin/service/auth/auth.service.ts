import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../../model/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  private apiURL: String = environment.apiURL;
  private userToken: string = '';

  constructor(private router: Router, private http: HttpClient) {
    const userData = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null;
    this.userSubject = new BehaviorSubject<User | null>(userData);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value || null;
  }

  /**
   * Close session
   */
  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/admin/login']);
  }

  /**
   * Login user
   * @param {String} userName
   * @param {String} password
   */
  loginUser(userName: string, password: String) {
    //Set data
    let authData = {
      user: userName,
      password,
    };

    let url = this.apiURL + 'admin/login';
    return this.http.post<User>(url, authData).pipe(
      map((user) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      })
    );
  }

  /**
   * Save Auth token
   * Save token expire date
   * @param {String} authToken
   */
  saveToken(authToken: any): void {
    //save token
    this.userToken = authToken['authToken'].toString();
    localStorage.setItem('authToken', this.userToken);

    //Save token expirate date
    let date = new Date();
    date.setSeconds(3600);
    let expireDate = date.getTime().toString();
    localStorage.setItem('expire', expireDate);
  }
}
