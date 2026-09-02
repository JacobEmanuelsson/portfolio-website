import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error} = await supabase
        .from("Skills")
        .select("*, Skill_category(Categories(*))");

    if (error) {
        return Response.json({ error: error.message }, { status: 500});
    }

    return Response.json({data, error});
}