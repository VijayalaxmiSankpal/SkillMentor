import React from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

function ChatContainer(props) {
  const messages = props.messages;
  const isLoading = props.isLoading;

  return (
    <div className="space-y-4">
      {messages.map(function (message) {
        return (
          <ChatMessage
            key={message.id}
            message={message}
          />
        );
      })}
      {isLoading && <TypingIndicator />}
    </div>
  );
}

export default ChatContainer;