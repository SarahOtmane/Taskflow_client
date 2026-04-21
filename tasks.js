import { supabase } from "./client.js";
export async function getProjectTasks(projectId, filters = {}) {
  let query = supabase
    .from("tasks")
    .select(
      `
 *,
 assigned_profile:profiles!tasks_assigned_to_fkey(username, full_name),
 creator:profiles!tasks_created_by_fkey(username),
 comments(count)
 `,
    )
    .eq("project_id", projectId);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.priority) query = query.eq("priority", filters.priority);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export async function createTask(projectId, taskData) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      project_id: projectId,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority ?? "medium",
      assigned_to: taskData.assignedTo ?? null,
      due_date: taskData.dueDate ?? null,
      file_url: taskData.fileUrl ?? null, // URL Uploadthing
      file_name: taskData.fileName ?? null,
      created_by: user.id,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function updateTaskStatus(taskId, status) {
  const valid = ["todo", "in_progress", "review", "done"];
  if (!valid.includes(status)) throw new Error("Statut invalide");
  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function assignTask(taskId, userId) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ assigned_to: userId })
    .eq("id", taskId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function addComment(taskId, content) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("comments")
    .insert({ task_id: taskId, author_id: user.id, content })
    .select("*, author:profiles(username)")
    .single();
  if (error) throw error;
  return data;
}
