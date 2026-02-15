import type {
  DiagramDetector,
  DiagramLoader,
  ExternalDiagramDefinition,
} from '../../diagram-api/types.js';

const id = 'milestone';

const detector: DiagramDetector = (txt) => {
  return /^\s*milestone/.test(txt);
};

const loader: DiagramLoader = async () => {
  const { diagram } = await import('./diagram.js');
  return { id, diagram };
};

export const milestone: ExternalDiagramDefinition = {
  id,
  detector,
  loader,
};
