import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";

function nextEditionName(year: number) {
  return `Edition ${year}`;
}

export async function POST() {
  try {
    const { supabase } = await requireAdmin();

    // 1) Find active edition
    const { data: activeEdition, error: editionError } = await supabase
      .from("edition")
      .select("*")
      .eq("is_active", true)
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (editionError) throw editionError;
    if (!activeEdition) {
      throw new Error("Geen actieve editie gevonden.");
    }

    const editionId = activeEdition.id;

    // 2) Find vote_sessions for this edition
    const { data: sessions, error: sessionsError } = await supabase
      .from("vote_session")
      .select("id")
      .eq("edition_id", editionId);

    if (sessionsError) throw sessionsError;

    const sessionIds = (sessions ?? []).map((s) => s.id);

    // 3) Delete votes for these sessions
    if (sessionIds.length > 0) {
      const { error: delVotesError } = await supabase
        .from("vote")
        .delete()
        .in("vote_session_id", sessionIds);

      if (delVotesError) throw delVotesError;
    }

    // 4) Delete vote_sessions for this edition
    const { error: delSessionsError } = await supabase
      .from("vote_session")
      .delete()
      .eq("edition_id", editionId);

    if (delSessionsError) throw delSessionsError;

    // 5) Delete films for this edition
    const { error: delFilmsError } = await supabase
      .from("film")
      .delete()
      .eq("edition_id", editionId);

    if (delFilmsError) throw delFilmsError;

    // 6) Deactivate old edition
    const { error: deactivateError } = await supabase
      .from("edition")
      .update({ is_active: false, end_time: new Date().toISOString() })
      .eq("id", editionId);

    if (deactivateError) throw deactivateError;

    // 7) Create and activate new edition
    const newYear = (activeEdition.year ?? new Date().getFullYear()) + 1;

    const { data: newEdition, error: createError } = await supabase
      .from("edition")
      .insert({
        name: nextEditionName(newYear),
        year: newYear,
        is_active: true,
        start_time: new Date().toISOString(),
        end_time: null,
      })
      .select("*")
      .single();

    if (createError) throw createError;

    return NextResponse.json({
      success: true,
      message: "Editie gereset. Nieuwe editie gestart.",
      oldEditionId: editionId,
      newEdition,
      deleted: {
        votesSessions: sessionIds.length,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "UNAUTHORIZED") {
        return NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 },
        );
      }
      if (err.message === "FORBIDDEN") {
        return NextResponse.json(
          { success: false, error: "Admin access required" },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
