// Wheel values for the Wheel of Fortune game
export const WHEEL_VALUES = [
  500, 550, 600, 650, 700, 800, 900,
  500, 600, 700, 800, 900, 500, 650,
  700, 800, 900, 500, 600, 700,
  "Bankrupt", "Lose a Turn", "Free Play", "Top Value: $2500"
]; // 24 slots

// Clue data for Wheel of Fortune game
export const clues = [
  // Movies
  { category: "MOVIES", phrase: "GIVE YOURSELF A ROUND OF APPLAUSE" },
  { category: "MOVIES", phrase: "STAR WARS" },
  { category: "MOVIES", phrase: "THE LION KING" },
  { category: "MOVIES", phrase: "TITANIC" },
  { category: "MOVIES", phrase: "AVENGERS ENDGAME" },
  
  // Food & Drink
  { category: "FOOD & DRINK", phrase: "HOT DOG" },
  { category: "FOOD & DRINK", phrase: "CHOCOLATE CHIP COOKIES" },
  { category: "FOOD & DRINK", phrase: "PIZZA HUT" },
  { category: "FOOD & DRINK", phrase: "ICE CREAM SUNDAE" },
  { category: "FOOD & DRINK", phrase: "FRENCH FRIES" },
  
  // Places
  { category: "PLACES", phrase: "NEW YORK CITY" },
  { category: "PLACES", phrase: "GOLDEN GATE BRIDGE" },
  { category: "PLACES", phrase: "GRAND CANYON" },
  { category: "PLACES", phrase: "STATUE OF LIBERTY" },
  { category: "PLACES", phrase: "NIAGARA FALLS" },
  
  // Animals
  { category: "ANIMALS", phrase: "ELEPHANT" },
  { category: "ANIMALS", phrase: "GIRAFFE" },
  { category: "ANIMALS", phrase: "PENGUIN" },
  { category: "ANIMALS", phrase: "BUTTERFLY" },
  { category: "ANIMALS", phrase: "KANGAROO" },
  
  // Phrases
  { category: "PHRASES", phrase: "THINK OUTSIDE THE BOX" },
  { category: "PHRASES", phrase: "PIECE OF CAKE" },
  { category: "PHRASES", phrase: "BREAK THE ICE" },
  { category: "PHRASES", phrase: "HIT THE NAIL ON THE HEAD" },
  { category: "PHRASES", phrase: "UNDER THE WEATHER" },
  
  // Sports
  { category: "SPORTS", phrase: "BASKETBALL" },
  { category: "SPORTS", phrase: "FOOTBALL" },
  { category: "SPORTS", phrase: "BASEBALL" },
  { category: "SPORTS", phrase: "TENNIS" },
  { category: "SPORTS", phrase: "SOCCER" }
];

// Utility function to get a random clue
export function getRandomClue() {
  const randomIndex = Math.floor(Math.random() * clues.length);
  return clues[randomIndex];
}

// Utility function to convert phrase to underscores (keeping spaces and punctuation)
export function phraseToUnderscores(phrase) {
  return phrase
    .split('')
    .map(char => {
      if (/[A-Z]/.test(char)) {
        return '_';
      }
      return char; // Keep spaces, punctuation, etc.
    })
    .join('');
}
