import { describe, expect, it } from 'vitest';

import { Milestone } from '../src/language/index.js';
import { expectNoErrorsOrAlternatives, milestoneParse as parse } from './test-util.js';

describe('milestone', () => {
  describe('should handle milestone definition with or without showData', () => {
    it.each([
      `milestone`,
      `  milestone  `,
      `\tmilestone\t`,
      `
    \tmilestone
    `,
    ])('should handle regular milestone', (context: string) => {
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Milestone);
    });

    it.each([
      `milestone showData`,
      `  milestone  showData  `,
      `\tmilestone\tshowData\t`,
      `
    milestone\tshowData
    `,
    ])('should handle regular showData', (context: string) => {
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Milestone);

      const { showData } = result.value;
      expect(showData).toBeTruthy();
    });
  });
  describe('should handle TitleAndAccessibilities', () => {
    describe('should handle TitleAndAccessibilities without showData', () => {
      it.each([
        `milestone title sample title`,
        `  milestone  title sample title  `,
        `\tmilestone\ttitle sample title\t`,
        `milestone
        \ttitle sample title
        `,
      ])('should handle regular milestone + title in same line', (context: string) => {
        const result = parse(context);
        expectNoErrorsOrAlternatives(result);
        expect(result.value.$type).toBe(Milestone);

        const { title } = result.value;
        expect(title).toBe('sample title');
      });

      it.each([
        `milestone
        title sample title`,
        `milestone
        title sample title
        `,
        `milestone
        title sample title`,
        `milestone
        title sample title
        `,
      ])('should handle regular milestone + title in different line', (context: string) => {
        const result = parse(context);
        expectNoErrorsOrAlternatives(result);
        expect(result.value.$type).toBe(Milestone);

        const { title } = result.value;
        expect(title).toBe('sample title');
      });
    });

    describe('should handle TitleAndAccessibilities with showData', () => {
      it.each([
        `milestone showData title sample title`,
        `milestone showData title sample title
        `,
      ])('should handle regular milestone + showData + title', (context: string) => {
        const result = parse(context);
        expectNoErrorsOrAlternatives(result);
        expect(result.value.$type).toBe(Milestone);

        const { showData, title } = result.value;
        expect(showData).toBeTruthy();
        expect(title).toBe('sample title');
      });

      it.each([
        `milestone showData
        title sample title`,
        `milestone showData
        title sample title
        `,
        `milestone showData
        title sample title`,
        `milestone showData
        title sample title
        `,
      ])('should handle regular showData + title in different line', (context: string) => {
        const result = parse(context);
        expectNoErrorsOrAlternatives(result);
        expect(result.value.$type).toBe(Milestone);

        const { showData, title } = result.value;
        expect(showData).toBeTruthy();
        expect(title).toBe('sample title');
      });
    });
  });

  describe('should handle sections', () => {
    it.each([
      `milestone
        "GitHub":100
        "GitLab":50`,
      `milestone
        "GitHub"   :   100
        "GitLab"   :   50`,
      `milestone
        "GitHub"\t:\t100
        "GitLab"\t:\t50`,
      `milestone
        \t"GitHub" \t : \t 100
        \t"GitLab" \t : \t  50
        `,
    ])('should handle regular sections', (context: string) => {
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Milestone);

      const { sections } = result.value;
      expect(sections[0].label).toBe('GitHub');
      expect(sections[0].value).toBe(100);

      expect(sections[1].label).toBe('GitLab');
      expect(sections[1].value).toBe(50);
    });

    it('should handle sections with showData', () => {
      const context = `milestone showData
        "GitHub": 100
        "GitLab": 50`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Milestone);

      const { showData, sections } = result.value;
      expect(showData).toBeTruthy();

      expect(sections[0].label).toBe('GitHub');
      expect(sections[0].value).toBe(100);

      expect(sections[1].label).toBe('GitLab');
      expect(sections[1].value).toBe(50);
    });

    it('should handle sections with title', () => {
      const context = `milestone title sample wow
        "GitHub": 100
        "GitLab": 50`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Milestone);

      const { title, sections } = result.value;
      expect(title).toBe('sample wow');

      expect(sections[0].label).toBe('GitHub');
      expect(sections[0].value).toBe(100);

      expect(sections[1].label).toBe('GitLab');
      expect(sections[1].value).toBe(50);
    });

    it('should handle value with positive decimal', () => {
      const context = `milestone
        "ash": 60.67
        "bat": 40`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Milestone);

      const { sections } = result.value;
      expect(sections[0].label).toBe('ash');
      expect(sections[0].value).toBe(60.67);

      expect(sections[1].label).toBe('bat');
      expect(sections[1].value).toBe(40);
    });

    it('should handle sections with accTitle', () => {
      const context = `milestone accTitle: sample wow
        "GitHub": 100
        "GitLab": 50`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Milestone);

      const { accTitle, sections } = result.value;
      expect(accTitle).toBe('sample wow');

      expect(sections[0].label).toBe('GitHub');
      expect(sections[0].value).toBe(100);

      expect(sections[1].label).toBe('GitLab');
      expect(sections[1].value).toBe(50);
    });

    it('should handle sections with single line accDescr', () => {
      const context = `milestone accDescr: sample wow
        "GitHub": 100
        "GitLab": 50`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Milestone);

      const { accDescr, sections } = result.value;
      expect(accDescr).toBe('sample wow');

      expect(sections[0].label).toBe('GitHub');
      expect(sections[0].value).toBe(100);

      expect(sections[1].label).toBe('GitLab');
      expect(sections[1].value).toBe(50);
    });

    it('should handle sections with multi line accDescr', () => {
      const context = `milestone accDescr {
            sample wow
        }
        "GitHub": 100
        "GitLab": 50`;
      const result = parse(context);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Milestone);

      const { accDescr, sections } = result.value;
      expect(accDescr).toBe('sample wow');

      expect(sections[0].label).toBe('GitHub');
      expect(sections[0].value).toBe(100);

      expect(sections[1].label).toBe('GitLab');
      expect(sections[1].value).toBe(50);
    });
  });
});
