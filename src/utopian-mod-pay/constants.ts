export interface CategoryValue {
  reviewed: number;
  flagged: number;
}

// Point value is in relation to 1 SBD
export const POST_MODERATION_THRESHOLD = 1;
export const POINT_VALUE = 1;
export const SUPERVISOR_MAX_POINTS = 250;
export const MODERATOR_MAX_POINTS = 250;
export const SUPERVISOR_MIN_POINTS = 100;

// Earnings multiplier
export const CATEGORY_VALUE: { [key: string]: CategoryValue } = {
  ideas: {
    reviewed: 2,
    flagged: 2
  },
  development: {
    reviewed: 4.25,
    flagged: 4.25
  },
  translations: {
    reviewed: 4,
    flagged: 4
  },
  graphics: {
    reviewed: 3,
    flagged: 3
  },
  documentation: {
    reviewed: 2.25,
    flagged: 2.25
  },
  copywriting: {
    reviewed: 2,
    flagged: 2
  },
  tutorials: {
    reviewed: 4,
    flagged: 4
  },
  analysis: {
    reviewed: 3.25,
    flagged: 3.25
  },
  social: {
    reviewed: 2,
    flagged: 2
  },
  blog: {
    reviewed: 2.25,
    flagged: 2.25
  },
  'video-tutorials': {
    reviewed: 4,
    flagged: 4
  },
  'bug-hunting': {
    reviewed: 3.25,
    flagged: 3.25
  },
  'task-ideas': {
    reviewed: 1.25,
    flagged: 1.25,
  },
  'task-development': {
    reviewed: 1.25,
    flagged: 1.25,
  },
  'task-bug-hunting': {
    reviewed: 1.25,
    flagged: 1.25,
  },
  'task-translations': {
    reviewed: 1.25,
    flagged: 1.25,
  },
  'task-graphics': {
    reviewed: 1.25,
    flagged: 1.25,
  },
  'task-documentation': {
    reviewed: 1.25,
    flagged: 1.25,
  },
  'task-analysis': {
    reviewed: 1.25,
    flagged: 1.25,
  },
  'task-social': {
    reviewed: 1.25,
    flagged: 1.25,
  }
};
