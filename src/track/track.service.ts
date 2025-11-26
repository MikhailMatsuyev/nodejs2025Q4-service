import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ITrack } from './interfaces/track.interface';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TrackService {
  constructor(private readonly storageService: StorageService) {}

  findAll(): ITrack[] {
    return this.storageService.getTracks();
  }

  findOne(id: string): ITrack {
    const track = this.storageService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  create(dto: CreateTrackDto): ITrack {
    const track: ITrack = {
      id: randomUUID(),
      name: dto.name,
      artistId: dto.artistId || null,
      albumId: dto.albumId || null,
      duration: dto.duration,
    };
    this.storageService.addTrack(track);
    return track;
  }

  update(id: string, dto: UpdateTrackDto): ITrack {
    const track = this.storageService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    const updatedTrack: ITrack = {
      ...track,
      name: dto.name,
      artistId: dto.artistId || null,
      albumId: dto.albumId || null,
      duration: dto.duration,
    };
    this.storageService.updateTrack(id, updatedTrack);
    return updatedTrack;
  }

  remove(id: string): void {
    const track = this.storageService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    this.storageService.deleteTrack(id);
  }
}
