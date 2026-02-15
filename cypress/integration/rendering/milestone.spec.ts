import { imgSnapshotTest, renderGraph } from '../../helpers/util.ts';

describe('milestone chart', () => {
  it('should render a simple milestone diagram', () => {
    imgSnapshotTest(
      `milestone title Sports in Sweden
        "Bandy": 40
        "Ice-Hockey": 80
        "Football": 90
      `
    );
  });

  it('should render a simple milestone diagram with long labels', () => {
    imgSnapshotTest(
      `milestone title NETFLIX
        "Time spent looking for movie": 90
        "Time spent watching it": 10
      `
    );
  });

  it('should render a simple milestone diagram with capital letters for labels', () => {
    imgSnapshotTest(
      `milestone title What Voldemort doesn't have?
        "FRIENDS": 2
        "FAMILY": 3
        "NOSE": 45
      `
    );
  });

  it('should render a milestone diagram when useMaxWidth is true (default)', () => {
    renderGraph(
      `milestone title Sports in Sweden
        "Bandy": 40
        "Ice-Hockey": 80
        "Football": 90
      `,
      { milestone: { useMaxWidth: true } }
    );
    cy.get('svg').should((svg) => {
      expect(svg).to.have.attr('width', '100%');
      const style = svg.attr('style');
      expect(style).to.match(/^max-width: [\d.]+px;$/);
      const maxWidthValue = parseFloat(style.match(/[\d.]+/g).join(''));
      expect(maxWidthValue).to.be.within(590, 600); // depends on installed fonts: 596.2 on my PC, 597.5 on CI
    });
  });

  it('should render a milestone diagram when useMaxWidth is false', () => {
    renderGraph(
      `milestone title Sports in Sweden
        "Bandy": 40
        "Ice-Hockey": 80
        "Football": 90
      `,
      { milestone: { useMaxWidth: false } }
    );
    cy.get('svg').should((svg) => {
      const width = parseFloat(svg.attr('width'));
      expect(width).to.be.within(590, 600); // depends on installed fonts: 596.2 on my PC, 597.5 on CI
      expect(svg).to.not.have.attr('style');
    });
  });

  it('should render a milestone diagram when textPosition is set', () => {
    imgSnapshotTest(
      `milestone
        "Dogs": 50
        "Cats": 25
      `,
      { logLevel: 1, milestone: { textPosition: 0.9 } }
    );
  });

  it('should render a milestone diagram with showData', () => {
    imgSnapshotTest(
      `milestone showData
        "Dogs": 50
        "Cats": 25
      `
    );
  });
  it('should render milestone slices only for non-zero values but shows all legends', () => {
    imgSnapshotTest(
      `   milestone title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 1
      `
    );
  });
});
