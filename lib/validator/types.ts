export type CategoryKey =
  | "Town"
  | "State"
  | "Country"
  | "Capital City"
  | "Girl's Name"
  | "Boy's Name"
  | "Article of Clothing"
  | "Animal"
  | "Food/Dish"
  | "Movie"
  | "Book"
  | "Historical Figure"
  | "Body of Water"
  | "Musical Instrument"
  | "Profession"
  | "Plant/Flower"
  | "Sport"
  | "Brand"
  | "Language"
  | "Mythological Figure"
  | "Song Title"
  | "TV Show"
  | "Scientific Term"
  | "Board Game"
  | "Fish"
  | "Vegetable";

export type Confidence = "high" | "medium" | "low";

export interface ValidationResult {
  isCorrect: boolean;
  confidence: Confidence;
  matchedValue?: string;
  reason: string;
  normalizedAnswer: string;
}
