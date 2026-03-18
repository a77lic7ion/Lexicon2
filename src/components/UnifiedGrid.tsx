import React from 'react';
import { motion } from 'motion/react';
import { CellState } from '../types';
import { Target, X, Flame } from 'lucide-react';
import { Tile } from './Tile';
import { TileSVG } from './TileSVG';
import { Tier } from '../constants';

interface UnifiedGridProps {
  myGrid: CellState[][];
  opponentGrid: CellState[][];
  onCellClick: (row: number, col: number) => void;
  activePlayer: 1 | 2;
}

export const UnifiedGrid: React.FC<UnifiedGridProps> = ({ 
  myGrid, 
  opponentGrid, 
  onCellClick,
  activePlayer
}) => {
  return (
    <div 
      className="relative aspect-square w-full mx-auto shadow-2xl rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 [container-type:size]"
    >
      {/* The Board SVG Background */}
      <img 
        src="/src/assets/lexicon_board.svg" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        alt="Board"
      />

      {/* Decorative Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_70%)] pointer-events-none" />
      
      {/* Grid Cells Overlay - Exactly matching the 15% - 85% area of the 1000px SVG */}
      <div className="absolute inset-[15%] grid grid-cols-10 pointer-events-auto">
        {myGrid.flat().map((myCell, idx) => {
          const r = myCell.row;
          const c = myCell.col;
          const oppCell = opponentGrid[r][c];
          
          const hasMyTile = myCell.tileId !== null;
          const isMyTileHit = myCell.isHit; // Enemy hit me
          const isMyTileMiss = myCell.isMiss; // Enemy missed me
          
          const iHitThem = oppCell.isHit;
          const iMissedThem = oppCell.isMiss;
          const isOppRevealed = oppCell.isRevealed;

          // Determine Cell Background
          let bgColor = '';
          let borderColor = 'border-white/5';
          
          if (hasMyTile) {
            bgColor = isMyTileHit ? 'bg-orange-500/10' : 'bg-cyan-500/5';
            borderColor = isMyTileHit ? 'border-orange-500/20' : 'border-cyan-500/10';
          }

          return (
            <motion.div
              key={`${r}-${c}`}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCellClick(r, c)}
              className={`
                aspect-square border ${borderColor} ${bgColor}
                flex items-center justify-center cursor-pointer relative
                transition-all duration-300 group
              `}
            >
              {/* My Tile Indicator */}
              {hasMyTile && !isMyTileHit && (
                <div className="w-[85%] h-[85%] [container-type:size]">
                  <Tile 
                    tile={{ 
                      id: myCell.tileId!, 
                      letter: myCell.letter!, 
                      tier: myCell.tier as Tier, 
                      isSpecial: myCell.isSpecial,
                      points: 0,
                      size: 1 
                    }} 
                    playerId={activePlayer}
                  />
                </div>
              )}

              {/* Enemy Hit on Me (Red Strike) */}
              {isMyTileHit && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-[85%] h-[85%] [container-type:size]"
                >
                  <TileSVG 
                    isMarker="hit"
                    isEnemyMarker={false}
                    letter={myCell.letter || ''}
                    tier={myCell.tier as Tier}
                    isSpecial={myCell.isSpecial}
                    points={0}
                    className="w-full h-full"
                  />
                </motion.div>
              )}

              {/* My Shot Indicators (Enemy Hit - Gold Burst) */}
              {iHitThem && (
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-[85%] h-[85%] [container-type:size] z-10"
                >
                  <TileSVG 
                    isMarker="hit"
                    isEnemyMarker={true}
                    letter={oppCell.letter || ''}
                    tier={oppCell.tier as Tier}
                    isSpecial={oppCell.isSpecial}
                    points={0}
                    className="w-full h-full"
                  />
                </motion.div>
              )}

              {iMissedThem && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-[85%] h-[85%] [container-type:size] z-10"
                >
                  <TileSVG 
                    isMarker="miss"
                    letter=""
                    tier="common"
                    points={0}
                    className="w-full h-full"
                  />
                </motion.div>
              )}

              {/* Revealed Enemy Ship (Spark/Surge) */}
              {isOppRevealed && !iHitThem && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-yellow-400/5 rounded-lg flex items-center justify-center"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/30" />
                </motion.div>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </motion.div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center border-t border-slate-800 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-cyan-500/20 border border-cyan-500/50" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Your Ship</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/50" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ship Damaged</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-3 h-3 text-red-500" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Enemy Hit</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="w-3 h-3 text-slate-600" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Miss</span>
        </div>
      </div>
    </div>
  );
};
