import { useEffect, useState } from "react";
import { Users } from "../models/Users";
import { useUser } from "../hooks/useUser";
import { Star } from "lucide-react";

const subscriptionPlans: Record<string, { name: string }> = {
  "68380950c659b1a48ce18927": { name: "Sock Emergency" },
  "68380992c659b1a48ce18928": { name: "Sock & Roll" },
  "683809b3c659b1a48ce18929": { name: "Sock Royalty" },
};

export const Admin = () => {
  const { fetchAllUsersHandler } = useUser();
  const [subscribers, setSubscribers] = useState<Users[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchAllUsersHandler();
        const filtered = data.filter(
          (user: Users) => user.subscription_id?._id?.trim()
        );
        setSubscribers(filtered);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    getUsers();
  }, []);

  const grouped = groupSubscribers(subscribers);

  const getStarColor = (level?: string) => {
    switch (level) {
      case "Sock Emergency":
        return "#CD7F32";
      case "Sock & Roll":
        return "#C0C0C0";
      case "Sock Royalty":
        return "#FFD700";
      default:
        return "#cccccc";
    }
  };

  return (
    <>
      <h1>Total Active Subscribers: {subscribers.length}</h1>

      {Object.entries(grouped).map(([id, users]) => {
        const plan = subscriptionPlans[id] || { name: "Unknown Plan" };
        const levelName = plan.name;

        return (
          <div key={id} style={{ marginBottom: "40px" }}>
            <h2>
              <Star fill={getStarColor(levelName)} /> {levelName}
            </h2>
              {users.map((user) => (
                <p className="centered-p-element" key={user.email}>
                  {user.firstname} {user.lastname} ({user.email})
                </p>
              ))}
          </div>
        );
      })}
    </>
  );
};

const groupSubscribers = (users: Users[]) => {
  const groups: Record<string, Users[]> = {};
  users.forEach((user) => {
    const id = user.subscription_id?._id!;
    if (!groups[id]) groups[id] = [];
    groups[id].push(user);
  });
  return groups;
};