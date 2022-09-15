import React, { useRef, useState } from "react";
import { auth, firebase, firestore } from '../../firebase'
import { useCollectionData } from "react-firebase-hooks/firestore";
import SignOut from '../SignOut/SignOut'
import ChatMessage from '../ChatMessage/ChatMessage'
import Sidebar from "../Sidebar/Sidebar";

import './ChatRoom.css';



function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* {SignOut()} */}
      <main class="chat">
        <Sidebar/>
        <div> 
  
          {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
        </div>
       
      </main>
      <form onSubmit={sendMessage}>
        <div class='message-input'>
          <input    
        class='input-message'
        placeholder="ketchup message..."
        value={formValue}
        onChange={(event) => setFormValue(event.target.value)}/>   
         <button type="submit" class="submit-button">Submit</button>    
        </div>
       
      </form>
    </>
  );
}
export default ChatRoom;