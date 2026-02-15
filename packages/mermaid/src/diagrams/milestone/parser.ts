import type { Milestone } from '@mermaid-js/parser';
import { parse } from '@mermaid-js/parser';
import { log } from '../../logger.js';
import type { ParserDefinition } from '../../diagram-api/types.js';
import { populateCommonDb } from '../common/populateCommonDb.js';
import type { MilestoneDB } from './types.js';
import { db } from './db.js';

const populateDb = (ast: Milestone, db: MilestoneDB) => {
  populateCommonDb(ast, db);
  db.setShowData(ast.showData);
  ast.sections.map(db.addSection);
};

export const parser: ParserDefinition = {
  parse: async (input: string): Promise<void> => {
    const ast: Milestone = await parse('milestone', input);
    log.debug(ast);
    populateDb(ast, db);
  },
};
