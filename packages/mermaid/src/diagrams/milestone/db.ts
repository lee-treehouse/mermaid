import { log } from '../../logger.js';
import {
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription,
  clear as commonClear,
} from '../common/commonDb.js';
import type { MilestoneFields, MilestoneDB, Sections, D3Section } from './types.js';
import type { RequiredDeep } from 'type-fest';
import type { MilestoneDiagramConfig } from '../../config.type.js';
import DEFAULT_CONFIG from '../../defaultConfig.js';

export const DEFAULT_MILESTONE_CONFIG: Required<MilestoneDiagramConfig> = DEFAULT_CONFIG.milestone;

export const DEFAULT_MILESTONE_DB: RequiredDeep<MilestoneFields> = {
  sections: new Map(),
  showData: false,
  config: DEFAULT_MILESTONE_CONFIG,
} as const;

let sections: Sections = DEFAULT_MILESTONE_DB.sections;
let showData: boolean = DEFAULT_MILESTONE_DB.showData;
const config: Required<MilestoneDiagramConfig> = structuredClone(DEFAULT_MILESTONE_CONFIG);

const getConfig = (): Required<MilestoneDiagramConfig> => structuredClone(config);

const clear = (): void => {
  sections = new Map();
  showData = DEFAULT_MILESTONE_DB.showData;
  commonClear();
};

const addSection = ({ label, value }: D3Section): void => {
  if (value < 0) {
    throw new Error(
      `"${label}" has invalid value: ${value}. Negative values are not allowed in milestone charts. All slice values must be >= 0.`
    );
  }
  if (!sections.has(label)) {
    sections.set(label, value);
    log.debug(`added new section: ${label}, with value: ${value}`);
  }
};

const getSections = (): Sections => sections;

const setShowData = (toggle: boolean): void => {
  showData = toggle;
};

const getShowData = (): boolean => showData;

export const db: MilestoneDB = {
  getConfig,

  clear,
  setDiagramTitle,
  getDiagramTitle,
  setAccTitle,
  getAccTitle,
  setAccDescription,
  getAccDescription,

  addSection,
  getSections,
  setShowData,
  getShowData,
};
