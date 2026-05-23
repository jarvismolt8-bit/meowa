import type { Cat, Vaccination, MedicalEntry } from '@/lib/api'

export interface XpState {
  level: number
  currentXp: number
  nextLevelXp: number
  progress: number
}

export interface Badge {
  id: string
  label: string
  earned: boolean
  icon: string
  description: string
}

const XP_PHOTO = 10
const XP_VACCINATION = 10
const XP_MEDICAL = 5
const XP_CHECKUP = 20

function xpForLevel(level: number): number {
  return (level * (level + 1) / 2) * 30
}

export function computeXp(
  cat: Cat,
  vaccinations: Vaccination[],
  medicalEntries: MedicalEntry[],
): XpState {
  let total = 0

  if (cat.photo_path) total += XP_PHOTO
  total += (vaccinations?.length ?? 0) * XP_VACCINATION
  total += (medicalEntries?.length ?? 0) * XP_MEDICAL

  if (cat.last_checkup) {
    const checkupDate = new Date(cat.last_checkup)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    if (checkupDate >= oneYearAgo) {
      total += XP_CHECKUP
    }
  }

  let level = 1
  while (xpForLevel(level + 1) <= total) {
    level++
  }

  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)
  const currentXp = total - currentLevelXp
  const progress = nextLevelXp - currentLevelXp > 0
    ? currentXp / (nextLevelXp - currentLevelXp)
    : 1

  return { level, currentXp, nextLevelXp: nextLevelXp - currentLevelXp, progress }
}

export function computeBadges(
  cat: Cat,
  vaccinations: Vaccination[],
  medicalEntries: MedicalEntry[],
): Badge[] {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const checkupDate = cat.last_checkup ? new Date(cat.last_checkup) : null

  return [
    {
      id: 'first-purr',
      label: 'First Purr',
      earned: true,
      icon: '🐱',
      description: 'Cat created',
    },
    {
      id: 'snap-happy',
      label: 'Snap Happy',
      earned: !!cat.photo_path,
      icon: '📸',
      description: 'Photo uploaded',
    },
    {
      id: 'vaccination-star',
      label: 'Vaccination Star',
      earned: (vaccinations?.length ?? 0) >= 3,
      icon: '💉',
      description: '3+ vaccinations',
    },
    {
      id: 'health-tracker',
      label: 'Health Tracker',
      earned: (medicalEntries?.length ?? 0) >= 3,
      icon: '📋',
      description: '3+ medical entries',
    },
    {
      id: 'checkup-champ',
      label: 'Checkup Champ',
      earned: !!checkupDate && checkupDate >= sixMonthsAgo,
      icon: '🏆',
      description: 'Checkup within 6 months',
    },
  ]
}
