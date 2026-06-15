import useGameStore from '@/store/useGameStore';
import { CANDY_CONFIG, MUSIC_NOTE_CONFIG } from '@/data/config';
import { Coins, Star, CheckCircle, XCircle, Music, Gift, Sparkles } from 'lucide-react';

export default function DispatchResultModal() {
  const { gamePhase, dispatchResult, nextOrder, closeResult, currentOrder } = useGameStore();

  if (gamePhase !== 'result' || !dispatchResult || !currentOrder) return null;

  const { success, matchRate, reward, penalty, mismatches, correctItems, reputationChange, melodyBonus } =
    dispatchResult;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-bounce-in
          ${success ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-rose-600'}`}
      >
        <div className="p-6 text-center">
          <div className="text-6xl mb-4">
            {success ? '🎉' : '😅'}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {success ? '发车成功！' : '有点小差错...'}
          </h2>
          <p className="text-white/80 text-sm">
            {success ? '糖果已安全送达目的地' : '下次一定能做得更好！'}
          </p>
        </div>

        <div className="bg-white rounded-t-3xl p-6 -mt-2">
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                {Math.round(matchRate * 100)}%
              </div>
              <div className="text-xs text-gray-500">匹配度</div>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <div className={`text-3xl font-bold ${reward > 0 ? 'text-yellow-500' : 'text-gray-400'}`}>
                +{reward}
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Coins className="w-3 h-3" />
                奖励
              </div>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <div className={`text-3xl font-bold ${reputationChange >= 0 ? 'text-purple-500' : 'text-red-500'}`}>
                {reputationChange >= 0 ? '+' : ''}{reputationChange}
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Star className="w-3 h-3" />
                信誉
              </div>
            </div>
          </div>

          {penalty > 0 && (
            <div className="mb-4 p-3 bg-red-50 rounded-xl flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-600 text-sm">
                错装罚金: -{penalty} 金币
              </span>
            </div>
          )}

          {correctItems.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                正确送达
              </h4>
              <div className="flex flex-wrap gap-2">
                {correctItems.map((item, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-sm"
                  >
                    {CANDY_CONFIG[item.candyType].emoji}
                    {item.quantity}个
                  </span>
                ))}
              </div>
            </div>
          )}

          {mismatches.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-500" />
                错装或缺货
              </h4>
              <div className="flex flex-wrap gap-2">
                {mismatches.map((item, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-lg text-sm"
                  >
                    {CANDY_CONFIG[item.candyType].emoji}
                    差{item.quantity}个
                  </span>
                ))}
              </div>
            </div>
          )}

          {melodyBonus && melodyBonus.matchedSheets.length > 0 && (
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <h4 className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
                <Music className="w-5 h-5" />
                🎵 鸣笛乐谱命中！
              </h4>

              {melodyBonus.welcomeMessage && (
                <div className="mb-3 p-3 bg-white/70 rounded-xl text-sm text-purple-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  {melodyBonus.welcomeMessage}
                </div>
              )}

              <div className="space-y-2">
                {melodyBonus.matchedSheets.map((sheet, i) => (
                  <div key={i} className="p-2 bg-white/60 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800">
                        🎼 {sheet.sheetMusicName}
                      </span>
                      <span className="text-xs text-purple-600 font-medium">
                        {sheet.reward.description}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {sheet.matchedPattern.map((note, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: MUSIC_NOTE_CONFIG[note].color }}
                        >
                          {MUSIC_NOTE_CONFIG[note].solfege}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {(melodyBonus.coinBonus > 0 ||
                melodyBonus.reputationBonus > 0 ||
                Object.keys(melodyBonus.returnedCandies).length > 0) && (
                <div className="mt-3 pt-3 border-t border-purple-200/60">
                  <div className="flex flex-wrap gap-3">
                    {melodyBonus.coinBonus > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-lg text-sm text-yellow-700">
                        <Coins className="w-4 h-4" />
                        +{melodyBonus.coinBonus}
                      </div>
                    )}
                    {melodyBonus.reputationBonus > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-lg text-sm text-purple-700">
                        <Star className="w-4 h-4" />
                        +{melodyBonus.reputationBonus}
                      </div>
                    )}
                    {Object.entries(melodyBonus.returnedCandies).map(([type, count]) =>
                      count ? (
                        <div
                          key={type}
                          className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-lg text-sm text-green-700"
                        >
                          <Gift className="w-4 h-4" />
                          {CANDY_CONFIG[type as keyof typeof CANDY_CONFIG].emoji}
                          +{count}
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={closeResult}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              继续装填
            </button>
            <button
              onClick={nextOrder}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95
                ${success
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                }`}
            >
              接下一单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
