import { Test, TestingModule } from '@nestjs/testing';
import { PersistenceController } from './persistence.controller';
import { PersistenceService } from './persistence.service';
import { CreatePersistenceDto } from './dto/create-persistence.dto';
import { UpdatePersistenceDto } from './dto/update-persistence.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Document, Types } from 'mongoose';
import { Movies } from '../entities/movie.entitie';

describe('PersistenceController', () => {
  let controller: PersistenceController;
  let service: PersistenceService;

  const mockMovie = {
    _id: new Types.ObjectId(),
    id: '1',
    name: 'Test Movie',
    overview: 'Test Overview',
    popularity: 1,
    voteAverage: 1,
    voteCount: 1,
    releaseDate: '2021-01-01',
    genres: [],
    tmdb_id: 1,
    __v: 0,
  } as Document<unknown, object, Movies> &
    Movies & { _id: Types.ObjectId } & { __v: number };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersistenceController],
      providers: [
        {
          provide: PersistenceService,
          useValue: {
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            removeById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PersistenceController>(PersistenceController);
    service = module.get<PersistenceService>(PersistenceService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('save', () => {
    it('should create a new movie', async () => {
      const createDto: CreatePersistenceDto = {
        name: mockMovie.name,
        overview: mockMovie.overview,
        popularity: mockMovie.popularity,
        voteAverage: mockMovie.voteAverage,
        voteCount: mockMovie.voteCount,
        releaseDate: mockMovie.releaseDate,
        genres: mockMovie.genres,
        tmdb_id: mockMovie.tmdb_id,
      };
      jest.spyOn(service, 'save').mockResolvedValue(mockMovie);

      const result = await controller.save(createDto);

      expect(result).toEqual(mockMovie);
      expect(service.save).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException when service throws', async () => {
      const createDto: CreatePersistenceDto = {
        name: mockMovie.name,
        overview: mockMovie.overview,
        popularity: mockMovie.popularity,
        voteAverage: mockMovie.voteAverage,
        voteCount: mockMovie.voteCount,
        releaseDate: mockMovie.releaseDate,
        genres: mockMovie.genres,
        tmdb_id: mockMovie.tmdb_id,
      };
      jest.spyOn(service, 'save').mockRejectedValue(new BadRequestException());

      await expect(controller.save(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockMovie]);

      const result = await controller.findAll();

      expect(result).toEqual([mockMovie]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no movies exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a movie by id', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockMovie);

      const result = await controller.findById('1');

      expect(result).toEqual(mockMovie);
      expect(service.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.findById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateById', () => {
    it('should update a movie', async () => {
      const updateDto: UpdatePersistenceDto = {
        name: mockMovie.name,
        overview: mockMovie.overview,
        popularity: mockMovie.popularity,
        voteAverage: mockMovie.voteAverage,
        voteCount: mockMovie.voteCount,
        releaseDate: mockMovie.releaseDate,
        genres: mockMovie.genres,
        tmdb_id: mockMovie.tmdb_id,
      };
      jest.spyOn(service, 'updateById').mockResolvedValue(mockMovie);

      const result = await controller.updateById('1', updateDto);

      expect(result).toEqual(mockMovie);
      expect(service.updateById).toHaveBeenCalledWith('1', updateDto);
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      jest
        .spyOn(service, 'updateById')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateById('999', {
          name: mockMovie.name,
          overview: mockMovie.overview,
          popularity: mockMovie.popularity,
          voteAverage: mockMovie.voteAverage,
          voteCount: mockMovie.voteCount,
          releaseDate: mockMovie.releaseDate,
          genres: mockMovie.genres,
          tmdb_id: mockMovie.tmdb_id,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeById', () => {
    it('should remove a movie', async () => {
      jest.spyOn(service, 'removeById').mockResolvedValue(mockMovie);

      const result = await controller.removeById('1');

      expect(result).toEqual(mockMovie);
      expect(service.removeById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      jest
        .spyOn(service, 'removeById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.removeById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
