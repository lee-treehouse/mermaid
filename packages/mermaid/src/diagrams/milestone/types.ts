import type { MilestoneDiagramConfig } from '../../config.type.js';
import type { DiagramDB } from '../../diagram-api/types.js';

export interface MilestoneFields {
  sections: Sections;
  showData: boolean;
  config: MilestoneDiagramConfig;
}

export interface MilestoneStyleOptions {
  fontFamily: string;
  milestone1: string;
  milestone2: string;
  milestone3: string;
  milestone4: string;
  milestone5: string;
  milestone6: string;
  milestone7: string;
  milestone8: string;
  milestone9: string;
  milestone10: string;
  milestone11: string;
  milestone12: string;
  milestoneTitleTextSize: string;
  milestoneTitleTextColor: string;
  milestoneSectionTextSize: string;
  milestoneSectionTextColor: string;
  milestoneLegendTextSize: string;
  milestoneLegendTextColor: string;
  milestoneStrokeColor: string;
  milestoneStrokeWidth: string;
  milestoneOuterStrokeWidth: string;
  milestoneOuterStrokeColor: string;
  milestoneOpacity: string;
}

export type Sections = Map<string, number>;

export interface D3Section {
  label: string;
  value: number;
}

export interface MilestoneDB extends DiagramDB {
  // config
  getConfig: () => Required<MilestoneDiagramConfig>;

  // common db
  clear: () => void;
  setDiagramTitle: (title: string) => void;
  getDiagramTitle: () => string;
  setAccTitle: (title: string) => void;
  getAccTitle: () => string;
  setAccDescription: (description: string) => void;
  getAccDescription: () => string;

  // diagram db
  addSection: ({ label, value }: D3Section) => void;
  getSections: () => Sections;
  setShowData: (toggle: boolean) => void;
  getShowData: () => boolean;
}
