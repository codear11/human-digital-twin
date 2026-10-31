import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('Human Digital Twin API Integration Tests', () => {
  const testUser = {
    email: `twin_tester_${Date.now()}@example.com`,
    password: 'Password123!',
    name: 'Ada Lovelace',
  };
  let authToken = '';

  it('GET /api/health-check should return healthy status', async () => {
    const res = await request(app).get('/api/health-check');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('POST /api/auth/register should create a user and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    authToken = res.body.data.token;
  });

  it('POST /api/auth/login should authenticate user and issue token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('PUT /api/profile should update user biometrics and calculate BMI', async () => {
    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        age: 28,
        gender: 'Female',
        height: 170, // cm
        weight: 65,  // kg
        bloodGroup: 'O+',
        occupation: 'Research Scientist',
        education: 'M.Sc Computer Science',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.occupation).toBe('Research Scientist');
  });

  it('POST /api/health should record biometric vitals and return dimension score', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        heartRate: 72,
        restingHeartRate: 64,
        bloodPressureSys: 120,
        bloodPressureDia: 80,
        oxygenLevel: 98.5,
        bloodSugar: 88,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.scoreResult.score).toBeGreaterThan(80);
  });

  it('POST /api/fitness should record steps and fitness score', async () => {
    const res = await request(app)
      .post('/api/fitness')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        steps: 8500,
        walkingDistance: 6.2,
        activeCalories: 450,
        waterIntake: 2.2,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.scoreResult.score).toBeGreaterThan(70);
  });

  it('GET /api/dashboard/overview should return unified 11 dimension scores', async () => {
    const res = await request(app)
      .get('/api/dashboard/overview')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.dimensionScores).toBeDefined();
    expect(res.body.data.quickStats).toBeDefined();
  });

  it('POST /api/ai/generate should produce holistic twin report with disclaimer', async () => {
    const res = await request(app)
      .post('/api/ai/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        reportType: 'HOLISTIC_TWIN',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary).toBeDefined();
    expect(res.body.data.observations.length).toBeGreaterThan(0);
    expect(res.body.data.disclaimer).toContain('DISCLAIMER');
  });
});
