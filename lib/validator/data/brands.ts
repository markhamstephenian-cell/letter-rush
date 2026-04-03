/** Recognizable consumer, automotive, fashion, tech, food, and other brands */
export const BRANDS = new Set([
  // Tech
  "apple","google","microsoft","amazon","meta","facebook","samsung","sony","intel","nvidia","amd","ibm","oracle","cisco","dell","hp","hewlett packard","lenovo","asus","acer",
  "adobe","salesforce","spotify","netflix","uber","lyft","airbnb","twitter","snapchat","tiktok","pinterest","reddit","zoom","slack","dropbox","paypal","stripe","square",
  "huawei","xiaomi","oppo","vivo","oneplus","realme","nokia","ericsson","motorola","blackberry","lg","panasonic","sharp","toshiba","hitachi","fujitsu",
  "nintendo","playstation","xbox","sega","atari","valve","epic","roblox",
  // Automotive
  "toyota","honda","ford","chevrolet","bmw","mercedes","mercedes-benz","audi","volkswagen","porsche","ferrari","lamborghini","maserati","bugatti","bentley","rolls royce","rolls-royce",
  "jaguar","land rover","range rover","volvo","saab","tesla","rivian","lucid","hyundai","kia","nissan","mazda","subaru","mitsubishi","suzuki","lexus","acura","infiniti",
  "cadillac","lincoln","buick","chrysler","dodge","jeep","ram","gmc","fiat","alfa romeo","peugeot","renault","citroen","opel","skoda","seat","mini","aston martin","mclaren","lotus",
  // Fashion & luxury
  "nike","adidas","puma","reebok","new balance","under armour","converse","vans","skechers",
  "gucci","prada","louis vuitton","chanel","hermes","dior","versace","armani","burberry","valentino","balenciaga","fendi","givenchy","yves saint laurent","saint laurent",
  "ralph lauren","calvin klein","tommy hilfiger","hugo boss","lacoste","michael kors","coach","kate spade","tory burch",
  "zara","hm","h&m","uniqlo","gap","old navy","forever 21","primark","topshop","asos",
  "rolex","omega","tag heuer","cartier","tiffany","swarovski","pandora","bulgari",
  "ray ban","ray-ban","oakley","luxottica",
  // Food & beverage
  "coca cola","coca-cola","coke","pepsi","pepsico","nestle","kraft","heinz","kellogg","kelloggs","general mills","mars","hershey","hersheys","cadbury","lindt","godiva","ferrero",
  "mcdonalds","burger king","wendys","subway","starbucks","dunkin","dunkin donuts","dominos","pizza hut","papa johns","kfc","taco bell","chipotle","chick-fil-a","popeyes",
  "budweiser","heineken","guinness","corona","jack daniels","johnnie walker","absolut","bacardi","smirnoff",
  "red bull","monster","gatorade",
  // Retail & consumer
  "walmart","target","costco","ikea","home depot","lowes","amazon","ebay","etsy","wayfair","best buy",
  "procter and gamble","procter & gamble","p&g","unilever","johnson and johnson","johnson & johnson","colgate","gillette","dove","tide","pampers","charmin",
  // Other
  "disney","warner bros","paramount","universal","fox","lego","mattel","hasbro","barbie","hot wheels",
  "boeing","airbus","lockheed martin","general electric","ge","siemens","philips","3m","caterpillar","john deere",
  "visa","mastercard","american express","amex","jpmorgan","goldman sachs","morgan stanley","citibank","hsbc","barclays",
  "fedex","ups","dhl",
  "kodak","canon","nikon","gopro","dyson","kitchenaid","whirlpool","bosch","electrolux","braun",
  "hallmark","crayola","bic","sharpie","post-it",
]);

export const BRAND_ALIASES: Record<string, string> = {
  "coca cola": "coca-cola",
  "coke": "coca-cola",
  "mcdonald's": "mcdonalds",
  "mcdonalds": "mcdonalds",
  "dunkin donuts": "dunkin",
  "hewlett-packard": "hp",
  "hewlett packard": "hp",
  "rolls royce": "rolls-royce",
  "mercedes benz": "mercedes-benz",
  "ray ban": "ray-ban",
  "h and m": "h&m",
  "h&m": "h&m",
  "hm": "h&m",
  "p and g": "procter & gamble",
  "p&g": "procter & gamble",
  "j and j": "johnson & johnson",
  "j&j": "johnson & johnson",
  "vw": "volkswagen",
  "merc": "mercedes-benz",
  "benz": "mercedes-benz",
  "beemer": "bmw",
  "chevy": "chevrolet",
  "lambo": "lamborghini",
  "ysl": "yves saint laurent",
  "lv": "louis vuitton",
  "amex": "american express",
  "ge": "general electric",
};
