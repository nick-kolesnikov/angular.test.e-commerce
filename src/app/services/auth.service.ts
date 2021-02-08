import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Constants } from '../constants';
import { User } from '../interfaces/user.interface';

const lsKey = `${Constants.lsPrefix}.user`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    const name = localStorage.getItem(lsKey);
    if (name) {
      this.currentUser.next({ name });
    }
  }

  login(name: string): Observable<boolean> {
    this.currentUser.next({ name });
    localStorage.setItem(lsKey, name);
    return from([true]).pipe(delay(200));
  }

  logout(): void {
    this.currentUser.next(null);
    localStorage.removeItem(lsKey);
  }
}
