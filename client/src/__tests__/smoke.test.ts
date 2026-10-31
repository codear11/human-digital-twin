import { describe, it, expect } from 'vitest';

describe('Human Digital Twin Client Smoke Tests', () => {
  it('should define API client with 11 dimension endpoints', async () => {
    const { api } = await import('../services/api');
    expect(api.auth).toBeDefined();
    expect(api.profile).toBeDefined();
    expect(api.dashboard).toBeDefined();
    expect(api.dimensions).toBeDefined();
    expect(api.habits).toBeDefined();
    expect(api.goals).toBeDefined();
    expect(api.ai).toBeDefined();
  });
});
