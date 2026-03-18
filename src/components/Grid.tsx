import React from 'react';
import { motion } from 'motion/react';
import { CellState } from '../types';
import { Tile } from './Tile';
import { TileSVG } from './TileSVG';
import { LetterTile, Tier } from '../constants';
import boardSvg from '../assets/lexicon_board.svg';

interface GridProps {
  grid: CellState[][];
  onCellClick?: (row: number, col: number) => void;
  onCellMouseEnter?: (row: number, col: number) => void;
  onCellMouseLeave?: () => void;
  previewCells?: { r: number; c: number; isValid: boolean }[];
  isEnemy?: boolean;
  activePlayer?: 1 | 2;
  playerId?: 1 | 2; // Owner of the board
  showLabels?: boolean;
}

export const Grid: React.FC<GridProps> = ({ 
  grid, 
  onCellClick, 
  onCellMouseEnter,
  onCellMouseLeave,
  previewCells,
  isEnemy, 
  activePlayer, 
  playerId,
  showLabels = true 
}) => {
  return (
    <div 
      className="relative aspect-square w-full mx-auto shadow-2xl rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 [container-type:size]"
      onMouseLeave={onCellMouseLeave}
    >
      {/* The Board SVG */}
      <img 
        src={boardSvg} 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        alt="Board"
      />

      {/* Grid Cells Overlay - Exactly matching the 15% - 85% area of the 1000px SVG */}
      <div className="absolute inset-[15%] grid grid-cols-10 pointer-events-auto">
        {grid.flat().map((cell, idx) => {
          const isHit = cell.isHit;
          const isMiss = cell.isMiss;
          const isRevealed = cell.isRevealed;
          const hasTile = cell.tileId !== null;
          const isSpecial = cell.isSpecial;
          
          const preview = previewCells?.find(p => p.r === cell.row && p.c === cell.col);

          return (
            <motion.div
              key={`${cell.row}-${cell.col}`}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCellClick?.(cell.row, cell.col)}
              onMouseEnter={() => onCellMouseEnter?.(cell.row, cell.col)}
              className={`
                aspect-square border border-white/5
                flex items-center justify-center cursor-pointer relative
                transition-colors duration-200
                ${isHit ? 'bg-red-500/10' : ''}
                ${isMiss ? 'bg-black/20' : ''}
                ${isRevealed ? 'bg-yellow-500/5' : ''}
                ${preview ? (preview.isValid ? 'bg-emerald-500/20' : 'bg-red-500/20') : ''}
              `}
            >
              {/* Content for Player's own grid */}
              {!isEnemy && hasTile && !isHit && (
                <div className="w-[85%] h-[85%] [container-type:size]">
                  <Tile 
                    tile={{ 
                      id: cell.tileId!, 
                      letter: cell.letter!, 
                      tier: cell.tier as Tier, 
                      isSpecial: cell.isSpecial,
                      points: 0, 
                      size: 1 
                    }} 
                    playerId={playerId}
                  />
                </div>
              )}

              {/* Content for Enemy grid or Hit cells */}
              {isHit && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-[85%] h-[85%] [container-type:size]"
                >
                  <TileSVG 
                    isMarker="hit"
                    isEnemyMarker={isEnemy}
                    letter={cell.letter || ''}
                    tier={cell.tier as Tier}
                    isSpecial={cell.isSpecial}
                    points={0}
                    className="w-full h-full"
                  />
                </motion.div>
              )}

              {isMiss && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-[85%] h-[85%] [container-type:size]"
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


              {/* Revealed (Spark/Surge) */}
              {isEnemy && isRevealed && !isHit && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-3 h-3 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center"
                >
                  <div className="w-1 h-1 rounded-full bg-yellow-400" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
