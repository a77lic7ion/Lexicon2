import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LetterTile, LETTER_POOL, SPECIAL_TILES } from '../constants';
import { Grid } from './Grid';
import { Tile } from './Tile';
import { RotateCw, Check, Trash2, Info, LogOut, Layout } from 'lucide-react';

interface PlacementScreenProps {
  player: { id: 1 | 2; name: string; grid: any; tilesPlaced: number };
  onPlace: (row: number, col: number, tile: LetterTile, orientation: 'h' | 'v') => void;
  onFinalize: () => void;
  onUndo: (playerId: 1 | 2) => void;
  onAutoPlace: (playerId: 1 | 2) => void;
  onQuit: () => void;
  error: string | null;
}

export const PlacementScreen: React.FC<PlacementScreenProps> = ({ 
  player, 
  onPlace, 
  onFinalize, 
  onUndo,
  onAutoPlace,
  onQuit,
  error 
}) => {
  const [selectedTile, setSelectedTile] = useState<LetterTile | null>(null);
  const [orientation, setOrientation] = useState<'h' | 'v'>('h');
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const [trayOrientation, setTrayOrientation] = useState<'vertical' | 'horizontal'>('vertical');

  // Filter pool to show what's available
  // For simplicity, we'll just show a selection of tiles
  const commonTiles = LETTER_POOL.filter(t => t.tier === 'common').slice(0, 8);
  const uncommonTiles = LETTER_POOL.filter(t => t.tier === 'uncommon').slice(0, 4);
  const rareTiles = LETTER_POOL.filter(t => t.tier === 'rare').slice(0, 4);
  const wildcard = LETTER_POOL.find(t => t.tier === 'wildcard')!;

  const handleCellClick = (r: number, c: number) => {
    if (selectedTile) {
      onPlace(r, c, selectedTile, orientation);
      setSelectedTile(null);
    }
  };

  const getPreviewCells = () => {
    if (!selectedTile || !hoveredCell) return [];
    
    const cells: { r: number; c: number; isValid: boolean }[] = [];
    let allValid = true;

    for (let i = 0; i < selectedTile.size; i++) {
      const r = orientation === 'v' ? hoveredCell.r + i : hoveredCell.r;
      const c = orientation === 'h' ? hoveredCell.c + i : hoveredCell.c;
      
      const outOfBounds = r >= 10 || c >= 10;
      const overlap = !outOfBounds && player.grid[r][c].tileId !== null;
      
      if (outOfBounds || overlap) {
        allValid = false;
      }
      
      if (!outOfBounds) {
        cells.push({ r, c, isValid: true });
      }
    }

    if (allValid) {
      for (const cell of cells) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cell.r + dr;
            const nc = cell.c + dc;
            if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
              const neighbor = player.grid[nr][nc];
              if (neighbor.tileId && neighbor.tileId !== selectedTile.id) {
                allValid = false;
                break;
              }
            }
          }
          if (!allValid) break;
        }
        if (!allValid) break;
      }
    }

    return cells.map(c => ({ ...c, isValid: allValid }));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_70%)]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />

      <div className={`flex ${trayOrientation === 'vertical' ? 'flex-col lg:flex-row' : 'flex-col'} gap-8 items-center justify-center w-full max-w-7xl z-10 transition-all duration-500`}>
        
        {/* Main Board Section */}
        <div className="flex flex-col gap-8 w-full lg:flex-[2] items-center">
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-serif font-black text-white tracking-tighter">
                {player.name}: <span className="text-emerald-500">SETUP</span>
              </h1>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em]">
                POSITION YOUR FLEET (15 TILES)
              </p>
            </div>
            <button
              onClick={onQuit}
              className="px-4 py-2 bg-slate-900/50 hover:bg-red-500/20 text-slate-500 hover:text-red-500 rounded-xl border border-slate-800 hover:border-red-500/50 transition-all flex items-center gap-2 text-[10px] font-mono font-black"
            >
              <LogOut className="w-3.5 h-3.5" />
              ABORT
            </button>
          </div>

          <div className="relative group w-full max-w-[600px]">
            <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="bg-slate-900/40 p-3 rounded-[2.5rem] border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
              
              <Grid 
                grid={player.grid} 
                onCellClick={handleCellClick}
                onCellMouseEnter={(r, c) => setHoveredCell({ r, c })}
                onCellMouseLeave={() => setHoveredCell(null)}
                previewCells={getPreviewCells()}
                playerId={player.id}
                showLabels={true}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[600px] bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-500 text-xs font-mono font-bold flex items-center gap-3"
            >
              <Info className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <div className="flex gap-4 w-full max-w-[600px]">
            <button
              onClick={() => onUndo(player.id)}
              disabled={player.tilesPlaced === 0}
              className="flex-1 p-4 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl font-mono font-black text-[10px] text-slate-400 transition-all flex items-center justify-center gap-3 border border-slate-800 shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              UNDO LAST
            </button>
            <button
              onClick={() => onAutoPlace(player.id)}
              disabled={player.tilesPlaced === 15}
              className="flex-1 p-4 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl font-mono font-black text-[10px] text-emerald-500 transition-all flex items-center justify-center gap-3 border border-emerald-500/20 shadow-lg"
            >
              <RotateCw className="w-4 h-4" />
              AUTO-DEPLOY
            </button>
          </div>

          <button
            onClick={onFinalize}
            disabled={player.tilesPlaced < 15}
            className={`
              w-full max-w-[600px] p-6 rounded-[2rem] font-serif font-black text-2xl transition-all flex items-center justify-center gap-4 relative overflow-hidden
              ${player.tilesPlaced < 15 
                ? 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed' 
                : 'bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 hover:from-emerald-300 hover:to-teal-500 shadow-2xl shadow-emerald-500/20'}
            `}
          >
            {player.tilesPlaced >= 15 && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 skew-x-[-30deg]" />}
            <Check className="w-8 h-8 drop-shadow-md" />
            READY FOR BATTLE ({player.tilesPlaced}/15)
          </button>
        </div>

        {/* Tile Tray Section */}
        <div className={`flex flex-col gap-6 ${trayOrientation === 'vertical' ? 'w-full lg:w-[450px]' : 'w-full'}`}>
          <div className="bg-slate-900/60 p-6 rounded-[3rem] border border-white/10 backdrop-blur-xl flex flex-col gap-6 shadow-2xl relative group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] pointer-events-none" />
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4 relative z-10">
              <div className="flex flex-col">
                <h3 className="text-xs font-mono font-black text-slate-400 uppercase tracking-[0.3em]">
                  TILE TRAY
                </h3>
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-0.5">Scale: Premium</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTrayOrientation(prev => prev === 'vertical' ? 'horizontal' : 'vertical')}
                  className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all border border-slate-700"
                  title="Turn Tray"
                >
                  <Layout className={`w-4 h-4 ${trayOrientation === 'horizontal' ? 'rotate-90' : ''} transition-transform`} />
                </button>
                <button
                  onClick={() => setOrientation(prev => prev === 'h' ? 'v' : 'h')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono font-black transition-all ${orientation === 'h' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
                >
                  <RotateCw className={`w-3 h-3 ${orientation === 'v' ? 'rotate-90' : ''} transition-transform`} />
                  PLACEMENT: {orientation === 'h' ? 'HORIZ' : 'VERT'}
                </button>
              </div>
            </div>

            <div className={`grid ${trayOrientation === 'vertical' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-6 relative z-10`}>
              <section className="flex flex-col gap-3">
                <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest pl-1">COMMON UNITS (1x1)</span>
                <div className="grid grid-cols-4 gap-3 bg-black/40 p-4 rounded-3xl border border-white/5">
                  {commonTiles.map(t => (
                    <div key={t.id} className="relative group/tile aspect-square w-full min-w-[50px]">
                      <Tile 
                        tile={t} 
                        playerId={player.id}
                        onClick={() => setSelectedTile(t)}
                        className={`transition-all duration-300 ${selectedTile?.id === t.id ? 'ring-4 ring-yellow-500 scale-110 z-10 shadow-lg shadow-yellow-500/20' : 'hover:scale-110'}`}
                      />
                      {selectedTile?.id === t.id && (
                        <motion.div 
                          layoutId="selection-dot"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,1)]" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest pl-1">TACTICAL ASSETS</span>
                <div className="flex flex-wrap gap-4 bg-black/40 p-5 rounded-3xl border border-white/5 items-center justify-center">
                  {[...uncommonTiles.slice(0, 2), ...rareTiles.slice(0, 2), wildcard].map(t => (
                    <div key={t.id} className="w-16 h-16 [container-type:size]">
                      <Tile 
                        tile={t} 
                        playerId={player.id}
                        onClick={() => setSelectedTile(t)}
                        className={`transition-all duration-300 ${selectedTile?.id === t.id ? 'ring-4 ring-yellow-500 scale-110 z-10 shadow-lg shadow-yellow-500/20' : 'hover:scale-110'}`}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest pl-1">DEFENSIVE AUGMENTS</span>
                <div className="flex flex-wrap gap-3 bg-black/40 p-5 rounded-3xl border border-white/5 items-center justify-center">
                  {SPECIAL_TILES.map(t => (
                    <div key={t.id} className="w-14 h-14 [container-type:size]">
                      <Tile 
                        key={t.id} 
                        tile={t} 
                        playerId={player.id}
                        onClick={() => setSelectedTile(t)}
                        className={`transition-all duration-300 ${selectedTile?.id === t.id ? 'ring-4 ring-yellow-500 scale-110 z-10 shadow-lg shadow-yellow-500/20' : 'hover:scale-110'}`}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 text-slate-500 border-b border-white/5 pb-3">
              <Info className="w-3.5 h-3.5" />
              <h4 className="text-[9px] font-mono font-black uppercase tracking-[0.2em]">ENGAGEMENT PROTOCOL</h4>
            </div>
            <ul className="text-[9px] font-mono font-bold text-slate-500 flex flex-col gap-2.5">
              <li className="flex items-start gap-2"><span className="text-emerald-500">▶</span> DEPLOY EXACTLY 15 STRATEGIC UNITS</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500">▶</span> MINIMUM 3 VOWEL CORE COMPONENTS</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500">▶</span> MAINTAIN TACTICAL BUFFER ZONES</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
