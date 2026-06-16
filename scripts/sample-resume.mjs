// A faithful, lore-accurate résumé for Rostam-e Dastan — the immortal champion
// of Ferdowsi's Shahnameh (The Book of Kings). Shared by the screenshot and
// gallery generators so the sample stays in one place.
export const RESUME_PAYLOAD = {
  resume: {
    basics: {
      firstName: "Rostam", lastName: "Dastan",
      headline: "Pahlavan of Iran · Champion of the Kayanian Crown · Slayer of the White Demon",
      email: "rostam@zabulistan.iran", phone: "+98 · summon by royal courier",
      location: "Zabulistan, Sistan, Iran", website: "shahnameh.iran",
      linkedin: "rostam-e-dastan", extra: "Steed: Rakhsh · Armor: Babr-e Bayan", photo: ""
    },
    summary: "Legendary pahlavan and lifelong defender of Iran, serving the crown across the reigns of Kay Qobad, Kay Kavus and Kay Khosrow. Completed the Seven Labors (Haft Khan) single-handedly, slew the White Demon of Mazandaran, and held the borders of Iran against Turan for generations. Trusted final champion of the realm, never defeated in single combat.",
    skills: [
      { id: "s1", hidden: false, name: "Combat & Warfare", level: "", keywords: ["Single Combat (Mard-o-Mard)", "Mace (Gorz-e Saam)", "Mounted Archery", "Lasso (Kamand)", "Cavalry Charge"] },
      { id: "s2", hidden: false, name: "Command & Court", level: "", keywords: ["Army Command (Sepahbod)", "Crown Protection", "Royal Diplomacy", "Mentoring Heroes"] },
      { id: "s3", hidden: false, name: "Special Operations", level: "", keywords: ["Demon Slaying", "Solo Rescue Missions", "Monster Hunting", "Covert Infiltration"] }
    ],
    experience: [
      { id: "e1", hidden: false, title: "Champion of Iran (Pahlavan-e Iran)", organization: "Royal Court of the Kayanian Dynasty", location: "Iran", period: "Reign of Kay Kavus – Kay Khosrow", bullets: ["Completed the Seven Labors (Haft Khan) alone to rescue King Kay Kavus and the Iranian army from captivity in Mazandaran.", "Slew the White Demon (Div-e Sefid) in his cavern and restored the blinded king's sight with the demon's heart-blood.", "Defended Iran's frontier against repeated invasions by Afrasiab and the host of Turan for over a generation."] },
      { id: "e2", hidden: false, title: "Crown-Bringer & Chief Commander", organization: "House of the Kayanian Kings", location: "Iran", period: "Multiple reigns", bullets: ["Sought out and enthroned Kay Qobad, securing the Kayanian line and ending a leaderless interregnum.", "Served as supreme commander (Sepahbod) and decisive final champion in the realm's gravest battles.", "Fought the young Turanian champion Sohrab in tragic single combat — the most sorrowful duel of the age."] },
      { id: "e3", hidden: false, title: "Hero of Sistan", organization: "House of Zal-e Dastan", location: "Sistan", period: "Youth", bullets: ["Tamed the wild stallion Rakhsh — the only steed in the world able to bear my weight — as a young man.", "Felled a rampaging mad white elephant with a single blow of my grandfather Saam's mace."] }
    ],
    education: [
      { id: "ed1", hidden: false, degree: "Heroship, Warcraft & Statecraft", organization: "Tutelage of Zal & the Simorgh", location: "Mount Damavand, Alborz", period: "Childhood", gpa: "Blessed by the Simorgh", bullets: ["Raised and counseled through the wisdom of the mythical Simorgh, conveyed by my father Zal."] }
    ],
    projects: [
      { id: "p1", hidden: false, name: "The Seven Labors (Haft Khan)", url: "shahnameh.iran/haft-khan", period: "Mazandaran Campaign", bullets: ["A solo expedition: defeated a lion, crossed a waterless desert, slew a dragon and a sorceress, captured the demon Arzhang, and at last destroyed the White Demon."] },
      { id: "p2", hidden: false, name: "Rescue of Bizhan", url: "", period: "Turan", bullets: ["Infiltrated Turan disguised as a merchant and freed the hero Bizhan from Afrasiab's sealed pit in a covert night operation."] }
    ],
    certifications: [
      { id: "c1", hidden: false, title: "Bearer of the Babr-e Bayan (invincible armor)", issuer: "Royal Armory of Iran", date: "—" },
      { id: "c2", hidden: false, title: "Master of Rakhsh, the matchless steed", issuer: "Stables of Zabulistan", date: "—" }
    ],
    languages: [{ id: "l1", hidden: false, language: "Persian (Pahlavi)", fluency: "Native" }, { id: "l2", hidden: false, language: "Turanian", fluency: "Professional" }, { id: "l3", hidden: false, language: "Tongue of Mazandaran", fluency: "Conversational" }],
    interests: [{ id: "i1", hidden: false, name: "The Hunt (Shekar)" }, { id: "i2", hidden: false, name: "Horsemanship" }, { id: "i3", hidden: false, name: "Wrestling (Koshti)" }, { id: "i4", hidden: false, name: "The Feast (Bazm)" }],
    publications: [{ id: "pub1", hidden: false, title: "Immortalized in the Shahnameh (The Book of Kings)", publisher: "Abolqasem Ferdowsi", date: "c. 1010 CE" }],
    achievements: [{ id: "a1", hidden: false, title: "Slayer of the White Demon of Mazandaran" }, { id: "a2", hidden: false, title: "Undefeated in single combat for a lifetime" }, { id: "a3", hidden: false, title: "Champion across the reigns of five kings" }],
    customSections: []
  },
  templateId: "teal-pro",
  pageSize: "A4"
};
