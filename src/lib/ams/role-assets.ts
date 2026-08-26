// @ts-nocheck
// Central registry of premium 3D collectible assets per role.
// Only images that exist on disk should be referenced here.

import type { RoleSlug } from "./roles";

import devBadge from "@/assets/badges/developer.png";
import resellerBadge from "@/assets/badges/reseller.png";
import franchiseBadge from "@/assets/badges/franchise.png";
import authorBadge from "@/assets/badges/author.png";
import vendorBadge from "@/assets/badges/vendor.png";
import affiliateBadge from "@/assets/badges/affiliate.png";
import influencerBadge from "@/assets/badges/influencer.png";
import creatorBadge from "@/assets/badges/creator.png";
import seoBadge from "@/assets/badges/seo.png";
import supportBadge from "@/assets/badges/support.png";
import userBadge from "@/assets/badges/user.png";

import devPass from "@/assets/passports/developer.png";
import resellerPass from "@/assets/passports/reseller.png";
import franchisePass from "@/assets/passports/franchise.png";
import authorPass from "@/assets/passports/author.png";
import vendorPass from "@/assets/passports/vendor.png";
import affiliatePass from "@/assets/passports/affiliate.png";
import influencerPass from "@/assets/passports/influencer.png";
import creatorPass from "@/assets/passports/creator.png";
import seoPass from "@/assets/passports/seo.png";
import supportPass from "@/assets/passports/support.png";
import userPass from "@/assets/passports/user.png";

import devCert from "@/assets/certificates/developer.png";
import resellerCert from "@/assets/certificates/reseller.png";
import franchiseCert from "@/assets/certificates/franchise.png";
import authorCert from "@/assets/certificates/author.png";
import vendorCert from "@/assets/certificates/vendor.png";
import affiliateCert from "@/assets/certificates/affiliate.png";
import influencerCert from "@/assets/certificates/influencer.png";
import creatorCert from "@/assets/certificates/creator.png";
import seoCert from "@/assets/certificates/seo.png";
import supportCert from "@/assets/certificates/support.png";
import userCert from "@/assets/certificates/user.png";

import devMember from "@/assets/membership/developer.png";
import resellerMember from "@/assets/membership/reseller.png";
import franchiseMember from "@/assets/membership/franchise.png";
import authorMember from "@/assets/membership/author.png";
import vendorMember from "@/assets/membership/vendor.png";
import affiliateMember from "@/assets/membership/affiliate.png";
import influencerMember from "@/assets/membership/influencer.png";
import creatorMember from "@/assets/membership/creator.png";
import seoMember from "@/assets/membership/seo.png";
import supportMember from "@/assets/membership/support.png";
import userMember from "@/assets/membership/user.png";

import devRank from "@/assets/ranks/developer.png";
import resellerRank from "@/assets/ranks/reseller.png";
import franchiseRank from "@/assets/ranks/franchise.png";
import authorRank from "@/assets/ranks/author.png";
import vendorRank from "@/assets/ranks/vendor.png";
import affiliateRank from "@/assets/ranks/affiliate.png";
import influencerRank from "@/assets/ranks/influencer.png";
import creatorRank from "@/assets/ranks/creator.png";
import seoRank from "@/assets/ranks/seo.png";
import supportRank from "@/assets/ranks/support.png";
import userRank from "@/assets/ranks/user.png";

import devShield from "@/assets/shields/developer.png";
import resellerShield from "@/assets/shields/reseller.png";
import franchiseShield from "@/assets/shields/franchise.png";
import authorShield from "@/assets/shields/author.png";
import vendorShield from "@/assets/shields/vendor.png";
import affiliateShield from "@/assets/shields/affiliate.png";
import influencerShield from "@/assets/shields/influencer.png";
import creatorShield from "@/assets/shields/creator.png";
import seoShield from "@/assets/shields/seo.png";
import supportShield from "@/assets/shields/support.png";
import userShield from "@/assets/shields/user.png";

import devAward from "@/assets/awards/developer.png";
import resellerAward from "@/assets/awards/reseller.png";
import franchiseAward from "@/assets/awards/franchise.png";
import authorAward from "@/assets/awards/author.png";
import vendorAward from "@/assets/awards/vendor.png";
import affiliateAward from "@/assets/awards/affiliate.png";
import influencerAward from "@/assets/awards/influencer.png";
import creatorAward from "@/assets/awards/creator.png";
import seoAward from "@/assets/awards/seo.png";
import supportAward from "@/assets/awards/support.png";
import userAward from "@/assets/awards/user.png";

import devAchievement from "@/assets/achievements/developer.png";
import resellerAchievement from "@/assets/achievements/reseller.png";
import franchiseAchievement from "@/assets/achievements/franchise.png";
import authorAchievement from "@/assets/achievements/author.png";
import vendorAchievement from "@/assets/achievements/vendor.png";
import affiliateAchievement from "@/assets/achievements/affiliate.png";
import influencerAchievement from "@/assets/achievements/influencer.png";
import creatorAchievement from "@/assets/achievements/creator.png";
import seoAchievement from "@/assets/achievements/seo.png";
import supportAchievement from "@/assets/achievements/support.png";
import userAchievement from "@/assets/achievements/user.png";

// Reputation Medals
import devRep from "@/assets/reputation-medals/developer.png";
import resellerRep from "@/assets/reputation-medals/reseller.png";
import franchiseRep from "@/assets/reputation-medals/franchise.png";
import authorRep from "@/assets/reputation-medals/author.png";
import vendorRep from "@/assets/reputation-medals/vendor.png";
import affiliateRep from "@/assets/reputation-medals/affiliate.png";
import influencerRep from "@/assets/reputation-medals/influencer.png";
import creatorRep from "@/assets/reputation-medals/creator.png";
import seoRep from "@/assets/reputation-medals/seo.png";
import supportRep from "@/assets/reputation-medals/support.png";
import userRep from "@/assets/reputation-medals/user.png";

// Trust Seals
import devTrust from "@/assets/trust-seals/developer.png";
import resellerTrust from "@/assets/trust-seals/reseller.png";
import franchiseTrust from "@/assets/trust-seals/franchise.png";
import authorTrust from "@/assets/trust-seals/author.png";
import vendorTrust from "@/assets/trust-seals/vendor.png";
import affiliateTrust from "@/assets/trust-seals/affiliate.png";
import influencerTrust from "@/assets/trust-seals/influencer.png";
import creatorTrust from "@/assets/trust-seals/creator.png";
import seoTrust from "@/assets/trust-seals/seo.png";
import supportTrust from "@/assets/trust-seals/support.png";
import userTrust from "@/assets/trust-seals/user.png";

// Recognition Coins
import devCoin from "@/assets/recognition-coins/developer.png";
import resellerCoin from "@/assets/recognition-coins/reseller.png";
import franchiseCoin from "@/assets/recognition-coins/franchise.png";
import authorCoin from "@/assets/recognition-coins/author.png";
import vendorCoin from "@/assets/recognition-coins/vendor.png";
import affiliateCoin from "@/assets/recognition-coins/affiliate.png";
import influencerCoin from "@/assets/recognition-coins/influencer.png";
import creatorCoin from "@/assets/recognition-coins/creator.png";
import seoCoin from "@/assets/recognition-coins/seo.png";
import supportCoin from "@/assets/recognition-coins/support.png";
import userCoin from "@/assets/recognition-coins/user.png";

// XP Crystals
import devXpc from "@/assets/xp-crystals/developer.png";
import resellerXpc from "@/assets/xp-crystals/reseller.png";
import franchiseXpc from "@/assets/xp-crystals/franchise.png";
import authorXpc from "@/assets/xp-crystals/author.png";
import vendorXpc from "@/assets/xp-crystals/vendor.png";
import affiliateXpc from "@/assets/xp-crystals/affiliate.png";
import influencerXpc from "@/assets/xp-crystals/influencer.png";
import creatorXpc from "@/assets/xp-crystals/creator.png";
import seoXpc from "@/assets/xp-crystals/seo.png";
import supportXpc from "@/assets/xp-crystals/support.png";
import userXpc from "@/assets/xp-crystals/user.png";

// Reward Chests
import devChest from "@/assets/reward-chests/developer.png";
import resellerChest from "@/assets/reward-chests/reseller.png";
import franchiseChest from "@/assets/reward-chests/franchise.png";
import authorChest from "@/assets/reward-chests/author.png";
import vendorChest from "@/assets/reward-chests/vendor.png";
import affiliateChest from "@/assets/reward-chests/affiliate.png";
import influencerChest from "@/assets/reward-chests/influencer.png";
import creatorChest from "@/assets/reward-chests/creator.png";
import seoChest from "@/assets/reward-chests/seo.png";
import supportChest from "@/assets/reward-chests/support.png";
import userChest from "@/assets/reward-chests/user.png";

// Honor Coins
import devHonor from "@/assets/honor-coins/developer.png";
import resellerHonor from "@/assets/honor-coins/reseller.png";
import franchiseHonor from "@/assets/honor-coins/franchise.png";
import authorHonor from "@/assets/honor-coins/author.png";
import vendorHonor from "@/assets/honor-coins/vendor.png";
import affiliateHonor from "@/assets/honor-coins/affiliate.png";
import influencerHonor from "@/assets/honor-coins/influencer.png";
import creatorHonor from "@/assets/honor-coins/creator.png";
import seoHonor from "@/assets/honor-coins/seo.png";
import supportHonor from "@/assets/honor-coins/support.png";
import userHonor from "@/assets/honor-coins/user.png";

// Legacy Medals
import devLegacy from "@/assets/legacy-medals/developer.png";
import resellerLegacy from "@/assets/legacy-medals/reseller.png";
import franchiseLegacy from "@/assets/legacy-medals/franchise.png";
import authorLegacy from "@/assets/legacy-medals/author.png";
import vendorLegacy from "@/assets/legacy-medals/vendor.png";
import affiliateLegacy from "@/assets/legacy-medals/affiliate.png";
import influencerLegacy from "@/assets/legacy-medals/influencer.png";
import creatorLegacy from "@/assets/legacy-medals/creator.png";
import seoLegacy from "@/assets/legacy-medals/seo.png";
import supportLegacy from "@/assets/legacy-medals/support.png";
import userLegacy from "@/assets/legacy-medals/user.png";

// Identity Cards
import devIdentity from "@/assets/identity-cards/developer.png";
import resellerIdentity from "@/assets/identity-cards/reseller.png";
import franchiseIdentity from "@/assets/identity-cards/franchise.png";
import authorIdentity from "@/assets/identity-cards/author.png";
import vendorIdentity from "@/assets/identity-cards/vendor.png";
import affiliateIdentity from "@/assets/identity-cards/affiliate.png";
import influencerIdentity from "@/assets/identity-cards/influencer.png";
import creatorIdentity from "@/assets/identity-cards/creator.png";
import seoIdentity from "@/assets/identity-cards/seo.png";
import supportIdentity from "@/assets/identity-cards/support.png";
import userIdentity from "@/assets/identity-cards/user.png";

// License Cards
import devLicense from "@/assets/license-cards/developer.png";
import resellerLicense from "@/assets/license-cards/reseller.png";
import franchiseLicense from "@/assets/license-cards/franchise.png";
import authorLicense from "@/assets/license-cards/author.png";
import vendorLicense from "@/assets/license-cards/vendor.png";
import affiliateLicense from "@/assets/license-cards/affiliate.png";
import influencerLicense from "@/assets/license-cards/influencer.png";
import creatorLicense from "@/assets/license-cards/creator.png";
import seoLicense from "@/assets/license-cards/seo.png";
import supportLicense from "@/assets/license-cards/support.png";
import userLicense from "@/assets/license-cards/user.png";

// Founder Seals
import devFounder from "@/assets/founder-seals/developer.png";
import resellerFounder from "@/assets/founder-seals/reseller.png";
import franchiseFounder from "@/assets/founder-seals/franchise.png";
import authorFounder from "@/assets/founder-seals/author.png";
import vendorFounder from "@/assets/founder-seals/vendor.png";
import affiliateFounder from "@/assets/founder-seals/affiliate.png";
import influencerFounder from "@/assets/founder-seals/influencer.png";
import creatorFounder from "@/assets/founder-seals/creator.png";
import seoFounder from "@/assets/founder-seals/seo.png";
import supportFounder from "@/assets/founder-seals/support.png";
import userFounder from "@/assets/founder-seals/user.png";

// Hall of Fame Emblems
import devHof from "@/assets/hall-of-fame/developer.png";
import resellerHof from "@/assets/hall-of-fame/reseller.png";
import franchiseHof from "@/assets/hall-of-fame/franchise.png";
import authorHof from "@/assets/hall-of-fame/author.png";
import vendorHof from "@/assets/hall-of-fame/vendor.png";
import affiliateHof from "@/assets/hall-of-fame/affiliate.png";
import influencerHof from "@/assets/hall-of-fame/influencer.png";
import creatorHof from "@/assets/hall-of-fame/creator.png";
import seoHof from "@/assets/hall-of-fame/seo.png";
import supportHof from "@/assets/hall-of-fame/support.png";
import userHof from "@/assets/hall-of-fame/user.png";

export const ROLE_BADGE: Record<RoleSlug, string> = {
  developer: devBadge, reseller: resellerBadge, franchise: franchiseBadge, author: authorBadge,
  vendor: vendorBadge, affiliate: affiliateBadge, influencer: influencerBadge, creator: creatorBadge,
  seo: seoBadge, support: supportBadge, user: userBadge,
};

export const ROLE_PASSPORT: Record<RoleSlug, string> = {
  developer: devPass, reseller: resellerPass, franchise: franchisePass, author: authorPass,
  vendor: vendorPass, affiliate: affiliatePass, influencer: influencerPass, creator: creatorPass,
  seo: seoPass, support: supportPass, user: userPass,
};

export const ROLE_CERTIFICATE: Record<RoleSlug, string> = {
  developer: devCert, reseller: resellerCert, franchise: franchiseCert, author: authorCert,
  vendor: vendorCert, affiliate: affiliateCert, influencer: influencerCert, creator: creatorCert,
  seo: seoCert, support: supportCert, user: userCert,
};

export const ROLE_MEMBERSHIP: Record<RoleSlug, string> = {
  developer: devMember, reseller: resellerMember, franchise: franchiseMember, author: authorMember,
  vendor: vendorMember, affiliate: affiliateMember, influencer: influencerMember, creator: creatorMember,
  seo: seoMember, support: supportMember, user: userMember,
};

export const ROLE_RANK: Record<RoleSlug, string> = {
  developer: devRank, reseller: resellerRank, franchise: franchiseRank, author: authorRank,
  vendor: vendorRank, affiliate: affiliateRank, influencer: influencerRank, creator: creatorRank,
  seo: seoRank, support: supportRank, user: userRank,
};

export const ROLE_SHIELD: Record<RoleSlug, string> = {
  developer: devShield, reseller: resellerShield, franchise: franchiseShield, author: authorShield,
  vendor: vendorShield, affiliate: affiliateShield, influencer: influencerShield, creator: creatorShield,
  seo: seoShield, support: supportShield, user: userShield,
};

export const ROLE_AWARD: Record<RoleSlug, string> = {
  developer: devAward, reseller: resellerAward, franchise: franchiseAward, author: authorAward,
  vendor: vendorAward, affiliate: affiliateAward, influencer: influencerAward, creator: creatorAward,
  seo: seoAward, support: supportAward, user: userAward,
};

export const ROLE_ACHIEVEMENT: Record<RoleSlug, string> = {
  developer: devAchievement, reseller: resellerAchievement, franchise: franchiseAchievement, author: authorAchievement,
  vendor: vendorAchievement, affiliate: affiliateAchievement, influencer: influencerAchievement, creator: creatorAchievement,
  seo: seoAchievement, support: supportAchievement, user: userAchievement,
};

export const ROLE_REPUTATION: Record<RoleSlug, string> = {
  developer: devRep, reseller: resellerRep, franchise: franchiseRep, author: authorRep,
  vendor: vendorRep, affiliate: affiliateRep, influencer: influencerRep, creator: creatorRep,
  seo: seoRep, support: supportRep, user: userRep,
};

export const ROLE_TRUST_SEAL: Record<RoleSlug, string> = {
  developer: devTrust, reseller: resellerTrust, franchise: franchiseTrust, author: authorTrust,
  vendor: vendorTrust, affiliate: affiliateTrust, influencer: influencerTrust, creator: creatorTrust,
  seo: seoTrust, support: supportTrust, user: userTrust,
};

export const ROLE_RECOGNITION_COIN: Record<RoleSlug, string> = {
  developer: devCoin, reseller: resellerCoin, franchise: franchiseCoin, author: authorCoin,
  vendor: vendorCoin, affiliate: affiliateCoin, influencer: influencerCoin, creator: creatorCoin,
  seo: seoCoin, support: supportCoin, user: userCoin,
};

export const ROLE_XP_CRYSTAL: Record<RoleSlug, string> = {
  developer: devXpc, reseller: resellerXpc, franchise: franchiseXpc, author: authorXpc,
  vendor: vendorXpc, affiliate: affiliateXpc, influencer: influencerXpc, creator: creatorXpc,
  seo: seoXpc, support: supportXpc, user: userXpc,
};

export const ROLE_REWARD_CHEST: Record<RoleSlug, string> = {
  developer: devChest, reseller: resellerChest, franchise: franchiseChest, author: authorChest,
  vendor: vendorChest, affiliate: affiliateChest, influencer: influencerChest, creator: creatorChest,
  seo: seoChest, support: supportChest, user: userChest,
};

export const ROLE_HONOR_COIN: Record<RoleSlug, string> = {
  developer: devHonor, reseller: resellerHonor, franchise: franchiseHonor, author: authorHonor,
  vendor: vendorHonor, affiliate: affiliateHonor, influencer: influencerHonor, creator: creatorHonor,
  seo: seoHonor, support: supportHonor, user: userHonor,
};

export const ROLE_LEGACY_MEDAL: Record<RoleSlug, string> = {
  developer: devLegacy, reseller: resellerLegacy, franchise: franchiseLegacy, author: authorLegacy,
  vendor: vendorLegacy, affiliate: affiliateLegacy, influencer: influencerLegacy, creator: creatorLegacy,
  seo: seoLegacy, support: supportLegacy, user: userLegacy,
};

export const ROLE_IDENTITY_CARD: Record<RoleSlug, string> = {
  developer: devIdentity, reseller: resellerIdentity, franchise: franchiseIdentity, author: authorIdentity,
  vendor: vendorIdentity, affiliate: affiliateIdentity, influencer: influencerIdentity, creator: creatorIdentity,
  seo: seoIdentity, support: supportIdentity, user: userIdentity,
};

export const ROLE_LICENSE_CARD: Record<RoleSlug, string> = {
  developer: devLicense, reseller: resellerLicense, franchise: franchiseLicense, author: authorLicense,
  vendor: vendorLicense, affiliate: affiliateLicense, influencer: influencerLicense, creator: creatorLicense,
  seo: seoLicense, support: supportLicense, user: userLicense,
};

export const ROLE_FOUNDER_SEAL: Record<RoleSlug, string> = {
  developer: devFounder, reseller: resellerFounder, franchise: franchiseFounder, author: authorFounder,
  vendor: vendorFounder, affiliate: affiliateFounder, influencer: influencerFounder, creator: creatorFounder,
  seo: seoFounder, support: supportFounder, user: userFounder,
};

export const ROLE_HALL_OF_FAME: Record<RoleSlug, string> = {
  developer: devHof, reseller: resellerHof, franchise: franchiseHof, author: authorHof,
  vendor: vendorHof, affiliate: affiliateHof, influencer: influencerHof, creator: creatorHof,
  seo: seoHof, support: supportHof, user: userHof,
};

import devTrophy from "@/assets/trophies/developer.png";
import resellerTrophy from "@/assets/trophies/reseller.png";
import franchiseTrophy from "@/assets/trophies/franchise.png";
import authorTrophy from "@/assets/trophies/author.png";
import vendorTrophy from "@/assets/trophies/vendor.png";
import affiliateTrophy from "@/assets/trophies/affiliate.png";
import influencerTrophy from "@/assets/trophies/influencer.png";
import creatorTrophy from "@/assets/trophies/creator.png";
import seoTrophy from "@/assets/trophies/seo.png";
import supportTrophy from "@/assets/trophies/support.png";
import userTrophy from "@/assets/trophies/user.png";

export const ROLE_TROPHY: Record<RoleSlug, string> = {
  developer: devTrophy, reseller: resellerTrophy, franchise: franchiseTrophy, author: authorTrophy,
  vendor: vendorTrophy, affiliate: affiliateTrophy, influencer: influencerTrophy, creator: creatorTrophy,
  seo: seoTrophy, support: supportTrophy, user: userTrophy,
};
