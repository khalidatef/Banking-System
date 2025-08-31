import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Iuser } from '../data/userInterface';
import { users as seedUsers } from '../data/mock-users';

const USERS_KEY = 'app_users';
const SEQ_KEY   = 'app_users_seq';

@Injectable({ providedIn: 'root' })
export class UserStoreService {
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }


  private read<T>(key: string, fallback: T): T {
    if (!this.isBrowser) return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch { return fallback; }
  }

  private write(key: string, value: unknown): void {
    if (!this.isBrowser) return;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  private readSeq(): number {
    if (!this.isBrowser) return seedUsers.length; 
    const raw = localStorage.getItem(SEQ_KEY);
    const n = raw ? parseInt(raw, 10) : seedUsers.length;
    return Number.isFinite(n) ? n : seedUsers.length;
  }

  private writeSeq(n: number): void {
    if (!this.isBrowser) return;
    localStorage.setItem(SEQ_KEY, String(n));
  }

  seedIfEmpty(): void {
    if (!this.isBrowser) return; 
    const existing = localStorage.getItem(USERS_KEY);
    if (!existing) {
      this.write(USERS_KEY, seedUsers);
      this.writeSeq(seedUsers.length);
    }
  }

  private nextId(): string {
    const curr = this.readSeq();
    const nxt = curr + 1;
    this.writeSeq(nxt);
    return String(nxt);
  }

  getAll(): Iuser[] {
    return this.read<Iuser[]>(USERS_KEY, []);
  }

  saveAll(list: Iuser[]): void {
    this.write(USERS_KEY, list);
  }

  findByCredentials(username: string, password: string): Iuser | null {
    return (
      this.getAll().find(
        (u) => u.username === username && u.password === password && u.isActive
      ) ?? null
    );
  }

  findById(id: string): Iuser | null {
    return this.getAll().find((u) => u.id === id) ?? null;
  }

  add(user: Omit<Iuser, 'id'>): Iuser {
    const list = this.getAll();
    const entity: Iuser = { id: this.nextId(), ...user };
    list.push(entity);
    this.saveAll(list);
    return entity;
  }

  update(id: string, patch: Partial<Omit<Iuser, 'id'>>): void {
    const list = this.getAll();
    const i = list.findIndex((u) => u.id === id);
    if (i >= 0) {
      list[i] = { ...list[i], ...patch };
      this.saveAll(list);
    }
  }

  remove(id: string): void {
    const list = this.getAll().filter((u) => u.id !== id);
    this.saveAll(list);
  }
}
