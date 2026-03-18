import React from 'react';
import { Tier } from '../constants';

interface TileSVGProps {
  letter: string;
  points: number;
  tier: Tier;
  isSpecial?: 'vault' | 'poison' | 'mirror' | 'charged' | null;
  isMarker?: 'hit' | 'miss' | 'unknown' | null;
  isEnemyMarker?: boolean;
  playerId?: 1 | 2;
  size?: number; // Physical size in px
  className?: string;
}

export const TileSVG: React.FC<TileSVGProps> = ({ 
  letter, 
  points, 
  tier, 
  isSpecial,
  isMarker,
  isEnemyMarker,
  playerId = 1, 
  size = 56, 
  className 
}) => {
  const isUncommon = tier === 'uncommon';
  const isRare = tier === 'rare';
  const isWildcard = tier === 'wildcard';
  const isSpecialTier = tier === 'special' || isSpecial;
  
  // Player specific colors
  const playerColor = playerId === 1 ? '#00D4FF' : '#F5A623';
  const playerGlow = playerId === 1 ? 'tealGlow' : 'amberGlow';
  
  // Tier specific colors/borders
  let borderColor = 'url(#borderCommon)';
  let glowFilter = '';
  let scoreBg = 'url(#scoreBg)';
  let scoreColor = '#C8922A';
  let tileBase = 'url(#tileBaseCommon)';
  let tileFace = 'url(#ivoryFace)';
  let innerStroke = '#A07830';
  let letterColor = '#1C0E00';
  
  if (isWildcard) {
    borderColor = 'url(#borderPurple)';
    glowFilter = 'url(#purpleGlow)';
    scoreBg = '#0D0020';
    scoreColor = '#E0AAFF';
    tileBase = 'url(#purpleBase)';
    tileFace = 'url(#purpleFace)';
    innerStroke = '#C060FF';
    letterColor = '#FFFFFF';
  } else if (isUncommon) {
    borderColor = 'url(#borderTeal)';
    glowFilter = 'url(#tealGlow)';
    scoreBg = 'url(#scoreBgTeal)';
    scoreColor = '#00D4FF';
    tileBase = 'url(#tileBaseUncommon)';
    innerStroke = '#00A0C0';
  } else if (isRare) {
    borderColor = 'url(#borderRare)';
    glowFilter = 'url(#goldGlow)';
    scoreBg = 'url(#scoreBg)';
    scoreColor = '#FFD700';
    tileBase = 'url(#tileBaseCommon)';
    innerStroke = '#C8922A';
  } else if (isSpecial) {
    if (isSpecial === 'vault') {
      borderColor = 'url(#borderGrey)';
      tileBase = '#1A1A2A';
      tileFace = 'url(#ivoryFace)';
      innerStroke = '#8899AA';
    } else if (isSpecial === 'poison') {
      borderColor = 'url(#borderGreen)';
      glowFilter = 'url(#greenGlow)';
      tileBase = '#0A1500';
      tileFace = '#0D1A0D';
      innerStroke = '#2DC653';
    } else if (isSpecial === 'mirror') {
      borderColor = 'url(#borderTeal)';
      glowFilter = 'url(#tealGlow)';
      tileBase = 'url(#tileBaseCommon)';
      tileFace = 'url(#ivoryFace)';
      innerStroke = '#00A0C0';
    } else if (isSpecial === 'charged') {
      borderColor = 'url(#borderGold)';
      glowFilter = 'url(#goldGlow)';
      tileBase = 'url(#tileBaseCommon)';
      tileFace = 'url(#ivoryFace)';
      innerStroke = '#C8922A';
    }
  } else if (isMarker === 'hit') {
    if (isEnemyMarker) {
      borderColor = 'url(#borderGold)';
      glowFilter = 'url(#goldGlow)';
      tileBase = '#1A0E00';
      tileFace = '#1A1000';
      innerStroke = '#F5A623';
      letterColor = '#FFFFFF';
    } else {
      borderColor = 'url(#borderRed)';
      glowFilter = 'url(#redGlow)';
      tileBase = '#1A0000';
      tileFace = 'url(#ivoryFace)';
      innerStroke = '#FF4444';
      letterColor = '#FFFFFF';
    }
  } else if (isMarker === 'miss') {
    borderColor = '#334455';
    tileBase = '#0A0E14';
    tileFace = '#0D1520';
    innerStroke = '#334455';
  }

  // Override border/glow for specific players if desired
  // For now, let's keep the tier colors but maybe add a player indicator
  
  return (
    <svg 
      viewBox="-5 -5 70 70" 
      width={size} 
      height={size} 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients and filters from lexicon_tiles_common_uncommon.svg */}
        <linearGradient id="ivoryFace" x1="10%" y1="8%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#F7EDD0" />
          <stop offset="35%" stopColor="#EDD9A3" />
          <stop offset="75%" stopColor="#D4B870" />
          <stop offset="100%" stopColor="#B8963A" />
        </linearGradient>
        <linearGradient id="purpleFace" x1="10%" y1="8%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#D4A0FF" />
          <stop offset="40%" stopColor="#9B40E0" />
          <stop offset="100%" stopColor="#4A0E8F" />
        </linearGradient>
        <linearGradient id="bevelV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bevelH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="shadowV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5A3A00" stopOpacity="0" />
          <stop offset="100%" stopColor="#3A2000" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="shadowH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A3A00" stopOpacity="0" />
          <stop offset="100%" stopColor="#3A2000" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="tileBaseCommon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A3000" />
          <stop offset="100%" stopColor="#1A1000" />
        </linearGradient>
        <linearGradient id="purpleBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A0040" />
          <stop offset="100%" stopColor="#0A0020" />
        </linearGradient>
        <linearGradient id="tileBaseUncommon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#003A44" />
          <stop offset="100%" stopColor="#001820" />
        </linearGradient>
        <linearGradient id="borderCommon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CCCCDD" />
          <stop offset="50%" stopColor="#AAAACC" />
          <stop offset="100%" stopColor="#777788" />
        </linearGradient>
        <linearGradient id="borderPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8AAFF" />
          <stop offset="50%" stopColor="#C060FF" />
          <stop offset="100%" stopColor="#7020C0" />
        </linearGradient>
        <linearGradient id="borderTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFEE" />
          <stop offset="50%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#0088BB" />
        </linearGradient>
        <linearGradient id="borderRare" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#B87820" />
        </linearGradient>
        <linearGradient id="borderGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#B87820" />
        </linearGradient>
        <linearGradient id="borderGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#44FF88" />
          <stop offset="100%" stopColor="#008844" />
        </linearGradient>
        <linearGradient id="borderRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6666" />
          <stop offset="100%" stopColor="#AA0000" />
        </linearGradient>
        <linearGradient id="borderGrey" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#888899" />
          <stop offset="100%" stopColor="#555566" />
        </linearGradient>
        <linearGradient id="scoreBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A1800" />
          <stop offset="100%" stopColor="#0D0800" />
        </linearGradient>
        <linearGradient id="scoreBgTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#001A22" />
          <stop offset="100%" stopColor="#000D10" />
        </linearGradient>
        
        <filter id="letterDepth" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="1" dy="1.5" stdDeviation="1.5" floodColor="#1A0A00" floodOpacity="0.65"/>
        </filter>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="n"/>
          <feColorMatrix type="saturate" values="0" in="n" result="g"/>
          <feBlend in="SourceGraphic" in2="g" mode="multiply" result="b"/>
          <feComposite in="b" in2="SourceGraphic" operator="in"/>
        </filter>
        <clipPath id="tc"><rect width="56" height="56" rx="7"/></clipPath>
        
        <filter id="tealGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
          <feFlood floodColor="#00D4FF" floodOpacity="0.55" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="purpleGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
          <feFlood floodColor="#C060FF" floodOpacity="0.7" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
          <feFlood floodColor="#FFE066" floodOpacity="0.55" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="amberGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
          <feFlood floodColor="#F5A623" floodOpacity="0.55" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="greenGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
          <feFlood floodColor="#00FF88" floodOpacity="0.7" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="redGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
          <feFlood floodColor="#FF2200" floodOpacity="0.8" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="hitBurst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FF6600" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF2200" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g filter="url(#tileDrop)">
        <rect x="3" y="4" width="56" height="56" rx="7" fill={tileBase} opacity={isMarker === 'unknown' ? 0.6 : 0.85}/>
        <rect x="-2" y="-2" width="60" height="60" rx="9" fill="none" stroke={borderColor} strokeWidth="3" filter={glowFilter}/>
        <rect x="0" y="0" width="56" height="56" rx="7" fill={tileFace} opacity={isSpecial === 'vault' ? 0.6 : 1}/>
        
        {/* Bevels & Shadows */}
        <rect x="0" y="0" width="56" height="16" rx="7" fill="url(#bevelV)" clipPath="url(#tc)" opacity="0.65"/>
        <rect x="0" y="0" width="16" height="56" rx="7" fill="url(#bevelH)" clipPath="url(#tc)" opacity="0.5"/>
        <rect x="0" y="40" width="56" height="16" rx="7" fill="url(#shadowV)" clipPath="url(#tc)" opacity="0.75"/>
        <rect x="40" y="0" width="16" height="56" rx="7" fill="url(#shadowH)" clipPath="url(#tc)" opacity="0.65"/>
        
        {/* Inner Engraved Line */}
        <rect x="4" y="4" width="48" height="48" rx="4" fill="none" stroke={innerStroke} strokeWidth="0.8" opacity="0.4"/>
        
        {/* Symbols and Icons */}
        {isSpecial === 'vault' ? (
          <g opacity="0.8">
            <rect x="18" y="26" width="20" height="18" rx="3" fill="none" stroke="#8899AA" strokeWidth="1.5"/>
            <path d="M 21,26 L 21,20 Q 21,14 28,14 Q 35,14 35,20 L 35,26" fill="none" stroke="#8899AA" strokeWidth="1.5"/>
            <circle cx="28" cy="33" r="3" fill="#8899AA"/>
            <rect x="26" y="33" width="4" height="5" rx="1" fill="#8899AA"/>
          </g>
        ) : isSpecial === 'poison' ? (
          <g opacity="0.8">
            <circle cx="28" cy="22" r="10" fill="none" stroke="#2DC653" strokeWidth="1.5"/>
            <circle cx="24" cy="20" r="3" fill="#2DC653"/>
            <circle cx="32" cy="20" r="3" fill="#2DC653"/>
            <line x1="16" y1="36" x2="40" y2="48" stroke="#2DC653" strokeWidth="1.5"/>
            <line x1="40" y1="36" x2="16" y2="48" stroke="#2DC653" strokeWidth="1.5"/>
          </g>
        ) : isSpecial === 'charged' ? (
          <polygon points="30,6 22,28 28,28 20,50 36,24 30,24" fill="#FFE066" filter="url(#goldGlow)" opacity="0.9"/>
        ) : isSpecial === 'mirror' ? (
          <g>
            <text x="18" y="42" fontFamily="Georgia, serif" fontSize="28" fontWeight="bold" textAnchor="middle" fill={letterColor} opacity="0.85">{letter}</text>
            <g transform="translate(56,0) scale(-1,1)">
              <text x="18" y="42" fontFamily="Georgia, serif" fontSize="28" fontWeight="bold" textAnchor="middle" fill="#00B4D8" opacity="0.45">{letter}</text>
            </g>
            <line x1="28" y1="8" x2="28" y2="46" stroke="#00D4FF" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6"/>
          </g>
        ) : isMarker === 'hit' ? (
          isEnemyMarker ? (
            <g>
              {/* Gold burst */}
              <circle cx="28" cy="28" r="22" fill="url(#hitBurst)" opacity="0.7"/>
              <polygon points="28,6 24,20 32,20" fill="#FFD700" opacity="0.8" filter="url(#goldGlow)"/>
              <polygon points="50,28 36,24 36,32" fill="#FFD700" opacity="0.7"/>
              <polygon points="28,50 24,36 32,36" fill="#FFD700" opacity="0.8"/>
              <polygon points="6,28 20,24 20,32" fill="#FFD700" opacity="0.7"/>
              <circle cx="28" cy="28" r="6" fill="#FFD700" opacity="0.9" filter="url(#goldGlow)"/>
              <circle cx="28" cy="28" r="3" fill="#FFFFFF"/>
              <text 
                x="28" y="28" 
                fontFamily="Georgia, serif" fontSize="12" fontWeight="bold" 
                textAnchor="middle" fill="#FFFFFF" dy=".3em"
              >
                {letter}
              </text>
            </g>
          ) : (
            <g>
              <line x1="14" y1="14" x2="42" y2="42" stroke="#FF4444" strokeWidth="3" filter="url(#redGlow)"/>
              <line x1="42" y1="14" x2="14" y2="42" stroke="#FF4444" strokeWidth="3" filter="url(#redGlow)"/>
              <text 
                x="28" y="28" 
                fontFamily="Georgia, serif" fontSize="12" fontWeight="bold" 
                textAnchor="middle" fill="#FF4444" dy=".3em"
              >
                {letter}
              </text>
            </g>
          )
        ) : isMarker === 'miss' ? (
          <g opacity="0.8">
            <circle cx="28" cy="28" r="7" fill="none" stroke="#556677" strokeWidth="2"/>
            <circle cx="28" cy="28" r="3" fill="#556677"/>
          </g>
        ) : (
          <text 
            x="28" y={isWildcard ? 40 : 42} 
            fontFamily="Georgia, 'Times New Roman', serif" 
            fontSize={isWildcard ? 34 : 34} fontWeight="bold"
            textAnchor="middle" fill={letterColor} filter="url(#letterDepth)"
          >
            {isWildcard ? '★' : letter}
          </text>
        )}
        
        {/* Score Badge */}
        {(points > 0 || isWildcard) && (
          <g>
            <rect x="38" y="40" width="14" height="12" rx="2.5" fill={scoreBg} opacity="0.9"/>
            <text 
              x={isWildcard ? 45 : 45} y={isWildcard ? 50 : 50} 
              fontFamily="Georgia, serif" fontSize={isWildcard ? 10 : 9} fontWeight="bold" 
              textAnchor="middle" fill={scoreColor}
            >
              {isWildcard ? '∞' : points}
            </text>
          </g>
        )}
        
        {/* Player Indicator (Mini Pip) */}
        {!isMarker && (
          <>
            <circle cx="8" cy="8" r="4" fill={isWildcard ? '#4A0E8F' : (isUncommon ? '#005566' : '#666677')} opacity="0.85"/>
            <circle cx="8" cy="8" r="2.5" fill={isWildcard ? '#C060FF' : playerColor} opacity="0.8"/>
          </>
        )}
        
        {/* Tier Label strip */}
        <rect x="0" y="47" width="56" height="9" fill={isWildcard ? '#050010' : '#0A0800'} opacity={isWildcard ? 0.4 : 0.2} clipPath="url(#tc)"/>
        <text 
          x="28" y="54" 
          fontFamily="'Courier New', monospace" fontSize="5.5" fontWeight="bold" 
          textAnchor="middle" fill={isWildcard ? '#D080FF' : (isUncommon ? '#00D4FF' : (isSpecialTier ? '#8899AA' : '#8A7040'))} letterSpacing="1.5"
        >
          {(isSpecialTier ? (isSpecial || 'SPECIAL') : (isWildcard ? 'WILDCARD' : tier)).toUpperCase()}
        </text>

        {/* Double-cell indicator for Uncommon */}
        {isUncommon && (
          <g opacity="0.8">
            <rect x="34" y="4" width="9" height="8" rx="1.5" fill="none" stroke="#00D4FF" strokeWidth="1"/>
            <rect x="45" y="4" width="9" height="8" rx="1.5" fill="none" stroke="#00D4FF" strokeWidth="1"/>
            <line x1="43" y1="8" x2="45" y2="8" stroke="#00D4FF" strokeWidth="1"/>
          </g>
        )}
      </g>
    </svg>
  );
};
