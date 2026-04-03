import { NextRequest, NextResponse } from "next/server";
import { validateAnswer, type CategoryKey, type ValidationResult } from "@/lib/validator";

interface ValidationRequest {
  answers: { category: string; answer: string; letter: string }[];
}

// ── Curated suggestions for wrong / empty answers ───────────────────────────
const SUGGESTIONS: Record<string, Record<string, string>> = {
  Town: {
    A:"Austin",B:"Bristol",C:"Charleston",D:"Denver",E:"Edinburgh",F:"Florence",
    G:"Galway",H:"Hartford",I:"Ipswich",J:"Jacksonville",K:"Killarney",L:"Liverpool",
    M:"Memphis",N:"Nashville",O:"Oxford",P:"Portland",R:"Richmond",S:"Savannah",T:"Tucson",W:"Wilmington"
  },
  State: {
    A:"Alabama",B:"Bavaria",C:"California",D:"Delaware",E:"Essex",F:"Florida",
    G:"Georgia",H:"Hawaii",I:"Idaho",J:"Jalisco",K:"Kansas",L:"Louisiana",
    M:"Montana",N:"Nevada",O:"Ohio",P:"Pennsylvania",R:"Rhode Island",S:"Saskatchewan",T:"Texas",W:"Wisconsin"
  },
  Country: {
    A:"Argentina",B:"Brazil",C:"Canada",D:"Denmark",E:"Egypt",F:"France",
    G:"Germany",H:"Hungary",I:"Ireland",J:"Japan",K:"Kenya",L:"Lebanon",
    M:"Mexico",N:"Norway",O:"Oman",P:"Poland",R:"Romania",S:"Spain",T:"Thailand",W:"Wales"
  },
  "Capital City": {
    A:"Athens",B:"Berlin",C:"Cairo",D:"Dublin",E:"Edinburgh",F:"Freetown",
    G:"Georgetown",H:"Havana",I:"Islamabad",J:"Jerusalem",K:"Kabul",L:"Lima",
    M:"Madrid",N:"Nairobi",O:"Ottawa",P:"Paris",R:"Rabat",S:"Seoul",T:"Tokyo",W:"Warsaw"
  },
  "Girl's Name": {
    A:"Alice",B:"Bella",C:"Charlotte",D:"Diana",E:"Emily",F:"Fiona",
    G:"Grace",H:"Hannah",I:"Isabella",J:"Julia",K:"Katherine",L:"Lucy",
    M:"Margaret",N:"Natalie",O:"Olivia",P:"Penelope",R:"Rachel",S:"Sophia",T:"Tessa",W:"Wendy"
  },
  "Boy's Name": {
    A:"Alexander",B:"Benjamin",C:"Charles",D:"Daniel",E:"Edward",F:"Frederick",
    G:"George",H:"Henry",I:"Isaac",J:"James",K:"Kenneth",L:"Lucas",
    M:"Matthew",N:"Nicholas",O:"Oliver",P:"Patrick",R:"Robert",S:"Samuel",T:"Thomas",W:"William"
  },
  "Historical Figure": {
    A:"Alexander the Great",B:"Beethoven",C:"Cleopatra",D:"Da Vinci",E:"Einstein",F:"Franklin",
    G:"Galileo",H:"Hannibal",I:"Ivan the Terrible",J:"Joan of Arc",K:"King Henry",L:"Lincoln",
    M:"Magellan",N:"Napoleon",O:"Octavian",P:"Plato",R:"Roosevelt",S:"Socrates",T:"Tutankhamun",W:"Washington"
  },
  "Article of Clothing": {
    A:"Anorak",B:"Blazer",C:"Cardigan",D:"Dress",E:"Espadrilles",F:"Fedora",
    G:"Gloves",H:"Hoodie",J:"Jeans",K:"Kilt",L:"Leggings",
    M:"Mackintosh",N:"Nightgown",O:"Overcoat",P:"Poncho",R:"Raincoat",S:"Scarf",T:"Trousers",W:"Waistcoat"
  },
  Animal: {
    A:"Antelope",B:"Bear",C:"Cheetah",D:"Dolphin",E:"Elephant",F:"Flamingo",
    G:"Gorilla",H:"Hawk",I:"Iguana",J:"Jaguar",K:"Kangaroo",L:"Leopard",
    M:"Moose",N:"Narwhal",O:"Octopus",P:"Penguin",R:"Rabbit",S:"Shark",T:"Tiger",W:"Walrus"
  },
  "Plant/Flower": {
    A:"Azalea",B:"Bluebell",C:"Carnation",D:"Dahlia",E:"Elderflower",F:"Fern",
    G:"Gardenia",H:"Hyacinth",I:"Iris",J:"Jasmine",K:"Kudzu",L:"Lavender",
    M:"Marigold",N:"Narcissus",O:"Orchid",P:"Peony",R:"Rose",S:"Sunflower",T:"Tulip",W:"Wisteria"
  },
  "Body of Water": {
    A:"Amazon",B:"Baltic Sea",C:"Caspian Sea",D:"Danube",E:"Erie",F:"Fraser River",
    G:"Ganges",H:"Hudson",I:"Indus",J:"Jordan River",K:"Kalahari",L:"Lake Louise",
    M:"Mississippi",N:"Nile",O:"Ohio River",P:"Pacific",R:"Rhine",S:"Seine",T:"Thames",W:"Wabash"
  },
  Movie: {
    A:"Avatar",B:"Braveheart",C:"Casablanca",D:"Dumbo",E:"E.T.",F:"Frozen",
    G:"Gladiator",H:"Home Alone",I:"Indiana Jones",J:"Jaws",K:"Kill Bill",L:"Lion King",
    M:"Mission Impossible",N:"Notting Hill",O:"Oliver",P:"Psycho",R:"Rocky",S:"Shrek",T:"Titanic",W:"Wall-E"
  },
  Book: {
    A:"Animal Farm",B:"Beloved",C:"Catch-22",D:"Dracula",E:"Emma",F:"Frankenstein",
    G:"Great Expectations",H:"Hamlet",I:"Ivanhoe",J:"Jane Eyre",K:"Kidnapped",L:"Little Women",
    M:"Moby Dick",N:"Narnia",O:"Oliver Twist",P:"Pride and Prejudice",R:"Rebecca",S:"Sherlock Holmes",T:"Treasure Island",W:"Wuthering Heights"
  },
  "Song Title": {
    A:"Abracadabra",B:"Bohemian Rhapsody",C:"Crazy",D:"Dancing Queen",E:"Every Breath You Take",F:"Freebird",
    G:"Gangsta's Paradise",H:"Hotel California",I:"Imagine",J:"Jolene",K:"Killing Me Softly",L:"Let It Be",
    M:"Missing You",N:"No Woman No Cry",O:"Oh Happy Day",P:"Purple Rain",R:"Respect",S:"Stayin Alive",T:"Thriller",W:"Wonderwall"
  },
  "TV Show": {
    A:"Arrow",B:"Breaking Bad",C:"Cheers",D:"Downton Abbey",E:"ER",F:"Friends",
    G:"Game of Thrones",H:"House",I:"I Love Lucy",J:"Jeopardy",K:"Knight Rider",L:"Lost",
    M:"Mad Men",N:"Narcos",O:"Ozark",P:"Peaky Blinders",R:"Roseanne",S:"Seinfeld",T:"The Sopranos",W:"Westworld"
  },
  "Food/Dish": {
    A:"Apple Pie",B:"Burrito",C:"Croissant",D:"Dumpling",E:"Enchilada",F:"Falafel",
    G:"Guacamole",H:"Hummus",I:"Ice Cream",J:"Jambalaya",K:"Kebab",L:"Lasagna",
    M:"Meatball",N:"Naan",O:"Omelette",P:"Pizza",R:"Risotto",S:"Sushi",T:"Taco",W:"Waffle"
  },
  "Musical Instrument": {
    A:"Accordion",B:"Banjo",C:"Cello",D:"Drums",E:"English Horn",F:"Flute",
    G:"Guitar",H:"Harmonica",K:"Kazoo",L:"Lute",
    M:"Mandolin",O:"Oboe",P:"Piano",R:"Recorder",S:"Saxophone",T:"Trumpet",W:"Whistle"
  },
  Profession: {
    A:"Architect",B:"Baker",C:"Carpenter",D:"Dentist",E:"Engineer",F:"Firefighter",
    G:"Gardener",H:"Historian",I:"Illustrator",J:"Journalist",K:"Kinesiologist",L:"Librarian",
    M:"Mechanic",N:"Nurse",O:"Optometrist",P:"Plumber",R:"Radiologist",S:"Surgeon",T:"Teacher",W:"Writer"
  },
  Brand: {
    A:"Apple",B:"BMW",C:"Coca-Cola",D:"Dell",E:"Ericsson",F:"Ford",
    G:"Google",H:"Honda",I:"IKEA",J:"Jaguar",K:"Kodak",L:"Lego",
    M:"Mercedes",N:"Nike",O:"Oracle",P:"Pepsi",R:"Rolex",S:"Samsung",T:"Toyota",W:"Walmart"
  },
  Language: {
    A:"Arabic",B:"Bengali",C:"Chinese",D:"Dutch",E:"English",F:"French",
    G:"German",H:"Hindi",I:"Italian",J:"Japanese",K:"Korean",L:"Latin",
    M:"Mandarin",N:"Norwegian",O:"Oriya",P:"Portuguese",R:"Russian",S:"Spanish",T:"Turkish",W:"Welsh"
  },
  "Mythological Figure": {
    A:"Aphrodite",B:"Bacchus",C:"Cerberus",D:"Dionysus",E:"Eros",F:"Freya",
    G:"Gaia",H:"Hercules",I:"Icarus",J:"Juno",K:"Krishna",L:"Loki",
    M:"Medusa",N:"Neptune",O:"Odin",P:"Poseidon",R:"Ra",S:"Saturn",T:"Thor",W:"Wotan"
  },
  "Scientific Term": {
    A:"Atom",B:"Bacteria",C:"Catalyst",D:"DNA",E:"Entropy",F:"Fusion",
    G:"Gravity",H:"Hypothesis",I:"Isotope",J:"Joule",K:"Kinetics",L:"Lipid",
    M:"Mitosis",N:"Neutron",O:"Osmosis",P:"Photosynthesis",R:"Radiation",S:"Symbiosis",T:"Thermodynamics",W:"Wavelength"
  },
  Sport: {
    A:"Archery",B:"Basketball",C:"Cricket",D:"Diving",E:"Equestrian",F:"Fencing",
    G:"Golf",H:"Hockey",I:"Ice Skating",J:"Javelin",K:"Kayaking",L:"Lacrosse",
    M:"Marathon",N:"Netball",O:"Orienteering",P:"Polo",R:"Rugby",S:"Soccer",T:"Tennis",W:"Wrestling"
  },
  "Board Game": {
    A:"Azul",B:"Battleship",C:"Chess",D:"Dominoes",E:"Everdell",
    J:"Jenga",L:"Life",
    M:"Monopoly",O:"Othello",P:"Parcheesi",R:"Risk",S:"Scrabble",T:"Trivial Pursuit",W:"Wingspan"
  },
};

function getSuggestion(category: string, letter: string): string {
  const catSuggestions = SUGGESTIONS[category];
  if (!catSuggestions) return "";
  return catSuggestions[letter.toUpperCase()] ?? "";
}

// ── CORS ─────────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// ── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: ValidationRequest = await request.json();

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const results = body.answers.map(({ category, answer, letter }) => {
      const result: ValidationResult = validateAnswer(
        category as CategoryKey,
        answer,
        letter,
      );
      const suggestion =
        !result.isCorrect ? getSuggestion(category, letter) : undefined;
      return {
        category,
        answer,
        valid: result.isCorrect,
        suggestion,
        reason: result.reason,
        confidence: result.confidence,
        matchedValue: result.matchedValue,
      };
    });

    return NextResponse.json({ results }, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
