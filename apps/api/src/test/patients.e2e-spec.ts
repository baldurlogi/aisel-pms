import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { AppModule } from '../app.module';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
}

describe('Patients E2E', () => {
  let app: INestApplication;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginRes: Response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'adminpass' });

    const body = loginRes.body as LoginResponse;
    jwt = body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new patient', async () => {
    const uniqueEmail = `alice+${Date.now()}@example.com`;
    const res: Response = await request(app.getHttpServer())
      .post('/patients')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        firstName: 'Alice',
        lastName: 'Smith',
        email: uniqueEmail,
        phoneNumber: '+15550001111',
        dob: '1990-01-01',
      });

    const patient = res.body as Patient;

    expect(res.status).toBe(201);
    expect(patient.email).toBe(uniqueEmail);
  });

  it('should fetch all patients', async () => {
    const res: Response = await request(app.getHttpServer())
      .get('/patients')
      .set('Authorization', `Bearer ${jwt}`);

    if (res.status !== 201) {
      console.error('Error creating patient:', res.body);
    }
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
