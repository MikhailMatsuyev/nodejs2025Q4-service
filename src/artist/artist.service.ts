import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IArtist } from './interfaces/artist.interface';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ArtistService {
  constructor(private readonly storageService: StorageService) {}

  findAll(): IArtist[] {
    return this.storageService.getArtists();
  }

  findOne(id: string): IArtist {
    const artist = this.storageService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  create(dto: CreateArtistDto): IArtist {
    const artist: IArtist = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
    };
    this.storageService.addArtist(artist);
    return artist;
  }

  update(id: string, dto: UpdateArtistDto): IArtist {
    const artist = this.storageService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    const updatedArtist: IArtist = {
      ...artist,
      name: dto.name,
      grammy: dto.grammy,
    };
    this.storageService.updateArtist(id, updatedArtist);
    return updatedArtist;
  }

  remove(id: string): void {
    const artist = this.storageService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    this.storageService.deleteArtist(id);
  }
}
