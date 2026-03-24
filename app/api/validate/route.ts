import { NextRequest, NextResponse } from "next/server";

interface ValidationRequest {
  answers: { category: string; answer: string; letter: string }[];
}

// ── Known-good fast-path lists ──────────────────────────────────────────────
// These bypass Wikipedia entirely for common, unambiguous answers.

const GIRLS_NAMES = new Set([
  "abigail","ada","adele","adeline","adriana","agatha","agnes","aileen","aimee","alana","alejandra","alexandra","alexis","alice","alicia","alina","alison","allegra","allison","alma","alyssa","amanda","amber","amelia","amy","ana","anastasia","andrea","angela","angelica","angelina","anita","ann","anna","anne","annette","annie","april","ariana","ariel","arlene","ashley","astrid","audrey","aurora","autumn","ava","avery",
  "bailey","barbara","beatrice","becky","belinda","bella","bernadette","bernice","bertha","beth","bethany","betty","beverly","bianca","blair","blanche","bonnie","brenda","bridget","brittany","brooke",
  "caitlin","camille","candace","cara","carina","carla","carmen","carol","carolina","caroline","carolyn","cassandra","catherine","cecilia","celeste","celia","charlotte","chelsea","cheryl","chloe","christina","christine","cindy","claire","clara","clarissa","claudia","colleen","connie","constance","cora","corinne","courtney","crystal","cynthia",
  "daisy","dakota","dana","daniela","danielle","daphne","darlene","dawn","deanna","deborah","debra","delia","delilah","denise","destiny","diana","diane","dolores","donna","dora","doris","dorothy",
  "eden","edith","eileen","elaine","eleanor","elena","elisa","elisabeth","elise","eliza","elizabeth","ella","ellen","eloise","elsa","elsie","emilia","emily","emma","erica","erin","esmeralda","estelle","esther","ethel","eugenia","eva","evangeline","eve","evelyn",
  "faith","fatima","faye","felicia","fern","fiona","flora","florence","frances","francesca","freda","freya",
  "gabriella","gabrielle","gail","gemma","genevieve","georgia","geraldine","gertrude","gina","giselle","gladys","glenda","gloria","grace","greta","gretchen","guadalupe","gwendolyn",
  "hailey","hannah","harper","harriet","hazel","heather","heidi","helen","helena","henrietta","hillary","holly","hope",
  "ida","ilene","imogen","ina","india","ines","ingrid","irene","iris","irma","isabel","isabella","isabelle","isla","ivy",
  "jacqueline","jade","jamie","jane","janet","janice","jasmine","jean","jeanette","jenna","jennifer","jenny","jessica","jill","joan","joanna","jocelyn","jodie","jolene","jordan","josephine","joy","joyce","juanita","judith","judy","julia","juliana","julie","juliet","june","justine",
  "kara","karen","karina","kate","katherine","kathleen","kathryn","kathy","katie","katrina","kay","kayla","kelly","kelsey","kendra","kerry","kim","kimberly","kirsten","kristen","kristin","kristina",
  "lacey","lana","lara","laura","lauren","lavinia","lea","leah","lena","leslie","leticia","lila","lillian","lily","linda","lindsay","lisa","lola","lorena","loretta","lori","lorraine","louisa","louise","lucia","lucille","lucinda","lucy","luna","lydia","lynn",
  "mabel","mackenzie","maddison","madeline","madison","mae","maggie","maisie","mallory","mandy","marcella","marcia","margaret","maria","marian","marie","marilyn","marina","marissa","marjorie","marlene","martha","mary","matilda","maureen","maxine","maya","megan","melanie","melinda","melissa","melody","mercedes","meredith","mia","michelle","mildred","millie","mindy","miranda","miriam","molly","monica","morgan","muriel","myrtle",
  "nadia","nancy","naomi","natalia","natalie","natasha","nell","nelly","nicole","nina","nora","noreen","norma",
  "octavia","olga","olive","olivia","opal","ophelia",
  "paige","pamela","patricia","patsy","patty","paula","pauline","pearl","peggy","penelope","penny","petra","phyllis","piper","polly","priscilla",
  "quinn",
  "rachel","ramona","rebecca","regina","renee","rhonda","riley","rita","roberta","robin","rochelle","rosa","rosalie","rose","rosemary","rosie","roxanne","ruby","ruth",
  "sabrina","sadie","sally","samantha","sandra","sandy","sara","sarah","savannah","scarlett","selena","serena","shannon","sharon","sheila","shelby","shelley","shirley","sierra","silvia","simone","skylar","sofia","sonia","sophia","stacy","stella","stephanie","summer","susan","susanna","suzanne","sybil","sylvia",
  "tabitha","tamara","tammy","tanya","tara","tatiana","taylor","teresa","tessa","thelma","theresa","tiffany","tina","toni","tracy","trudy",
  "uma","ursula",
  "valentina","valerie","vanessa","vera","veronica","victoria","viola","violet","virginia","vivian",
  "wanda","wendy","whitney","willa","willow","wilma","winifred",
  "xena","ximena",
  "yasmin","yolanda","yvette","yvonne",
  "zara","zelda","zoe","zoey",
]);

const BOYS_NAMES = new Set([
  "aaron","abel","abraham","adam","adrian","aidan","alan","albert","alec","alejandro","alex","alexander","alfred","ali","allen","alvin","ambrose","amos","andre","andrew","andy","angel","angelo","angus","anthony","antonio","archer","archie","armand","arnold","arthur","asher","ashton","august","augustine","austin","avery",
  "bailey","barnaby","barney","barry","bartholomew","basil","beau","ben","benedict","benjamin","bennett","bernard","bert","billy","blake","bob","bobby","boris","brad","bradley","brandon","brendan","brent","brett","brian","bruce","bruno","bryan","bryce","byron",
  "caleb","calvin","cameron","carl","carlos","carter","casey","cecil","cedric","chad","charles","charlie","chase","chester","chris","christian","christopher","clarence","clark","claude","clay","clayton","clement","clifford","clinton","clive","clyde","cody","colby","cole","colin","connor","conrad","cooper","corey","cornelius","craig","curtis","cyrus",
  "dale","dallas","dalton","damian","damon","dan","daniel","danny","dante","darius","darren","daryl","dave","david","dean","dennis","derek","desmond","devin","dexter","diego","dillon","dimitri","dirk","dominic","donald","donovan","douglas","drew","duke","duncan","dustin","dwight","dylan",
  "earl","eddie","edgar","edmund","eduardo","edward","edwin","eli","elias","elijah","elliot","elliott","ellis","elmer","elton","elvis","emilio","emmanuel","emmett","enrique","ephraim","eric","ernest","erwin","ethan","eugene","evan","everett","ezekiel","ezra",
  "fabian","felix","fernando","finley","finn","fletcher","floyd","ford","forrest","francis","francisco","frank","franklin","fred","frederick","fritz",
  "gabriel","garrett","gary","gavin","gene","geoffrey","george","gerald","gerard","gilbert","glenn","gordon","graham","grant","gregory","griffin","guillermo","gunnar","gustav","guy",
  "hank","harold","harrison","harry","harvey","hassan","hayden","heath","hector","henry","herbert","herman","holden","homer","howard","hubert","hudson","hugh","hugo","hunter",
  "ian","ibrahim","ignacio","igor","irving","isaac","isaiah","ismael","ivan",
  "jack","jackson","jacob","jake","james","jamie","jared","jason","jasper","javier","jay","jayden","jeff","jefferson","jeffrey","jeremiah","jeremy","jerome","jerry","jesse","jesus","jim","jimmy","joaquin","joel","john","johnny","jonah","jonathan","jordan","jorge","jose","joseph","joshua","juan","julian","julius","justin",
  "kai","karl","keegan","keith","kellan","kelvin","ken","kendrick","kenneth","kenny","kent","kevin","kieran","kirk","kit","knox","kurt","kyle",
  "lance","landon","larry","lars","lawrence","lee","leo","leon","leonard","leonardo","leroy","leslie","lester","levi","lewis","liam","lincoln","lionel","lloyd","logan","lorenzo","louis","luca","lucas","luis","luke","luther",
  "mack","malcolm","manuel","marc","marco","marcus","mario","mark","marshall","martin","marvin","mason","mathew","matthew","maurice","max","maximilian","maxwell","melvin","michael","miguel","miles","milton","mitchell","mohammed","morgan","morris","moses","murphy","murray","myles",
  "nathan","nathaniel","neal","ned","nelson","nicholas","nick","nicolas","nigel","noah","noel","nolan","norman",
  "oliver","omar","orlando","oscar","oswald","otis","otto","owen",
  "pablo","parker","patrick","paul","pedro","percy","perry","peter","philip","phillip","pierce","porter","preston",
  "quentin","quincy","quinn",
  "rafael","ralph","ramiro","ramon","randall","randolph","randy","raphael","ray","raymond","reed","reginald","reid","remy","rene","rex","rhett","ricardo","richard","rick","riley","robert","roberto","robin","rocco","roderick","rodney","rodrigo","roger","roland","roman","ronald","ronnie","rory","ross","roy","ruben","rudolph","rupert","russell","ryan",
  "salvador","sam","samuel","santiago","saul","scott","sean","sebastian","sergio","seth","shane","shaun","sheldon","sherman","sidney","simon","solomon","spencer","stanley","stefan","stephen","sterling","steve","steven","stuart","sylvester",
  "taylor","ted","teddy","terrence","terry","theodore","thomas","timothy","tobias","todd","tom","tommy","tony","travis","trevor","trent","trevor","tristan","troy","tucker","tyler",
  "ulysses",
  "vance","vaughn","vernon","victor","vincent","virgil","vladimir",
  "wade","walker","wallace","walter","warren","wayne","wendell","wesley","weston","wilbur","wiley","will","william","willis","wilson","winston","woodrow","wyatt",
  "xavier",
  "yale","yusuf",
  "zachary","zane","zeus",
]);

const CAPITAL_CITIES = new Set([
  "abu dhabi","abuja","accra","addis ababa","algiers","amman","amsterdam","ankara","antananarivo","apia","ashgabat","asmara","astana","asuncion","athens","avarua",
  "baku","bamako","bandar seri begawan","bangkok","bangui","banjul","basseterre","beijing","beirut","belgrade","belmopan","berlin","bern","bishkek","bissau","bogota","brasilia","bratislava","brazzaville","bridgetown","brussels","bucharest","budapest","buenos aires",
  "cairo","canberra","caracas","castries","chisinau","colombo","conakry","copenhagen","cotonou",
  "dakar","damascus","dhaka","dili","djibouti","dodoma","doha","dublin","dushanbe",
  "edinburgh",
  "freetown","funafuti",
  "gaborone","georgetown","gitega","guatemala city",
  "hanoi","harare","havana","helsinki","honiara",
  "islamabad",
  "jakarta","jerusalem",
  "kabul","kampala","kathmandu","khartoum","kiev","kigali","kingston","kingstown","kinshasa","kuala lumpur","kuwait city",
  "libreville","lilongwe","lima","lisbon","ljubljana","lome","london","luanda","lusaka","luxembourg",
  "madrid","majuro","malabo","male","managua","manama","manila","maputo","maseru","mbabane","mexico city","minsk","mogadishu","monaco","monrovia","montevideo","moroni","moscow","muscat",
  "nairobi","nassau","naypyidaw","new delhi","niamey","nicosia","nouakchott","nuku alofa",
  "oslo","ottawa","ouagadougou",
  "panama city","paramaribo","paris","phnom penh","podgorica","port louis","port moresby","port of spain","porto novo","prague","pretoria","pristina","pyongyang",
  "quito",
  "rabat","reykjavik","riga","riyadh","rome","roseau",
  "san jose","san marino","san salvador","sana'a","santiago","santo domingo","sao tome","sarajevo","seoul","singapore","skopje","sofia","stockholm","sucre","suva",
  "taipei","tallinn","tarawa","tashkent","tbilisi","tegucigalpa","tehran","thimphu","tirana","tokyo","tripoli","tunis",
  "ulaanbaatar",
  "vaduz","valletta","vatican city","victoria","vienna","vientiane","vilnius",
  "warsaw","washington","wellington","windhoek",
  "yaounde","yerevan",
  "zagreb",
]);

const CLOTHING_ITEMS = new Set([
  "anorak","apron","ascot",
  "bandana","beret","bikini","blazer","blouse","bodysuit","bolero","bonnet","boots","bow tie","boxers","bra","bracelet","braces","briefs","brogues","buckle","burqa","bustier","button",
  "caftan","camisole","cap","cape","capri","cardigan","cargo pants","chaps","chemise","chinos","cloak","clogs","coat","collar","corset","coveralls","cowl","cravat","cufflinks","cummerbund",
  "dashiki","denim","dickey","doublet","dress","dungarees","duster",
  "earmuffs","earrings","espadrilles",
  "fanny pack","fascinator","fedora","fez","flip flops","fleece","formal","frock","fur coat",
  "gabardine","gaiters","galoshes","garment","garter","gauntlets","girdle","glasses","gloves","goggles","gown","guayabera",
  "halter","hat","headband","headscarf","helmet","hem","henley","high heels","hijab","hood","hoodie","hosiery","housecoat",
  "jacket","jeans","jersey","jewellery","jodhpurs","jumper","jumpsuit",
  "kaftan","kilt","kimono","knickers","knit",
  "lace","lapel","leggings","lei","leotard","lingerie","loafers","loincloth","longjohns",
  "macintosh","mackintosh","mantle","mink","mittens","moccasins","muffler","mukluk","muumuu",
  "necklace","necktie","negligee","nightgown","nightshirt",
  "obi","overalls","overcoat","oxford",
  "pads","pajamas","palazzo","parka","pashmina","peacoat","pendant","petticoat","pinafore","plaid","platform","pocket","polo","poncho","pullover","pumps","puttees",
  "raincoat","robe","romper","ruana",
  "sandals","sari","sarong","sash","scarf","shawl","shirt","shoes","shorts","singlet","skirt","slacks","slippers","smock","sneakers","snood","socks","sole","sombrero","speedo","stilettos","stockings","stole","suit","sundress","suspenders","sweatpants","sweater","sweatshirt",
  "tabard","tank top","tee","thong","tights","tie","tippet","toga","top","topcoat","toque","trench coat","trousers","trunks","tunic","turban","turtleneck","tuxedo",
  "undergarment","undershirt","underwear","uniform",
  "veil","vest","visor",
  "waistcoat","watch","wedges","wetsuit","wig","windbreaker","wrap",
  "yashmak",
  "zori",
]);

// ── Wikipedia keyword maps ──────────────────────────────────────────────────
// Keywords that Wikipedia article content/categories should contain for each game category
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Town: ["town", "city", "village", "municipality", "settlement", "populated place", "census-designated", "population", "county seat", "borough", "hamlet", "unincorporated"],
  State: ["state", "province", "region", "territory", "subdivision", "administrative", "u.s. state", "federal subject"],
  Country: ["country", "sovereign", "nation", "republic", "kingdom", "state in", "member state", "independent"],
  "Capital City": ["capital", "seat of government", "capital city", "capital of", "capital and largest"],
  "Girl's Name": ["given name", "feminine", "female name", "female given", "name of", "first name", "forename", "hypocorism", "diminutive", "personal name", "woman", "women", "girl", "name day", "english name", "hebrew name", "latin name", "greek name", "arabic name", "french name"],
  "Boy's Name": ["given name", "masculine", "male name", "male given", "name of", "first name", "forename", "hypocorism", "diminutive", "personal name", "man", "men", "boy", "name day", "english name", "hebrew name", "latin name", "greek name", "arabic name", "french name"],
  "Article of Clothing": ["clothing", "garment", "worn", "fashion", "apparel", "fabric", "textile", "dress", "wear", "footwear", "headwear", "outerwear", "accessory", "attire", "costume", "wardrobe", "neckwear", "underwear", "knitwear", "scarf", "hat", "shoe", "boot", "coat", "jacket", "trouser", "sleeve"],
  Animal: ["animal", "species", "mammal", "bird", "fish", "reptile", "insect", "genus", "family", "amphibian", "invertebrate", "predator", "prey", "habitat"],
  "Food/Dish": ["food", "dish", "cuisine", "recipe", "ingredient", "cooking", "bread", "dessert", "soup", "sauce", "meat", "vegetable", "fruit", "pastry", "baked", "eaten", "meal"],
  Movie: ["film", "movie", "directed", "starring", "box office", "screenplay", "released"],
  Book: ["book", "novel", "author", "written by", "published", "literature", "novella", "memoir", "nonfiction"],
  "Historical Figure": ["historian", "emperor", "king", "queen", "president", "leader", "general", "politician", "revolutionary", "explorer", "conqueror", "born", "died", "reign", "century", "war", "battle", "founder", "statesman", "philosopher"],
  "Body of Water": ["river", "lake", "ocean", "sea", "bay", "gulf", "strait", "creek", "reservoir", "waterway", "tributary", "flows", "basin", "estuary"],
  "Musical Instrument": ["instrument", "musical", "played", "string", "woodwind", "brass", "percussion", "keyboard", "plucked", "bowed"],
  Profession: ["profession", "occupation", "career", "job", "worker", "specialist", "practitioner", "person who", "responsible for", "trained", "expert", "professional"],
  "Plant/Flower": ["plant", "flower", "species", "genus", "botanical", "herb", "tree", "shrub", "flora", "blossom", "perennial", "annual", "cultivar", "bloom"],
  Sport: ["sport", "game", "competition", "tournament", "championship", "played", "athlete", "olympic", "team sport", "race", "racing", "marathon", "athletics", "league", "match", "event"],
  Brand: ["brand", "company", "corporation", "founded", "manufacturer", "trademark", "subsidiary", "products", "headquartered", "multinational"],
  Language: ["language", "spoken", "dialect", "lingua", "speakers", "linguistic", "official language", "native"],
  "Mythological Figure": ["mythology", "myth", "god", "goddess", "deity", "legend", "mythical", "folklore", "pantheon", "demigod", "hero", "titan"],
  "Song Title": ["song", "single", "track", "recorded", "album", "music", "billboard", "chart", "written by", "performed by", "lyrics"],
  "TV Show": ["television", "tv series", "tv show", "sitcom", "drama", "episodes", "season", "aired", "network", "streaming", "premiered", "created by", "animated series", "television program", "tv program", "talk show", "reality show", "game show", "miniseries", "series finale", "showrunner", "broadcast"],
  "Scientific Term": ["science", "scientific", "theory", "biology", "chemistry", "physics", "cell", "molecule", "process", "phenomenon", "medical", "organism", "compound", "element", "equation", "hypothesis", "genetic", "quantum", "atomic"],
  "Board Game": ["board game", "game", "players", "dice", "cards", "tabletop", "strategy game", "parlor", "designed by", "published by", "gameplay"],
};

// For name categories, also try searching for the "(name)" Wikipedia article directly
const NAME_CATEGORIES = ["Girl's Name", "Boy's Name"];

// Categories where a Wikipedia search with "(category)" suffix helps find the right article
const CATEGORY_SEARCH_SUFFIXES: Record<string, string[]> = {
  "Girl's Name": ["name", "given name", "female name"],
  "Boy's Name": ["name", "given name", "male name"],
  "Capital City": ["capital city", "city capital"],
  "Body of Water": ["river", "lake", "body of water"],
  "Musical Instrument": ["instrument", "musical instrument"],
  "TV Show": ["TV series", "television show", "TV show"],
  Movie: ["film", "movie"],
  "Board Game": ["board game", "game"],
  "Song Title": ["song", "single"],
  "Article of Clothing": ["clothing", "garment"],
  Animal: ["animal", "species"],
  "Food/Dish": ["food", "dish", "cuisine"],
  "Plant/Flower": ["plant", "flower"],
  Brand: ["company", "brand"],
};

// Wikipedia disambiguation suffixes — for direct page lookups like "Mission Impossible (film)"
const CATEGORY_DISAMBIG: Record<string, string[]> = {
  Movie: ["film", "film series"],
  Book: ["novel", "book"],
  "Song Title": ["song", "single"],
  "TV Show": ["TV series", "television series"],
  "Board Game": ["board game", "game"],
  Animal: ["animal"],
  Sport: ["sport"],
  Brand: ["company", "brand"],
  "Historical Figure": ["historical figure"],
  "Body of Water": ["river", "lake"],
  "Musical Instrument": ["instrument"],
  "Plant/Flower": ["plant", "flower"],
  "Article of Clothing": ["clothing", "garment"],
  "Food/Dish": ["food", "dish"],
  Language: ["language"],
  "Mythological Figure": ["mythology"],
  "Scientific Term": ["science"],
  Profession: ["profession", "occupation"],
};

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
    G:"Gloves",H:"Hoodie",I:"(none common)",J:"Jeans",K:"Kilt",L:"Leggings",
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
    G:"Guitar",H:"Harmonica",I:"(none common)",J:"(none common)",K:"Kazoo",L:"Lute",
    M:"Mandolin",N:"(none common)",O:"Oboe",P:"Piano",R:"Recorder",S:"Saxophone",T:"Trumpet",W:"Whistle"
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
    A:"Azul",B:"Battleship",C:"Chess",D:"Dominoes",E:"Everdell",F:"(none common)",
    G:"Go",H:"(none common)",I:"(none common)",J:"Jenga",K:"(none common)",L:"Life",
    M:"Monopoly",N:"(none common)",O:"Othello",P:"Parcheesi",R:"Risk",S:"Scrabble",T:"Trivial Pursuit",W:"(none common)"
  },
};

async function wikiSearchSnippets(
  term: string,
): Promise<{ title: string; snippet: string }[]> {
  if (!term.trim()) return [];
  try {
    const encoded = encodeURIComponent(term.trim());
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&srlimit=5&format=json&origin=*`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.query?.search ?? [];
  } catch {
    return [];
  }
}

async function wikiPageCategories(title: string): Promise<string[]> {
  try {
    const encoded = encodeURIComponent(title);
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=categories&cllimit=20&redirects=1&format=json&origin=*`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return [];
    const page = Object.values(pages)[0] as { categories?: { title: string }[] };
    return (page.categories ?? []).map((c) => c.title.toLowerCase());
  } catch {
    return [];
  }
}

async function wikiPageExtract(title: string): Promise<string> {
  try {
    const encoded = encodeURIComponent(title);
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=extracts&exintro=1&explaintext=1&exsentences=5&redirects=1&format=json&origin=*`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return "";
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return "";
    const page = Object.values(pages)[0] as { extract?: string };
    return (page.extract ?? "").toLowerCase();
  } catch {
    return "";
  }
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleMatches(searchTitle: string, term: string): boolean {
  const t = searchTitle.toLowerCase();
  const s = term.toLowerCase();
  const tn = normalize(searchTitle);
  const sn = normalize(term);

  // Exact or near-exact matches
  if (
    t === s ||
    tn === sn ||
    t === s + " (name)" ||
    t === s + " (given name)" ||
    t.startsWith(s + " ") ||
    t.startsWith(s + ",") ||
    t.startsWith(s + "(") ||
    t.includes("(" + s + ")") ||
    tn.startsWith(sn + " ") ||
    tn.includes("(" + sn + ")")
  ) {
    return true;
  }

  // For multi-word terms (e.g. "Mission Impossible", "Murder on the Orient Express"),
  // check if all significant words appear in the title
  const termWords = sn.split(" ").filter((w) => w.length > 2);
  if (termWords.length >= 2) {
    const titleWords = new Set(tn.split(" "));
    if (termWords.every((w) => titleWords.has(w) || tn.includes(w))) {
      return true;
    }
  }

  // Check if normalized term is contained within normalized title
  // (handles cases like title "Murder on the Orient Express (novel)" containing "murder on the orient express")
  if (sn.length >= 4 && tn.includes(sn)) {
    return true;
  }

  return false;
}

function textMatchesCategory(
  text: string,
  categories: string[],
  gameCategory: string,
): boolean {
  const keywords = CATEGORY_KEYWORDS[gameCategory];
  if (!keywords) return false;

  const combined = (text + " " + categories.join(" ")).toLowerCase();
  return keywords.some((kw) => combined.includes(kw));
}

async function checkDatamuse(
  term: string,
  category: string,
): Promise<boolean> {
  if (!term.trim()) return false;

  const datamuseCategories = [
    "Animal",
    "Food/Dish",
    "Article of Clothing",
    "Plant/Flower",
    "Musical Instrument",
    "Sport",
    "Profession",
    "Scientific Term",
  ];
  if (!datamuseCategories.includes(category)) return false;

  try {
    const encoded = encodeURIComponent(term.trim());
    const url = `https://api.datamuse.com/words?sp=${encoded}&max=1&md=d`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return false;
    if (data[0].word.toLowerCase() !== term.trim().toLowerCase()) return false;

    const defs: string[] = data[0].defs ?? [];
    const keywords = CATEGORY_KEYWORDS[category];
    if (!keywords || defs.length === 0) return false;

    const defText = defs.join(" ").toLowerCase();
    return keywords.some((kw) => defText.includes(kw));
  } catch {
    return false;
  }
}

async function tryWikiPage(
  title: string,
  gameCategory: string,
): Promise<boolean> {
  const [extract, wikiCats] = await Promise.all([
    wikiPageExtract(title),
    wikiPageCategories(title),
  ]);
  if (!extract && wikiCats.length === 0) return false;
  return textMatchesCategory(extract, wikiCats, gameCategory);
}

// Try fetching the Wikipedia page directly by title, including disambiguation variants
async function tryDirectPage(
  answer: string,
  category: string,
): Promise<boolean> {
  const suffixes = CATEGORY_DISAMBIG[category] ?? [];
  const titles = [answer, ...suffixes.map((s) => `${answer} (${s})`)];
  const results = await Promise.all(
    titles.map((t) => tryWikiPage(t, category)),
  );
  return results.some((r) => r);
}

function getSuggestion(category: string, letter: string): string {
  const catSuggestions = SUGGESTIONS[category];
  if (!catSuggestions) return "";
  const suggestion = catSuggestions[letter.toUpperCase()] ?? "";
  // Don't return placeholder entries
  if (suggestion.startsWith("(")) return "";
  return suggestion;
}

async function validateAnswer(
  answer: string,
  category: string,
  letter: string,
): Promise<boolean> {
  const trimmed = answer.trim();
  if (!trimmed) return false;

  // Must start with the correct letter
  if (trimmed[0].toUpperCase() !== letter.toUpperCase()) return false;

  // Must be at least 2 characters
  if (trimmed.length < 2) return false;

  // Strategy 0: Fast-path known-good lists (no API calls needed)
  const lower = trimmed.toLowerCase();
  if (category === "Girl's Name" && GIRLS_NAMES.has(lower)) return true;
  if (category === "Boy's Name" && BOYS_NAMES.has(lower)) return true;
  if (category === "Capital City" && CAPITAL_CITIES.has(lower)) return true;
  if (category === "Article of Clothing" && CLOTHING_ITEMS.has(lower)) return true;

  // Strategy 0.5: Direct Wikipedia page fetch with disambiguation variants
  // Handles "Mission Impossible" → "Mission Impossible (film)", "Murder on the Orient Express" → novel, etc.
  const directValid = await tryDirectPage(trimmed, category);
  if (directValid) return true;

  // Strategy 1: Direct Wikipedia article lookup (e.g. "William (name)" for names)
  if (NAME_CATEGORIES.includes(category)) {
    const namePageValid = await tryWikiPage(`${trimmed} (name)`, category);
    if (namePageValid) return true;
    const givenNameValid = await tryWikiPage(
      `${trimmed} (given name)`,
      category,
    );
    if (givenNameValid) return true;
  }

  // Strategy 2: Search Wikipedia for the term
  const results = await wikiSearchSnippets(trimmed);

  if (results.length > 0) {
    const keywords = CATEGORY_KEYWORDS[category];

    // Check all matching results, not just the first
    for (const result of results) {
      if (!titleMatches(result.title, trimmed)) continue;

      const snippetText = result.snippet.replace(/<[^>]*>/g, "").toLowerCase();

      // Quick check: does the snippet itself contain category keywords?
      if (keywords && keywords.some((kw) => snippetText.includes(kw))) {
        return true;
      }

      // Deeper check: fetch the page extract and categories
      const valid = await tryWikiPage(result.title, category);
      if (valid) return true;
    }

    // Fallback: accept top result if snippet has 2+ keyword matches even without exact title match
    if (keywords) {
      for (const result of results.slice(0, 3)) {
        const snippetText = result.snippet
          .replace(/<[^>]*>/g, "")
          .toLowerCase();
        const matchCount = keywords.filter((kw) =>
          snippetText.includes(kw),
        ).length;
        if (
          matchCount >= 2 &&
          normalize(result.title).includes(normalize(trimmed))
        ) {
          return true;
        }
      }
    }
  }

  // Strategy 3: Search with category-specific suffixes
  const suffixes = CATEGORY_SEARCH_SUFFIXES[category] ?? [category];
  for (const suffix of suffixes) {
    const contextResults = await wikiSearchSnippets(`${trimmed} ${suffix}`);
    for (const result of contextResults) {
      if (!titleMatches(result.title, trimmed)) continue;

      const snippetText = result.snippet.replace(/<[^>]*>/g, "").toLowerCase();
      const keywords = CATEGORY_KEYWORDS[category];
      if (keywords && keywords.some((kw) => snippetText.includes(kw))) {
        return true;
      }

      const valid = await tryWikiPage(result.title, category);
      if (valid) return true;
    }
  }

  // Strategy 4: Datamuse fallback for common dictionary words
  return checkDatamuse(trimmed, category);
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidationRequest = await request.json();

    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const results = await Promise.all(
      body.answers.map(async ({ category, answer, letter }) => {
        const valid = await validateAnswer(answer, category, letter);
        const suggestion =
          !valid ? getSuggestion(category, letter) : undefined;
        return { category, answer, valid, suggestion };
      }),
    );

    return NextResponse.json({ results }, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
