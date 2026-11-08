import type { CharacterType, PoseIndex } from './GuideCharacter';

export type GuideStep = {
  id: string;
  character: CharacterType;
  pose: PoseIndex;
  badgeKey: string;
  titleKey: string;
  textKey: string;
  targetFolderId?: string;
  actionButtonKey?: string;
};

/**
 * Los 12 pasos de la guía interactiva de ECOS 98.
 * TATA (Taehyung / V) y COOKY (Jungkook) explican cada rincón de forma dulce y retro.
 */
export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'welcome',
    character: 'tata',
    pose: 1, // Saludando
    badgeKey: 'guide.badgeTata',
    titleKey: 'guide.step0.title',
    textKey: 'guide.step0.text',
  },
  {
    id: 'navigation',
    character: 'cooky',
    pose: 2, // Explicando
    badgeKey: 'guide.badgeCooky',
    titleKey: 'guide.step1.title',
    textKey: 'guide.step1.text',
  },
  {
    id: 'my-computer',
    character: 'tata',
    pose: 2, // Explicando
    badgeKey: 'guide.badgeTata',
    titleKey: 'guide.step2.title',
    textKey: 'guide.step2.text',
    targetFolderId: 'my-computer',
    actionButtonKey: 'guide.openMyComputer',
  },
  {
    id: 'vouchers',
    character: 'cooky',
    pose: 3, // Pista / Bombilla
    badgeKey: 'guide.badgeCooky',
    titleKey: 'guide.step3.title',
    textKey: 'guide.step3.text',
    targetFolderId: 'voucher-validator',
    actionButtonKey: 'guide.openVouchers',
  },
  {
    id: 'special-voucher',
    character: 'tata',
    pose: 0, // En espera / Atento
    badgeKey: 'guide.badgeTata',
    titleKey: 'guide.step4.title',
    textKey: 'guide.step4.text',
    targetFolderId: 'voucher-validator',
    actionButtonKey: 'guide.openVouchers',
  },
  {
    id: 'our-love',
    character: 'tata',
    pose: 1, // Saludando
    badgeKey: 'guide.badgeTata',
    titleKey: 'guide.step5.title',
    textKey: 'guide.step5.text',
    targetFolderId: 'our-love',
    actionButtonKey: 'guide.openOurLove',
  },
  {
    id: 'poem',
    character: 'cooky',
    pose: 3, // Pista / Bombilla
    badgeKey: 'guide.badgeCooky',
    titleKey: 'guide.step6.title',
    textKey: 'guide.step6.text',
    targetFolderId: 'our-love',
    actionButtonKey: 'guide.openOurLove',
  },
  {
    id: 'comments',
    character: 'tata',
    pose: 0, // En espera
    badgeKey: 'guide.badgeTata',
    titleKey: 'guide.step7.title',
    textKey: 'guide.step7.text',
    targetFolderId: 'comments',
    actionButtonKey: 'guide.openComments',
  },
  {
    id: 'music',
    character: 'cooky',
    pose: 3, // Pista
    badgeKey: 'guide.badgeCooky',
    titleKey: 'guide.step8.title',
    textKey: 'guide.step8.text',
    targetFolderId: 'if-love-were-songs',
    actionButtonKey: 'guide.openMusic',
  },
  {
    id: 'games',
    character: 'cooky',
    pose: 1, // Saludando
    badgeKey: 'guide.badgeCooky',
    titleKey: 'guide.step9.title',
    textKey: 'guide.step9.text',
    targetFolderId: 'games',
    actionButtonKey: 'guide.openGames',
  },
  {
    id: 'recycle-bin',
    character: 'tata',
    pose: 3, // Pista con picardía
    badgeKey: 'guide.badgeTata',
    titleKey: 'guide.step10.title',
    textKey: 'guide.step10.text',
    targetFolderId: 'recycle-bin',
    actionButtonKey: 'guide.openRecycleBin',
  },
  {
    id: 'goodbye',
    character: 'tata',
    pose: 1, // Saludando amoroso
    badgeKey: 'guide.badgeTata',
    titleKey: 'guide.step11.title',
    textKey: 'guide.step11.text',
  },
];
