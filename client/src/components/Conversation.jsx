import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useCurrentUserContext } from "../contexts/CurrentUserContext";
import { useSelectedUserContext } from "../contexts/SelectedUserContext";
import SentMessage from "./SentMessage";
import ReceivedMessage from "./ReceivedMessage";
import ConversationTopBar from "./ConversationTopBar";
import SendMessageForm from "./SendMessageForm";
import WelcomeUser from "./WelcomeUser";
import { useSocketContext } from "../contexts/SocketContext";

const Conversation = () => {
  const { selectedUser, setSelectedUser } = useSelectedUserContext();
  const { currentUser, setCurrentUser } = useCurrentUserContext();
  const { receiverMessage } = useSocketContext();
  const [conversation, setConversation] = useState([]);
  const lastMessageRef = useRef(null);

  const handleSend = async (e) => {
    const message = e.target.message.value;
    try {
      const response = await axios.post(
        `/api/conversation/${selectedUser._id}`,
        { message: message }
      );
      if (response.status === 201) {
        // console.log(response.data);
        setConversation([...conversation, response.data]);
      }
    } catch (error) {
      // console.error(error);
      toast.error(error.message);
      localStorage.removeItem("chat-selected-user");
      localStorage.removeItem("chat-user");
      setCurrentUser(null);
      setSelectedUser(null);
    }
  };
  useEffect(() => {
    if (receiverMessage) setConversation([...conversation, receiverMessage]);
    // console.log(receiverMessage);
  }, [receiverMessage]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `/api/conversation/${selectedUser._id}`
        );
        if (response.status === 200) {
          setConversation(response.data.messages);
          // console.log("convo : ", response.data.messages);
        }
      } catch (error) {
        // console.error(error);
        toast.error(error.message);
        localStorage.removeItem("chat-selected-user");
        localStorage.removeItem("chat-user");
        setCurrentUser(null);
        setSelectedUser(null);
      }
    };
    // lastMessageRef?.current?.scrollIntoView({behavior:"smooth"});
    if (selectedUser) getConversation();
  }, [selectedUser]);

  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <>
      {selectedUser ? (
        <div className="w-[20rem] flex flex-col">
          <ConversationTopBar />
          <div className="h-full overflow-auto">
            {conversation.map((message, index) =>
              currentUser._id === message.sender ? (
                <SentMessage
                  message={message}
                  key={`${message._id}-${index}`}
                />
              ) : (
                <ReceivedMessage
                  message={message}
                  key={`${message._id}-${index}`}
                />
              )
            )}
            <div ref={lastMessageRef} />
          </div>
          <SendMessageForm handleSend={handleSend} />
        </div>
      ) : (
        <WelcomeUser />
      )}
    </>
  );
};

export default Conversation;
