import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IAlbum } from './interfaces/album.interface';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AlbumService {
  constructor(private readonly storageService: StorageService) {}

  findAll(): IAlbum[] {
    return this.storageService.getAlbums();
  }

  findOne(id: string): IAlbum {
    const album = this.storageService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  create(dto: CreateAlbumDto): IAlbum {
    const album: IAlbum = {
      id: randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId || null,
    };
    this.storageService.addAlbum(album);
    return album;
  }

  update(id: string, dto: UpdateAlbumDto): IAlbum {
    const album = this.storageService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    const updatedAlbum: IAlbum = {
      ...album,
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId || null,
    };
    this.storageService.updateAlbum(id, updatedAlbum);
    return updatedAlbum;
  }

  remove(id: string): void {
    const album = this.storageService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    this.storageService.deleteAlbum(id);
  }
}
