import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

//model
import { ChatRoom, ChatRoomMessage, SignupUser, chatRoomwiseData, AllChatRoom } from 'src/app/model/interface/loginuser';

//service
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})

export class ChatService {

  /**
   * @chatroomPath for get path if chatroom
   * @currentuserId for pass current logged user id 
   * @db for inject angular fire database 
   * @ChatRoomlist for pass chatroom list 
   */
  private chatroomPath = '/chatRooms';
  currentuserId = JSON.parse(localStorage.getItem('currentuserId') ?? 'null');
  private db = inject(AngularFireDatabase);
  private toast = inject(ToastrService)
  ChatRoomlist: AngularFireList<AllChatRoom>
  constructor() {
    this.ChatRoomlist = this.db.list(this.chatroomPath)
  }

  /**
   * createChatRoom for create chatroom 
   * @param data for pass user data for create chatroom
   * @returns error if come during creation of chtatroom
   */
  createChatRoom(data: ChatRoom): Promise<void> {
    return this.db.list(this.chatroomPath)
      .push(data).then(() => {
        return Promise.resolve();
      })
      .catch((error) => {
        console.error(`Error message: ${error.message}`);
        this.toast.error(
          'An error occurred during Creating chatroom'
        );
        return Promise.reject(error);
      });
  }

  /**
   * getAllchatroom for get all chatroomdata
   * @returns chatroom list
   */
  getAllChatroom(): AngularFireList<AllChatRoom> {
    return this.ChatRoomlist
  }

  /**
   * isOldChat for check chat is old or not 
   * @param firstmemberid for pass firstmember id 
   * @param secondmemberid for pass second member id 
   * @returns get all chatroom data and than find chatroomdata if data is found than return data
   * else create chatroom and again check and find data and return data 
   */
  isOldChat(firstmemberid: string, secondmemberid: string): Observable<chatRoomwiseData> {
    const newChatRoom: ChatRoom = {
      members: { firstmemberid: this.currentuserId, secondmemberid: secondmemberid },
      messages: []
    };
    return this.getAllChatroom().snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))),
      map((data) => {
        const isOldChat = data.find((chatroomdata) => {
          return chatroomdata.members?.firstmemberid === firstmemberid && chatroomdata.members?.secondmemberid === secondmemberid ||
            chatroomdata.members?.firstmemberid === secondmemberid && chatroomdata.members?.secondmemberid === firstmemberid
        });
        if (isOldChat == undefined || isOldChat == null) {
          this.createChatRoom(newChatRoom)
            .then(() => {
              return this.isOldChat(this.currentuserId, secondmemberid)
            })
        }
        return isOldChat as chatRoomwiseData
      }),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  /**
   * send msg for send message 
   * @param msgdata for pass messasge data 
   * @param Chatid for pass current chatid
   * @returns error if come during send message
   */
  sendMsg(msgdata: ChatRoomMessage, Chatid: string): Promise<void> {
    return this.db.database.ref(`chatRooms/${Chatid}/messages`).push(msgdata)
      .then(() => {
        return Promise.resolve();
      })
      .catch((error) => {
        console.error(`Error message: ${error.message}`);
        this.toast.error('An error occurred during sending message');
        return Promise.reject(error);
      });
  }

  /**
   * currentUserProfile for return current logged user data
   * @param userId for pass logged user id
   * @returns logged user data
   */
  currentUserProfile(userId: string): Observable<SignupUser | null> {
    return this.db.object<SignupUser>(`/signupUsersList/${userId}`).valueChanges();
  }

  /**
  * updateUser for update userdata to the database
  * @param id for pass user that you wants to add 
  * @param data for pass updated data of user 
  * @returns promise if error than reject promise and handle error 
  */
  updateUserData(id: string, data: object): Promise<void> {
    return this.db.list('/signupUsersList').update(id, data)
      .then(() => {
        return Promise.resolve();
      })
      .catch((error) => {
        console.error(`Error message: ${error.message}`);
        this.toast.error(
          'An error occurred during Update user. Please try again later.'
        );
        return Promise.reject(error);
      });
  }
}
