import { parser } from './parser.js';
import { DEFAULT_MILESTONE_DB, db } from './db.js';
import { setConfig } from '../../diagram-api/diagramAPI.js';

setConfig({
  securityLevel: 'strict',
});

describe('milestone', () => {
  beforeEach(() => db.clear());

  describe('parse', () => {
    it('should handle very simple milestone', async () => {
      await parser.parse(`milestone
      "ash": 100
      `);

      const sections = db.getSections();
      expect(sections.get('ash')).toBe(100);
    });

    it('should handle simple milestone', async () => {
      await parser.parse(`milestone
      "ash" : 60
      "bat" : 40
      `);

      const sections = db.getSections();
      expect(sections.get('ash')).toBe(60);
      expect(sections.get('bat')).toBe(40);
    });

    it('should handle simple milestone with showData', async () => {
      await parser.parse(`milestone showData
      "ash" : 60
      "bat" : 40
      `);

      expect(db.getShowData()).toBeTruthy();

      const sections = db.getSections();
      expect(sections.get('ash')).toBe(60);
      expect(sections.get('bat')).toBe(40);
    });

    it('should handle simple milestone with comments', async () => {
      await parser.parse(`milestone
      %% comments
      "ash" : 60
      "bat" : 40
      `);

      const sections = db.getSections();
      expect(sections.get('ash')).toBe(60);
      expect(sections.get('bat')).toBe(40);
    });

    it('should handle simple milestone with a title', async () => {
      await parser.parse(`milestone title a 60/40 milestone
      "ash" : 60
      "bat" : 40
      `);

      expect(db.getDiagramTitle()).toBe('a 60/40 milestone');

      const sections = db.getSections();
      expect(sections.get('ash')).toBe(60);
      expect(sections.get('bat')).toBe(40);
    });

    it('should handle simple milestone with an acc title (accTitle)', async () => {
      await parser.parse(`milestone title a neat chart
      accTitle: a neat acc title
      "ash" : 60
      "bat" : 40
      `);

      expect(db.getDiagramTitle()).toBe('a neat chart');

      expect(db.getAccTitle()).toBe('a neat acc title');

      const sections = db.getSections();
      expect(sections.get('ash')).toBe(60);
      expect(sections.get('bat')).toBe(40);
    });

    it('should handle simple milestone with an acc description (accDescr)', async () => {
      await parser.parse(`milestone title a neat chart
      accDescr: a neat description
      "ash" : 60
      "bat" : 40
      `);

      expect(db.getDiagramTitle()).toBe('a neat chart');

      expect(db.getAccDescription()).toBe('a neat description');

      const sections = db.getSections();
      expect(sections.get('ash')).toBe(60);
      expect(sections.get('bat')).toBe(40);
    });

    it('should handle simple milestone with a multiline acc description (accDescr)', async () => {
      await parser.parse(`milestone title a neat chart
      accDescr {
        a neat description
        on multiple lines
      }
      "ash" : 60
      "bat" : 40
    `);

      expect(db.getDiagramTitle()).toBe('a neat chart');

      expect(db.getAccDescription()).toBe('a neat description\non multiple lines');

      const sections = db.getSections();
      expect(sections.get('ash')).toBe(60);
      expect(sections.get('bat')).toBe(40);
    });

    it('should handle simple milestone with positive decimal', async () => {
      await parser.parse(`milestone
      "ash" : 60.67
      "bat" : 40
      `);

      const sections = db.getSections();
      expect(sections.get('ash')).toBe(60.67);
      expect(sections.get('bat')).toBe(40);
    });

    it('should handle simple milestone with negative decimal', async () => {
      await expect(async () => {
        await parser.parse(`milestone
        "ash" : -60.67
        "bat" : 40.12
        `);
      }).rejects.toThrowError();
    });

    it('should handle simple milestone with zero slice value', async () => {
      await parser.parse(`milestone title Default text position: Animal adoption
        accTitle: simple milestone char demo
        accDescr: milestone chart with 3 sections: dogs, cats, rats. Most are dogs.
         "dogs" : 0
        "rats" : 40.12
      `);

      const sections = db.getSections();
      expect(sections.get('dogs')).toBe(0);
      expect(sections.get('rats')).toBe(40.12);
    });

    it('should handle simple milestone with negative slice value', async () => {
      await expect(async () => {
        await parser.parse(`milestone title Default text position: Animal adoption
        accTitle: simple milestone char demo
        accDescr: milestone chart with 3 sections: dogs, cats, rats. Most are dogs.
         "dogs" : -60.67
        "rats" : 40.12
    `);
      }).rejects.toThrowError(
        '"dogs" has invalid value: -60.67. Negative values are not allowed in milestone charts. All slice values must be >= 0.'
      );
    });

    it('should handle unsafe properties', async () => {
      await expect(
        parser.parse(`milestone title Unsafe props test
        "__proto__" : 386
        "constructor" : 85
        "prototype" : 15`)
      ).resolves.toBeUndefined();
      expect([...db.getSections().keys()]).toEqual(['__proto__', 'constructor', 'prototype']);
    });
  });

  describe('config', () => {
    it.todo('setConfig', () => {
      // db.setConfig({ useWidth: 850, useMaxWidth: undefined });

      const config = db.getConfig();
      expect(config.useWidth).toBe(850);
      expect(config.useMaxWidth).toBeTruthy();
    });

    it('getConfig', () => {
      expect(db.getConfig()).toStrictEqual(DEFAULT_MILESTONE_DB.config);
    });

    it.todo('resetConfig', () => {
      // db.setConfig({ textPosition: 0 });
      // db.resetConfig();
      expect(db.getConfig().textPosition).toStrictEqual(DEFAULT_MILESTONE_DB.config.textPosition);
    });
  });
});
