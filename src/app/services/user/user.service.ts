import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';
import { user } from 'src/app/model/interface/loginuser';

//service
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  /**
   * @dbPath for database path
   * @toast for inject toastr service for pass toaster message
   * @db for inject angular firedatabase
   * @Userlist for bind model to angular firelistuser
   */
  private dbPath = '/userlist';
  private toast = inject(ToastrService);
  private db = inject(AngularFireDatabase)
  Userlist: AngularFireList<user>
  constructor() {
    this.Userlist = this.db.list(this.dbPath);
  }

  /**
   * addUser for add user to the database
   * @param data for pass userdata
   * @returns promise if error than reject promise and handle error 
   */
  addUser(data: object): Promise<void> {
    return this.db.list('/userlist').push(data)
      .then(() => {
        return Promise.resolve();
      })
      .catch((error) => {
        console.error(`Error message: ${error.message}`);
        this.toast.error(
          'An error occurred during adding user. Please try again later.'
        );
        return Promise.reject(error);
      });
  }

  /**
   * updateUser for update userdata to the database
   * @param id for pass user that you wants to add 
   * @param data for pass updated data of user 
   * @returns promise if error than reject promise and handle error 
   */
  updateUser(id: string, data: object): Promise<void> {
    return this.db.list('/userlist').update(id, data)
      .then(() => {
        return Promise.resolve();
      })
      .catch((error) => {
        console.error(`Error message: ${error.message}`);
        this.toast.error('An error occurred during Update user. Please try again later.');
        return Promise.reject(error);
      });
  }

  /**
   * deleteUser for delete user from database 
   * @param id for pass user id that user you want to delete
   * @returns promise if error than reject promise and handle error 
   */
  deleteUser(id: string): Promise<void> {
    return this.db.list('/userlist').remove(id)
      .then(() => {
        return Promise.resolve();
      })
      .catch((error) => {
        console.error(`Error message: ${error.message}`);
        this.toast.error(
          'An error occurred during Delete user. Please try again later.'
        );
        return Promise.reject(error);
      });
  }

  /**
   * allUser for return all user from database
   * @returns all user as observabe user
   */
  allUser(): Observable<user[]> {
    return this.Userlist.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() } as user))
      )
    )
  }
}
