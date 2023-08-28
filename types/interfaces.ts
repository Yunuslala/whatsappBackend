
export interface User {
    id: number;
    name: string;
    email: string;
    picture: string;
    About: string;
  }
  
  export interface Relation {
    id: number;
    reciverId: number;
    senderId: number;
    conversations: Conversation[] | JSON;
  }
  
  export interface Conversation {
    text: string;
    textId: number;
    date: string;
    type: string;
    time: string;
  }
  