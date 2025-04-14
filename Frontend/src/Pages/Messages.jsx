import React, { useEffect, useState } from "react";
import { ToastContainer, Slide } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getMessages } from "../redux/slices/user/Messages.slice";
import Chat from "../Components/Chat";
import UserChat from "../Components/UserChat";

const Messages = () => {
  const dispatch = useDispatch();
  const [chatIndex, setChatIndex] = useState(-1);

  useEffect(() => {
    dispatch(getMessages({ token: localStorage.getItem("userToken") }));
  }, []);

  const messages = useSelector((state) => state.messages);

  return (
    <>
      <ToastContainer transition={Slide} />
      {messages.status == "loading" && (
        <div className="h-screen flex justify-center items-center bg-gray-100 bg-opacity-25">
          Loading...
        </div>
      )}
      {messages.status == "failed" && (
        <div className="h-screen flex justify-center items-center bg-gray-100 bg-opacity-25">
          Check Your Internet Connection !!
        </div>
      )}

      {messages.status == "succeeded" && (
        <>
          <div className=" h-screen w-full overflow-hidden flex">
            {messages.messages.messages.length > 0 ? (
              <div className=" h-full w-2/3 overflow-x-auto pb-3 border-r border-indigo-100">
                {messages.messages.messages.map((message, index) => (
                  <div
                    key={message.id}
                    onClick={async () => {
                      const res = await dispatch(
                        getMessages({
                          token: localStorage.getItem("userToken"),
                        })
                      );
                      setChatIndex(index);
                    }}
                  >
                    <Chat message={message} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full w-2/3 overflow-x-auto pb-3 flex justify-center items-center bg-gray-100 bg-opacity-25 border-r border-indigo-100">
                No Messages !!
              </div>
            )}
            <div className="w-screen">
              {messages.messages.messages.length > 0 && chatIndex !== -1 ? (
                <UserChat
                  chats={messages.messages.messages[chatIndex]}
                  username={messages.messages.username}
                  receiverId={messages.messages.messages[chatIndex].id}
                />
              ) : (
                <div className="h-screen flex justify-center items-center bg-gray-100 bg-opacity-25">
                  No Chats !!
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Messages;
