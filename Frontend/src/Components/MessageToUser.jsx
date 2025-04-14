import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage } from "../redux/slices/user/Messages.slice";

function MessageToUser({ chat, username }) {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);

  return (
    <>
      <div className=" flex justify-end">
        <div className=" flex gap-2 p-2 shadow rounded-md bg-amber-100 mb-1">
          <p className=" break-words max-w-96 ">{chat.message}</p>
          <p className=" text-xs flex items-end text-nowrap">
            {chat.createdAt}
          </p>
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
        </div>
      </div>
    </>
  );
}

export default MessageToUser;
