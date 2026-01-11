import React from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";

const CustomChannelHeader = () => {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  if (!channel) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: "15px 20px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          # {channel.data?.name || "Channel"}
        </h2>
        {channel.data?.topic && (
          <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#666" }}>
            {channel.data.topic}
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomChannelHeader;
