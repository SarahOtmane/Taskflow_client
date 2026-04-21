// Terminal 2 — bob-actions.js
import { signIn } from "./auth.js";
import { createTask, updateTaskStatus, addComment } from "./tasks.js";
const { user } = await signIn("sarah@gmail.com", process.env.BOB_PASSWORD);
const PROJECT_ID = process.env.PROJECT_ID;
const task = await createTask(PROJECT_ID, {
  title: "Implémenter le Realtime3",
  priority: "high",
  assignedTo: user.id,
  // fileUrl et fileName seraient renseignés après un upload Uploadthing
});
await new Promise((r) => setTimeout(r, 1000));
await updateTaskStatus(task.id, "in_progress");
await new Promise((r) => setTimeout(r, 1000));
await addComment(task.id, "Je commence maintenant !");
