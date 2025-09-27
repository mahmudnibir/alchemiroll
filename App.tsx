import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Dice from './components/Dice';
import { Scorecard } from './components/Scorecard';
import { ScoreCategory, Scorecard as ScorecardType } from './types';
import { calculatePotentialScores, ALL_CATEGORIES } from './utils/score';

const initialDice = () => Array(5).fill(1);
const initialHeld = () => Array(5).fill(false);
const initialScores = (): ScorecardType => ({});

const App: React.FC = () => {
  const [dice, setDice] = useState<number[]>(initialDice());
  const [held, setHeld] = useState<boolean[]>(initialHeld());
  const [rollsLeft, setRollsLeft] = useState<number>(3);
  const [scores, setScores] = useState<ScorecardType>(initialScores());
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [rolling, setRolling] = useState<boolean>(false);
  const [yahtzeeBonusCount, setYahtzeeBonusCount] = useState<number>(0);

  const potentialScores = useMemo(() => calculatePotentialScores(dice), [dice]);

  const totalScore = useMemo(() => {
    const upperSectionTotal = ALL_CATEGORIES.slice(0, 6).reduce((total, cat) => total + (scores[cat] || 0), 0);
    const upperBonus = upperSectionTotal >= 63 ? 35 : 0;
    const lowerSectionTotal = ALL_CATEGORIES.slice(6).reduce((total, cat) => total + (scores[cat] || 0), 0);
    const yahtzeeBonuses = yahtzeeBonusCount * 100;
    return upperSectionTotal + upperBonus + lowerSectionTotal + yahtzeeBonuses;
  }, [scores, yahtzeeBonusCount]);

  useEffect(() => {
    if (Object.keys(scores).length === ALL_CATEGORIES.length) {
      setIsGameOver(true);
    }
  }, [scores]);
  
  const rollDice = useCallback(() => {
    if (rollsLeft > 0 && !rolling) {
      setRolling(true);
      setRollsLeft(prev => prev - 1);
      
      setTimeout(() => {
        setDice(prevDice => prevDice.map((d, i) => 
          held[i] ? d : Math.ceil(Math.random() * 6)
        ));
        setRolling(false);
      }, 500);
    }
  }, [rollsLeft, held, rolling]);

  const toggleHold = useCallback((index: number) => {
    if (rollsLeft < 3) {
      setHeld(prevHeld => {
        const newHeld = [...prevHeld];
        newHeld[index] = !newHeld[index];
        return newHeld;
      });
    }
  }, [rollsLeft]);

  const selectCategory = useCallback((category: ScoreCategory) => {
    if (scores[category] !== undefined || rollsLeft === 3) return;

    const isCurrentRollYahtzee = potentialScores[ScoreCategory.Yahtzee] === 50;
    const hasScoredYahtzee = scores[ScoreCategory.Yahtzee] === 50;
    
    if (isCurrentRollYahtzee && hasScoredYahtzee) {
      setYahtzeeBonusCount(prev => prev + 1);
    }

    setScores(prevScores => ({
      ...prevScores,
      [category]: potentialScores[category],
    }));

    setRollsLeft(3);
    setHeld(initialHeld());
  }, [scores, rollsLeft, potentialScores]);

  const newGame = () => {
    setDice(initialDice());
    setHeld(initialHeld());
    setRollsLeft(3);
    setScores(initialScores());
    setIsGameOver(false);
    setRolling(false);
    setYahtzeeBonusCount(0);
  };

  const getStatusMessage = () => {
    if(isGameOver) return "Your experiment is complete.";
    if(rollsLeft === 3) return "Prepare your components and cast the runes.";
    if(rollsLeft > 0) return `You have ${rollsLeft} ${rollsLeft === 1 ? 'cast' : 'casts'} remaining.`;
    return "Record your findings in the Grimoire.";
  }

  const backgroundStyle = {
    background: 'radial-gradient(circle at center, #2c3e50 0%, #000000 100%)',
    fontFamily: "'IM Fell English', serif",
  };

  return (
    <div className="bg-slate-900 text-amber-100 min-h-screen flex flex-col items-center justify-center p-4 antialiased" style={backgroundStyle}>
      {isGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#f3e9d2] p-10 rounded-xl text-center shadow-2xl border-4 border-[#c8bda8] text-amber-950">
            <h2 className="text-4xl mb-4" style={{ fontFamily: "'Cinzel Decorative', serif" }}>Experiment Complete!</h2>
            <p className="text-xl mb-2">Final Elixir Potency:</p>
            <p className="text-6xl font-bold mb-8">{totalScore}</p>
            <button
              onClick={newGame}
              className="px-8 py-3 bg-amber-700 text-white font-bold rounded-lg text-xl hover:bg-amber-800 transition-colors shadow-lg"
            >
              Begin a New Experiment
            </button>
          </div>
        </div>
      )}

      <header className="text-center mb-6">
        <h1 className="text-7xl font-bold text-amber-400" style={{ fontFamily: "'Cinzel Decorative', serif", textShadow: '0 0 8px #f59e0b, 0 0 12px #f59e0b, 0 0 20px #b45309' }}>Alchemist's Roll</h1>
        <p className="text-amber-300/80 mt-2 text-lg">{getStatusMessage()}</p>
      </header>
      
      <main className="flex flex-col items-center gap-8 w-full max-w-5xl">
        <Scorecard 
            scores={scores} 
            potentialScores={potentialScores}
            onSelectCategory={selectCategory}
            rollsLeft={rollsLeft}
            yahtzeeBonusCount={yahtzeeBonusCount}
        />

        <div className="flex flex-col items-center gap-6 p-6 bg-black/20 backdrop-blur-sm border border-amber-500/20 rounded-lg w-full max-w-lg">
            <div className="flex flex-wrap justify-center gap-4">
              {dice.map((value, i) => (
                <Dice 
                  key={i} 
                  value={value} 
                  isHeld={held[i]} 
                  onClick={() => toggleHold(i)}
                  rolling={rolling}
                />
              ))}
            </div>

            <button
              onClick={rollDice}
              disabled={rollsLeft === 0 || isGameOver || rolling}
              className="w-full max-w-xs px-8 py-4 bg-amber-600 text-white text-2xl rounded-lg transition-all duration-200 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100 transform active:scale-95 shadow-[0_4px_15px_rgba(245,158,11,0.4)] hover:bg-amber-700 hover:shadow-[0_4px_20px_rgba(245,158,11,0.6)]"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              {rolling ? 'Casting...' : `Cast Runes (${rollsLeft})`}
            </button>

            <button
              onClick={newGame}
              className="w-full max-w-xs px-8 py-2 bg-transparent text-amber-400/80 font-bold rounded-lg border border-amber-500/50 hover:bg-amber-500/20 hover:text-amber-300 transition-colors"
            >
              New Experiment
            </button>
        </div>
      </main>
    </div>
  );
};

export default App;