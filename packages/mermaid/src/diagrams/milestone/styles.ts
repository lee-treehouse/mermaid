import type { DiagramStylesProvider } from '../../diagram-api/types.js';
import type { MilestoneStyleOptions } from './types.js';

const getStyles: DiagramStylesProvider = (options: MilestoneStyleOptions) =>
  `
  .milestoneCircle{
    stroke: ${options.milestoneStrokeColor};
    stroke-width : ${options.milestoneStrokeWidth};
    opacity : ${options.milestoneOpacity};
  }
  .milestoneOuterCircle{
    stroke: ${options.milestoneOuterStrokeColor};
    stroke-width: ${options.milestoneOuterStrokeWidth};
    fill: none;
  }
  .milestoneTitleText {
    text-anchor: middle;
    font-size: ${options.milestoneTitleTextSize};
    fill: ${options.milestoneTitleTextColor};
    font-family: ${options.fontFamily};
  }
  .slice {
    font-family: ${options.fontFamily};
    fill: ${options.milestoneSectionTextColor};
    font-size:${options.milestoneSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${options.milestoneLegendTextColor};
    font-family: ${options.fontFamily};
    font-size: ${options.milestoneLegendTextSize};
  }
`;

export default getStyles;
