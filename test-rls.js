import { supabase } from "./client.js";
import { signIn, signOut } from "./auth.js";

const { data: noAuth } = await supabase.from("tasks").select("*");
console.log("Sans auth:", noAuth?.length, "(attendu: 0)");

await signIn("jojo@gmail.com", "test2025");
const { data: tasks, error: errorAuth } = await supabase
  .from("tasks")
  .select("*");

console.log("Tasks Alice:", tasks?.length);
if (errorAuth) console.error("Error auth:", errorAuth.message || errorAuth);

const { data: bobTask } = await supabase
  .from("tasks")
  .select("id")
  .eq("assigned_to", "740bc06a-5984-4325-acd8-ea0c340a294c")
  .maybeSingle();

if (bobTask) {
  const { data: updatedData, error: updateError } = await supabase
    .from("tasks")
    .update({ title: "Hacked2" })
    .eq("id", bobTask.id)
    .select();

  if (updateError) {
    console.log("Modif refusée (Erreur):", updateError.message);
  } else if (!updatedData || updatedData.length === 0) {
    console.log("Modif refusée (RLS silencieux): Aucune ligne modifiée.");
  } else {
    console.log("⚠ ERREUR : La tâche a été modifiée !");
  }
} else {
  console.log("Test 3 réussi : Alice ne voit même pas la tâche de Bob.");
}

await signOut();
