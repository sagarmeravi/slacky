import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";
// import { deleteStreamUser } from "../services/stream.js"; // adjust path as needed
// Create a client to send and receive events
export const inngest = new Inngest({ id: "slacky" });
connectDB();
export const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;
    const newUser = {
      clerkId: id,
      email: primaryEmail,
      name: `${first_name || ""} ${last_name || ""}`,
      image_url: image_url,
    };
    await User.create(newUser);
    //todo
  }
);
export const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
    //todo task
  }
);
export const functions = [syncUser, deleteUserFromDB];
