// Lore-based Shahnameh resume samples used by the README preview/gallery.
// Each template gets a distinct character and profile image.

const profile = (file) => `/assets/templates/profiles/${file}`;

const publication = (id) => ({
  id: `${id}-pub1`,
  hidden: false,
  title: "Immortalized in the Shahnameh (The Book of Kings)",
  publisher: "Abolqasem Ferdowsi",
  date: "c. 1010 CE",
  description: "A legendary career preserved in Persian epic literature."
});

export const SHAHNAMEH_SAMPLES = {
  "dark-sidebar": {
    resume: {
      basics: {
        firstName: "Rostam",
        lastName: "Tahmtan",
        headline: "Pahlavan of Iran | Champion of Sistan | Slayer of the White Demon",
        email: "rostam@zabulistan.iran",
        phone: "+98 - royal courier",
        location: "Zabulistan, Sistan",
        website: "shahnameh.iran/rostam",
        linkedin: "rostam-tahmtan",
        extra: "Steed: Rakhsh | Armor: Babr-e Bayan",
        photo: profile("rostam_tahmtan.png")
      },
      summary: "Legendary defender of Iran across the reigns of the Kayanian kings. Completed the Seven Labors, rescued Kay Kavus from Mazandaran, and served as the final champion called upon when the realm faced impossible odds.",
      skills: [
        { id: "rostam-s1", hidden: false, name: "Battlefield Mastery", level: "5", keywords: ["Mace combat", "Mounted archery", "Wrestling", "Lasso tactics"] },
        { id: "rostam-s2", hidden: false, name: "Command", level: "5", keywords: ["Frontier defense", "Royal rescue", "Army morale", "Hero mentorship"] },
        { id: "rostam-s3", hidden: false, name: "Mythic Operations", level: "5", keywords: ["Demon slaying", "Dragon fighting", "Solo expeditions"] }
      ],
      experience: [
        { id: "rostam-e1", hidden: false, title: "Champion of Iran", organization: "Kayanian Court", location: "Iran", period: "Kay Kavus to Kay Khosrow", bullets: ["Rescued the king and army from captivity in Mazandaran through a solo campaign.", "Defeated the White Demon and restored the king's sight.", "Held Iran's border against repeated Turanian invasions."] },
        { id: "rostam-e2", hidden: false, title: "Hero of Sistan", organization: "House of Zal", location: "Sistan", period: "Youth onward", bullets: ["Tamed Rakhsh, the only steed strong enough to carry him.", "Defeated a raging white elephant with the mace of Sam."] }
      ],
      education: [{ id: "rostam-ed1", hidden: false, degree: "Warcraft and kingship counsel", organization: "Zal and the Simorgh", period: "Childhood", location: "Zabulistan", description: "Raised in the heroic house of Zal, guided by the wisdom passed down from the Simorgh." }],
      projects: [
        { id: "rostam-p1", hidden: false, name: "The Seven Labors", period: "Mazandaran campaign", website: "shahnameh.iran/haft-khan", bullets: ["Crossed wilderness, defeated monsters and demons, and completed the rescue without an army."] }
      ],
      certifications: [{ id: "rostam-c1", hidden: false, title: "Bearer of Babr-e Bayan", issuer: "Royal armory of Iran", date: "Legendary era", description: "Recognized for invulnerable battle readiness." }],
      languages: [{ id: "rostam-l1", hidden: false, language: "Persian", fluency: "Native", level: "5" }, { id: "rostam-l2", hidden: false, language: "Turanian", fluency: "Working", level: "3" }],
      interests: [{ id: "rostam-i1", hidden: false, name: "Hunting", keywords: [] }, { id: "rostam-i2", hidden: false, name: "Feasting", keywords: [] }, { id: "rostam-i3", hidden: false, name: "Horsemanship", keywords: [] }],
      publications: [publication("rostam")],
      achievements: [{ id: "rostam-a1", hidden: false, title: "Completed the Seven Labors", description: "" }, { id: "rostam-a2", hidden: false, title: "Undefeated champion of Iran", description: "" }],
      customSections: []
    },
    templateId: "dark-sidebar",
    pageSize: "A4"
  },
  "classic-blue-lines": {
    resume: {
      basics: {
        firstName: "Gordafarid",
        lastName: "Dezhban",
        headline: "Warrior of the White Fortress | Defender against Turan",
        email: "gordafarid@sepiddiz.iran",
        phone: "+98 - fortress watch",
        location: "White Fortress, Iran",
        website: "shahnameh.iran/gordafarid",
        linkedin: "gordafarid",
        extra: "Known for courage, disguise, and tactical composure",
        photo: profile("gordafarid.png")
      },
      summary: "A bold Iranian warrior who rode out from the White Fortress to challenge Sohrab and slow the Turanian advance. Remembered for battlefield courage, strategic deception, and the refusal to let reputation or gender define duty.",
      skills: [
        { id: "gord-s1", hidden: false, name: "Defense", level: "5", keywords: ["Fortress command", "Mounted combat", "Delay tactics"] },
        { id: "gord-s2", hidden: false, name: "Strategy", level: "4", keywords: ["Disguise", "Negotiation under pressure", "Rapid retreat planning"] },
        { id: "gord-s3", hidden: false, name: "Leadership", level: "4", keywords: ["Morale", "Crisis courage", "Symbolic resistance"] }
      ],
      experience: [
        { id: "gord-e1", hidden: false, title: "Defender of the White Fortress", organization: "Iranian frontier command", location: "Sepid Dezh", period: "Sohrab campaign", bullets: ["Challenged Sohrab in single combat to protect the fortress and buy time for Iran.", "Used identity, speech, and timing to turn a losing duel into a successful defensive withdrawal.", "Preserved the honor and readiness of the garrison under overwhelming pressure."] }
      ],
      education: [{ id: "gord-ed1", hidden: false, degree: "Arms, riding, and fortress discipline", organization: "House of Gozhdaham", period: "Youth", location: "White Fortress", description: "Trained inside a frontier family responsible for guarding Iran's border." }],
      projects: [{ id: "gord-p1", hidden: false, name: "White Fortress Stand", period: "Turanian incursion", website: "", bullets: ["Delayed a superior champion through personal risk and tactical misdirection."] }],
      certifications: [{ id: "gord-c1", hidden: false, title: "Frontier Defender", issuer: "House of Gozhdaham", date: "Heroic age", description: "" }],
      languages: [{ id: "gord-l1", hidden: false, language: "Persian", fluency: "Native", level: "5" }],
      interests: [{ id: "gord-i1", hidden: false, name: "Riding", keywords: [] }, { id: "gord-i2", hidden: false, name: "Archery", keywords: [] }],
      publications: [publication("gord")],
      achievements: [{ id: "gord-a1", hidden: false, title: "First warrior to face Sohrab at the fortress", description: "" }],
      customSections: []
    },
    templateId: "classic-blue-lines",
    pageSize: "Letter"
  },
  "purple-compact": {
    resume: {
      basics: {
        firstName: "Sohrab",
        lastName: "Turanian",
        headline: "Young Champion | Rapid Campaign Leader | Son of Rostam",
        email: "sohrab@samangan.turan",
        phone: "+98 - camp standard",
        location: "Samangan and Turan",
        website: "shahnameh.iran/sohrab",
        linkedin: "sohrab-pahlavan",
        extra: "Known for unmatched strength at a young age",
        photo: profile("sohrab.png")
      },
      summary: "A prodigious young hero raised in Samangan who led a Turanian campaign while seeking his unknown father, Rostam. His story is remembered for speed, strength, ambition, and the tragedy of hidden identity.",
      skills: [
        { id: "sohrab-s1", hidden: false, name: "Combat", level: "5", keywords: ["Wrestling", "Spear fighting", "Siege pressure"] },
        { id: "sohrab-s2", hidden: false, name: "Campaigning", level: "4", keywords: ["Rapid advance", "Troop command", "Frontline challenge"] },
        { id: "sohrab-s3", hidden: false, name: "Presence", level: "5", keywords: ["Courage", "Charisma", "Fearless negotiation"] }
      ],
      experience: [
        { id: "sohrab-e1", hidden: false, title: "Young Champion", organization: "Army of Turan", location: "Iranian frontier", period: "Sohrab campaign", bullets: ["Advanced rapidly toward Iran while searching for Rostam.", "Captured and pressured frontier positions with unusual speed for a first campaign.", "Defeated experienced warriors and forced Iran to summon its greatest champion."] }
      ],
      education: [{ id: "sohrab-ed1", hidden: false, degree: "Heroic arms and noble conduct", organization: "Court of Samangan", period: "Youth", location: "Samangan", description: "Raised by Tahmineh with the signs of Rostam's lineage and trained for kingship-level combat." }],
      projects: [{ id: "sohrab-p1", hidden: false, name: "Search for Rostam", period: "Final campaign", website: "", bullets: ["Turned a military expedition into a personal mission to find his father and reshape the rule of Iran and Turan."] }],
      certifications: [{ id: "sohrab-c1", hidden: false, title: "Recognized champion of Turan", issuer: "Turanian host", date: "Youth", description: "" }],
      languages: [{ id: "sohrab-l1", hidden: false, language: "Turanian", fluency: "Native", level: "5" }, { id: "sohrab-l2", hidden: false, language: "Persian", fluency: "Fluent", level: "4" }],
      interests: [{ id: "sohrab-i1", hidden: false, name: "Lineage", keywords: [] }, { id: "sohrab-i2", hidden: false, name: "Wrestling", keywords: [] }],
      publications: [publication("sohrab")],
      achievements: [{ id: "sohrab-a1", hidden: false, title: "Forced Iran to call Rostam to battle", description: "" }],
      customSections: []
    },
    templateId: "purple-compact",
    pageSize: "A4"
  },
  "modern-minimal": {
    resume: {
      basics: {
        firstName: "Siavash",
        lastName: "Kayanian",
        headline: "Prince of Iran | Peace Envoy | Founder of Siavashgerd",
        email: "siavash@kayanian.iran",
        phone: "+98 - royal court",
        location: "Iran and Turan",
        website: "shahnameh.iran/siavash",
        linkedin: "siavash-kayani",
        extra: "Known for truth, restraint, and tragic innocence",
        photo: profile("siavash.png")
      },
      summary: "A Kayanian prince famed for purity of character, diplomatic restraint, and the ordeal of passing through fire. Chose peace over needless bloodshed and founded Siavashgerd in Turan before becoming a central martyr of the epic.",
      skills: [
        { id: "siavash-s1", hidden: false, name: "Diplomacy", level: "5", keywords: ["Peace negotiation", "Hostage exchange", "Court protocol"] },
        { id: "siavash-s2", hidden: false, name: "Ethics", level: "5", keywords: ["Truthfulness", "Restraint", "Public trust"] },
        { id: "siavash-s3", hidden: false, name: "Leadership", level: "4", keywords: ["City founding", "Military discipline", "Alliance building"] }
      ],
      experience: [
        { id: "siavash-e1", hidden: false, title: "Prince and Peace Envoy", organization: "Kayanian Court", location: "Iran", period: "Reign of Kay Kavus", bullets: ["Passed through fire to prove innocence and preserve public trust.", "Negotiated peace with Afrasiab after victory on the battlefield.", "Refused to betray sworn terms even when pressured by the Iranian court."] },
        { id: "siavash-e2", hidden: false, title: "Founder", organization: "Siavashgerd", location: "Turan", period: "Exile", bullets: ["Built a city of order and beauty in foreign territory.", "Maintained dignity and loyalty while navigating dangerous Turanian politics."] }
      ],
      education: [{ id: "siavash-ed1", hidden: false, degree: "Royal conduct, arms, and governance", organization: "Training of Rostam", period: "Youth", location: "Zabulistan", description: "Entrusted to Rostam for heroic education away from court intrigue." }],
      projects: [{ id: "siavash-p1", hidden: false, name: "Siavashgerd", period: "Turan exile", website: "", bullets: ["Founded a model city remembered as a sign of wisdom, grace, and order."] }],
      certifications: [{ id: "siavash-c1", hidden: false, title: "Trial by Fire", issuer: "Public witness of Iran", date: "Kayanian era", description: "Passed the ordeal unharmed and proved innocence." }],
      languages: [{ id: "siavash-l1", hidden: false, language: "Persian", fluency: "Native", level: "5" }, { id: "siavash-l2", hidden: false, language: "Turanian", fluency: "Diplomatic", level: "4" }],
      interests: [{ id: "siavash-i1", hidden: false, name: "City building", keywords: [] }, { id: "siavash-i2", hidden: false, name: "Peacecraft", keywords: [] }],
      publications: [publication("siavash")],
      achievements: [{ id: "siavash-a1", hidden: false, title: "Passed through fire unharmed", description: "" }, { id: "siavash-a2", hidden: false, title: "Founded Siavashgerd", description: "" }],
      customSections: []
    },
    templateId: "modern-minimal",
    pageSize: "A4"
  },
  "executive": {
    resume: {
      basics: {
        firstName: "Esfandiar",
        lastName: "Ruyintan",
        headline: "Crown Prince | Invulnerable Champion | Commander of the Seven Labors",
        email: "esfandiar@goshtasp.iran",
        phone: "+98 - royal summons",
        location: "Kayanian Iran",
        website: "shahnameh.iran/esfandiar",
        linkedin: "esfandiar-ruyintan",
        extra: "Ruyintan: bronze-bodied champion",
        photo: profile("esfandiar.png")
      },
      summary: "Crown prince and invulnerable champion of Iran, renowned for faith, obedience, and military discipline. Completed his own Seven Labors, rescued his sisters from Arjasp, and led royal campaigns while caught between duty to father and justice toward heroes.",
      skills: [
        { id: "esf-s1", hidden: false, name: "Executive Command", level: "5", keywords: ["Campaign leadership", "Royal mandate", "Succession readiness"] },
        { id: "esf-s2", hidden: false, name: "Elite Combat", level: "5", keywords: ["Invulnerable defense", "Swordsmanship", "Monster combat"] },
        { id: "esf-s3", hidden: false, name: "Mission Delivery", level: "5", keywords: ["Seven Labors", "Hostage rescue", "High-risk obedience"] }
      ],
      experience: [
        { id: "esf-e1", hidden: false, title: "Crown Prince and Commander", organization: "Court of Goshtasp", location: "Iran", period: "Kayanian era", bullets: ["Led campaigns against Arjasp and restored royal honor.", "Completed the Seven Labors of Esfandiar and rescued captive sisters.", "Accepted the impossible assignment to bind Rostam, revealing the cost of political obedience."] }
      ],
      education: [{ id: "esf-ed1", hidden: false, degree: "Royal command and sacred duty", organization: "Court of Goshtasp", period: "Youth", location: "Iran", description: "Prepared for kingship through military command, religious devotion, and court discipline." }],
      projects: [{ id: "esf-p1", hidden: false, name: "Seven Labors of Esfandiar", period: "Campaign against Arjasp", website: "", bullets: ["Defeated wolves, lions, dragons, witches, storms, and fortress threats to complete a royal rescue mission."] }],
      certifications: [{ id: "esf-c1", hidden: false, title: "Ruyintan invulnerability", issuer: "Divine fortune and royal legend", date: "Heroic age", description: "Known as bronze-bodied except for the vulnerable eyes." }],
      languages: [{ id: "esf-l1", hidden: false, language: "Persian", fluency: "Native", level: "5" }],
      interests: [{ id: "esf-i1", hidden: false, name: "Justice", keywords: [] }, { id: "esf-i2", hidden: false, name: "Kingship", keywords: [] }],
      publications: [publication("esf")],
      achievements: [{ id: "esf-a1", hidden: false, title: "Completed the Seven Labors of Esfandiar", description: "" }, { id: "esf-a2", hidden: false, title: "Rescued royal captives from Arjasp", description: "" }],
      customSections: []
    },
    templateId: "executive",
    pageSize: "Letter"
  },
  "teal-pro": {
    resume: {
      basics: {
        firstName: "Rudabeh",
        lastName: "Mehrabani",
        headline: "Princess of Kabul | Alliance Builder | Mother of Rostam",
        email: "rudabeh@kabul.shahnameh",
        phone: "+98 - palace tower",
        location: "Kabul",
        website: "shahnameh.iran/rudabeh",
        linkedin: "rudabeh-kabul",
        extra: "Bridge between Kabul, Zabul, and Iran",
        photo: profile("rudabeh.png")
      },
      summary: "Princess of Kabul whose courage and diplomacy joined the houses of Mehrab and Zal despite political danger. Her story anchors one of the Shahnameh's great unions and leads to the birth of Rostam through the miraculous aid of the Simorgh.",
      skills: [
        { id: "rud-s1", hidden: false, name: "Alliance Building", level: "5", keywords: ["Cross-house diplomacy", "Trust building", "Conflict de-escalation"] },
        { id: "rud-s2", hidden: false, name: "Courage", level: "5", keywords: ["Personal agency", "Court pressure", "Risk acceptance"] },
        { id: "rud-s3", hidden: false, name: "Legacy", level: "5", keywords: ["Dynastic continuity", "Heroic lineage", "Cultural memory"] }
      ],
      experience: [
        { id: "rud-e1", hidden: false, title: "Princess and Diplomatic Catalyst", organization: "Court of Kabul", location: "Kabul", period: "Age of Zal", bullets: ["Built a bond with Zal that overcame ancestral suspicion and royal resistance.", "Helped transform a potential political crisis into an alliance between Kabul and Zabul.", "Became mother of Rostam, securing the heroic line that would defend Iran for generations."] }
      ],
      education: [{ id: "rud-ed1", hidden: false, degree: "Court culture, counsel, and royal diplomacy", organization: "House of Mehrab", period: "Youth", location: "Kabul", description: "Raised in a royal household skilled in negotiation, hospitality, and dynastic politics." }],
      projects: [{ id: "rud-p1", hidden: false, name: "Union of Zal and Rudabeh", period: "Kabul-Zabul alliance", website: "", bullets: ["Navigated family, kingdom, and lineage risk to establish a lasting heroic union."] }],
      certifications: [{ id: "rud-c1", hidden: false, title: "Simorgh-assisted birth of Rostam", issuer: "House of Zal", date: "Heroic age", description: "Central figure in the miraculous birth episode of the national champion." }],
      languages: [{ id: "rud-l1", hidden: false, language: "Persian", fluency: "Fluent", level: "5" }, { id: "rud-l2", hidden: false, language: "Kabul court speech", fluency: "Native", level: "5" }],
      interests: [{ id: "rud-i1", hidden: false, name: "Poetry", keywords: [] }, { id: "rud-i2", hidden: false, name: "Court diplomacy", keywords: [] }],
      publications: [publication("rud")],
      achievements: [{ id: "rud-a1", hidden: false, title: "Mother of Rostam", description: "" }, { id: "rud-a2", hidden: false, title: "United rival heroic houses", description: "" }],
      customSections: []
    },
    templateId: "teal-pro",
    pageSize: "A4"
  },
  "warm-earth": {
    resume: {
      basics: {
        firstName: "Tahmineh",
        lastName: "Samangani",
        headline: "Princess of Samangan | Strategic Host | Mother of Sohrab",
        email: "tahmineh@samangan.turan",
        phone: "+98 - Samangan court",
        location: "Samangan",
        website: "shahnameh.iran/tahmineh",
        linkedin: "tahmineh-samangan",
        extra: "Known for resolve, hospitality, and lineage foresight",
        photo: profile("tahmineh.png")
      },
      summary: "Princess of Samangan who recognized Rostam's stature and acted with rare directness to shape her own destiny. Mother of Sohrab, she preserved the signs of his lineage and stands at the emotional center of one of the epic's greatest tragedies.",
      skills: [
        { id: "tah-s1", hidden: false, name: "Court Strategy", level: "5", keywords: ["Hospitality", "Private negotiation", "Lineage planning"] },
        { id: "tah-s2", hidden: false, name: "Resolve", level: "5", keywords: ["Courage", "Self-advocacy", "High-stakes choice"] },
        { id: "tah-s3", hidden: false, name: "Stewardship", level: "4", keywords: ["Heir raising", "Memory keeping", "Cultural continuity"] }
      ],
      experience: [
        { id: "tah-e1", hidden: false, title: "Princess and Lineage Steward", organization: "Court of Samangan", location: "Samangan", period: "Age of Rostam", bullets: ["Hosted Rostam after the loss and recovery of Rakhsh, creating a pivotal link between Sistan and Samangan.", "Raised Sohrab with knowledge of his heroic ancestry and the token of Rostam's identity.", "Preserved dignity and agency in a political world shaped by kings and armies."] }
      ],
      education: [{ id: "tah-ed1", hidden: false, degree: "Royal household leadership", organization: "Court of Samangan", period: "Youth", location: "Samangan", description: "Prepared in courtly diplomacy, household command, and noble alliance customs." }],
      projects: [{ id: "tah-p1", hidden: false, name: "Safeguarding Sohrab's lineage", period: "Sohrab's youth", website: "", bullets: ["Maintained the identifying armlet and story of Rostam so Sohrab could seek his father."] }],
      certifications: [{ id: "tah-c1", hidden: false, title: "Keeper of Rostam's token", issuer: "House of Samangan", date: "Heroic age", description: "" }],
      languages: [{ id: "tah-l1", hidden: false, language: "Turanian", fluency: "Native", level: "5" }, { id: "tah-l2", hidden: false, language: "Persian", fluency: "Courtly", level: "4" }],
      interests: [{ id: "tah-i1", hidden: false, name: "Genealogy", keywords: [] }, { id: "tah-i2", hidden: false, name: "Court music", keywords: [] }],
      publications: [publication("tah")],
      achievements: [{ id: "tah-a1", hidden: false, title: "Mother of Sohrab", description: "" }, { id: "tah-a2", hidden: false, title: "Linked Samangan to the house of Rostam", description: "" }],
      customSections: []
    },
    templateId: "warm-earth",
    pageSize: "A4"
  },
  "ats-clean": {
    resume: {
      basics: {
        firstName: "Afrasiab",
        lastName: "Turan",
        headline: "King of Turan | Long-Range Rival of Iran | Strategic Adversary",
        email: "afrasiab@turan.kingdom",
        phone: "+98 - royal war camp",
        location: "Turan",
        website: "shahnameh.iran/afrasiab",
        linkedin: "afrasiab-turan",
        extra: "Primary geopolitical rival across the Kayanian age",
        photo: profile("afrasiab.png")
      },
      summary: "King of Turan and enduring adversary of Iran, remembered for ambition, strategic persistence, and a long cycle of war with the Kayanian realm. His rule shaped the destinies of Siyavash, Kay Khosrow, Rostam, and generations of Iranian heroes.",
      skills: [
        { id: "afr-s1", hidden: false, name: "Grand Strategy", level: "5", keywords: ["War planning", "Alliance pressure", "Long campaigns"] },
        { id: "afr-s2", hidden: false, name: "Rule", level: "4", keywords: ["Court command", "Resource mobilization", "Dynastic politics"] },
        { id: "afr-s3", hidden: false, name: "Adversarial Operations", level: "5", keywords: ["Border raids", "Psychological pressure", "Hero containment"] }
      ],
      experience: [
        { id: "afr-e1", hidden: false, title: "King of Turan", organization: "Turanian realm", location: "Turan", period: "Kayanian age", bullets: ["Led repeated campaigns against Iran and forced the Kayanian court into prolonged strategic defense.", "Hosted Siavash in exile before court suspicion and political fear led to tragedy.", "Became the central adversary whose defeat defined Kay Khosrow's mission."] }
      ],
      education: [{ id: "afr-ed1", hidden: false, degree: "Kingship and warcraft", organization: "House of Pashang", period: "Youth", location: "Turan", description: "Raised for command in a court defined by rivalry with Iran." }],
      projects: [{ id: "afr-p1", hidden: false, name: "Iran-Turan long war", period: "Multiple reigns", website: "", bullets: ["Sustained a multi-generational conflict that shaped the heroic age of both kingdoms."] }],
      certifications: [{ id: "afr-c1", hidden: false, title: "Sovereign of Turan", issuer: "House of Pashang", date: "Heroic age", description: "" }],
      languages: [{ id: "afr-l1", hidden: false, language: "Turanian", fluency: "Native", level: "5" }, { id: "afr-l2", hidden: false, language: "Persian", fluency: "Diplomatic", level: "4" }],
      interests: [{ id: "afr-i1", hidden: false, name: "Kingship", keywords: [] }, { id: "afr-i2", hidden: false, name: "War councils", keywords: [] }],
      publications: [publication("afr")],
      achievements: [{ id: "afr-a1", hidden: false, title: "Longest-running royal rival of Iran", description: "" }, { id: "afr-a2", hidden: false, title: "Shaped the fate of Siavash and Kay Khosrow", description: "" }],
      customSections: []
    },
    templateId: "ats-clean",
    pageSize: "Letter"
  }
};

export const TEMPLATE_PERSONAS = {
  "dark-sidebar": "Rostam Tahmtan",
  "classic-blue-lines": "Gordafarid",
  "purple-compact": "Sohrab",
  "modern-minimal": "Siavash",
  "executive": "Esfandiar",
  "teal-pro": "Rudabeh",
  "warm-earth": "Tahmineh",
  "ats-clean": "Afrasiab"
};

export function sampleForTemplate(templateId) {
  return SHAHNAMEH_SAMPLES[templateId] || SHAHNAMEH_SAMPLES["dark-sidebar"];
}

// Main GitHub/social preview: Rostam rendered in the Product & Design template.
export const RESUME_PAYLOAD = {
  ...SHAHNAMEH_SAMPLES["dark-sidebar"],
  templateId: "teal-pro"
};
