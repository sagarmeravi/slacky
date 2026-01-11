import React, { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import { useUser } from "@clerk/clerk-react";

const UsersList = ({ activeChannel, setActiveChannel }) => {
  const { client } = useChatContext();
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!client || !user?.id) return;

      setLoading(true);
      try {
        // Get all users from the app
        const response = await client.queryUsers(
          { id: { $ne: user.id } },
          { created_at: -1 }
        );
        setUsers(response.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [client, user?.id]);

  const handleStartDirectMessage = async (selectedUser) => {
    if (!client || !user?.id) return;

    try {
      const channel = client.channel("messaging", {
        members: [user.id, selectedUser.id],
      });

      await channel.create();
      setActiveChannel?.(channel);
    } catch (error) {
      console.error("Error creating direct message:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "10px", fontSize: "13px" }}>Loading users...</div>
    );
  }

  return (
    <div className="users-list">
      {users.length === 0 ? (
        <div style={{ padding: "10px", fontSize: "13px", color: "#666" }}>
          No users available
        </div>
      ) : (
        users.map((u) => (
          <div
            key={u.id}
            onClick={() => handleStartDirectMessage(u)}
            style={{
              padding: "10px 15px",
              cursor: "pointer",
              borderRadius: "8px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f0f0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {u.image && (
              <img
                src={u.image}
                alt={u.name}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <div>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                {u.name || u.id}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UsersList;
