import React, { useRef, useState } from "react";
import { auth, firebase, firestore } from "../../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { AiFillDownCircle } from "react-icons/ai";

import ChatMessage from "../ChatMessage/ChatMessage";
import Sidebar from "../Sidebar/Sidebar";
import Button from "../Button/Button";

import "./ChatRoom.css";

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(1000);

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const scrollToBottom = () => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL, displayName } = auth.currentUser;
    try {
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
        displayName,
      });
    } catch (e) {
      alert(e)
    }
    setFormValue("");
    scrollToBottom();
  };

  return (
    <main className="chatroom">
      <main className="chat">
        <Sidebar />
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <div ref={dummy}></div>
      </main>
      <button className="icon fixed bottom-0 right-0 z-20 mr-32 mb-5 animate-bounce" onClick={scrollToBottom}>
          <AiFillDownCircle size={28} />
        </button>

        <form
          className="fixed bottom-0 left-20 ml-5 mb-0 text-2xl pb-5 bg-white w-screen"
          onSubmit={sendMessage}
        >
          <section className="flex content-center justify-center">
            <input
              className="input-message"
              placeholder="ketchup message..."
              value={formValue}
              onChange={(event) => setFormValue(event.target.value)}
            />
            <Button message={"Submit"} type="submit" />
          </section>
        </form>
    </main>
  );
}
export default ChatRoom;
