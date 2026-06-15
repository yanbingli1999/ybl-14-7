import { Train, StationOrder, DispatchResult, OrderItem, CandyType, MusicNote, Carriage } from '@/types';
import { GAME_CONFIG } from '@/data/config';
import { getCandyLoad } from './loadingSystem';
import { calculateMelodyBonus } from './melodySystem';

export function calculateDispatchResult(
  train: Train,
  order: StationOrder,
  melodyNotes: MusicNote[] = [],
  stationId: string = ''
): DispatchResult {
  const correctItems: OrderItem[] = [];
  const mismatches: OrderItem[] = [];
  let matchPoints = 0;
  let totalRequired = 0;

  for (const item of order.items) {
    const loaded = getCandyLoad(train, item.candyType);
    totalRequired += item.quantity;

    if (loaded >= item.quantity) {
      correctItems.push({ ...item });
      matchPoints += item.quantity;
    } else if (loaded > 0) {
      correctItems.push({ candyType: item.candyType, quantity: loaded });
      mismatches.push({ candyType: item.candyType, quantity: item.quantity - loaded });
      matchPoints += loaded;
    } else {
      mismatches.push({ ...item });
    }
  }

  for (const carriage of train.carriages) {
    const inOrder = order.items.find(i => i.candyType === carriage.candyType);
    if (!inOrder && carriage.currentLoad > 0) {
      mismatches.push({ candyType: carriage.candyType, quantity: carriage.currentLoad });
    }
  }

  const matchRate = totalRequired > 0 ? matchPoints / totalRequired : 0;
  const success = matchRate >= 0.8;

  let baseReward = 0;
  if (success) {
    baseReward = order.reward;
    if (order.isUrgent) {
      baseReward += Math.floor(order.reward * GAME_CONFIG.URGENT_BONUS_RATE);
    }
  }

  const melodyBonus =
    melodyNotes.length > 0 && stationId
      ? calculateMelodyBonus(melodyNotes, stationId, baseReward)
      : null;

  let reward = baseReward;
  if (melodyBonus) {
    reward += melodyBonus.coinBonus;
  }

  let penalty = 0;
  if (mismatches.length > 0) {
    penalty = Math.floor(order.reward * GAME_CONFIG.MISMATCH_PENALTY_RATE) * mismatches.length;
    penalty = Math.min(penalty, order.penalty);
  }

  let reputationChange = success
    ? GAME_CONFIG.REPUTATION_PER_SUCCESS
    : GAME_CONFIG.REPUTATION_PER_FAIL;

  if (melodyBonus) {
    reputationChange += melodyBonus.reputationBonus;
  }

  return {
    success,
    matchRate,
    reward,
    penalty,
    mismatches,
    correctItems,
    reputationChange,
    melodyBonus,
  };
}

export function applyReturnedCandiesToTrain(
  train: Train,
  melodyBonus: { returnedCandies: Partial<Record<CandyType, number>> } | null
): Train {
  if (!melodyBonus || Object.keys(melodyBonus.returnedCandies).length === 0) {
    return train;
  }
  return {
    ...train,
    carriages: train.carriages.map((carriage: Carriage) => {
      const returnAmount = melodyBonus.returnedCandies[carriage.candyType] || 0;
      if (returnAmount > 0) {
        const newLoad = Math.min(carriage.currentLoad + returnAmount, carriage.capacity);
        return { ...carriage, currentLoad: newLoad };
      }
      return { ...carriage };
    }),
  };
}

export function canDispatch(train: Train): boolean {
  const totalLoad = train.carriages.reduce((sum, c) => sum + c.currentLoad, 0);
  return totalLoad > 0;
}

export function getMatchColor(matchRate: number): string {
  if (matchRate >= 0.9) return '#6BCB77';
  if (matchRate >= 0.7) return '#FFD93D';
  if (matchRate >= 0.5) return '#FF9F43';
  return '#FF4757';
}
