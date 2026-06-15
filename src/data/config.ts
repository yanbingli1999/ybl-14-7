import { CandyType, Station, Train, BOARD_SIZE, MusicNoteType, StationSheetMusic } from '@/types';

export const CANDY_CONFIG: Record<CandyType, { name: string; color: string; points: number; emoji: string }> = {
  strawberry: { name: '草莓糖', color: '#FF6B9D', points: 10, emoji: '🍓' },
  lemon: { name: '柠檬糖', color: '#FFD93D', points: 10, emoji: '🍋' },
  mint: { name: '薄荷糖', color: '#6BCB77', points: 10, emoji: '🍀' },
  blueberry: { name: '蓝莓糖', color: '#4D96FF', points: 10, emoji: '🫐' },
  grape: { name: '葡萄糖', color: '#9B59B6', points: 10, emoji: '🍇' },
  rainbow: { name: '彩虹糖', color: 'linear-gradient(135deg, #FF6B9D, #FFD93D, #6BCB77, #4D96FF, #9B59B6)', points: 50, emoji: '🌈' },
  bomb: { name: '炸弹糖', color: '#FF4757', points: 30, emoji: '💣' },
};

export const STATIONS: Station[] = [
  {
    id: 'candy-town',
    name: '糖果小镇',
    reputationRequired: 0,
    themeColor: '#FF6B9D',
    description: '甜蜜的起点，适合新手列车长',
  },
  {
    id: 'lemon-estate',
    name: '柠檬庄园',
    reputationRequired: 100,
    themeColor: '#FFD93D',
    description: '酸爽的柠檬订单，需要更多技巧',
  },
  {
    id: 'mint-forest',
    name: '薄荷森林',
    reputationRequired: 300,
    themeColor: '#6BCB77',
    description: '急单频发的森林车站',
  },
  {
    id: 'blueberry-port',
    name: '蓝莓港口',
    reputationRequired: 600,
    themeColor: '#4D96FF',
    description: '大额订单的港口贸易站',
  },
  {
    id: 'grape-castle',
    name: '葡萄城堡',
    reputationRequired: 1000,
    themeColor: '#9B59B6',
    description: '皇家级别的复杂订单',
  },
];

export const INITIAL_TRAIN: Train = {
  id: 'candy-express',
  name: '糖果快车',
  carriages: [
    { id: 'car-1', candyType: 'strawberry', capacity: 20, currentLoad: 0 },
    { id: 'car-2', candyType: 'lemon', capacity: 20, currentLoad: 0 },
    { id: 'car-3', candyType: 'mint', capacity: 20, currentLoad: 0 },
    { id: 'car-4', candyType: 'blueberry', capacity: 20, currentLoad: 0 },
    { id: 'car-5', candyType: 'grape', capacity: 20, currentLoad: 0 },
  ],
};

export const GAME_CONFIG = {
  BOARD_SIZE,
  INITIAL_MOVES: 30,
  COMBO_BONUS_MULTIPLIER: 0.5,
  MATCH_MIN: 3,
  FOUR_MATCH_SPECIAL: 'bomb' as const,
  FIVE_MATCH_SPECIAL: 'rainbow' as const,
  DISPATCH_BASE_REWARD: 50,
  MISMATCH_PENALTY_RATE: 0.3,
  URGENT_BONUS_RATE: 0.5,
  REPUTATION_PER_SUCCESS: 10,
  REPUTATION_PER_FAIL: -5,
  LOAD_PER_MATCH: 1,
  MELODY_MAX_NOTES: 20,
  BONUS_COIN_MULTIPLIER: 0.2,
  BONUS_REPUTATION: 5,
  RETURN_CANDY_COUNT: 3,
};

export const MUSIC_NOTE_CONFIG: Record<MusicNoteType, { name: string; emoji: string; solfege: string; color: string }> = {
  do: { name: 'Do（横向）', emoji: '🎵', solfege: 'Do', color: '#FF6B9D' },
  re: { name: 'Re（纵向）', emoji: '🎶', solfege: 'Re', color: '#FFD93D' },
  mi: { name: 'Mi（炸弹）', emoji: '🎼', solfege: 'Mi', color: '#FF4757' },
  fa: { name: 'Fa（彩虹）', emoji: '🎹', solfege: 'Fa', color: '#9B59B6' },
};

export const STATION_SHEET_MUSIC: Record<string, StationSheetMusic[]> = {
  'candy-town': [
    {
      id: 'ct-welcome',
      name: '小镇迎宾曲',
      pattern: ['do', 're', 'do'],
      reward: { type: 'welcome', value: 0, description: '触发站台欢迎仪式' },
      difficulty: 'easy',
    },
    {
      id: 'ct-bonus',
      name: '甜蜜小调和',
      pattern: ['do', 'do', 're'],
      reward: { type: 'bonus', value: 20, description: '金币奖励 +20%' },
      difficulty: 'easy',
    },
    {
      id: 'ct-return',
      name: '糖果回旋歌',
      pattern: ['re', 'mi', 're'],
      reward: { type: 'return_candy', value: 3, description: '返还3颗随机糖果' },
      difficulty: 'medium',
    },
  ],
  'lemon-estate': [
    {
      id: 'le-welcome',
      name: '庄园晨曲',
      pattern: ['re', 'do', 're'],
      reward: { type: 'welcome', value: 0, description: '触发庄园欢迎仪式' },
      difficulty: 'easy',
    },
    {
      id: 'le-bonus',
      name: '柠檬酸爽调',
      pattern: ['re', 're', 'mi'],
      reward: { type: 'bonus', value: 25, description: '金币奖励 +25%' },
      difficulty: 'medium',
    },
    {
      id: 'le-return',
      name: '柠檬水之歌',
      pattern: ['do', 'mi', 'fa'],
      reward: { type: 'return_candy', value: 3, description: '返还3颗柠檬糖' },
      difficulty: 'hard',
    },
  ],
  'mint-forest': [
    {
      id: 'mf-welcome',
      name: '森林序曲',
      pattern: ['mi', 're', 'do'],
      reward: { type: 'welcome', value: 0, description: '触发森林欢迎仪式' },
      difficulty: 'medium',
    },
    {
      id: 'mf-bonus',
      name: '清新薄荷风',
      pattern: ['mi', 'mi', 'fa'],
      reward: { type: 'bonus', value: 30, description: '金币奖励 +30%' },
      difficulty: 'medium',
    },
    {
      id: 'mf-return',
      name: '林间回响',
      pattern: ['fa', 'mi', 're', 'do'],
      reward: { type: 'return_candy', value: 4, description: '返还4颗薄荷糖' },
      difficulty: 'hard',
    },
  ],
  'blueberry-port': [
    {
      id: 'bp-welcome',
      name: '港口号角',
      pattern: ['fa', 'do', 'mi'],
      reward: { type: 'welcome', value: 0, description: '触发港口欢迎仪式' },
      difficulty: 'medium',
    },
    {
      id: 'bp-bonus',
      name: '航海财富调',
      pattern: ['fa', 'fa', 'mi', 're'],
      reward: { type: 'bonus', value: 40, description: '金币奖励 +40%' },
      difficulty: 'hard',
    },
    {
      id: 'bp-return',
      name: '浪花华尔兹',
      pattern: ['do', 're', 'mi', 'fa'],
      reward: { type: 'return_candy', value: 5, description: '返还5颗蓝莓糖' },
      difficulty: 'hard',
    },
  ],
  'grape-castle': [
    {
      id: 'gc-welcome',
      name: '皇家迎宾礼',
      pattern: ['fa', 'mi', 're', 'do', 're'],
      reward: { type: 'welcome', value: 0, description: '触发皇家欢迎仪式' },
      difficulty: 'hard',
    },
    {
      id: 'gc-bonus',
      name: '紫晶荣耀调',
      pattern: ['mi', 'fa', 'mi', 'fa'],
      reward: { type: 'bonus', value: 50, description: '金币奖励 +50%' },
      difficulty: 'hard',
    },
    {
      id: 'gc-return',
      name: '葡萄藤之歌',
      pattern: ['do', 're', 'mi', 'fa', 'mi'],
      reward: { type: 'return_candy', value: 6, description: '返还6颗葡萄糖' },
      difficulty: 'hard',
    },
  ],
};

export const STATION_WELCOME_MESSAGES: Record<string, string> = {
  'candy-town': '🎪 糖果小镇居民手持彩旗热烈欢迎您的到来！',
  'lemon-estate': '🍋 庄园管家献上一杯鲜榨柠檬汁迎接您！',
  'mint-forest': '🌿 森林精灵们奏响了自然之歌欢迎您！',
  'blueberry-port': '⚓ 港口工人鸣响汽笛，挥手致意！',
  'grape-castle': '👑 皇家仪仗队奏响号角恭迎列车长！',
};
