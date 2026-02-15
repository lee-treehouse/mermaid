import type d3 from 'd3';
import { arc, pie as d3pie, scaleOrdinal } from 'd3';
import type { MermaidConfig, MilestoneDiagramConfig } from '../../config.type.js';
import { getConfig } from '../../diagram-api/diagramAPI.js';
import type { DrawDefinition, SVG, SVGGroup } from '../../diagram-api/types.js';
import { log } from '../../logger.js';
import { selectSvgElement } from '../../rendering-util/selectSvgElement.js';
import { configureSvgSize } from '../../setupGraphViewbox.js';
import { cleanAndMerge, parseFontSize } from '../../utils.js';
import type { D3Section, MilestoneDB, Sections } from './types.js';

const createMilestoneArcs = (sections: Sections): d3.PieArcDatum<D3Section>[] => {
  const sum = [...sections.values()].reduce((acc, val) => acc + val, 0);

  const milestoneData: D3Section[] = [...sections.entries()]
    .map(([label, value]) => ({ label, value }))
    .filter((d) => (d.value / sum) * 100 >= 1) // Remove values < 1%
    .sort((a, b) => b.value - a.value);

  const milestone: d3.Pie<unknown, D3Section> = d3pie<D3Section>().value((d) => d.value);
  return milestone(milestoneData);
};

/**
 * Draws a Milestone Chart with the data given in text.
 *
 * @param text - milestone chart code
 * @param id - diagram id
 * @param _version - MermaidJS version from package.json.
 * @param diagObj - A standard diagram containing the DB and the text and type etc of the diagram.
 */
export const draw: DrawDefinition = (text, id, _version, diagObj) => {
  log.debug('rendering milestone chart\n' + text);
  const db = diagObj.db as MilestoneDB;
  const globalConfig: MermaidConfig = getConfig();
  const milestoneConfig: Required<MilestoneDiagramConfig> = cleanAndMerge(
    db.getConfig(),
    globalConfig.milestone
  );
  const MARGIN = 40;
  const LEGEND_RECT_SIZE = 18;
  const LEGEND_SPACING = 4;
  const height = 450;
  const milestoneWidth: number = height;
  const svg: SVG = selectSvgElement(id);
  const group: SVGGroup = svg.append('g');
  group.attr('transform', 'translate(' + milestoneWidth / 2 + ',' + height / 2 + ')');

  const { themeVariables } = globalConfig;
  let [outerStrokeWidth] = parseFontSize(themeVariables.milestoneOuterStrokeWidth);
  outerStrokeWidth ??= 2;

  const textPosition: number = milestoneConfig.textPosition;
  const radius: number = Math.min(milestoneWidth, height) / 2 - MARGIN;
  // Shape helper to build arcs:
  const arcGenerator: d3.Arc<unknown, d3.PieArcDatum<D3Section>> = arc<d3.PieArcDatum<D3Section>>()
    .innerRadius(0)
    .outerRadius(radius);
  const labelArcGenerator: d3.Arc<unknown, d3.PieArcDatum<D3Section>> = arc<
    d3.PieArcDatum<D3Section>
  >()
    .innerRadius(radius * textPosition)
    .outerRadius(radius * textPosition);

  group
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', radius + outerStrokeWidth / 2)
    .attr('class', 'milestoneOuterCircle');

  const sections: Sections = db.getSections();
  const arcs: d3.PieArcDatum<D3Section>[] = createMilestoneArcs(sections);

  const myGeneratedColors = [
    themeVariables.milestone1,
    themeVariables.milestone2,
    themeVariables.milestone3,
    themeVariables.milestone4,
    themeVariables.milestone5,
    themeVariables.milestone6,
    themeVariables.milestone7,
    themeVariables.milestone8,
    themeVariables.milestone9,
    themeVariables.milestone10,
    themeVariables.milestone11,
    themeVariables.milestone12,
  ];
  let sum = 0;
  sections.forEach((section) => {
    sum += section;
  });

  // Filter out arcs that would render as 0%
  const filteredArcs = arcs.filter((datum) => ((datum.data.value / sum) * 100).toFixed(0) !== '0');

  // Set the color scale
  const color: d3.ScaleOrdinal<string, 12, never> = scaleOrdinal(myGeneratedColors);

  // Build the milestone chart: each part of the milestone is a path that we build using the arc function.
  group
    .selectAll('mySlices')
    .data(filteredArcs)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', (datum: d3.PieArcDatum<D3Section>) => {
      return color(datum.data.label);
    })
    .attr('class', 'milestoneCircle');

  // Now add the percentage.
  // Use the centroid method to get the best coordinates.
  group
    .selectAll('mySlices')
    .data(filteredArcs)
    .enter()
    .append('text')
    .text((datum: d3.PieArcDatum<D3Section>): string => {
      return ((datum.data.value / sum) * 100).toFixed(0) + '%';
    })
    .attr('transform', (datum: d3.PieArcDatum<D3Section>): string => {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      return 'translate(' + labelArcGenerator.centroid(datum) + ')';
    })
    .style('text-anchor', 'middle')
    .attr('class', 'slice');

  group
    .append('text')
    .text(db.getDiagramTitle())
    .attr('x', 0)
    .attr('y', -(height - 50) / 2)
    .attr('class', 'milestoneTitleText');

  // Add the legends/annotations for each section
  const allSectionData: D3Section[] = [...sections.entries()].map(([label, value]) => ({
    label,
    value,
  }));

  const legend = group
    .selectAll('.legend')
    .data(allSectionData)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', (_datum, index: number): string => {
      const height = LEGEND_RECT_SIZE + LEGEND_SPACING;
      const offset = (height * allSectionData.length) / 2;
      const horizontal = 12 * LEGEND_RECT_SIZE;
      const vertical = index * height - offset;
      return 'translate(' + horizontal + ',' + vertical + ')';
    });

  legend
    .append('rect')
    .attr('width', LEGEND_RECT_SIZE)
    .attr('height', LEGEND_RECT_SIZE)
    .style('fill', (d) => color(d.label))
    .style('stroke', (d) => color(d.label));

  legend
    .append('text')
    .attr('x', LEGEND_RECT_SIZE + LEGEND_SPACING)
    .attr('y', LEGEND_RECT_SIZE - LEGEND_SPACING)
    .text((d) => {
      if (db.getShowData()) {
        return `${d.label} [${d.value}]`;
      }
      return d.label;
    });

  const longestTextWidth = Math.max(
    ...legend
      .selectAll('text')
      .nodes()
      .map((node) => (node as Element)?.getBoundingClientRect().width ?? 0)
  );

  const totalWidth = milestoneWidth + MARGIN + LEGEND_RECT_SIZE + LEGEND_SPACING + longestTextWidth;

  // Set viewBox
  svg.attr('viewBox', `0 0 ${totalWidth} ${height}`);
  configureSvgSize(svg, height, totalWidth, milestoneConfig.useMaxWidth);
};

export const renderer = { draw };
