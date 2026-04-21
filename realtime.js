import { supabase } from "./client.js";
export function subscribeToProject(projectId, callbacks) {
  const channel = supabase.channel(`project:${projectId}`);
  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "tasks",
      filter: `project_id=eq.${projectId}`,
    },
    (payload) => {
      if (payload.eventType === "INSERT")
        callbacks.onTaskCreated?.(payload.new);
      if (payload.eventType === "UPDATE")
        callbacks.onTaskUpdated?.(payload.new, payload.old);
      if (payload.eventType === "DELETE")
        callbacks.onTaskDeleted?.(payload.old);
    },
  );
  channel.on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "comments" },
    (payload) => callbacks.onCommentAdded?.(payload.new),
  );
  // Présence : qui est connecté sur ce projet
  channel.on("presence", { event: "sync" }, () => {
    const users = Object.values(channel.presenceState()).flat();
    callbacks.onPresenceChange?.(users);
  });
  channel.subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await channel.track({
        username: user?.email,
        online_at: new Date().toISOString(),
      });
    }
  });
  return () => supabase.removeChannel(channel);
}
