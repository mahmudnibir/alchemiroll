
import { ScoreCategory, UPPER_SECTION_CATEGORIES, LOWER_SECTION_CATEGORIES } from '../types';

const countDice = (dice: number[]): Record<number, number> => {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const d of dice) {
    if (d >= 1 && d <= 6) {
      counts[d]++;
    }
  }
  return counts;
};

const sumDice = (dice: number[]): number => dice.reduce((sum, d) => sum + d, 0);

const calculateUpperSection = (dice: number[], value: number): number => {
  return dice.filter(d => d === value).reduce((sum, d) => sum + d, 0);
};

const calculateOfAKind = (dice: number[], kind: number): number => {
  const counts = countDice(dice);
  const hasKind = Object.values(counts).some(count => count >= kind);
  return hasKind ? sumDice(dice) : 0;
};

const calculateFullHouse = (dice: number[]): number => {
  const counts = countDice(dice);
  const values = Object.values(counts);
  const hasThree = values.includes(3);
  const hasTwo = values.includes(2);
  return hasThree && hasTwo ? 25 : 0;
};

const calculateSmallStraight = (dice: number[]): number => {
  const uniqueDice = [...new Set(dice)].sort((a, b) => a - b);
  const sequences = ['1234', '2345', '3456'];
  const diceString = uniqueDice.join('');
  for (const seq of sequences) {
    if (diceString.includes(seq)) {
      return 30;
    }
  }
  return 0;
};

const calculateLargeStraight = (dice: number[]): number => {
  const uniqueDice = [...new Set(dice)].sort((a, b) => a - b);
  const sequences = ['12345', '23456'];
  const diceString = uniqueDice.join('');
  for (const seq of sequences) {
    if (diceString.includes(seq)) {
      return 40;
    }
  }
  return 0;
};

const calculateYahtzee = (dice: number[]): number => {
  const counts = countDice(dice);
  const isYahtzee = Object.values(counts).some(count => count >= 5);
  return isYahtzee ? 50 : 0;
};

export const calculatePotentialScores = (dice: number[]): Record<ScoreCategory, number> => {
  return {
    [ScoreCategory.Ones]: calculateUpperSection(dice, 1),
    [ScoreCategory.Twos]: calculateUpperSection(dice, 2),
    [ScoreCategory.Threes]: calculateUpperSection(dice, 3),
    [ScoreCategory.Fours]: calculateUpperSection(dice, 4),
    [ScoreCategory.Fives]: calculateUpperSection(dice, 5),
    [ScoreCategory.Sixes]: calculateUpperSection(dice, 6),
    [ScoreCategory.ThreeOfAKind]: calculateOfAKind(dice, 3),
    [ScoreCategory.FourOfAKind]: calculateOfAKind(dice, 4),
    [ScoreCategory.FullHouse]: calculateFullHouse(dice),
    [ScoreCategory.SmallStraight]: calculateSmallStraight(dice),
    [ScoreCategory.LargeStraight]: calculateLargeStraight(dice),
    [ScoreCategory.Yahtzee]: calculateYahtzee(dice),
    [ScoreCategory.Chance]: sumDice(dice),
  };
};

export const ALL_CATEGORIES = [...UPPER_SECTION_CATEGORIES, ...LOWER_SECTION_CATEGORIES];