import useGameStore from '@/store/useGameStore';
import { getStationSheetMusic, matchSheetMusic } from '@/engine/melodySystem';
import { MUSIC_NOTE_CONFIG } from '@/data/config';
import { Music, Target, Sparkles } from 'lucide-react';

export default function MelodyPanel() {
  const { melodyNotes, currentStationId } = useGameStore();
  const sheetMusic = getStationSheetMusic(currentStationId);
  const currentNoteTypes = melodyNotes.map(n => n.type);
  const matchedIds = new Set(
    matchSheetMusic(melodyNotes, currentStationId).map(m => m.sheetMusicId)
  );

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm p-4 border border-purple-100">
      <div className="flex items-center gap-2 mb-3">
        <Music className="w-5 h-5 text-purple-500" />
        <span className="font-semibold text-gray-700">鸣笛乐谱</span>
        <span className="text-xs text-gray-400 ml-auto">
          命中乐谱触发奖励
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500">
          <Sparkles className="w-3.5 h-3.5" />
          本局音符序列
        </div>
        <div className="min-h-[52px] p-2.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 flex items-center gap-1.5 flex-wrap">
          {currentNoteTypes.length === 0 ? (
            <span className="text-xs text-gray-400 italic">
              开始消除以生成音符 🎵
            </span>
          ) : (
            currentNoteTypes.map((note, i) => (
              <div
                key={i}
                className="relative group"
              >
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold text-white shadow-md transition-transform hover:scale-110 animate-bounce-in"
                  style={{
                    backgroundColor: MUSIC_NOTE_CONFIG[note].color,
                    animationDelay: `${i * 40}ms`,
                  }}
                  title={`${MUSIC_NOTE_CONFIG[note].name}`}
                >
                  {MUSIC_NOTE_CONFIG[note].solfege}
                </span>
              </div>
            ))
          )}
        </div>
        {currentNoteTypes.length > 0 && (
          <div className="mt-1.5 flex gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: MUSIC_NOTE_CONFIG.do.color }} />
              Do=横消
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: MUSIC_NOTE_CONFIG.re.color }} />
              Re=纵消
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: MUSIC_NOTE_CONFIG.mi.color }} />
              Mi=炸弹
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: MUSIC_NOTE_CONFIG.fa.color }} />
              Fa=彩虹
            </span>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500">
          <Target className="w-3.5 h-3.5" />
          本站偏爱乐谱
        </div>
        <div className="space-y-2">
          {sheetMusic.map(sheet => {
            const isMatched = matchedIds.has(sheet.id);
            return (
              <div
                key={sheet.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  isMatched
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                    : 'bg-gray-50/50 border-gray-100 hover:border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-sm font-medium ${
                      isMatched ? 'text-green-700' : 'text-gray-700'
                    }`}
                  >
                    {isMatched && '✅ '}
                    {sheet.name}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      sheet.difficulty === 'easy'
                        ? 'bg-green-100 text-green-600'
                        : sheet.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {sheet.difficulty === 'easy'
                      ? '简单'
                      : sheet.difficulty === 'medium'
                      ? '中等'
                      : '困难'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    {sheet.pattern.map((note, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: MUSIC_NOTE_CONFIG[note].color }}
                      >
                        {MUSIC_NOTE_CONFIG[note].solfege}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`text-[11px] text-right flex-shrink-0 ${
                      isMatched ? 'text-green-600 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    {sheet.reward.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
