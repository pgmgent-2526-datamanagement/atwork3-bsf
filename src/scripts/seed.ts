import { supabase } from "@/lib/supabaseClient"

function randomDeviceHash() {
  return `device-${Math.random().toString(36).substring(2, 12)}`
}

async function seed() {
  console.log("🌱 Seeding database (extended)...")



  const { data: edition, error: editionError } = await supabase
    .from("edition")
    .insert({
      name: "One Minute Festival",
      year: 2025,
      is_active: true,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    })
    .select()
    .single()

  if (editionError) throw editionError
  console.log("✅ edition created")

  const editionId = edition.id

  

  const filmData = [
    { number: 1, title: "Blink", maker: "Alex Lee", tagline: "Life in a second" },
    { number: 2, title: "One Breath", maker: "Mila Janssen", tagline: "Hold it" },
    { number: 3, title: "60 Seconds of Fame", maker: "John Smith", tagline: "Your moment" },
    { number: 4, title: "Stillness", maker: "Eva de Vries", tagline: "Nothing moves" },
    { number: 5, title: "Rush", maker: "Liam O'Connor", tagline: "Too fast" },
    { number: 6, title: "Echo", maker: "Noah Kim", tagline: "What remains" },
    { number: 7, title: "Pause", maker: "Sophie Müller", tagline: "Stop and look" },
    { number: 8, title: "Loop", maker: "Carlos Rivera", tagline: "Again and again" },
    { number: 9, title: "Flash", maker: "Yara El Amrani", tagline: "Gone instantly" },
    { number: 10, title: "Drift", maker: "Tom Bakker", tagline: "Let go" },
    { number: 11, title: "Pulse", maker: "Rosa Nguyen", tagline: "Feel it" },
    { number: 12, title: "Fade", maker: "Lucas Moreau", tagline: "Almost gone" },
  ]

  const { data: films, error: filmError } = await supabase
    .from("film")
    .insert(
      filmData.map(film => ({
        ...film,
        edition_id: editionId,
      }))
    )
    .select()

  if (filmError) throw filmError
  console.log(`✅ ${films.length} films created`)



  const now = new Date()

  const { data: sessions, error: sessionError } = await supabase
    .from("vote_session")
    .insert([
      {
        type: "online",
        is_active: true,
        start_time: now.toISOString(),
        end_time: new Date(now.getTime() + 1000 * 60 * 60).toISOString(),
        edition_id: editionId,
      },
      {
        type: "zaal",
        is_active: false,
        start_time: now.toISOString(),
        end_time: new Date(now.getTime() + 1000 * 60 * 60).toISOString(),
        edition_id: editionId,
      },
    ])
    .select()

  if (sessionError) throw sessionError
  console.log("✅ vote sessions created")

  const onlineSession = sessions.find(s => s.type === "online")
  if (!onlineSession) throw new Error("Online session not found")



  const votes = []

  for (let i = 0; i < 50; i++) {
    const randomFilm = films[Math.floor(Math.random() * films.length)]

    votes.push({
      film_id: randomFilm.id,
      vote_session_id: onlineSession.id,
      device_hash: randomDeviceHash(),
      ip_address: `192.168.0.${i}`,
      is_valid: true,
    })
  }

  const { error: voteError } = await supabase.from("vote").insert(votes)
  if (voteError) throw voteError

  console.log(`✅ ${votes.length} votes created`)
  console.log("🎉 Extended seeding complete!")
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err)
  process.exit(1)
})
