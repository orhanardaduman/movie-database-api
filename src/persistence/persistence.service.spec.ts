import { Test, TestingModule } from '@nestjs/testing';
import { PersistenceService } from './persistence.service';
import { Movies } from '../entities/movie.entitie';
import { getModelToken } from '@nestjs/mongoose';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('PersistenceService', () => {
  let service: PersistenceService;
  let movieModel: any;

  const mockMovie = {
    id: '1',
    name: 'Test Movie',
    overview: 'Test Overview',
    popularity: 1,
    voteAverage: 1,
    voteCount: 1,
    releaseDate: '2021-01-01',
    genres: [],
    tmdb_id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersistenceService,
        {
          provide: getModelToken(Movies.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PersistenceService>(PersistenceService);
    movieModel = module.get<any>(getModelToken(Movies.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('save', () => {
    it('should successfully create a new movie', async () => {
      movieModel.create.mockResolvedValue(mockMovie);
      const result = await service.save(mockMovie);
      expect(result).toEqual(mockMovie);
      expect(movieModel.create).toHaveBeenCalledWith({
        ...mockMovie,
        id: expect.any(String),
      });
    });

    it('should throw InternalServerErrorException on create failure', async () => {
      movieModel.create.mockRejectedValue(new Error('Database error'));
      await expect(service.save(mockMovie)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle null values in movie data', async () => {
      const movieWithNulls = {
        ...mockMovie,
        overview: null,
        releaseDate: null,
      };
      movieModel.create.mockResolvedValue(movieWithNulls);
      const result = await service.save(movieWithNulls);
      expect(result.overview).toBeNull();
      expect(result.releaseDate).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      movieModel.find.mockResolvedValue([mockMovie]);
      const result = await service.findAll();
      expect(result).toEqual([mockMovie]);
      expect(movieModel.find).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on find failure', async () => {
      movieModel.find.mockRejectedValue(new Error('Database error'));
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return empty array when no movies exist', async () => {
      movieModel.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should handle large result sets', async () => {
      const manyMovies = Array(100).fill(mockMovie);
      movieModel.find.mockResolvedValue(manyMovies);
      const result = await service.findAll();
      expect(result.length).toBe(100);
    });
  });

  describe('findById', () => {
    it('should return a movie when found', async () => {
      movieModel.findOne.mockResolvedValue(mockMovie);
      const result = await service.findById('1');
      expect(result).toEqual(mockMovie);
      expect(movieModel.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException when movie not found', async () => {
      movieModel.findOne.mockResolvedValue(null);
      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on find failure', async () => {
      movieModel.findOne.mockRejectedValue(new Error('Database error'));
      await expect(service.findById('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle invalid id format', async () => {
      await expect(service.findById('')).rejects.toThrow();
    });

    it('should handle special characters in id', async () => {
      const specialId = '1@#$%^&*()';
      movieModel.findOne.mockResolvedValue(mockMovie);
      await service.findById(specialId);
      expect(movieModel.findOne).toHaveBeenCalledWith({ id: specialId });
    });
  });

  describe('updateById', () => {
    it('should update and return movie when found', async () => {
      movieModel.findOne.mockResolvedValue(mockMovie);
      movieModel.findOneAndUpdate.mockResolvedValue(mockMovie);

      const result = await service.updateById('1', mockMovie);
      expect(result).toEqual(mockMovie);
      expect(movieModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: '1' },
        mockMovie,
        { new: true },
      );
    });

    it('should throw NotFoundException when movie not found', async () => {
      movieModel.findOne.mockResolvedValue(null);
      await expect(service.updateById('1', mockMovie)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on update failure', async () => {
      movieModel.findOne.mockResolvedValue(mockMovie);
      movieModel.findOneAndUpdate.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(service.updateById('1', mockMovie)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { name: 'Updated Name' };
      movieModel.findOne.mockResolvedValue(mockMovie);
      movieModel.findOneAndUpdate.mockResolvedValue({
        ...mockMovie,
        ...partialUpdate,
      });
      const result = await service.updateById('1', partialUpdate);
      expect(result.name).toBe('Updated Name');
    });

    it('should preserve unchanged fields during update', async () => {
      const partialUpdate = { name: 'Updated Name' };
      const expectedResult = { ...mockMovie, ...partialUpdate };
      movieModel.findOne.mockResolvedValue(mockMovie);
      movieModel.findOneAndUpdate.mockResolvedValue(expectedResult);
      const result = await service.updateById('1', partialUpdate);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('removeById', () => {
    it('should remove and return movie when found', async () => {
      movieModel.findOne.mockResolvedValue(mockMovie);
      movieModel.findOneAndDelete.mockResolvedValue(mockMovie);

      const result = await service.removeById('1');
      expect(result).toEqual(mockMovie);
      expect(movieModel.findOneAndDelete).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException when movie not found', async () => {
      movieModel.findOne.mockResolvedValue(null);
      await expect(service.removeById('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on delete failure', async () => {
      movieModel.findOne.mockResolvedValue(mockMovie);
      movieModel.findOneAndDelete.mockRejectedValue(
        new Error('Database error'),
      );
      await expect(service.removeById('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle deletion of already deleted movie', async () => {
      movieModel.findOne.mockResolvedValue(mockMovie);
      movieModel.findOneAndDelete.mockResolvedValue(null);
      const result = await service.removeById('1');
      expect(result).toBeNull();
    });

    it('should verify movie is actually deleted', async () => {
      movieModel.findOne
        .mockResolvedValueOnce(mockMovie) // First call returns movie
        .mockResolvedValueOnce(null); // Second call verifies deletion
      movieModel.findOneAndDelete.mockResolvedValue(mockMovie);

      await service.removeById('1');
      const verifyDeletion = await movieModel.findOne({ id: '1' });
      expect(verifyDeletion).toBeNull();
    });
  });
});
