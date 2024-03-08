import { Component, ElementRef } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { catchError, map, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';


//models
import { Alluser, ChatRoomMessage } from 'src/app/model/interface/loginuser';

//services
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/Authentication/authentication.service';
import { ChatService } from 'src/app/services/chat/chat.service';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NavbarComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ]
})

export class HomeComponent {

  /**
   * @userservice for inject userauthenticationservice
   * @myControl for formcontrol
   * @signupUsersList for array of user
   * @currentuserId for getting logged userid
   * @selectedUser for return selected user
   * @chatservice  for chatservice 
   * @toast for show toastr message
   * @chatRoomKey for hold the current chatroomkey 
   * @dialog for inject service dialog
   * @msglist for list of messages
   * @sendbutton for manage button  state 
   * @elementref for pass refrence of dom element 
   */
  private userservice = inject(AuthenticationService)
  public sendbutton: boolean = true
  private chatRoomKey: string = ''
  private toast = inject(ToastrService)
  private chatservice = inject(ChatService)
  private elementref = inject(ElementRef)
  myControl = new FormControl('');
  signupUsersList: Alluser[] = [];
  msglist: ChatRoomMessage[] = []
  currentuserId = JSON.parse(localStorage.getItem('currentuserId') ?? 'null');
  selectedUser: string = ''
  msgform = new FormGroup(
    {
      msgControl: new FormControl('', Validators.required)
    }
  )

  /**
* @get controls for get the controls of the form for validation
*/
  get controls()  : { [key: string]: AbstractControl } {
    return this.msgform.controls;
  }

  /**
   * ngOnInit for get all registered all userlist from service
   */
  ngOnInit() :void {
    this.userservice
      .getAllUser().snapshotChanges().pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() } as Alluser))))
      .pipe(tap((data) => {
        this.signupUsersList = data.filter(
          (user) => user.key !== this.currentuserId
        )
      }),
        catchError((error) => {
          console.error('Error:', error);
          return throwError(error);
        })
      ).subscribe();
  }

  /**
   * selecteduser for check and get message list
   * @param id for pass selected user that is message receiver
   * this method call isold chat method and get msg data and map it if data is found 
   */
  async selecteduser(id: string) :Promise<void>{
    this.selectedUser = this.myControl.value ?? '';
    await this.chatservice.isOldChat(this.currentuserId, id).subscribe(data => {
      this.msglist = data?.messages ? Object.entries(data?.messages!).map(([key, messageObject]) => ({
        key,
        ...messageObject
      })) : []
      this.chatRoomKey = data?.key!
    })
  }

  /**
   * sendMsg for send message to user
   * @if user is not seleted than return and pass error for select user 
   * @else get message from control and pass message to the model 
   * and call send msg method from service  and pass message and reset form 
   */
  sendMsg(): void {
    const user = this.myControl.value ?? '';
    if (user == '') {
      this.toast.error('Please select user for send message')
      return
    }
    else {
      let msg = this.msgform.get('msgControl')?.value;
      const newMessage: ChatRoomMessage = {
        message: msg!,
        sender: this.currentuserId,
        timestamp: Date.now()
      };
      this.chatservice.sendMsg(newMessage, this.chatRoomKey).then(() => {
        this.msgform.reset()
        this.scrollMessagesToBottom()
      })
    }
  }

  /**
   * @checkInput for check input is valid or not 
   * if msg is null than return 
   * else return false 
   */
  checkInput(): void {
    let msg = this.msgform.get('msgControl')?.value;
    if (msg == '' || msg == null) {
      this.sendbutton = true
    }
    else {
      this.sendbutton = false
    }
  }

  /**
   * scrollMessagesToBottom for scroll when new message is send from user 
   */
    scrollMessagesToBottom(): void {
    try {
      const messagesDiv = this.elementref.nativeElement.querySelector('.messages');
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}


