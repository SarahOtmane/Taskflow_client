// Terminal 1 — alice-watch.js
import { signIn } from "./auth.js";
import { subscribeToProject } from "./realtime.js";
await signIn("jojo@gmail.com", process.env.ALICE_PASSWORD);
const PROJECT_ID = process.env.PROJECT_ID;
const unsub = subscribeToProject(PROJECT_ID, {
  onTaskCreated: (t) => console.log("✅ Nouvelle tâche:", t.title),
  onTaskUpdated: (n, o) => console.log(`🔄 ${o.status} → ${n.status}`),
  onCommentAdded: (c) => console.log("💬", c.content),
  onPresenceChange: (u) => console.log("👥 En ligne:", u.length),
});
process.on("SIGINT", () => {
  unsub();
  process.exit();
});
