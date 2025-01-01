import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Movie API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/movies', () => {
    const mockMovie = {
      tmdb_id: 1,
      name: 'Test Movie',
      overview: 'Test Overview',
      popularity: 1,
      voteAverage: 1,
      voteCount: 1,
      releaseDate: '2021-01-01',
      genres: [{ id: 1, name: 'Action' }],
    };

    it('POST /movies - should create a movie', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send(mockMovie)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject(mockMovie);
        });
    });

    it('GET /movies - should return all movies', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /movies/:id - should return a movie by id', () => {
      return request(app.getHttpServer())
        .get('/movies/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
        });
    });
  });

  describe('/Retrieve', () => {
    it('GET /Retrieve - should update database with latest movies', () => {
      return request(app.getHttpServer())
        .get('/Retrieve')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('tmdb_id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('overview');
        });
    });
  });
});
