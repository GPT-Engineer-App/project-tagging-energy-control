import { generateFieldwireToken } from "../_shared/fieldwire_api.ts";

async function fetchFieldwireTasks(token: string, project_id: string) {
  const tasksUrl =
    `https://client-api.us.fieldwire.com/api/v3/projects/${project_id}/tasks`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "Fieldwire-Version": "2024-01-01",
      "Fieldwire-Per-Page": "1000",
      authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(tasksUrl, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks for project ${project_id}`);
  }
  return await response.json();
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const project_id = url.searchParams.get("project_id");

    if (!project_id) {
      return new Response(JSON.stringify({ error: "Project ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const token = await generateFieldwireToken();
    const tasks = await fetchFieldwireTasks(token, project_id);
    return new Response(JSON.stringify({ tasks: tasks }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/get_fieldwire_tasks' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"project_id":"098b8040-134a-46cd-88ce-814bdd447b9f"}'

*/
