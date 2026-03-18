import React from 'react';
import { motion } from 'motion/react';
import { LetterTile } from '../constants';
import { Tooltip } from './Tooltip';
import { TileSVG } from './TileSVG';

interface TileProps {
  tile: LetterTile;
  playerId?: 1 | 2;
  isHit?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
  className?: string;
  showPoints?: boolean;
}

export const Tile: React.FC<TileProps> = ({ 
  tile, 
  playerId, 
  isHit, 
  isRevealed, 
  onClick, 
  className, 
  showPoints = true 
}) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.05, translateY: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative flex items-center justify-center
        w-full h-full
        ${isHit ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100 cursor-pointer'}
        ${isRevealed ? 'ring-2 ring-yellow-400/50 shadow-[0_0_20px_rgba(234,179,8,0.3)] rounded-lg' : ''}
        select-none transition-all duration-300
        ${className}
      `}
    >
      <TileSVG 
        letter={tile.letter}
        points={tile.points}
        tier={tile.tier}
        isSpecial={tile.isSpecial}
        playerId={playerId}
        className="w-full h-full"
      />
    </motion.div>
  );

  if (tile.description) {
    return (
      <Tooltip content={tile.description} title={tile.isSpecial ? `${tile.isSpecial.toUpperCase()} TILE` : 'WILDCARD'}>
        {content}
      </Tooltip>
    );
  }

  return content;
};
