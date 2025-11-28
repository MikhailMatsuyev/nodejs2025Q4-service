import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  IFavorites,
  IFavoritesResponse,
} from './interfaces/favorites.interface';
import { StorageService } from '../storage/storage.service';
import { IArtist } from '../artist/interfaces/artist.interface';

@Injectable()
export class FavoritesService {
  constructor(private readonly storageService: StorageService) {}

  findAll(): IFavoritesResponse {
    const favorites: IFavorites = this.storageService.getFavorites();

    const artists: IArtist[] = favorites.artists
      .map((id) => this.storageService.getArtistById(id))
      .filter((artist) => artist !== undefined);

    const albums = favorites.albums
      .map((id) => this.storageService.getAlbumById(id))
      .filter((album) => album !== undefined);

    const tracks = favorites.tracks
      .map((id) => this.storageService.getTrackById(id))
      .filter((track) => track !== undefined);

    return { artists, albums, tracks };
  }

  addArtist(id: string): void {
    const artist = this.storageService.getArtistById(id);
    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }
    this.storageService.addToFavorites('artists', id);
  }

  removeArtist(id: string): void {
    const removed = this.storageService.removeFromFavorites('artists', id);
    if (!removed) {
      throw new NotFoundException('Artist is not in favorites');
    }
  }

  addAlbum(id: string): void {
    const album = this.storageService.getAlbumById(id);
    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }
    this.storageService.addToFavorites('albums', id);
  }

  removeAlbum(id: string): void {
    const removed = this.storageService.removeFromFavorites('albums', id);
    if (!removed) {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  addTrack(id: string): void {
    const track = this.storageService.getTrackById(id);
    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }
    this.storageService.addToFavorites('tracks', id);
  }

  removeTrack(id: string): void {
    const removed = this.storageService.removeFromFavorites('tracks', id);
    if (!removed) {
      throw new NotFoundException('Track is not in favorites');
    }
  }
}
