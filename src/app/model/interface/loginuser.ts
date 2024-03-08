export class Loginuser {
  email!: string;
  password!: string;
}
export interface signupUsersList {
  email: string;
  name: string
  password: string;
  
}
export class SignupUser {
  email!: string;
  name!: string
  password!: string;
  profile? : string
}
export interface ChatRoomMessage {
  key?: string;
  message: string;
  sender: string;
  timestamp: number;
}
export interface ChatRoom {
  members: {
    firstmemberid: string;
    secondmemberid: string;
  },
  messages: ChatRoomMessage[]
}
export interface Alluser {
  email: string;
  key: string;
  name: string;
  password: string;
}
export interface AllChatRoom {
  ChatroomId: string,
  members: {
    firstmemberid: string;
    secondmemberid: string;
  }
  messages: ChatRoomMessage[]
}
export class user {
  email!: string
  firstname!: string
  key!: string
  lastname!: string
  password!: string
}


export interface chatRoomwiseData {
  ChatroomId?: string;
  members?: {
      firstmemberid: string;
      secondmemberid: string;
  };
  messages?: ChatRoomMessage[];
  key: string | null;
} 











