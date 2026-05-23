import { describe, it, expect } from 'vitest'
import { computeXp, computeBadges } from '../gamification'
import type { Cat, Vaccination, MedicalEntry } from '../api'

const baseCat: Cat = {
  id: 1,
  name: 'Whiskers',
  age: 3,
  details: null,
  favorite_foods: [],
  last_checkup: null,
  photo_path: null,
  next_checkup_due: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

// XP formula: xpForLevel(n) = (n*(n+1)/2)*30
// Level 1 baseline = xpForLevel(1) = 30, so currentXp = total - 30
// With 0 total XP: currentXp = 0 - 30 = -30, progress is negative but the
// nextLevelXp span (xpForLevel(2)-xpForLevel(1) = 90-30 = 60) is what matters.

describe('computeXp', () => {
  it('returns level 1 for a cat with no data', () => {
    const result = computeXp(baseCat, [], [])
    expect(result.level).toBe(1)
    // nextLevelXp is the span to next level (60 at level 1)
    expect(result.nextLevelXp).toBeGreaterThan(0)
  })

  it('increases XP with each vaccination', () => {
    const noVaccResult = computeXp(baseCat, [], [])
    const vaccs: Vaccination[] = [
      { id: 1, cat_id: 1, name: 'Rabies', date: '2024-01-01', created_at: '2024-01-01T00:00:00.000Z' },
      { id: 2, cat_id: 1, name: 'FVRCP', date: '2024-02-01', created_at: '2024-02-01T00:00:00.000Z' },
    ]
    const twoVaccResult = computeXp(baseCat, vaccs, [])
    // 2 vaccinations × 10 XP = 20 more; currentXp increases by 20
    expect(twoVaccResult.currentXp).toBe(noVaccResult.currentXp + 20)
  })

  it('awards XP bonus for recent checkup within 1 year', () => {
    const recentCheckup = new Date()
    recentCheckup.setMonth(recentCheckup.getMonth() - 3)
    const catWithCheckup: Cat = { ...baseCat, last_checkup: recentCheckup.toISOString() }

    const withCheckup = computeXp(catWithCheckup, [], [])
    const without = computeXp(baseCat, [], [])
    expect(withCheckup.currentXp).toBeGreaterThan(without.currentXp)
  })

  it('does not award checkup XP for checkup older than 1 year', () => {
    const oldCheckup = new Date()
    oldCheckup.setFullYear(oldCheckup.getFullYear() - 2)
    const catOldCheckup: Cat = { ...baseCat, last_checkup: oldCheckup.toISOString() }

    const withOldCheckup = computeXp(catOldCheckup, [], [])
    const withoutCheckup = computeXp(baseCat, [], [])
    expect(withOldCheckup.currentXp).toBe(withoutCheckup.currentXp)
  })

  it('awards photo XP when photo_path is set', () => {
    const catWithPhoto: Cat = { ...baseCat, photo_path: '/uploads/whiskers.jpg' }
    const withPhoto = computeXp(catWithPhoto, [], [])
    const without = computeXp(baseCat, [], [])
    expect(withPhoto.currentXp).toBeGreaterThan(without.currentXp)
  })
})

describe('computeBadges', () => {
  it('always earns the first-purr badge', () => {
    const badges = computeBadges(baseCat, [], [])
    const firstPurr = badges.find((b) => b.id === 'first-purr')
    expect(firstPurr).toBeDefined()
    expect(firstPurr!.earned).toBe(true)
  })

  it('unlocks vaccination-star badge with 3 or more vaccinations', () => {
    const vaccs: Vaccination[] = [
      { id: 1, cat_id: 1, name: 'Rabies', date: '2024-01-01', created_at: '2024-01-01T00:00:00.000Z' },
      { id: 2, cat_id: 1, name: 'FVRCP', date: '2024-02-01', created_at: '2024-02-01T00:00:00.000Z' },
      { id: 3, cat_id: 1, name: 'FeLV', date: '2024-03-01', created_at: '2024-03-01T00:00:00.000Z' },
    ]
    const badges = computeBadges(baseCat, vaccs, [])
    const vaccBadge = badges.find((b) => b.id === 'vaccination-star')
    expect(vaccBadge!.earned).toBe(true)
  })

  it('does NOT unlock vaccination-star badge with fewer than 3 vaccinations', () => {
    const vaccs: Vaccination[] = [
      { id: 1, cat_id: 1, name: 'Rabies', date: '2024-01-01', created_at: '2024-01-01T00:00:00.000Z' },
      { id: 2, cat_id: 1, name: 'FVRCP', date: '2024-02-01', created_at: '2024-02-01T00:00:00.000Z' },
    ]
    const badges = computeBadges(baseCat, vaccs, [])
    const vaccBadge = badges.find((b) => b.id === 'vaccination-star')
    expect(vaccBadge!.earned).toBe(false)
  })

  it('unlocks health-tracker badge with 3 or more medical entries', () => {
    const entries: MedicalEntry[] = [
      { id: 1, cat_id: 1, date: '2024-01-01', notes: 'check', created_at: '2024-01-01T00:00:00.000Z' },
      { id: 2, cat_id: 1, date: '2024-02-01', notes: 'check', created_at: '2024-02-01T00:00:00.000Z' },
      { id: 3, cat_id: 1, date: '2024-03-01', notes: 'check', created_at: '2024-03-01T00:00:00.000Z' },
    ]
    const badges = computeBadges(baseCat, [], entries)
    const healthBadge = badges.find((b) => b.id === 'health-tracker')
    expect(healthBadge!.earned).toBe(true)
  })

  it('unlocks checkup-champ badge when checkup is within 6 months', () => {
    const recentCheckup = new Date()
    recentCheckup.setMonth(recentCheckup.getMonth() - 2)
    const catWithCheckup: Cat = { ...baseCat, last_checkup: recentCheckup.toISOString() }
    const badges = computeBadges(catWithCheckup, [], [])
    const checkupBadge = badges.find((b) => b.id === 'checkup-champ')
    expect(checkupBadge!.earned).toBe(true)
  })

  it('does NOT unlock checkup-champ when checkup is older than 6 months', () => {
    const oldCheckup = new Date()
    oldCheckup.setMonth(oldCheckup.getMonth() - 8)
    const catOldCheckup: Cat = { ...baseCat, last_checkup: oldCheckup.toISOString() }
    const badges = computeBadges(catOldCheckup, [], [])
    const checkupBadge = badges.find((b) => b.id === 'checkup-champ')
    expect(checkupBadge!.earned).toBe(false)
  })
})
