/** Broad animal list: mammals, birds, reptiles, amphibians, fish, insects, etc. */
export const ANIMALS = new Set([
  // Mammals
  "aardvark","alpaca","anteater","antelope","ape","armadillo","baboon","badger","bat","bear","beaver","bison","boar","bobcat","buffalo","bull","camel","caribou","cat","cheetah","chimpanzee","chimp","chinchilla","chipmunk","civet","cougar","cow","coyote","deer","dingo","dog","dolphin","donkey","dormouse","dugong","elephant","elk","ermine","ferret","fox","gazelle","gerbil","gibbon","giraffe","gnu","goat","gopher","gorilla","grizzly","groundhog","guinea pig","hamster","hare","hedgehog","hippo","hippopotamus","horse","hyena","ibex","impala","jackal","jaguar","kangaroo","koala","kudu","lemur","leopard","lion","llama","lynx","manatee","mandrill","marmot","marten","meerkat","mink","mole","mongoose","monkey","moose","mouse","mule","muskrat","narwhal","newt","ocelot","okapi","opossum","orangutan","orca","otter","ox","panda","panther","peccary","pig","platypus","polar bear","pony","porcupine","porpoise","possum","prairie dog","pronghorn","puma","rabbit","raccoon","ram","rat","reindeer","rhinoceros","rhino","seal","sea lion","sheep","shrew","skunk","sloth","squirrel","stoat","tapir","tiger","vole","walrus","warthog","weasel","whale","wildcat","wildebeest","wolf","wolverine","wombat","woodchuck","yak","zebra",
  // Birds
  "albatross","blackbird","bluebird","blue jay","budgerigar","budgie","canary","cardinal","cassowary","chicken","cockatoo","condor","cormorant","crane","crow","cuckoo","dove","duck","eagle","egret","emu","falcon","finch","flamingo","goose","grouse","gull","hawk","heron","hummingbird","ibis","jay","kestrel","kingfisher","kite","kiwi","lark","loon","macaw","magpie","mallard","martin","mockingbird","nightingale","oriole","osprey","ostrich","owl","parakeet","parrot","partridge","peacock","pelican","penguin","pheasant","pigeon","plover","puffin","quail","raven","robin","rooster","sandpiper","seagull","sparrow","starling","stork","swallow","swan","swift","tern","thrush","toucan","turkey","vulture","warbler","woodpecker","wren",
  // Reptiles
  "alligator","anaconda","asp","boa","boa constrictor","chameleon","cobra","crocodile","gecko","gila monster","iguana","komodo dragon","lizard","mamba","monitor","python","rattlesnake","salamander","snake","terrapin","tortoise","turtle","viper",
  // Amphibians
  "axolotl","bullfrog","frog","newt","salamander","toad","tree frog",
  // Fish (commonly known as animals)
  "angelfish","barracuda","bass","blowfish","carp","catfish","clownfish","cod","eel","flounder","goldfish","grouper","guppy","haddock","halibut","herring","mackerel","marlin","minnow","perch","pike","piranha","pufferfish","ray","sailfish","salmon","sardine","sawfish","seahorse","shark","snapper","sole","stingray","sturgeon","swordfish","trout","tuna","walleye",
  // Insects & arachnids
  "ant","bee","beetle","butterfly","caterpillar","centipede","cicada","cockroach","cricket","dragonfly","earwig","firefly","flea","fly","gnat","grasshopper","hornet","ladybug","locust","mantis","millipede","mosquito","moth","praying mantis","scorpion","spider","tarantula","termite","tick","wasp",
  // Marine invertebrates
  "clam","coral","crab","cuttlefish","jellyfish","lobster","mussel","nautilus","octopus","oyster","scallop","sea cucumber","sea urchin","shrimp","snail","slug","squid","starfish",
]);

export const ANIMAL_ALIASES: Record<string, string> = {
  "hippo": "hippopotamus",
  "rhino": "rhinoceros",
  "croc": "crocodile",
  "gator": "alligator",
  "chimp": "chimpanzee",
  "orangutan": "orangutan",
  "grizzly bear": "grizzly",
  "polar bear": "polar bear",
  "sea lion": "sea lion",
  "guinea pig": "guinea pig",
  "prairie dog": "prairie dog",
  "praying mantis": "praying mantis",
  "komodo dragon": "komodo dragon",
  "blue jay": "blue jay",
  "boa constrictor": "boa constrictor",
  "tree frog": "tree frog",
  "gila monster": "gila monster",
  "sea cucumber": "sea cucumber",
  "sea urchin": "sea urchin",
  "killer whale": "orca",
  "king cobra": "cobra",
};
