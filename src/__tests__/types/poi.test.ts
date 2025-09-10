import { describe, it, expect } from 'vitest';
import { POI, POIType, POI_METADATA, LIFEBOAT_5, BearingRecord } from '../../types/poi';

describe('POI Types', () => {
  it('should have all required POI fields', () => {
    const testPOI: POI = {
      id: 'test-1',
      name: 'Test Wreck',
      type: 'wreck',
      x: 100,
      y: 200,
      notes: 'Test notes',
      depth: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
      definitionMode: 'coordinates' as const
    };

    expect(testPOI.id).toBe('test-1');
    expect(testPOI.name).toBe('Test Wreck');
    expect(testPOI.type).toBe('wreck');
    expect(testPOI.x).toBe(100);
    expect(testPOI.y).toBe(200);
    expect(testPOI.notes).toBe('Test notes');
    expect(testPOI.depth).toBe(50);
    expect(testPOI.createdAt).toBeInstanceOf(Date);
    expect(testPOI.updatedAt).toBeInstanceOf(Date);
  });

  it('should support all POI types', () => {
    const validTypes: POIType[] = [
      'wreck', 'structure', 'biome', 'resource', 
      'cave', 'landmark', 'hazard', 'base', 'buoy'
    ];

    validTypes.forEach(type => {
      expect(POI_METADATA[type]).toBeDefined();
      expect(POI_METADATA[type].emoji).toBeTruthy();
      expect(POI_METADATA[type].color).toBeTruthy();
      expect(POI_METADATA[type].label).toBeTruthy();
    });
  });

  it('should have valid Lifeboat 5 default POI', () => {
    expect(LIFEBOAT_5.id).toBe('lifeboat-5');
    expect(LIFEBOAT_5.name).toBe('Lifeboat 5');
    expect(LIFEBOAT_5.type).toBe('lifeboat');
    expect(LIFEBOAT_5.x).toBe(0);
    expect(LIFEBOAT_5.y).toBe(0);
    expect(LIFEBOAT_5.depth).toBe(0);
  });

  it('should have valid bearing structure', () => {
    const testBearing: BearingRecord = {
      id: 'bearing-1',
      referencePOIId: 'poi-1',
      bearing: 90,
      distance: 100,
      direction: 'to',
      createdAt: new Date(),
    };

    expect(testBearing.bearing).toBeGreaterThanOrEqual(0);
    expect(testBearing.bearing).toBeLessThan(360);
    expect(testBearing.distance).toBeGreaterThan(0);
  });
});
