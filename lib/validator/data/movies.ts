/** Well-known films — a curated list of popular/classic movies */
export const MOVIES = new Set([
  // A
  "a beautiful mind","a clockwork orange","a few good men","a quiet place","a star is born","ace ventura","aladdin","alien","aliens","amadeus","american beauty","american graffiti","american pie","american psycho","anchorman","ant-man","apocalypse now","aquaman","arrival","avatar",
  // B
  "back to the future","bambi","batman","batman begins","beauty and the beast","beetlejuice","ben-hur","big","birds of prey","blade runner","blazing saddles","blood diamond","bohemian rhapsody","borat","brave","braveheart","breakfast at tiffanys","bridesmaids",
  // C
  "captain america","cars","casablanca","cast away","catch me if you can","charlie and the chocolate factory","chicago","chinatown","cinderella","citizen kane","cleopatra","clueless","coco","coraline","creed","crocodile dundee",
  // D
  "dances with wolves","deadpool","die hard","dirty dancing","django unchained","doctor strange","donnie darko","dracula","drive","dumbo","dunkirk","dune",
  // E
  "e.t.","et","elf","encanto","erin brockovich","eternal sunshine of the spotless mind","everything everywhere all at once",
  // F
  "fantasia","fargo","ferris buellers day off","fight club","finding dory","finding nemo","flash gordon","forrest gump","frankenstein","frozen","fury",
  // G
  "gandhi","get out","ghost","ghostbusters","gladiator","godfather","gone girl","gone with the wind","good will hunting","goodfellas","grease","gravity","groundhog day","guardians of the galaxy",
  // H
  "hacksaw ridge","halloween","happy feet","harry potter","heat","hercules","home alone","hook","how to train your dragon","hulk","hunger games","hustle",
  // I
  "ice age","inception","independence day","indiana jones","inside out","interstellar","into the wild","iron man","it",
  // J
  "jaws","jerry maguire","joker","jumanji","jungle book","jurassic park","jurassic world",
  // K
  "karate kid","kill bill","king kong","kingsman","knives out","kong","kramer vs kramer","kung fu panda",
  // L
  "la la land","labyrinth","lady bird","leon","life is beautiful","life of pi","lilo and stitch","lincoln","lion king","little mermaid","little women","logan","lord of the rings","looper",
  // M
  "mad max","madagascar","maleficent","mamma mia","man of steel","marriage story","mars attacks","mary poppins","matrix","mean girls","memento","men in black","minions","mission impossible","moana","monsters inc","monty python and the holy grail","moonlight","moulin rouge","mulan","mummy",
  // N
  "napoleon dynamite","nemo","night at the museum","nightmare before christmas","no country for old men","nope","notting hill",
  // O
  "ocean's eleven","oceans eleven","once upon a time in hollywood","one flew over the cuckoos nest","oppenheimer","out of africa",
  // P
  "parasite","peter pan","phantom of the opera","pinocchio","pirates of the caribbean","pitch perfect","platoon","pocahontas","predator","pretty woman","pride and prejudice","psycho","pulp fiction","puss in boots",
  // Q
  "queen of katwe",
  // R
  "ratatouille","ready player one","rear window","rebel without a cause","requiem for a dream","reservoir dogs","robocop","robot","rocky","rogue one","roman holiday","romeo and juliet","rush hour",
  // S
  "saving private ryan","scarface","schindlers list","scream","se7en","seven","shawshank redemption","sherlock holmes","shining","shrek","silence of the lambs","sin city","singin in the rain","skyfall","sleepless in seattle","slumdog millionaire","snow white","social network","some like it hot","soul","sound of music","space jam","speed","spider-man","spirited away","spotlight","stand by me","star trek","star wars","step brothers","superbad",
  // T
  "tangled","tarzan","taxi driver","terminator","the avengers","the big lebowski","the dark knight","the departed","the exorcist","the godfather","the green mile","the hangover","the incredibles","the jungle book","the lion king","the little mermaid","the matrix","the notebook","the shining","the wizard of oz","there will be blood","thor","titanic","top gun","total recall","toy story","trainspotting","transformers","truman show","twilight",
  // U
  "up","us",
  // V
  "vertigo","venom",
  // W
  "wall-e","war of the worlds","warrior","west side story","whiplash","who framed roger rabbit","wicked","wild","willy wonka","wizard of oz","wolf of wall street","wonder","wonder woman","wreck-it ralph",
  // X
  "x-men",
  // Y
  "you've got mail",
  // Z
  "zodiac","zoolander","zootopia",
]);

export const MOVIE_ALIASES: Record<string, string> = {
  "e.t.": "et",
  "e t": "et",
  "et the extra terrestrial": "et",
  "the godfather": "godfather",
  "the matrix": "matrix",
  "the shining": "shining",
  "the lion king": "lion king",
  "the little mermaid": "little mermaid",
  "the jungle book": "jungle book",
  "the wizard of oz": "wizard of oz",
  "the notebook": "the notebook",
  "lord of the rings": "lord of the rings",
  "lotr": "lord of the rings",
  "pirates of the caribbean": "pirates of the caribbean",
  "potc": "pirates of the caribbean",
  "back to the future": "back to the future",
  "bttf": "back to the future",
  "return of the jedi": "star wars",
  "empire strikes back": "star wars",
  "new hope": "star wars",
  "mission impossible": "mission impossible",
  "mi": "mission impossible",
  "oceans 11": "oceans eleven",
  "oceans eleven": "oceans eleven",
  "ocean's 11": "oceans eleven",
  "se7en": "seven",
  "schindler's list": "schindlers list",
  "ferris bueller's day off": "ferris buellers day off",
  "breakfast at tiffany's": "breakfast at tiffanys",
  "one flew over the cuckoo's nest": "one flew over the cuckoos nest",
  "you've got mail": "you've got mail",
  "its a wonderful life": "its a wonderful life",
  "wall e": "wall-e",
  "wreck it ralph": "wreck-it ralph",
  "spider man": "spider-man",
  "x men": "x-men",
};
