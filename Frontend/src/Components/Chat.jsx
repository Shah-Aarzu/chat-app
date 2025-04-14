import emptyProfile from "../utils/Image/empty-profile.avif";

function Chat({ message }) {
  return (
    <>
      <div className=" flex px-3 pt-3 gap-3 hover:cursor-pointer hover:bg-gray-100">
        <div>
          <img
            src={message.profile ? message.profile : emptyProfile}
            alt="image"
            className=" bg-orange-500 w-14 h-12 rounded-full"
          />
        </div>
        <div className=" border-b-2 border-b-gray-100 w-full pb-3">
          <div className=" flex justify-between">
            <p>{message.fullname}</p>
            <p className=" text-sm">
              {message.chats.length > 0
                ? message.chats[message.chats.length - 1].createdAt
                : ""}
            </p>
          </div>
          <div>
            <p className=" text-sm">
              {message.chats.length > 0
                ? message.chats[message.chats.length - 1].message
                : ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
