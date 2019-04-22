'use strict';

const OrbitalCrossPosition = require('../src/OrbitalCrossPosition');
const { HorizontalCoordinate } = require('@behaver/celestial-coordinate');
const { JDateRepository } = require('@behaver/jdate');
const expect = require("chai").expect;

describe('#OrbitalCrossPosition', () => {
  describe('#Verify', () => {
    it('1992/08/15 08:25 地平黄道交点测试', () => {
      let OCP = new OrbitalCrossPosition({
        direction: true,
      });

      let ECC = OCP.on(new HorizontalCoordinate({
        a: 270,
        h: 0,
        obGeoLong: -124.23,
        obGeoLat: 40.08,
        obTime: new JDateRepository(new Date(1992, 7, 15, 8, 25), 'date'),
        centerMode: 'geocentric',
      })).cross('ecc', {
        withNutation: true, 
      });

      expect(ECC.l.inRound().getDegrees()).to.closeTo(183.26, 0.1);
      expect(Math.sin(ECC.b.inRound().getRadian())).to.closeTo(0, 0.0001);

      OCP.direction = false;

      let ECC2 = OCP.cross('ecc', {
        withNutation: true, 
      });

      expect(ECC2.l.inRound().getDegrees()).to.closeTo(3.26, 0.1);
    });

    it('1992/08/15 08:25 地平赤道交点测试', () => {
      let OCP = new OrbitalCrossPosition({
        direction: true,
      });

      OCP.SystemSwitcher.options({
        enableAnnualAberration: false,
        enableGravitationalDeflection: false,
        enableFK5: false,
        enableAR: false,
      });

      let EQC = OCP.on(new HorizontalCoordinate({
        a: 270,
        h: 0,
        obGeoLong: -124.23,
        obGeoLat: 40.08,
        obTime: new JDateRepository(new Date(1992, 7, 15, 8, 25), 'date'),
        centerMode: 'geocentric',
      })).cross('eqc', {
        withNutation: true,
      });

      expect(EQC.ra.inRound().getDegrees()).to.closeTo(184.41, 0.3);
      expect(Math.sin(EQC.dec.inRound().getRadian())).to.closeTo(0, 0.0001);
    });
  });
})