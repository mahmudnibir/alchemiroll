export enum ScoreCategory {
  Ones = 'Essence of Ichor',
  Twos = 'Twin-Serpent Scales',
  Threes = 'Mandrake Trinity',
  Fours = 'Four-Leaf Cloverdust',
  Fives = 'Quicksilver Quintessence',
  Sixes = 'Six-Eyed Spider Silk',
  ThreeOfAKind = 'Minor Concoction',
  FourOfAKind = 'Major Concoction',
  FullHouse = 'Alchemical Fusion',
  SmallStraight = 'Lesser Transmutation',
  LargeStraight = 'Greater Transmutation',
  Yahtzee = "The Philosopher's Stone",
  Chance = 'Elixir of Luck',
}

export type Scorecard = {
  [key in ScoreCategory]?: number;
};

export const UPPER_SECTION_CATEGORIES: ScoreCategory[] = [
  ScoreCategory.Ones,
  ScoreCategory.Twos,
  ScoreCategory.Threes,
  ScoreCategory.Fours,
  ScoreCategory.Fives,
  ScoreCategory.Sixes,
];

export const LOWER_SECTION_CATEGORIES: ScoreCategory[] = [
  ScoreCategory.ThreeOfAKind,
  ScoreCategory.FourOfAKind,
  ScoreCategory.FullHouse,
  ScoreCategory.SmallStraight,
  ScoreCategory.LargeStraight,
  ScoreCategory.Yahtzee,
  ScoreCategory.Chance,
];