export interface CategoryValues {
  max_vote: number;
}

export const MAX_USABLE_POWER = 100000; // 10 votes at 100%

export const CATEGORY_VALUES: { [key: string]: CategoryValues } = {
  "ideas": {
    "max_vote": 5,
  },
  "development": {
    "max_vote": 30,
  },
  "bug-hunting": {
    "max_vote": 8,
  },
  "translations": {
    "max_vote": 20,
  },
  "graphics": {
    "max_vote": 25,
  },
  "analysis": {
    "max_vote": 25,
  },
  "social": {
    "max_vote": 15,
  },
  "documentation": {
    "max_vote": 15,
  },
  "tutorials": {
    "max_vote": 15,
  },
  "video-tutorials": {
    "max_vote": 20,
  },
  "copywriting": {
    "max_vote": 15,
  },
  "blog": {
    "max_vote": 15,
  },
  "tasks-requests": {
    "max_vote": 4,
  },
};