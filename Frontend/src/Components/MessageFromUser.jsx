import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { deleteMessage } from "../redux/slices/user/Messages.slice";
import { useDispatch, useSelector } from "react-redux";

function MessageFromUser({ chat, username }) {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);

  return (
    <>
      <div className=" flex">
        <div className=" flex gap-2 p-2 shadow rounded-md bg-slate-100 mb-1">
        <button
            onClick={() => {
              dispatch(
                deleteMessage({
                  token: localStorage.getItem("userToken"),
                  username,
                  _id: chat._id,
                })
              );
              socket.emit("getDeleteMessageId", { messageId: chat._id });
            }}
            className=" text-red-500"
          >
            <FontAwesomeIcon icon={faDeleteLeft} />
          </button>
          <p className=" text-wrap overflow-auto">{chat.message}</p>
          <p className=" text-xs flex items-end text-nowrap">
            {chat.createdAt}
          </p>
          
        </div>
      </div>
    </>
  );
}

export default MessageFromUser;
