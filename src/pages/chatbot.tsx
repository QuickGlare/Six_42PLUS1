import React, { useState, useEffect, useRef } from "react";
import { api } from "~/utils/api";
import LinearChart from "./LinearChart";

interface Message {
  id: number;
  text: string;
  objects: { display: string; identifier: string }[];
  isUser: boolean;
  isGraph: boolean;
}

function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome! I'm your personal stock assistant, how may I help you?",
      objects: [],
      isUser: false,
      isGraph: false,
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const [stateNumber, setStateNumber] = useState<number>(0);
  const { data, isLoading, refetch } = api.instruments.search.useQuery(
    { query: searchValue },
    {
      onSuccess: (d) => {
        if (d.length != 0) {
          setStateNumber(stateNumber + 1);
          sendMessage(
            (
              <div>
                <span>Which stocks do you wanna look up?</span>
                <br />
                <div className="grid grid-cols-3 mt-4">
                {d.map((object: any) => (
                  <button
                    onClick={() => handleAllStocksSelection([object.identifier])}
                    className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-outline ml-2 mb-1 mt-3"
                    key={object.identifier}
                  >
                    {object.display}
                  </button>
                ))}
                </div>
                <button
                  onClick={() =>
                    handleAllStocksSelection(
                      d.map<string>((object: any) => object.identifier)
                    )
                  }
                  className="btn btn-primary w-full mt-3"
                >Compare All</button>
              </div>
            ) as unknown as string,
            false,
            false
          );
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const handleAllStocksSelection = async (data: string[]) => {
    let id = data.join(", ");

    messages.pop()
    sendMessage("Which stocks do you wanna look up?", false, false)
    sendMessage(id, true, false);
    sendMessage(
      (
        <LinearChart query={data} from={"2023-01-01"} to={"2023-03-01"} />
      ) as unknown as string,
      false,
      true
    );
    sendMessage("Can I help you with something else?", false, false)
    setStateNumber(0)
  };

  const sendMessage = (text: string, user: boolean, graph: boolean) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: text,
      objects: [],
      isUser: user,
      isGraph: graph,
    };
    messages.push(newMessage);
    setMessages(messages);
  };

  const handleSubmit = async () => {
    if (inputRef.current && inputRef.current.value) {
      setSearchValue(inputRef.current.value);
      sendMessage(inputRef.current.value as string, true, false);
      inputRef.current.value = "";
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.which == 13) {
      handleSubmit()
    }
  }
  return (
    <div className="h-full">
      {messages.map((message) => (
        <div
          className={
            message.isGraph
              ? ""
              : message.isUser
              ? "chat chat-end"
              : "chat chat-start"
          }
          key={message.id}
        >
          <div className="chat-image avatar online">
            <div className="w-10 rounded-full">
              <img src={message.isUser ? "/user.png" : "/bot.jpg"} />
            </div>
          </div>

          <div className={!message.isGraph ? "chat-bubble" : ""}>
            {message.text}
          </div>
        </div>
      ))}
      {isLoading ? <div className={"chat chat-start"}>
          <div className="chat-image avatar online">
            <div className="w-10 rounded-full">
              <img src={"/bot.jpg"} />
            </div>
          </div>

          <div className={"chat-bubble"}>
            <div className="dot-pulse mt-2"></div>
          </div>
        </div> 
      : ""}
      <div className="form-control mt-4 align-bottom">
        <div className="justify-left input-group flex">
          <input
            type="text"
            placeholder="Message"
            ref={inputRef}
            className="input-bordered input w-full"
            disabled={stateNumber != 0}
            onKeyDown={handleKeyPress}
          />
          <button className="btn-square btn" onClick={handleSubmit}>
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 4L3 11L10 14M20 4L13 21L10 14M20 4L10 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
