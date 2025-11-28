import { Injectable } from '@nestjs/common';
import { IUser } from '../user/interfaces/user.interface';
import { IArtist } from '../artist/interfaces/artist.interface';
import { IAlbum } from '../album/interfaces/album.interface';
import { ITrack } from '../track/interfaces/track.interface';
import { IFavorites } from '../favorites/interfaces/favorites.interface';

@Injectable()
export class StorageService {
  private users: IUser[] = [];
  private artists: IArtist[] = [];
  private albums: IAlbum[] = [];
  private tracks: ITrack[] = [];
  private favorites: IFavorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getUsers(): IUser[] {
    return this.users;
  }

  getUserById(id: string): IUser | undefined {
    return this.users.find((user) => user.id === id);
  }

  addUser(user: IUser): void {
    this.users.push(user);
  }

  updateUser(id: string, updatedUser: IUser): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }

  deleteUser(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }

  getArtists(): IArtist[] {
    return this.artists;
  }

  getArtistById(id: string): IArtist | undefined {
    return this.artists.find((artist) => artist.id === id);
  }

  addArtist(artist: IArtist): void {
    this.artists.push(artist);
  }

  updateArtist(id: string, updatedArtist: IArtist): void {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index !== -1) {
      this.artists[index] = updatedArtist;
    }
  }

  deleteArtist(id: string): void {
    this.artists = this.artists.filter((artist) => artist.id !== id);
    this.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    this.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
  }

  getAlbums(): IAlbum[] {
    return this.albums;
  }

  getAlbumById(id: string): IAlbum | undefined {
    return this.albums.find((album) => album.id === id);
  }

  addAlbum(album: IAlbum): void {
    this.albums.push(album);
  }

  updateAlbum(id: string, updatedAlbum: IAlbum): void {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index !== -1) {
      this.albums[index] = updatedAlbum;
    }
  }

  deleteAlbum(id: string): void {
    this.albums = this.albums.filter((album) => album.id !== id);
    this.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
  }

  getTracks(): ITrack[] {
    return this.tracks;
  }

  getTrackById(id: string): ITrack | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  addTrack(track: ITrack): void {
    this.tracks.push(track);
  }

  updateTrack(id: string, updatedTrack: ITrack): void {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index !== -1) {
      this.tracks[index] = updatedTrack;
    }
  }

  deleteTrack(id: string): void {
    this.tracks = this.tracks.filter((track) => track.id !== id);
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }

  getFavorites(): IFavorites {
    return this.favorites;
  }

  addToFavorites(type: 'artists' | 'albums' | 'tracks', id: string): void {
    if (!this.favorites[type].includes(id)) {
      this.favorites[type].push(id);
    }
  }

  removeFromFavorites(
    type: 'artists' | 'albums' | 'tracks',
    id: string,
  ): boolean {
    const index = this.favorites[type].indexOf(id);
    if (index !== -1) {
      this.favorites[type].splice(index, 1);
      return true;
    }
    return false;
  }
}
