import {
  MusicNote,
  MusicNoteType,
  MatchResult,
  StationSheetMusic,
  SheetMusicMatch,
  MelodyDispatchBonus,
  CandyType,
} from '@/types';
import {
  STATION_SHEET_MUSIC,
  STATION_WELCOME_MESSAGES,
  GAME_CONFIG,
} from '@/data/config';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function matchResultToNoteType(match: MatchResult): MusicNoteType | null {
  if (match.specialGenerated === 'rainbow') return 'fa';
  if (match.specialGenerated === 'bomb') return 'mi';

  if (match.matchType === 'special') {
    for (const candy of match.candies) {
      if (candy.specialType === 'rainbow') return 'fa';
      if (candy.specialType === 'bomb') return 'mi';
    }
  }

  if (match.matchType === 'horizontal') return 'do';
  if (match.matchType === 'vertical') return 're';
  if (match.matchType === 'both') return 'do';

  return null;
}

export function matchResultToSource(
  match: MatchResult
): 'horizontal' | 'vertical' | 'bomb' | 'rainbow' | null {
  if (match.specialGenerated === 'rainbow') return 'rainbow';
  if (match.specialGenerated === 'bomb') return 'bomb';

  if (match.matchType === 'special') {
    for (const candy of match.candies) {
      if (candy.specialType === 'rainbow') return 'rainbow';
      if (candy.specialType === 'bomb') return 'bomb';
    }
  }

  if (match.matchType === 'horizontal') return 'horizontal';
  if (match.matchType === 'vertical') return 'vertical';
  if (match.matchType === 'both') return 'horizontal';

  return null;
}

export function generateNotesFromMatches(matches: MatchResult[]): MusicNote[] {
  const notes: MusicNote[] = [];
  const now = Date.now();

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const noteType = matchResultToNoteType(match);
    const source = matchResultToSource(match);

    if (noteType && source) {
      notes.push({
        id: generateId(),
        type: noteType,
        source,
        timestamp: now + i,
      });
    }
  }

  return notes;
}

export function appendNotes(
  existingNotes: MusicNote[],
  newNotes: MusicNote[]
): MusicNote[] {
  const combined = [...existingNotes, ...newNotes];
  if (combined.length > GAME_CONFIG.MELODY_MAX_NOTES) {
    return combined.slice(combined.length - GAME_CONFIG.MELODY_MAX_NOTES);
  }
  return combined;
}

function findPatternInSequence(
  sequence: MusicNoteType[],
  pattern: MusicNoteType[]
): { startIndex: number; endIndex: number } | null {
  if (pattern.length === 0 || sequence.length < pattern.length) return null;

  for (let i = 0; i <= sequence.length - pattern.length; i++) {
    let match = true;
    for (let j = 0; j < pattern.length; j++) {
      if (sequence[i + j] !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      return { startIndex: i, endIndex: i + pattern.length - 1 };
    }
  }
  return null;
}

export function matchSheetMusic(
  notes: MusicNote[],
  stationId: string
): SheetMusicMatch[] {
  const sheets: StationSheetMusic[] = STATION_SHEET_MUSIC[stationId] || [];
  const sequence: MusicNoteType[] = notes.map(n => n.type);
  const matches: SheetMusicMatch[] = [];
  const usedIndices = new Set<number>();

  const sortedSheets = [...sheets].sort((a, b) => b.pattern.length - a.pattern.length);

  for (const sheet of sortedSheets) {
    const found = findPatternInSequence(sequence, sheet.pattern);
    if (found) {
      const indicesOverlap = Array.from(
        { length: found.endIndex - found.startIndex + 1 },
        (_, i) => found.startIndex + i
      ).some(idx => usedIndices.has(idx));

      if (!indicesOverlap) {
        for (let i = found.startIndex; i <= found.endIndex; i++) {
          usedIndices.add(i);
        }
        matches.push({
          sheetMusicId: sheet.id,
          sheetMusicName: sheet.name,
          matchedPattern: [...sheet.pattern],
          reward: { ...sheet.reward },
          startIndex: found.startIndex,
          endIndex: found.endIndex,
        });
      }
    }
  }

  return matches;
}

export function getStationSheetMusic(stationId: string): StationSheetMusic[] {
  return STATION_SHEET_MUSIC[stationId] || [];
}

function getReturnCandyTypeFromStation(stationId: string): CandyType {
  switch (stationId) {
    case 'lemon-estate':
      return 'lemon';
    case 'mint-forest':
      return 'mint';
    case 'blueberry-port':
      return 'blueberry';
    case 'grape-castle':
      return 'grape';
    default:
      const basic: CandyType[] = ['strawberry', 'lemon', 'mint', 'blueberry', 'grape'];
      return basic[Math.floor(Math.random() * basic.length)];
  }
}

export function calculateMelodyBonus(
  notes: MusicNote[],
  stationId: string,
  baseReward: number
): MelodyDispatchBonus {
  const matchedSheets = matchSheetMusic(notes, stationId);

  let welcomeMessage: string | null = null;
  let totalCoinBonusPercent = 0;
  let totalReputationBonus = 0;
  const returnedCandies: Partial<Record<CandyType, number>> = {};

  for (const match of matchedSheets) {
    switch (match.reward.type) {
      case 'welcome':
        if (!welcomeMessage) {
          welcomeMessage = STATION_WELCOME_MESSAGES[stationId] || '🎵 站台奏响欢迎曲！';
        }
        totalReputationBonus += GAME_CONFIG.BONUS_REPUTATION;
        break;
      case 'bonus':
        totalCoinBonusPercent += match.reward.value;
        totalReputationBonus += Math.floor(GAME_CONFIG.BONUS_REPUTATION * 0.5);
        break;
      case 'return_candy': {
        const candyType = getReturnCandyTypeFromStation(stationId);
        returnedCandies[candyType] = (returnedCandies[candyType] || 0) + match.reward.value;
        totalReputationBonus += GAME_CONFIG.BONUS_REPUTATION;
        break;
      }
    }
  }

  const coinBonus = Math.floor(baseReward * (totalCoinBonusPercent / 100));

  return {
    welcomeMessage,
    coinBonus,
    reputationBonus: totalReputationBonus,
    returnedCandies,
    matchedSheets,
  };
}

export function applyReturnedCandies(
  trainCarriages: { candyType: CandyType; capacity: number; currentLoad: number }[],
  returnedCandies: Partial<Record<CandyType, number>>
): { candyType: CandyType; capacity: number; currentLoad: number }[] {
  return trainCarriages.map(carriage => {
    const returnAmount = returnedCandies[carriage.candyType] || 0;
    if (returnAmount > 0) {
      const newLoad = Math.min(carriage.currentLoad + returnAmount, carriage.capacity);
      return { ...carriage, currentLoad: newLoad };
    }
    return { ...carriage };
  });
}
