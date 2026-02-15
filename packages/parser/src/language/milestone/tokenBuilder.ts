import { AbstractMermaidTokenBuilder } from '../common/index.js';

export class MilestoneTokenBuilder extends AbstractMermaidTokenBuilder {
  public constructor() {
    super(['milestone', 'showData']);
  }
}
