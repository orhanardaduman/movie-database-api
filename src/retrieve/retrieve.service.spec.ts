import { Test, TestingModule } from '@nestjs/testing';
import { RetrieveService } from './retrieve.service';
import { getModelToken } from '@nestjs/mongoose';
import { ExternalRequest } from '../helpers/external.request';
import { TmdbMovieDto } from './dto/tmdb.movie.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('RetrieveService', () => {
  let service: RetrieveService;
  let externalRequest: ExternalRequest;
  let movieModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetrieveService,
        {
          provide: ExternalRequest,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getModelToken('Movies'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            insertMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RetrieveService>(RetrieveService);
    externalRequest = module.get<ExternalRequest>(ExternalRequest);
    movieModel = module.get<any>(getModelToken('Movies'));
  });

  describe('getMovies', () => {
    it('should return an array of movies', async () => {
      const movies: TmdbMovieDto[] = [
        {
          id: 1,
          original_title: 'Test Movie',
          overview: 'Test overview',
          release_date: '2023-01-01',
          vote_average: 8.5,
          vote_count: 1500,
          popularity: 100,
          genres: [{ id: 1, name: 'Action' }],
        },
      ];
      jest.spyOn(externalRequest, 'get').mockResolvedValue(movies);

      const result = await service.getMovies();

      expect(result).toEqual(movies);
      expect(externalRequest.get).toHaveBeenCalledWith(
        `${process.env.TMDB_API_URL}/discover/movie?`,
        expect.stringContaining('sort_by=primary_release_date.asc'),
        expect.any(Object),
      );
    });

    it('should throw BadRequestException when response format is invalid', async () => {
      jest.spyOn(externalRequest, 'get').mockResolvedValue(null);

      await expect(service.getMovies()).rejects.toThrow(
        new BadRequestException('Invalid response format from TMDB API'),
      );
    });

    it('should throw BadRequestException when response is not an array', async () => {
      jest.spyOn(externalRequest, 'get').mockResolvedValue({});

      await expect(service.getMovies()).rejects.toThrow(
        new BadRequestException('Invalid response format from TMDB API'),
      );
    });

    it('should throw BadRequestException when required fields are missing', async () => {
      const invalidMovies = [
        {
          id: 1,
          original_title: 'Test Movie',
        },
      ];
      jest.spyOn(externalRequest, 'get').mockResolvedValue(invalidMovies);

      await expect(service.getMovies()).rejects.toThrow(
        new BadRequestException(
          'Response contains movies with missing required fields',
        ),
      );
    });

    it('should handle empty array response', async () => {
      jest.spyOn(externalRequest, 'get').mockResolvedValue([]);
      const result = await service.getMovies();
      expect(result).toEqual([]);
    });

    it('should handle network errors', async () => {
      jest
        .spyOn(externalRequest, 'get')
        .mockRejectedValue(new Error('Network error'));
      await expect(service.getMovies()).rejects.toThrow('Network error');
    });
  });

  describe('getMovieDetails', () => {
    it('should return movie details', async () => {
      const movieId = 1;
      const movieDetails: TmdbMovieDto = {
        id: movieId,
        original_title: 'Test Movie',
        overview: 'Test overview',
        release_date: '2023-01-01',
        vote_average: 8.5,
        vote_count: 1500,
        popularity: 100,
        genres: [{ id: 1, name: 'Action' }],
      };
      jest.spyOn(externalRequest, 'get').mockResolvedValue(movieDetails);

      const result = await service.getMovieDetails(movieId);

      expect(result).toEqual(movieDetails);
      expect(externalRequest.get).toHaveBeenCalledWith(
        `${process.env.TMDB_API_URL}/movie/${movieId}`,
        '',
        expect.any(Object),
      );
    });

    it('should throw BadRequestException when required fields are missing', async () => {
      const movieId = 1;
      const invalidMovie: Partial<TmdbMovieDto> = {
        id: movieId,
        original_title: 'Test Movie',
      };
      jest.spyOn(externalRequest, 'get').mockResolvedValue(invalidMovie);

      await expect(service.getMovieDetails(movieId)).rejects.toThrow(
        'Response contains movies with missing required fields',
      );
    });

    it('should handle invalid movie ID', async () => {
      const invalidId = -1;
      jest
        .spyOn(externalRequest, 'get')
        .mockRejectedValue(new Error('Invalid ID'));
      await expect(service.getMovieDetails(invalidId)).rejects.toThrow(
        'Invalid ID',
      );
    });

    it('should handle null response', async () => {
      const movieId = 1;
      jest.spyOn(externalRequest, 'get').mockResolvedValue(null);
      await expect(service.getMovieDetails(movieId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('isValidMovie', () => {
    it('should return true when all required fields are present', () => {
      const requiredFields = ['original_title', 'overview'];
      const movie: TmdbMovieDto = {
        id: 1,
        original_title: 'Test Movie',
        overview: 'Test overview',
        release_date: '2023-01-01',
        vote_average: 8.5,
        vote_count: 1500,
        popularity: 100,
        genres: [{ id: 1, name: 'Action' }],
      };

      const result = service.isValidMovie(requiredFields, movie);

      expect(result).toBe(true);
    });

    it('should return false when required fields are missing', () => {
      const requiredFields = ['original_title', 'overview'];
      const movie: Partial<TmdbMovieDto> = {
        id: 1,
        original_title: 'Test Movie',
      };

      const result = service.isValidMovie(
        requiredFields,
        movie as TmdbMovieDto,
      );

      expect(result).toBe(false);
    });

    it('should handle empty required fields array', () => {
      const requiredFields: string[] = [];
      const movie: Partial<TmdbMovieDto> = {};

      const result = service.isValidMovie(
        requiredFields,
        movie as TmdbMovieDto,
      );
      expect(result).toBe(true);
    });

    it('should handle null values in required fields', () => {
      const requiredFields = ['original_title', 'overview'];
      const movie = {
        id: 1,
        overview: 'Test overview',
      };

      const result = service.isValidMovie(
        requiredFields,
        movie as TmdbMovieDto,
      );
      expect(result).toBe(false);
    });
  });

  describe('updateDatabase', () => {
    it('should successfully update database with new movies', async () => {
      const movies = [
        {
          id: 1,
          original_title: 'Test Movie',
          overview: 'Test overview',
          release_date: '2023-01-01',
          vote_average: 8.5,
          vote_count: 1500,
          popularity: 100,
          genres: [{ id: 1, name: 'Action' }],
        },
      ];
      jest.spyOn(service, 'getMovies').mockResolvedValue(movies);
      jest.spyOn(service, 'getMovieDetails').mockResolvedValue(movies[0]);
      jest.spyOn(movieModel, 'find').mockResolvedValue([]);
      jest.spyOn(movieModel, 'insertMany').mockResolvedValue(movies);

      const result = await service.updateDatabase();

      expect(result.updatedCount).toBe(1);
      expect(result.message).toBe('Database updated successfully');
      expect(movieModel.insertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            tmdb_id: 1,
            name: 'Test Movie',
            overview: 'Test overview',
            releaseDate: '2023-01-01',
            voteAverage: 8.5,
            voteCount: 1500,
            popularity: 100,
            genres: [{ id: 1, name: 'Action' }],
          }),
        ]),
      );
    });

    it('should skip existing movies during update', async () => {
      const movies = [
        {
          id: 1,
          original_title: 'Test Movie',
          overview: 'Test overview',
          release_date: '2023-01-01',
          vote_average: 8.5,
          vote_count: 1500,
          popularity: 100,
          genres: [{ id: 1, name: 'Action' }],
        },
      ];
      jest.spyOn(service, 'getMovies').mockResolvedValue(movies);
      jest.spyOn(service, 'getMovieDetails').mockResolvedValue(movies[0]);
      jest.spyOn(movieModel, 'find').mockResolvedValue([{ tmdb_id: 1 }]);
      jest.spyOn(movieModel, 'insertMany').mockResolvedValue([]);

      const result = await service.updateDatabase();

      expect(result.updatedCount).toBe(0);
      expect(result.message).toBe('Database updated successfully');
      expect(movieModel.insertMany).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      jest
        .spyOn(service, 'getMovies')
        .mockRejectedValue(new Error('API Error'));

      await expect(service.updateDatabase()).rejects.toThrow(
        'Failed to update database: API Error',
      );
    });

    it('should handle database connection errors', async () => {
      const movies: TmdbMovieDto[] = [
        {
          id: 1,
          original_title: 'Test Movie',
          overview: 'Test overview',
          popularity: 100,
          vote_average: 8.5,
          vote_count: 1500,
          release_date: '2023-01-01',
          genres: [{ id: 1, name: 'Action' }],
        },
      ];
      jest.spyOn(service, 'getMovies').mockResolvedValue(movies);
      jest.spyOn(service, 'getMovieDetails').mockResolvedValue(movies[0]);
      jest
        .spyOn(movieModel, 'find')
        .mockRejectedValue(new Error('Database connection failed'));

      await expect(service.updateDatabase()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle empty API response', async () => {
      jest.spyOn(service, 'getMovies').mockResolvedValue([]);

      await expect(service.updateDatabase()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle partial movie details failures', async () => {
      const movies: TmdbMovieDto[] = [
        {
          id: 1,
          original_title: 'Movie 1',
          overview: 'Test overview 1',
          popularity: 1.0,
          vote_average: 7.5,
          vote_count: 100,
          release_date: '2023-01-01',
          genres: [{ id: 1, name: 'Action' }],
        },
        {
          id: 2,
          original_title: 'Movie 2',
          overview: 'Test overview 2',
          popularity: 1.0,
          vote_average: 7.5,
          vote_count: 100,
          release_date: '2023-01-01',
          genres: [{ id: 1, name: 'Action' }],
        },
      ];
      jest.spyOn(service, 'getMovies').mockResolvedValue(movies);
      jest
        .spyOn(service, 'getMovieDetails')
        .mockResolvedValueOnce({
          id: 1,
          original_title: 'Movie 1',
          overview: 'Test overview',
          popularity: 1.0,
          vote_average: 7.5,
          vote_count: 100,
          release_date: '2023-01-01',
          genres: [{ id: 1, name: 'Action' }],
        })
        .mockRejectedValueOnce(new Error('Failed to fetch details'));
      jest.spyOn(movieModel, 'find').mockResolvedValue([]);

      await expect(service.updateDatabase()).rejects.toThrow(
        'Failed to fetch details',
      );
    });
  });
});
