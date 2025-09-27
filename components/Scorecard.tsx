import React from 'react';
import { Scorecard as ScorecardType, ScoreCategory, UPPER_SECTION_CATEGORIES, LOWER_SECTION_CATEGORIES } from '../types';

interface ScoreRowProps {
  category: ScoreCategory;
  potentialScore: number;
  finalScore?: number;
  onSelect: (category: ScoreCategory) => void;
  isSelectable: boolean;
}

const ScoreRow: React.FC<ScoreRowProps> = ({ category, potentialScore, finalScore, onSelect, isSelectable }) => {
  const hasBeenScored = finalScore !== undefined;
  const canSelect = isSelectable && !hasBeenScored;

  return (
    <div
      onClick={() => canSelect && onSelect(category)}
      className={`flex justify-between items-center py-2 px-4 border-b border-amber-800/20 transition-colors ${canSelect ? 'cursor-pointer hover:bg-amber-900/30' : ''}`}
    >
      <span className={`text-base ${hasBeenScored ? 'text-amber-900/70' : 'text-amber-800'}`}>{category}</span>
      <span className="font-mono text-lg">
        {hasBeenScored ? (
          <span className="text-amber-950 font-bold">{finalScore}</span>
        ) : isSelectable ? (
          <span className="text-yellow-400 animate-pulse">{potentialScore}</span>
        ) : (
          <span className="text-amber-900/50">-</span>
        )}
      </span>
    </div>
  );
};

interface ScorecardProps {
  scores: ScorecardType;
  potentialScores: Record<ScoreCategory, number>;
  onSelectCategory: (category: ScoreCategory) => void;
  rollsLeft: number;
  yahtzeeBonusCount: number;
}

export const Scorecard: React.FC<ScorecardProps> = ({ scores, potentialScores, onSelectCategory, rollsLeft, yahtzeeBonusCount }) => {
  const isSelectable = rollsLeft < 3;
  
  const upperSectionTotal = UPPER_SECTION_CATEGORIES.reduce((total, cat) => total + (scores[cat] || 0), 0);
  const upperBonus = upperSectionTotal >= 63 ? 35 : 0;
  const upperTotalWithBonus = upperSectionTotal + upperBonus;
  
  const lowerSectionTotal = LOWER_SECTION_CATEGORIES.reduce((total, cat) => total + (scores[cat] || 0), 0);
  const yahtzeeBonuses = yahtzeeBonusCount * 100;
  const grandTotal = upperTotalWithBonus + lowerSectionTotal + yahtzeeBonuses;

  const Page: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-['Cinzel_Decorative'] text-amber-950 text-center mb-4 pb-2 border-b-2 border-amber-800/30">{title}</h2>
      <div className="space-y-1">{children}</div>
    </div>
  );

  return (
    <div 
        className="w-full max-w-4xl bg-[#f3e9d2] text-amber-900 rounded-lg shadow-2xl flex flex-col md:flex-row shadow-[0_10px_30px_rgba(0,0,0,0.5),_inset_0_0_10px_rgba(0,0,0,0.3)] border-4 border-[#c8bda8]"
        style={{ fontFamily: "'IM Fell English', serif" }}
    >
      {/* Left Page */}
      <Page title="Basic Ingredients">
        {UPPER_SECTION_CATEGORIES.map(cat => (
          <ScoreRow key={cat} category={cat} potentialScore={potentialScores[cat]} finalScore={scores[cat]} onSelect={onSelectCategory} isSelectable={isSelectable} />
        ))}
        <div className="pt-4 mt-4 border-t-2 border-amber-800/30">
            <div className="flex justify-between font-bold text-amber-950"><span>Ingredient Purity</span><span>{upperSectionTotal}</span></div>
            <div className="flex justify-between font-bold text-amber-950"><span>Purity Bonus (if ≥ 63)</span><span className={upperBonus > 0 ? 'text-green-700' : ''}>{upperBonus}</span></div>
            <div className="flex justify-between font-bold text-xl mt-2 text-amber-800"><span>Total Purity</span><span>{upperTotalWithBonus}</span></div>
        </div>
      </Page>
      
      {/* Center Spine */}
      <div className="w-full md:w-4 bg-amber-950/20 shadow-inner"></div>

      {/* Right Page */}
      <Page title="Complex Concoctions">
        {LOWER_SECTION_CATEGORIES.map(cat => (
          <ScoreRow key={cat} category={cat} potentialScore={potentialScores[cat]} finalScore={scores[cat]} onSelect={onSelectCategory} isSelectable={isSelectable} />
        ))}
         <div className="pt-4 mt-4 border-t-2 border-amber-800/30">
            <div className="flex justify-between font-bold text-amber-950"><span>Philosopher's Bonus (x100)</span><span className="text-green-700">{yahtzeeBonuses}</span></div>
            <div className="flex justify-between font-bold text-3xl mt-4 text-amber-800" style={{fontFamily: "'Cinzel Decorative', serif", textShadow: '0 1px 1px #fff'}}>
                <span>Final Elixir</span>
                <span>{grandTotal}</span>
            </div>
        </div>
      </Page>
    </div>
  );
};