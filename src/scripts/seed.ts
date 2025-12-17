import "dotenv/config";
import { supabaseService } from "../lib/supabaseService";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function randomDeviceHash() {
  return `seed-device-${Math.random().toString(36).substring(2, 12)}`;
}

/* ------------------------------------------------------------------ */
/* Seed                                                               */
/* ------------------------------------------------------------------ */

async function seed() {
  console.log("🧹 Resetting database...");

  /* ------------------------------------------------------------------ */
  /* 0️⃣ RESET DATABASE (ORDER MATTERS)                                 */
  /* ------------------------------------------------------------------ */

  await supabaseService.from("vote").delete().neq("id", 0);
  await supabaseService.from("vote_session").delete().neq("id", 0);
  await supabaseService.from("film").delete().neq("id", 0);
  await supabaseService.from("edition").delete().neq("id", 0);

  console.log("✅ Database cleared");

  /* ------------------------------------------------------------------ */
  /* 2️⃣ EDITION                                                        */
  /* ------------------------------------------------------------------ */

  const { data: edition, error: editionError } = await supabaseService
    .from("edition")
    .insert({
      name: "One Minute Festival",
      year: 2025,
      is_active: true,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    })
    .select()
    .single();

  if (editionError) throw editionError;
  console.log("✅ Edition created");

  /* ------------------------------------------------------------------ */
  /* 3️⃣ FILMS                                                          */
  /* ------------------------------------------------------------------ */

  const filmsData = [
    {
      number: 1,
      title: "Blink",
      maker: "Alex Lee",
      tagline: "Life in a second",
    },
    {
      number: 2,
      title: "One Breath",
      maker: "Mila Janssen",
      tagline: "Hold it",
    },
    {
      number: 3,
      title: "60 Seconds of Fame",
      maker: "John Smith",
      tagline: "Your moment",
    },
    {
      number: 4,
      title: "Stillness",
      maker: "Eva de Vries",
      tagline: "Nothing moves",
    },
    { number: 5, title: "Rush", maker: "Liam O'Connor", tagline: "Too fast" },
    { number: 6, title: "Echo", maker: "Noah Kim", tagline: "What remains" },
    {
      number: 7,
      title: "Pause",
      maker: "Sophie Müller",
      tagline: "Stop and look",
    },
    {
      number: 8,
      title: "Loop",
      maker: "Carlos Rivera",
      tagline: "Again and again",
    },
    {
      number: 9,
      title: "Flash",
      maker: "Yara El Amrani",
      tagline: "Gone instantly",
    },
    { number: 10, title: "Drift", maker: "Tom Bakker", tagline: "Let go" },
    { number: 11, title: "Pulse", maker: "Rosa Nguyen", tagline: "Feel it" },
    {
      number: 12,
      title: "Fade",
      maker: "Lucas Moreau",
      tagline: "Almost gone",
    },
  ];

  const { data: films, error: filmError } = await supabaseService
    .from("film")
    .insert(
      filmsData.map((film) => ({
        ...film,
        edition_id: edition.id,
      }))
    )
    .select();

  if (filmError) throw filmError;
  console.log(`✅ ${films.length} films created`);

  /* ------------------------------------------------------------------ */
  /* 4️⃣ VOTE SESSIONS (ONLY ONE ACTIVE PER TYPE)                       */
  /* ------------------------------------------------------------------ */

  const now = new Date();

  const { error: sessionError } = await supabaseService
    .from("vote_session")
    .insert([
      {
        type: "online",
        is_active: true,
        start_time: now.toISOString(),
        end_time: new Date(now.getTime() + 1000 * 60 * 60).toISOString(),
        edition_id: edition.id,
      },
      {
        type: "zaal",
        is_active: false,
        start_time: now.toISOString(),
        end_time: new Date(now.getTime() + 1000 * 60 * 60).toISOString(),
        edition_id: edition.id,
      },
    ]);

  if (sessionError) throw sessionError;
  console.log("✅ Vote sessions created");

  /* ------------------------------------------------------------------ */
  /* 5️⃣ OPTIONAL TEST VOTES                                            */
  /* ------------------------------------------------------------------ */

  const testVotes = films.slice(0, 5).map((film, i) => ({
    film_id: film.id,
    device_hash: randomDeviceHash(),
    ip_address: `192.168.1.${i}`,
    is_valid: true,
    fraud_reason: null,
  }));

  await supabaseService.from("vote").insert(testVotes);

  console.log("✅ Test votes created");
  console.log("🎉 Seeding complete — database is clean and consistent");
}

/* ------------------------------------------------------------------ */

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
