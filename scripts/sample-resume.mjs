// Bilingual Shahnameh resume samples used by gallery preview generation.

const profile = (file) => `/assets/templates/profiles/${file}`;

export const TEMPLATE_IDS = [
  "dark-sidebar", "classic-blue-lines", "purple-compact", "modern-minimal",
  "executive", "teal-pro", "warm-earth", "ats-clean",
  "gordafarid-defender", "rudabeh-heritage"
];

export const TEMPLATE_PERSONAS = {
  en: {
    "dark-sidebar": "Rostam Tahmtan",
    "classic-blue-lines": "Gordafarid",
    "purple-compact": "Sohrab",
    "modern-minimal": "Siavash",
    "executive": "Esfandiar",
    "teal-pro": "Rudabeh",
    "warm-earth": "Tahmineh",
    "ats-clean": "Afrasiab",
    "gordafarid-defender": "Gordafarid",
    "rudabeh-heritage": "Rudabeh"
  },
  fa: {
    "dark-sidebar": "رستم تهمتن",
    "classic-blue-lines": "گردآفرید",
    "purple-compact": "سهراب",
    "modern-minimal": "سیاوش",
    "executive": "اسفندیار",
    "teal-pro": "رودابه",
    "warm-earth": "تهمینه",
    "ats-clean": "افراسیاب",
    "gordafarid-defender": "گردآفرید",
    "rudabeh-heritage": "رودابه"
  }
};

const PERSONAS = {
  "dark-sidebar": {
    pageSize: "A4",
    photo: "rostam_tahmtan.png",
    en: {
      firstName: "Rostam",
      lastName: "Tahmtan",
      headline: "Champion of Iran | Hero of Sistan | Keeper of the Seven Labors",
      location: "Zabulistan and the court of Iran",
      contact: ["royal courier of Sistan", "Rakhsh stable route", "House of Zal", "Book of Kings record"],
      summary: "Legendary champion of Iran whose strength, judgment, and loyalty carried the realm through its hardest wars. Rescued kings, broke demonic sieges, guarded the frontier against Turan, and became the final name called when ordinary armies could no longer protect the crown.",
      quote: "I stand where Iran needs a shield, whether the road leads to mountains, demons, or kings.",
      skills: [["Heroic combat", ["Mace mastery", "Mounted archery", "Wrestling", "Lasso tactics"]], ["Command", ["Frontier defense", "Royal rescue", "Army morale", "Mentoring heroes"]], ["Mythic endurance", ["Seven Labors", "Demon slaying", "Desert crossing", "Night watch"]], ["Judgment", ["Court counsel", "Oath keeping", "Mercy after victory", "Crisis reading"]]],
      experience: [["Champion of Iran", "Kayanian Court", "Reigns of Kay Kavus to Kay Khosrow", "Iran", ["Rescued Kay Kavus and the Iranian host from Mazandaran after the army was blinded and imprisoned.", "Defeated the White Demon, restored the king's sight, and returned the court to power.", "Held the eastern frontier when Turanian pressure threatened the realm."]], ["Hero of Sistan", "House of Zal", "Youth onward", "Zabulistan", ["Tamed Rakhsh, the only steed strong enough to bear him into war.", "Defeated the white elephant with the mace of Sam and proved readiness for royal service.", "Protected Sistan as a stable power behind the Iranian throne."]], ["Mentor and last resort", "Iranian host", "Heroic age", "Iran and Turan", ["Trained and advised younger princes in arms, discipline, and restraint.", "Entered impossible conflicts only after counsel, oath, and duty had been weighed."]]],
      projects: [["The Seven Labors", "Mazandaran campaign", "shahnameh.example/haft-khan", ["Crossed wilderness, fought beasts and demons, and completed a royal rescue without an army."]], ["Defense of Iran", "Long war with Turan", "shahnameh.example/iran-turan", ["Stabilized the border through repeated duels, raids, and battlefield interventions."]], ["Rakhsh partnership", "Life-long campaign", "shahnameh.example/rakhsh", ["Built the most famous rider-and-steed partnership in Persian epic memory."]]],
      education: ["Heroic arms and royal counsel", "House of Zal and wisdom of the Simorgh", "Childhood to youth", "Zabulistan", "Raised in the house of Zal with inherited knowledge from Sam and the protective wisdom of the Simorgh."],
      achievements: [["Completed the Seven Labors", "Saved the king and army from Mazandaran."], ["Defeated the White Demon", "Restored sight, honor, and command to the Iranian court."], ["Defender of Sistan", "Kept the eastern stronghold loyal and battle-ready."], ["Undefeated champion", "Became the measure against which all heroes were tested."]],
      interests: ["Horsemanship", "Hunting", "Feasting after victory", "Counsel of elders", "Keeping oaths"],
      publications: [["Rostam in the Shahnameh", "Abolqasem Ferdowsi", "c. 1010 CE", "A heroic career preserved in the Persian Book of Kings."]]
    },
    fa: {
      firstName: "رستم",
      lastName: "تهمتن",
      headline: "پهلوان ایران | قهرمان سیستان | گذرنده هفت خان",
      location: "زابلستان و دربار ایران",
      contact: ["پیک شاهی سیستان", "راه اصطبل رخش", "خانه زال", "دفتر شاهنامه"],
      summary: "پهلوان نامدار ایران که زور بازو، خرد عملی و وفاداری او پناه کشور در سخت ترین روزگارها بود. شاهان را از بند رهانید، دیوان را شکست، مرزهای ایران را در برابر توران نگه داشت و هرگاه سپاه از چاره می ماند، نام او آخرین امید دربار بود.",
      quote: "هر جا ایران سپر بخواهد، من می ایستم؛ خواه راه به کوه برسد، خواه به دیو، خواه به تخت شاهی.",
      skills: [["رزم پهلوانی", ["گرزآوری", "تیراندازی بر اسب", "کشتی", "کمنداندازی"]], ["فرماندهی", ["دفاع مرزی", "رهایی شاه", "روحیه سپاه", "پرورش پهلوانان"]], ["تاب اسطوره ای", ["هفت خان", "دیوکشی", "گذر از بیابان", "نگهبانی شبانه"]], ["داوری", ["رایزنی دربار", "پایبندی به سوگند", "بخشایش پس از پیروزی", "شناخت بحران"]]],
      experience: [["پهلوان ایران", "دربار کیانی", "از کاووس تا کیخسرو", "ایران", ["کاووس و سپاه ایران را پس از گرفتاری در مازندران از بند و نابینایی رهانید.", "دیو سپید را شکست، بینایی شاه را بازگرداند و شکوه دربار را احیا کرد.", "هنگام فشار تورانیان، مرزهای شرقی ایران را استوار نگه داشت."]], ["قهرمان سیستان", "خانه زال", "از جوانی", "زابلستان", ["رخش را رام کرد؛ اسبی که تنها او توان کشیدن پهلوان را داشت.", "فیل سپید خشمگین را با گرز سام از پا انداخت و شایستگی خدمت شاهی را نشان داد.", "سیستان را به پشتوانه ای نیرومند برای تخت ایران بدل کرد."]], ["رایزن و آخرین پناه", "سپاه ایران", "روزگار پهلوانی", "ایران و توران", ["شاهزادگان جوان را در رزم، خویشتن داری و آیین پهلوانی راه نمود.", "تنها پس از سنجیدن سوگند، داد و وظیفه وارد نبردهای ناممکن شد."]]],
      projects: [["هفت خان رستم", "لشکرکشی مازندران", "روایت شاهنامه", ["از بیابان و کوه گذشت، با جانوران و دیوان جنگید و شاه را بی سپاه نجات داد."]], ["پاسداری از ایران", "نبردهای ایران و توران", "روایت شاهنامه", ["با دوئل ها، یورش ها و حضور در میدان، مرز را از فروپاشی دور نگه داشت."]], ["همراهی با رخش", "همه عمر پهلوانی", "روایت شاهنامه", ["نامدارترین پیوند سوار و اسب را در حافظه حماسی ایران ساخت."]]],
      education: ["رزم پهلوانی و رای شاهی", "خانه زال و فرزانگی سیمرغ", "کودکی تا جوانی", "زابلستان", "در خاندان زال پرورش یافت و دانش سام و راهنمایی سیمرغ را پشتوانه خود کرد."],
      achievements: [["گذر از هفت خان", "شاه و سپاه را از مازندران نجات داد."], ["شکست دیو سپید", "بینایی و فرمانروایی را به دربار بازگرداند."], ["پاسدار سیستان", "مرز شرقی را وفادار و آماده نگه داشت."], ["پهلوان بی همتا", "معیار سنجش همه پهلوانان پس از خود شد."]],
      interests: ["سوارکاری", "شکار", "بزم پس از پیروزی", "رای پیران", "وفاداری به سوگند"],
      publications: [["رستم در شاهنامه", "ابوالقاسم فردوسی", "حدود ۴۰۰ هجری", "کارنامه پهلوانی که در کتاب شاهان ایران ماندگار شد."]]
    }
  },
  "classic-blue-lines": {
    pageSize: "Letter",
    photo: "gordafarid.png",
    en: {
      firstName: "Gordafarid",
      lastName: "Dezhban",
      headline: "Defender of the White Fortress | Warrior and strategist",
      location: "White Fortress on the Iranian frontier",
      contact: ["fortress watch", "eastern gate", "House of Gozhdaham", "frontier dispatch"],
      summary: "Courageous Iranian warrior who rode out when Sohrab pressed the White Fortress. Used speed, disguise, negotiation, and nerve to delay a stronger champion, protect the garrison, and prove that duty to Iran was not limited by expectation or fear.",
      quote: "A fortress is kept first in the heart, then by stone, gate, and spear.",
      skills: [["Defense", ["Fortress command", "Mounted combat", "Delay tactics", "Gate security"]], ["Strategy", ["Disguise", "Rapid retreat", "Reading rivals", "Pressure negotiation"]], ["Leadership", ["Morale", "Symbolic courage", "Crisis calm", "Frontier loyalty"]], ["Arms", ["Spear", "Sword", "Helmet craft", "War horse handling"]]],
      experience: [["Defender of the White Fortress", "Iranian frontier command", "Sohrab campaign", "Sepid Dezh", ["Rode out in armor to challenge Sohrab and buy time for the fortress.", "Turned a losing duel into a successful withdrawal through timing and speech.", "Kept the garrison from panic while Turanian pressure mounted."]], ["Daughter of Gozhdaham", "House of the fortress keeper", "Youth to campaign", "White Fortress", ["Trained in arms, riding, and border discipline inside a military household.", "Learned to treat honor as a practical defense resource, not only a courtly word."]], ["Symbol of resistance", "Iranian memory", "After the duel", "Epic tradition", ["Became a model of courage for defenders facing superior force.", "Showed that tactical survival can protect national honor as much as victory."]]],
      projects: [["White Fortress Stand", "Turanian incursion", "shahnameh.example/white-fortress", ["Delayed Sohrab and preserved time for Iran to answer the invasion."]], ["Masked duel", "Single combat", "shahnameh.example/gordafarid", ["Used concealed identity and battlefield wit to survive a stronger opponent."]], ["Garrison morale", "Frontier crisis", "shahnameh.example/frontier", ["Kept defenders organized under the shock of Sohrab's advance."]]],
      education: ["Arms, riding, and fortress discipline", "House of Gozhdaham", "Youth", "White Fortress", "Raised in a border family responsible for watching the dangerous road between Iran and Turan."],
      achievements: [["Faced Sohrab first", "Met the young champion before Iran's great heroes arrived."], ["Protected the fortress", "Bought time for warning and defense."], ["Preserved honor", "Transformed retreat into strategy."], ["Inspired later defenders", "Became a lasting emblem of courage."]],
      interests: ["Archery", "Riding", "Fortress design", "Border intelligence", "Honor codes"],
      publications: [["Gordafarid in the Shahnameh", "Abolqasem Ferdowsi", "c. 1010 CE", "A compact but powerful episode of courage at the frontier."]]
    },
    fa: {
      firstName: "گردآفرید",
      lastName: "دژبان",
      headline: "مدافع دژ سپید | جنگاور و تدبیرگر مرز",
      location: "دژ سپید در مرز ایران",
      contact: ["دیدبان دژ", "دروازه شرقی", "خانه گژدهم", "نامه مرزی"],
      summary: "جنگاور دلیر ایرانی که هنگام فشار سهراب بر دژ سپید به میدان رفت. با شتاب، پوشش جنگی، گفتار سنجیده و آرامش در بحران، پهلوانی نیرومندتر را درنگ داد، پادگان را نگه داشت و نشان داد وظیفه نسبت به ایران مرز جنسیت و هراس نمی شناسد.",
      quote: "دژ نخست در دل نگاه داشته می شود، سپس با سنگ و دروازه و نیزه.",
      skills: [["دفاع", ["فرماندهی دژ", "نبرد سواره", "تاکتیک تاخیر", "امنیت دروازه"]], ["تدبیر", ["پوشش هویت", "عقب نشینی سریع", "شناخت حریف", "مذاکره زیر فشار"]], ["رهبری", ["روحیه بخشی", "شجاعت نمادین", "آرامش بحران", "وفاداری مرزی"]], ["جنگ افزار", ["نیزه", "شمشیر", "کلاهخود", "اسب جنگی"]]],
      experience: [["مدافع دژ سپید", "فرماندهی مرزی ایران", "لشکرکشی سهراب", "سپید دژ", ["با زره به میدان رفت تا سهراب را به نبرد بخواند و برای دژ زمان بخرد.", "دوئل دشوار را با زمان شناسی و سخن سنجیده به عقب نشینی موفق بدل کرد.", "پادگان را در برابر فشار تورانیان از آشفتگی دور نگه داشت."]], ["دختر گژدهم", "خانه نگهبان دژ", "جوانی تا نبرد", "دژ سپید", ["در خانواده ای مرزی، رزم، سوارکاری و آیین پاسداری آموخت.", "آموخت که ناموس و شرف تنها واژه درباری نیست، بلکه سرمایه عملی دفاع است."]], ["نماد ایستادگی", "حافظه ایرانی", "پس از دوئل", "روایت حماسی", ["برای مدافعانی که با نیروی برتر روبه رو می شوند، نمونه شجاعت شد.", "نشان داد زنده ماندن هوشمندانه نیز می تواند آبرو و کشور را حفظ کند."]]],
      projects: [["ایستادگی دژ سپید", "یورش تورانیان", "روایت شاهنامه", ["سهراب را درنگ داد و برای رسیدن هشدار به ایران زمان ساخت."]], ["نبرد با پوشش هویت", "رزم تن به تن", "روایت شاهنامه", ["با هویت پنهان و هوش میدان از حریفی نیرومندتر جان به در برد."]], ["نگهداشت روحیه پادگان", "بحران مرزی", "روایت شاهنامه", ["مدافعان را در شوک پیشروی سهراب منظم نگه داشت."]]],
      education: ["رزم، سوارکاری و آیین دژبانی", "خانه گژدهم", "جوانی", "دژ سپید", "در خاندان نگهبان مرز پرورش یافت؛ جایی که راه ایران و توران همواره زیر نظر بود."],
      achievements: [["نخستین رویارویی با سهراب", "پیش از رسیدن پهلوانان بزرگ ایران به میدان رفت."], ["حفظ دژ", "برای هشدار و دفاع زمان خرید."], ["نگهداشت آبرو", "عقب نشینی را به تدبیر بدل کرد."], ["الهام مدافعان", "نماد پایدار شجاعت مرزی شد."]],
      interests: ["تیراندازی", "سوارکاری", "ساختار دژ", "خبر مرزی", "آیین جوانمردی"],
      publications: [["گردآفرید در شاهنامه", "ابوالقاسم فردوسی", "حدود ۴۰۰ هجری", "روایتی کوتاه و نیرومند از شجاعت در مرز."]]
    }
  },
  "purple-compact": {
    pageSize: "A4",
    photo: "sohrab.png",
    en: {
      firstName: "Sohrab",
      lastName: "Samangan",
      headline: "Young champion of Turan | Seeker of Rostam",
      location: "Samangan and the Iranian frontier",
      contact: ["camp standard", "Samangan court", "armlet of lineage", "campaign record"],
      summary: "Prodigious young hero raised in Samangan with the signs of Rostam's lineage. Led a swift Turanian campaign while searching for his unknown father, combining strength, charisma, and tragic innocence in one of the Shahnameh's most moving stories.",
      quote: "I came for a father and found a battlefield between two worlds.",
      skills: [["Combat", ["Wrestling", "Spear fighting", "Siege pressure", "Duel courage"]], ["Campaigning", ["Rapid advance", "Troop command", "Frontline challenge", "Fortress pressure"]], ["Presence", ["Charisma", "Fearless speech", "Youthful force", "Mercy to captives"]], ["Lineage", ["Identity seeking", "Token keeping", "Heroic ambition", "Dynastic vision"]]],
      experience: [["Young champion", "Army of Turan", "Sohrab campaign", "Iranian frontier", ["Advanced rapidly toward Iran while seeking Rostam.", "Captured frontier positions and forced Iran to summon its greatest champion.", "Showed mercy and curiosity even while leading an invading host."]], ["Prince of Samangan", "Court of Tahmineh", "Youth", "Samangan", ["Grew under Tahmineh's protection with the armlet of Rostam as proof of lineage.", "Mastered arms unusually early and drew warriors to his banner."]], ["Tragic challenger", "Field of single combat", "Final duel", "Iran", ["Faced Rostam without knowing the bond between them.", "Turned hidden identity into the central wound of the epic."]]],
      projects: [["Search for Rostam", "Final campaign", "shahnameh.example/sohrab", ["Transformed a military expedition into a personal search for father and rightful order."]], ["Frontier breakthrough", "Opening campaign", "shahnameh.example/frontier", ["Overran defensive positions quickly enough to alarm the Iranian court."]], ["Armlet of recognition", "Life-long sign", "shahnameh.example/armlet", ["Carried the token meant to reveal his father, though fate delayed recognition."]]],
      education: ["Heroic arms and noble conduct", "Court of Samangan", "Youth", "Samangan", "Raised by Tahmineh with the signs of Rostam's house and trained for kingly combat."],
      achievements: [["Forced Iran to call Rostam", "Made the court summon its greatest defender."], ["United youth and command", "Led warriors while still very young."], ["Captured frontier ground", "Shook the first defenses of Iran."], ["Became a tragic emblem", "His story warns against hidden truth and delayed recognition."]],
      interests: ["Lineage", "Wrestling", "Horses", "Royal destiny", "Questions of identity"],
      publications: [["Sohrab in the Shahnameh", "Abolqasem Ferdowsi", "c. 1010 CE", "The great tragedy of youth, power, and unknown kinship."]]
    },
    fa: {
      firstName: "سهراب",
      lastName: "سمنگان",
      headline: "پهلوان جوان توران | جوینده رستم",
      location: "سمنگان و مرز ایران",
      contact: ["درفش اردو", "دربار سمنگان", "بازوبند تبار", "دفتر لشکر"],
      summary: "پهلوان جوان و شگفت انگیزی که در سمنگان با نشان تبار رستم پرورش یافت. در جست و جوی پدر ناشناخته خود، سپاهی تندرو را به مرز ایران رساند و نیرو، گیرایی و معصومیت تراژیک را در یکی از جانسوزترین داستان های شاهنامه به هم پیوند زد.",
      quote: "برای یافتن پدر آمدم و میدان جنگی میان دو جهان یافتم.",
      skills: [["رزم", ["کشتی", "نیزه داری", "فشار بر دژ", "شجاعت دوئل"]], ["لشکرکشی", ["پیشروی سریع", "فرماندهی سپاه", "چالش پیشانی", "فشار مرزی"]], ["حضور", ["گیرایی", "سخن بی هراس", "نیروی جوانی", "بخشش اسیران"]], ["تبار", ["جست و جوی هویت", "نگهداری نشان", "بلندپروازی پهلوانی", "تصور پادشاهی"]]],
      experience: [["پهلوان جوان", "سپاه توران", "لشکرکشی سهراب", "مرز ایران", ["به شتاب به سوی ایران آمد و همزمان رستم را می جست.", "مواضع مرزی را گرفت و دربار ایران را واداشت بزرگ ترین پهلوان را فراخواند.", "با وجود فرماندهی سپاه مهاجم، کنجکاوی و بخشندگی خود را نشان داد."]], ["شاهزاده سمنگان", "دربار تهمینه", "جوانی", "سمنگان", ["زیر حمایت تهمینه و با بازوبند رستم به عنوان نشان تبار رشد کرد.", "بسیار زودتر از سن خود رزم آموخت و جنگاوران را به سوی درفش خود کشاند."]], ["چالشگر تراژیک", "میدان نبرد تن به تن", "دوئل پایانی", "ایران", ["با رستم روبه رو شد بی آن که پیوند خون میانشان آشکار باشد.", "هویت پنهان را به زخم مرکزی داستان بدل کرد."]]],
      projects: [["جست و جوی رستم", "لشکرکشی پایانی", "روایت شاهنامه", ["یک حرکت نظامی را به جست و جویی شخصی برای پدر و سامان درست جهان بدل کرد."]], ["شکستن مرز", "آغاز لشکرکشی", "روایت شاهنامه", ["دفاع های نخستین ایران را چنان سریع شکست که دربار را هراسان کرد."]], ["بازوبند شناسایی", "نشان زندگی", "روایت شاهنامه", ["نشانی را حمل کرد که باید پدر را آشکار می کرد، اما تقدیر شناخت را دیر کرد."]]],
      education: ["رزم پهلوانی و آیین بزرگی", "دربار سمنگان", "جوانی", "سمنگان", "تهمینه او را با نشان خاندان رستم پرورد و برای نبرد شاهانه آماده کرد."],
      achievements: [["فراخواندن رستم", "دربار ایران را واداشت بزرگ ترین مدافع خود را بخواهد."], ["فرماندهی در جوانی", "در سن کم سپاه را رهبری کرد."], ["گشودن مرز", "دفاع نخست ایران را لرزاند."], ["نماد تراژدی", "داستان او هشدار پنهان ماندن حقیقت شد."]],
      interests: ["تبار", "کشتی", "اسب", "سرنوشت شاهی", "پرسش هویت"],
      publications: [["سهراب در شاهنامه", "ابوالقاسم فردوسی", "حدود ۴۰۰ هجری", "تراژدی بزرگ جوانی، نیرو و خویشاوندی ناشناخته."]]
    }
  },
  "modern-minimal": {
    pageSize: "A4",
    photo: "siavash.png",
    en: {
      firstName: "Siavash",
      lastName: "Kayanian",
      headline: "Prince of Iran | Peace envoy | Founder of Siavashgerd",
      location: "Iran, Turan, and Siavashgerd",
      contact: ["royal court", "peace embassy", "Siavashgerd record", "Kayanian archive"],
      summary: "Kayanian prince remembered for truthfulness, restraint, and tragic innocence. Passed through fire to prove purity, chose peace over needless bloodshed, honored sworn terms even under pressure, and founded Siavashgerd before becoming a martyr whose death reshaped Iran and Turan.",
      quote: "A promise kept in exile is stronger than a throne kept by deceit.",
      skills: [["Diplomacy", ["Peace negotiation", "Hostage exchange", "Court protocol", "Treaty keeping"]], ["Ethics", ["Truthfulness", "Restraint", "Public trust", "Fire ordeal"]], ["Leadership", ["City founding", "Alliance building", "Military discipline", "Calm command"]], ["Governance", ["Justice", "Order", "Ritual care", "Civic beauty"]]],
      experience: [["Prince and peace envoy", "Kayanian Court", "Reign of Kay Kavus", "Iran", ["Passed through fire to answer accusation and restore public trust.", "Defeated Turan in battle but chose negotiated peace over wasteful killing.", "Refused to violate sworn terms even when his own court demanded it."]], ["Founder", "Siavashgerd", "Exile in Turan", "Turan", ["Built a city remembered for order, beauty, and just rule.", "Maintained dignity while navigating suspicion inside Afrasiab's court."]], ["Martyred prince", "Iranian memory", "After betrayal", "Epic tradition", ["His death became the moral wound that drove Kay Khosrow's mission.", "Transformed private injustice into a national call for justice."]]],
      projects: [["Trial by fire", "Court accusation", "shahnameh.example/fire", ["Entered flame to prove innocence and emerged unharmed."]], ["Peace with Turan", "Border campaign", "shahnameh.example/peace", ["Turned victory into a treaty and protected captives by honoring terms."]], ["Siavashgerd", "Exile project", "shahnameh.example/siavashgerd", ["Founded a model city that embodied grace, order, and restraint."]]],
      education: ["Royal conduct, arms, and governance", "Training of Rostam", "Youth", "Zabulistan", "Entrusted to Rostam for heroic education away from court intrigue."],
      achievements: [["Passed through fire", "Proved innocence before the realm."], ["Protected the treaty", "Chose oath over political pressure."], ["Founded Siavashgerd", "Built beauty and order in exile."], ["Inspired Kay Khosrow", "His death became a force of justice."]],
      interests: ["Peacecraft", "City building", "Ritual purity", "Horses", "Just law"],
      publications: [["Siavash in the Shahnameh", "Abolqasem Ferdowsi", "c. 1010 CE", "A story of purity, politics, exile, and martyrdom."]]
    },
    fa: {
      firstName: "سیاوش",
      lastName: "کیانی",
      headline: "شاهزاده ایران | فرستاده صلح | بنیان گذار سیاوشگرد",
      location: "ایران، توران و سیاوشگرد",
      contact: ["دربار شاهی", "فرستادگی صلح", "دفتر سیاوشگرد", "بایگانی کیانی"],
      summary: "شاهزاده کیانی که به راستی، خویشتن داری و بی گناهی تراژیک شناخته می شود. برای اثبات پاکی از آتش گذشت، صلح را بر خونریزی بیهوده برگزید، به پیمان وفادار ماند و پیش از شهادتی که سرنوشت ایران و توران را دگرگون کرد، سیاوشگرد را بنیاد نهاد.",
      quote: "پیمانی که در غربت نگاه داشته شود، از تختی که با فریب بماند نیرومندتر است.",
      skills: [["دیپلماسی", ["مذاکره صلح", "مبادله گروگان", "آیین دربار", "نگهداشت پیمان"]], ["اخلاق", ["راستی", "خویشتن داری", "اعتماد عمومی", "گذر از آتش"]], ["رهبری", ["بنیان گذاری شهر", "اتحادسازی", "انضباط سپاه", "فرمان آرام"]], ["حکمرانی", ["داد", "نظم", "آیین پاکی", "زیبایی شهری"]]],
      experience: [["شاهزاده و فرستاده صلح", "دربار کیانی", "پادشاهی کاووس", "ایران", ["برای پاسخ به اتهام و بازگرداندن اعتماد مردم از آتش گذشت.", "پس از پیروزی بر توران، صلح را بر کشتار بیهوده ترجیح داد.", "حتی زیر فشار دربار خود، پیمان بسته را نشکست."]], ["بنیان گذار", "سیاوشگرد", "تبعید در توران", "توران", ["شهری ساخت که به نظم، زیبایی و دادگری شناخته شد.", "در دربار افراسیاب، با وجود بدگمانی ها، وقار خود را نگه داشت."]], ["شاهزاده شهید", "حافظه ایران", "پس از خیانت", "روایت حماسی", ["مرگ او زخم اخلاقی بزرگی شد که ماموریت کیخسرو را شکل داد.", "ستم شخصی را به ندای ملی دادخواهی بدل کرد."]]],
      projects: [["گذر از آتش", "اتهام دربار", "روایت شاهنامه", ["برای اثبات بی گناهی در آتش رفت و بی گزند بیرون آمد."]], ["صلح با توران", "لشکرکشی مرزی", "روایت شاهنامه", ["پیروزی را به پیمان بدل کرد و اسیران را با وفاداری به عهد حفظ کرد."]], ["سیاوشگرد", "پروژه تبعید", "روایت شاهنامه", ["شهری نمونه ساخت که وقار، نظم و خویشتن داری را نشان می داد."]]],
      education: ["آیین شاهی، رزم و کشورداری", "آموزش رستم", "جوانی", "زابلستان", "برای دوری از فتنه دربار به رستم سپرده شد تا تربیت پهلوانی و شاهانه بیاموزد."],
      achievements: [["گذر از آتش", "بی گناهی خود را پیش چشم کشور ثابت کرد."], ["پاسداری از پیمان", "سوگند را بر فشار سیاسی ترجیح داد."], ["بنیان گذاری سیاوشگرد", "در غربت زیبایی و نظم ساخت."], ["الهام کیخسرو", "مرگ او نیروی دادخواهی شد."]],
      interests: ["صلح سازی", "شهرسازی", "پاکی آیینی", "اسب", "قانون دادگر"],
      publications: [["سیاوش در شاهنامه", "ابوالقاسم فردوسی", "حدود ۴۰۰ هجری", "داستان پاکی، سیاست، تبعید و شهادت."]]
    }
  },
  "executive": {
    pageSize: "Letter",
    photo: "esfandiar.png",
    en: {
      firstName: "Esfandiar",
      lastName: "Ruyintan",
      headline: "Crown prince of Iran | Invulnerable champion | Commander of the Seven Labors",
      location: "Court of Goshtasp and Iranian campaigns",
      contact: ["royal summons", "crown command", "bronze-bodied record", "Kayanian mandate"],
      summary: "Crown prince and invulnerable champion of Iran, famed for discipline, sacred duty, and command under impossible orders. Completed his own Seven Labors, rescued royal captives, defeated Arjasp's forces, and entered the fatal mission to bind Rostam while caught between obedience and justice.",
      quote: "Duty without wisdom becomes a chain, yet a prince must still face the chain.",
      skills: [["Executive command", ["Campaign leadership", "Royal mandate", "Succession readiness", "High-stakes judgment"]], ["Elite combat", ["Invulnerable defense", "Swordsmanship", "Monster fighting", "Siege assault"]], ["Mission delivery", ["Seven Labors", "Hostage rescue", "Deep campaign", "Relentless execution"]], ["Faith and order", ["Sacred duty", "Court discipline", "Lawful command", "Personal sacrifice"]]],
      experience: [["Crown prince and commander", "Court of Goshtasp", "Kayanian era", "Iran", ["Led campaigns against Arjasp and restored royal authority.", "Completed the Seven Labors of Esfandiar and rescued captive sisters.", "Accepted the impossible charge to bind Rostam, revealing the cost of obedience."]], ["Invulnerable champion", "Iranian host", "Royal campaigns", "Iran and foreign lands", ["Carried the reputation of Ruyintan, vulnerable only in the eyes.", "Used personal courage to turn difficult campaigns into royal victories."]], ["Heir under pressure", "Kayanian succession", "Final mission", "Sistan road", ["Balanced desire for the throne with command from his father.", "Met Rostam as both rival and elder hero, making the conflict morally unbearable."]]],
      projects: [["Seven Labors of Esfandiar", "Campaign against Arjasp", "shahnameh.example/esfandiar-labors", ["Defeated wolves, lions, dragons, witches, storms, and fortress threats to complete a rescue mission."]], ["Rescue of royal captives", "Ruyin Dezh campaign", "shahnameh.example/ruyin-dezh", ["Broke enemy power and restored the honor of Goshtasp's house."]], ["Mission to Sistan", "Final royal order", "shahnameh.example/rostam-esfandiar", ["Carried a command that placed loyalty, justice, and heroism in open conflict."]]],
      education: ["Royal command and sacred duty", "Court of Goshtasp", "Youth", "Iran", "Prepared for kingship through arms, faith, discipline, and the burden of command."],
      achievements: [["Completed the Seven Labors", "Delivered a royal rescue through impossible hazards."], ["Rescued royal captives", "Restored honor after Arjasp's aggression."], ["Ruyintan champion", "Became the bronze-bodied defender of Iran."], ["Faced Rostam", "Entered the epic's hardest conflict of duty and justice."]],
      interests: ["Kingship", "Sacred law", "Military discipline", "Succession", "Justice"],
      publications: [["Esfandiar in the Shahnameh", "Abolqasem Ferdowsi", "c. 1010 CE", "A royal tragedy of obedience, power, and invulnerable courage."]]
    },
    fa: {
      firstName: "اسفندیار",
      lastName: "رویین تن",
      headline: "ولیعهد ایران | پهلوان رویین تن | فرمانده هفت خان",
      location: "دربار گشتاسپ و کارزارهای ایران",
      contact: ["فرمان شاهی", "درفش ولیعهدی", "دفتر رویین تنی", "ماموریت کیانی"],
      summary: "ولیعهد و پهلوان رویین تن ایران که به انضباط، وظیفه مقدس و فرماندهی در ماموریت های ناممکن شناخته می شود. هفت خان خود را گذراند، اسیران شاهی را رهانید، سپاه ارجاسپ را شکست و در ماموریت بستن رستم، میان فرمانبری و داد گرفتار شد.",
      quote: "وظیفه اگر بی خردی باشد زنجیر می شود، اما شاهزاده باید همان زنجیر را نیز رو در رو ببیند.",
      skills: [["فرماندهی شاهانه", ["رهبری کارزار", "ماموریت شاهی", "آمادگی جانشینی", "داوری پرخطر"]], ["رزم برگزیده", ["دفاع رویین تن", "شمشیرزنی", "نبرد با هیولا", "گشودن دژ"]], ["انجام ماموریت", ["هفت خان", "رهایی گروگان", "لشکرکشی دور", "اجرای پیگیر"]], ["دین و نظم", ["وظیفه مقدس", "انضباط دربار", "فرمان قانونی", "فداکاری شخصی"]]],
      experience: [["ولیعهد و فرمانده", "دربار گشتاسپ", "روزگار کیانی", "ایران", ["بر ضد ارجاسپ لشکر کشید و اقتدار شاهی را بازگرداند.", "هفت خان اسفندیار را گذراند و خواهران اسیر را رهانید.", "ماموریت ناممکن بستن رستم را پذیرفت و هزینه فرمانبری را آشکار کرد."]], ["پهلوان رویین تن", "سپاه ایران", "کارزارهای شاهی", "ایران و سرزمین های دور", ["آوازه رویین تنی را داشت؛ تنها چشمانش آسیب پذیر بود.", "با شجاعت شخصی، کارزارهای دشوار را به پیروزی شاهی بدل کرد."]], ["وارث زیر فشار", "جانشینی کیانی", "ماموریت پایانی", "راه سیستان", ["میل به تخت را با فرمان پدر در ترازوی سختی گذاشت.", "با رستم چنان روبه رو شد که هم رقیب بود و هم پهلوان بزرگ پیشین."]]],
      projects: [["هفت خان اسفندیار", "کارزار ارجاسپ", "روایت شاهنامه", ["گرگ، شیر، اژدها، جادو، توفان و دژ را پشت سر گذاشت تا ماموریت رهایی را به پایان برد."]], ["رهایی اسیران شاهی", "کارزار رویین دژ", "روایت شاهنامه", ["قدرت دشمن را شکست و آبروی خاندان گشتاسپ را بازگرداند."]], ["ماموریت سیستان", "فرمان پایانی شاه", "روایت شاهنامه", ["فرمانی را برد که وفاداری، داد و پهلوانی را در برابر هم گذاشت."]]],
      education: ["فرماندهی شاهی و وظیفه مقدس", "دربار گشتاسپ", "جوانی", "ایران", "برای پادشاهی با رزم، دین، انضباط و بار فرمان آماده شد."],
      achievements: [["گذر از هفت خان", "ماموریت رهایی شاهانه را از خطرهای ناممکن گذراند."], ["رهایی اسیران", "آبرو را پس از یورش ارجاسپ بازگرداند."], ["پهلوان رویین تن", "مدافع زرهین ایران شد."], ["رویارویی با رستم", "سخت ترین کشمکش وظیفه و داد را پذیرفت."]],
      interests: ["پادشاهی", "آیین مقدس", "انضباط سپاه", "جانشینی", "داد"],
      publications: [["اسفندیار در شاهنامه", "ابوالقاسم فردوسی", "حدود ۴۰۰ هجری", "تراژدی شاهانه فرمانبری، قدرت و شجاعت رویین تن."]]
    }
  },
  "teal-pro": {
    pageSize: "A4",
    photo: "rudabeh.png",
    enKey: "rudabeh"
  },
  "warm-earth": {
    pageSize: "A4",
    photo: "tahmineh.png",
    enKey: "tahmineh"
  },
  "ats-clean": {
    pageSize: "Letter",
    photo: "afrasiab.png",
    enKey: "afrasiab"
  },
  "gordafarid-defender": {
    pageSize: "A4",
    photo: "gordafarid.png",
    aliasOf: "classic-blue-lines",
    headlineOverride: { en: "Defensive strategist of the White Fortress", fa: "راهبردپرداز دفاعی دژ سپید" }
  },
  "rudabeh-heritage": {
    pageSize: "A4",
    photo: "rudabeh.png",
    enKey: "rudabeh"
  }
};

const EXTRA_PERSONAS = {
  rudabeh: {
    en: {
      firstName: "Rudabeh",
      lastName: "Mehrabani",
      headline: "Princess of Kabul | Alliance builder | Mother of Rostam",
      location: "Kabul, Zabul, and the house of Zal",
      contact: ["palace tower", "Kabul court", "house of Mehrab", "Simorgh record"],
      summary: "Princess of Kabul whose courage and diplomacy joined the houses of Mehrab and Zal despite ancestral suspicion and political danger. Her decision created the union that led to Rostam's birth, making her one of the central builders of Iran's heroic future.",
      quote: "Love without wisdom burns quickly; wisdom without courage never crosses the tower.",
      skills: [["Alliance building", ["Cross-house diplomacy", "Trust making", "Conflict softening", "Family negotiation"]], ["Courage", ["Personal agency", "Court pressure", "Risk acceptance", "Steadfast speech"]], ["Legacy", ["Heroic lineage", "Cultural memory", "Maternal leadership", "Dynastic continuity"]], ["Care", ["Hospitality", "Listening", "Ritual respect", "Emotional clarity"]]],
      experience: [["Princess and diplomatic catalyst", "Court of Kabul", "Age of Zal", "Kabul", ["Built trust with Zal despite the danger between Kabul, Zabul, and Iran.", "Helped turn a possible royal crisis into an alliance of houses.", "Became mother of Rostam and secured the heroic line that would defend Iran."]], ["Bridge between houses", "House of Mehrab and House of Zal", "Kabul-Zabul union", "Kabul and Zabul", ["Moved between love, family honor, and political risk with unusual steadiness.", "Accepted counsel while keeping her own choice clear and active."]], ["Mother of the champion", "House of Zal", "Birth of Rostam", "Zabulistan", ["Endured the dangerous birth of Rostam through the miraculous help of the Simorgh.", "Anchored the family story that gave Iran its greatest defender."]]],
      projects: [["Union of Zal and Rudabeh", "Kabul-Zabul alliance", "shahnameh.example/rudabeh", ["Navigated family, kingdom, and lineage risk to establish a lasting heroic union."]], ["Birth of Rostam", "Simorgh-assisted delivery", "shahnameh.example/rostam-birth", ["Became central to the miraculous birth episode that saved mother and child."]], ["Cultural bridge", "After the union", "shahnameh.example/kabul-zabul", ["Linked courtly grace, personal courage, and future national defense."]]],
      education: ["Court culture, counsel, and royal diplomacy", "House of Mehrab", "Youth", "Kabul", "Raised in a royal household skilled in negotiation, hospitality, poetry, and dynastic politics."],
      achievements: [["United rival houses", "Joined Kabul and Zabul through a courageous choice."], ["Mother of Rostam", "Brought Iran's greatest champion into the heroic line."], ["Protected agency", "Acted with clarity under royal pressure."], ["Preserved legacy", "Made family love part of national destiny."]],
      interests: ["Poetry", "Court diplomacy", "Family memory", "Hospitality", "Courageous choice"],
      publications: [["Rudabeh in the Shahnameh", "Abolqasem Ferdowsi", "c. 1010 CE", "A luminous story of love, alliance, and heroic birth."]]
    },
    fa: {
      firstName: "رودابه",
      lastName: "مهرابانی",
      headline: "شاهزاده کابل | پیوندساز خاندان ها | مادر رستم",
      location: "کابل، زابل و خانه زال",
      contact: ["برج کاخ", "دربار کابل", "خانه مهراب", "دفتر سیمرغ"],
      summary: "شاهزاده کابل که با دلیری و دیپلماسی، خانه مهراب و زال را با وجود بدگمانی های کهن و خطر سیاسی به هم پیوند داد. انتخاب او اتحادی را ساخت که به زادن رستم انجامید و رودابه را از سازندگان اصلی آینده پهلوانی ایران کرد.",
      quote: "عشق بی خردی زود می سوزد؛ خرد بی دلیری هرگز از برج نمی گذرد.",
      skills: [["پیوندسازی", ["دیپلماسی میان خاندان ها", "اعتمادسازی", "آرام کردن تعارض", "گفت و گوی خانوادگی"]], ["دلیری", ["کنشگری شخصی", "فشار دربار", "پذیرش خطر", "سخن استوار"]], ["میراث", ["تبار پهلوانی", "حافظه فرهنگی", "رهبری مادرانه", "پیوستگی دودمان"]], ["مراقبت", ["مهمان نوازی", "شنیدن", "احترام آیینی", "روشنی عاطفی"]]],
      experience: [["شاهزاده و کاتالیزور دیپلماسی", "دربار کابل", "روزگار زال", "کابل", ["با وجود خطر میان کابل، زابل و ایران، با زال اعتماد ساخت.", "بحران احتمالی شاهانه را به اتحاد خاندان ها بدل کرد.", "مادر رستم شد و تبار پهلوانی نگهبان ایران را پایدار کرد."]], ["پل میان خاندان ها", "خانه مهراب و خانه زال", "پیوند کابل و زابل", "کابل و زابل", ["میان عشق، آبروی خانواده و خطر سیاسی با آرامش کم نظیر حرکت کرد.", "رای بزرگان را شنید اما انتخاب خود را روشن و زنده نگه داشت."]], ["مادر پهلوان", "خانه زال", "زادن رستم", "زابلستان", ["زادن دشوار رستم را با یاری معجزه آسای سیمرغ از سر گذراند.", "داستان خانوادگی ای را بنیاد گذاشت که بزرگ ترین مدافع ایران از آن برخاست."]]],
      projects: [["پیوند زال و رودابه", "اتحاد کابل و زابل", "روایت شاهنامه", ["خطر خانواده، کشور و تبار را گذراند تا اتحادی پایدار بسازد."]], ["زادن رستم", "یاری سیمرغ", "روایت شاهنامه", ["در رخداد معجزه آسایی که مادر و کودک را نجات داد، محور داستان شد."]], ["پل فرهنگی", "پس از پیوند", "روایت شاهنامه", ["وقار دربار، دلیری شخصی و آینده دفاع از ایران را به هم وصل کرد."]]],
      education: ["فرهنگ دربار، رایزنی و دیپلماسی شاهی", "خانه مهراب", "جوانی", "کابل", "در خانه ای شاهانه پرورش یافت که گفت و گو، مهمان نوازی، شعر و سیاست دودمانی را می شناخت."],
      achievements: [["پیوند خاندان های رقیب", "کابل و زابل را با انتخابی دلیرانه به هم رساند."], ["مادر رستم", "بزرگ ترین پهلوان ایران را به تبار حماسی آورد."], ["نگهداشت اختیار", "زیر فشار شاهانه روشن و کنشگر ماند."], ["پاسداری میراث", "عشق خانوادگی را به سرنوشت ملی پیوند زد."]],
      interests: ["شعر", "دیپلماسی دربار", "حافظه خانواده", "مهمان نوازی", "انتخاب دلیرانه"],
      publications: [["رودابه در شاهنامه", "ابوالقاسم فردوسی", "حدود ۴۰۰ هجری", "داستانی روشن از عشق، اتحاد و زایش پهلوانی."]]
    }
  },
  tahmineh: {
    en: {
      firstName: "Tahmineh",
      lastName: "Samangani",
      headline: "Princess of Samangan | Strategic host | Mother of Sohrab",
      location: "Samangan and the house of Rostam",
      contact: ["Samangan court", "royal chamber", "armlet keeper", "lineage memory"],
      summary: "Princess of Samangan who recognized Rostam's stature and acted with direct courage to shape her destiny. Hosted the hero after the loss of Rakhsh, preserved the token of lineage, and raised Sohrab at the emotional center of the epic's greatest tragedy.",
      quote: "A single token may carry a whole bloodline when the world forgets to ask the truth.",
      skills: [["Court strategy", ["Hospitality", "Private negotiation", "Lineage planning", "Political reading"]], ["Resolve", ["Self-advocacy", "Courage", "Dignity", "High-stakes choice"]], ["Stewardship", ["Heir raising", "Memory keeping", "Token protection", "Cultural continuity"]], ["Emotional intelligence", ["Direct speech", "Care", "Grief bearing", "Trust making"]]],
      experience: [["Princess and lineage steward", "Court of Samangan", "Age of Rostam", "Samangan", ["Hosted Rostam after the loss and recovery of Rakhsh.", "Created the bond that led to Sohrab's birth and preserved Rostam's identifying token.", "Raised Sohrab with knowledge of his heroic ancestry."]], ["Strategic host", "Samangan palace", "Rostam's arrival", "Samangan", ["Read the moment clearly and spoke with direct agency inside a royal setting.", "Balanced hospitality, desire, and future responsibility."]], ["Keeper of memory", "House of Sohrab", "Sohrab's youth", "Samangan", ["Maintained the story of Rostam so Sohrab could seek his father.", "Carried the sorrow of a truth that arrived too late."]]],
      projects: [["Safeguarding Sohrab's lineage", "Sohrab's youth", "shahnameh.example/tahmineh", ["Protected the armlet and story that connected Sohrab to Rostam."]], ["Hospitality to Rostam", "Rakhsh episode", "shahnameh.example/rakhsh", ["Turned an unexpected royal visit into a destiny-shaping encounter."]], ["Memory of Samangan", "After Sohrab", "shahnameh.example/samangan", ["Preserved dignity amid grief and gave the tragedy its human center."]]],
      education: ["Royal household leadership", "Court of Samangan", "Youth", "Samangan", "Prepared in courtly diplomacy, household command, noble alliance customs, and ceremonial speech."],
      achievements: [["Mother of Sohrab", "Raised the young champion of Samangan."], ["Keeper of Rostam's token", "Preserved the sign of fatherhood."], ["Linked heroic houses", "Connected Samangan to the house of Zal."], ["Voice of agency", "Acted directly in a world ruled by kings and armies."]],
      interests: ["Genealogy", "Court music", "Hospitality", "Memory keeping", "Private counsel"],
      publications: [["Tahmineh in the Shahnameh", "Abolqasem Ferdowsi", "c. 1010 CE", "A story of direct choice, motherhood, memory, and grief."]]
    },
    fa: {
      firstName: "تهمینه",
      lastName: "سمنگانی",
      headline: "شاهزاده سمنگان | میزبان تدبیرگر | مادر سهراب",
      location: "سمنگان و خانه رستم",
      contact: ["دربار سمنگان", "شبستان شاهی", "نگهبان بازوبند", "حافظه تبار"],
      summary: "شاهزاده سمنگان که بزرگی رستم را شناخت و با دلیری مستقیم سرنوشت خود را شکل داد. پس از گم شدن رخش، پهلوان را میزبانی کرد، نشان تبار را نگه داشت و سهراب را در مرکز عاطفی بزرگ ترین تراژدی شاهنامه پرورد.",
      quote: "گاه نشانی کوچک، همه خون یک خاندان را حمل می کند؛ وقتی جهان حقیقت را دیر می پرسد.",
      skills: [["تدبیر دربار", ["مهمان نوازی", "گفت و گوی خصوصی", "برنامه تبار", "شناخت سیاست"]], ["استواری", ["دفاع از خواست خود", "دلیری", "وقار", "انتخاب پرخطر"]], ["نگهبانی میراث", ["پرورش وارث", "حفظ خاطره", "نگهداری نشان", "پیوستگی فرهنگی"]], ["هوش عاطفی", ["سخن مستقیم", "مراقبت", "تحمل اندوه", "اعتمادسازی"]]],
      experience: [["شاهزاده و نگهبان تبار", "دربار سمنگان", "روزگار رستم", "سمنگان", ["پس از گم شدن و بازیافتن رخش، میزبان رستم شد.", "پیوندی ساخت که به زادن سهراب انجامید و نشان رستم را نگه داشت.", "سهراب را با آگاهی از تبار پهلوانی خود پرورش داد."]], ["میزبان راهبردی", "کاخ سمنگان", "آمدن رستم", "سمنگان", ["لحظه را درست شناخت و در فضای شاهانه با اختیار سخن گفت.", "مهمان نوازی، خواست دل و مسئولیت آینده را در تعادل نگه داشت."]], ["نگهبان خاطره", "خانه سهراب", "جوانی سهراب", "سمنگان", ["داستان رستم را زنده نگه داشت تا سهراب پدر را بجوید.", "اندوه حقیقتی را حمل کرد که دیر آشکار شد."]]],
      projects: [["نگهداشت تبار سهراب", "جوانی سهراب", "روایت شاهنامه", ["بازوبند و داستانی را حفظ کرد که سهراب را به رستم پیوند می داد."]], ["میزبانی رستم", "رخداد رخش", "روایت شاهنامه", ["دیداری ناگهانی را به رویدادی سرنوشت ساز بدل کرد."]], ["حافظه سمنگان", "پس از سهراب", "روایت شاهنامه", ["در میان اندوه، وقار را نگه داشت و تراژدی را انسانی کرد."]]],
      education: ["مدیریت خانه شاهی", "دربار سمنگان", "جوانی", "سمنگان", "در دیپلماسی دربار، فرمان خانه، رسم اتحاد و سخن آیینی پرورش یافت."],
      achievements: [["مادر سهراب", "پهلوان جوان سمنگان را پرورد."], ["نگهبان نشان رستم", "نشانه پدری را حفظ کرد."], ["پیوند خاندان ها", "سمنگان را به خانه زال وصل کرد."], ["صدای اختیار", "در جهانی زیر فرمان شاهان و سپاهان، مستقیم عمل کرد."]],
      interests: ["تبارشناسی", "موسیقی دربار", "مهمان نوازی", "حفظ خاطره", "رایزنی خصوصی"],
      publications: [["تهمینه در شاهنامه", "ابوالقاسم فردوسی", "حدود ۴۰۰ هجری", "داستان انتخاب مستقیم، مادری، خاطره و اندوه."]]
    }
  },
  afrasiab: {
    en: {
      firstName: "Afrasiab",
      lastName: "Turan",
      headline: "King of Turan | Strategic rival of Iran",
      location: "Turan and the Iran-Turan frontier",
      contact: ["royal war camp", "Turanian court", "house of Pashang", "campaign archive"],
      summary: "Long-ruling king of Turan and enduring adversary of Iran. His ambition, fear, political suspicion, and military persistence shaped generations of conflict, from the fate of Siavash to the rise of Kay Khosrow and the final reckoning of the heroic age.",
      quote: "A kingdom won by fear must spend every season guarding its own shadow.",
      skills: [["Grand strategy", ["War planning", "Alliance pressure", "Long campaigns", "Border raids"]], ["Rule", ["Court command", "Resource mobilization", "Dynastic politics", "Hard bargaining"]], ["Adversarial operations", ["Psychological pressure", "Hero containment", "Espionage", "Rapid reprisal"]], ["Survival", ["Retreat planning", "Hidden bases", "Risk sensing", "Last stands"]]],
      experience: [["King of Turan", "Turanian realm", "Kayanian age", "Turan", ["Led repeated campaigns against Iran and forced the Kayanian court into strategic defense.", "Hosted Siavash in exile before suspicion and court fear turned hospitality into tragedy.", "Became the central adversary whose defeat defined Kay Khosrow's mission."]], ["Rival of Iranian kings", "Iran-Turan conflict", "Multiple reigns", "Frontier lands", ["Applied pressure through raids, alliances, and court intrigue.", "Kept conflict alive across generations of heroes and kings."]], ["Fugitive sovereign", "Late heroic age", "After Kay Khosrow's rise", "Turan", ["Retreated into hidden places as the moral consequences of Siavash's death closed in.", "Met the end of a reign built on fear, strategy, and unresolved guilt."]]],
      projects: [["Iran-Turan long war", "Multiple reigns", "shahnameh.example/iran-turan", ["Sustained a multi-generational conflict that shaped both kingdoms."]], ["Siavash exile crisis", "Turan court", "shahnameh.example/siavash", ["Turned a chance for peace into the wound that doomed his house."]], ["Kay Khosrow pursuit", "Final reckoning", "shahnameh.example/kay-khosrow", ["Became the target of a justice mission rooted in family and nation."]]],
      education: ["Kingship and warcraft", "House of Pashang", "Youth", "Turan", "Raised for command in a court defined by rivalry with Iran and the burden of dynastic ambition."],
      achievements: [["Longest royal rival", "Sustained pressure on Iran over generations."], ["Shaped Siavash's fate", "His suspicion created the tragedy that changed the epic."], ["Defined Kay Khosrow's mission", "Became the adversary justice had to answer."], ["Mobilized Turan", "Held a vast realm through war and fear."]],
      interests: ["Kingship", "War councils", "Border politics", "Dynastic survival", "Hidden strongholds"],
      publications: [["Afrasiab in the Shahnameh", "Abolqasem Ferdowsi", "c. 1010 CE", "A portrait of power, fear, rivalry, and consequence."]]
    },
    fa: {
      firstName: "افراسیاب",
      lastName: "توران",
      headline: "شاه توران | رقیب راهبردی ایران",
      location: "توران و مرز ایران و توران",
      contact: ["اردوی شاهی", "دربار توران", "خانه پشنگ", "بایگانی کارزار"],
      summary: "شاه دیرپای توران و دشمن ماندگار ایران که بلندپروازی، هراس، بدگمانی سیاسی و پایداری نظامی او نسل های پیاپی جنگ را شکل داد؛ از سرنوشت سیاوش تا برآمدن کیخسرو و حساب نهایی روزگار پهلوانی.",
      quote: "پادشاهی که با ترس به دست آید، هر فصل باید سایه خود را نگهبانی کند.",
      skills: [["راهبرد کلان", ["طرح جنگ", "فشار اتحاد", "کارزار بلند", "یورش مرزی"]], ["فرمانروایی", ["فرمان دربار", "بسیج منابع", "سیاست دودمانی", "چانه زنی سخت"]], ["عملیات خصمانه", ["فشار روانی", "مهار پهلوان", "جاسوسی", "پاسخ سریع"]], ["بقا", ["برنامه عقب نشینی", "پناهگاه پنهان", "شناخت خطر", "ایستادگی پایانی"]]],
      experience: [["شاه توران", "پادشاهی توران", "روزگار کیانی", "توران", ["بارها بر ایران لشکر کشید و دربار کیانی را به دفاع راهبردی واداشت.", "سیاوش را در تبعید پذیرفت، اما بدگمانی و هراس دربار مهمان نوازی را به تراژدی بدل کرد.", "دشمن مرکزی شد که شکست او ماموریت کیخسرو را تعریف کرد."]], ["رقیب شاهان ایران", "نبرد ایران و توران", "چندین پادشاهی", "سرزمین های مرزی", ["با یورش، اتحاد و فتنه دربار فشار می آورد.", "آتش کشمکش را در نسل های پیاپی شاهان و پهلوانان روشن نگه داشت."]], ["شاه گریزنده", "پایان روزگار پهلوانی", "پس از برآمدن کیخسرو", "توران", ["با نزدیک شدن پیامد اخلاقی مرگ سیاوش، به پناهگاه های پنهان عقب نشست.", "پایان پادشاهی ای را دید که بر ترس، تدبیر و گناه حل نشده بنا شده بود."]]],
      projects: [["جنگ بلند ایران و توران", "چندین پادشاهی", "روایت شاهنامه", ["کشمکشی چندنسلی را نگه داشت که هر دو کشور را شکل داد."]], ["بحران تبعید سیاوش", "دربار توران", "روایت شاهنامه", ["فرصت صلح را به زخمی بدل کرد که خاندان خود او را نابود ساخت."]], ["پیگرد کیخسرو", "حساب نهایی", "روایت شاهنامه", ["هدف ماموریت دادخواهی شد که ریشه در خانواده و کشور داشت."]]],
      education: ["شاهی و جنگاوری", "خانه پشنگ", "جوانی", "توران", "در درباری پرورش یافت که رقابت با ایران و سنگینی بلندپروازی دودمانی آن را تعریف می کرد."],
      achievements: [["دیرپاترین رقیب شاهی", "نسل ها بر ایران فشار آورد."], ["شکل دادن سرنوشت سیاوش", "بدگمانی او تراژدی بزرگ را ساخت."], ["تعریف ماموریت کیخسرو", "دشمنی شد که داد باید به آن پاسخ می داد."], ["بسیج توران", "قلمرویی بزرگ را با جنگ و هراس نگه داشت."]],
      interests: ["پادشاهی", "شورای جنگ", "سیاست مرزی", "بقای دودمان", "پناهگاه پنهان"],
      publications: [["افراسیاب در شاهنامه", "ابوالقاسم فردوسی", "حدود ۴۰۰ هجری", "تصویری از قدرت، هراس، رقابت و پیامد."]]
    }
  }
};

function resolvePersona(templateId) {
  const base = PERSONAS[templateId] || PERSONAS["dark-sidebar"];
  if (base.aliasOf) {
    const source = structuredClone(resolvePersona(base.aliasOf));
    source.pageSize = base.pageSize || source.pageSize;
    source.photo = base.photo || source.photo;
    if (base.headlineOverride) {
      source.en.headline = base.headlineOverride.en;
      source.fa.headline = base.headlineOverride.fa;
    }
    return source;
  }
  if (base.enKey) {
    return { ...base, en: EXTRA_PERSONAS[base.enKey].en, fa: EXTRA_PERSONAS[base.enKey].fa };
  }
  return base;
}

function buildResume(templateId, locale = "en") {
  const persona = resolvePersona(templateId);
  const data = persona[locale === "fa" ? "fa" : "en"];
  return {
    basics: {
      firstName: data.firstName,
      lastName: data.lastName,
      headline: data.headline,
      email: data.contact[0],
      phone: data.contact[1],
      location: data.location,
      website: data.contact[2],
      linkedin: data.contact[3],
      extra: data.quote,
      photo: profile(persona.photo)
    },
    summary: data.summary,
    experience: data.experience.map((e, i) => ({ id: `${templateId}-e${i}`, hidden: false, title: e[0], organization: e[1], period: e[2], location: e[3], bullets: e[4] })),
    education: [{ id: `${templateId}-ed1`, hidden: false, degree: data.education[0], organization: data.education[1], period: data.education[2], location: data.education[3], description: data.education[4] }],
    skills: data.skills.map((s, i) => ({ id: `${templateId}-s${i}`, hidden: false, name: s[0], level: String(5 - (i % 2)), keywords: s[1] })),
    projects: data.projects.map((p, i) => ({ id: `${templateId}-p${i}`, hidden: false, name: p[0], period: p[1], website: p[2], bullets: p[3] })),
    certifications: [
      { id: `${templateId}-c1`, hidden: false, title: locale === "fa" ? "شناخته شده در روایت پهلوانی" : "Recognized in heroic tradition", issuer: locale === "fa" ? "حافظه شاهنامه" : "Shahnameh tradition", date: data.publications[0][2], description: data.publications[0][3] },
      { id: `${templateId}-c2`, hidden: false, title: locale === "fa" ? "دارنده نقش سرنوشت ساز" : "Bearer of a fate-shaping role", issuer: locale === "fa" ? "دربار و میدان" : "Court and battlefield", date: data.experience[0][2], description: data.quote }
    ],
    languages: locale === "fa"
      ? [{ id: `${templateId}-l1`, hidden: false, language: "فارسی", fluency: "زبان روایت", level: "5" }, { id: `${templateId}-l2`, hidden: false, language: "زبان دربار", fluency: "روان", level: "4" }, { id: `${templateId}-l3`, hidden: false, language: "زبان میدان", fluency: "کاری", level: "4" }]
      : [{ id: `${templateId}-l1`, hidden: false, language: "Persian", fluency: "Epic tradition", level: "5" }, { id: `${templateId}-l2`, hidden: false, language: "Court speech", fluency: "Fluent", level: "4" }, { id: `${templateId}-l3`, hidden: false, language: "Battlefield signals", fluency: "Working", level: "4" }],
    interests: data.interests.map((name, i) => ({ id: `${templateId}-i${i}`, hidden: false, name, keywords: [] })),
    publications: data.publications.map((p, i) => ({ id: `${templateId}-pub${i}`, hidden: false, title: p[0], publisher: p[1], date: p[2], description: p[3] })),
    achievements: data.achievements.map((a, i) => ({ id: `${templateId}-a${i}`, hidden: false, title: a[0], description: a[1] })),
    customSections: [{
      id: `${templateId}-custom`,
      hidden: false,
      title: locale === "fa" ? "یادداشت روایی" : "Narrative Note",
      items: [
        { id: `${templateId}-custom-1`, hidden: false, title: data.quote, subtitle: data.location, period: data.experience[0][2], bullets: [data.summary] }
      ]
    }]
  };
}

export function sampleForTemplate(templateId, locale = "en") {
  const safeLocale = locale === "fa" ? "fa" : "en";
  const persona = resolvePersona(templateId);
  return {
    resume: buildResume(templateId, safeLocale),
    templateId,
    pageSize: persona.pageSize,
    locale: safeLocale
  };
}

export const RESUME_PAYLOAD = {
  ...sampleForTemplate("dark-sidebar", "en"),
  templateId: "teal-pro"
};
