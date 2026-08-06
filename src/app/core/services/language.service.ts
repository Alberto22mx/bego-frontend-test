import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

import en from '../../../assets/i18n/en.json';
import es from '../../../assets/i18n/es.json';

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof en;

const LANGUAGE_STORAGE_KEY = 'bego-language';
const translations: Record<Language, Record<TranslationKey, string>> = { en, es };

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  readonly language = signal<Language>(this.readStoredLanguage());

  constructor() {
    this.updateDocumentLanguage(this.language());
  }

  translate(key: TranslationKey): string {
    return translations[this.language()][key];
  }

  toggleLanguage(): void {
    const language: Language = this.language() === 'en' ? 'es' : 'en';
    this.language.set(language);
    this.updateDocumentLanguage(language);

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      } catch {
        // The language still changes when storage is unavailable or blocked.
      }
    }
  }

  private readStoredLanguage(): Language {
    if (!isPlatformBrowser(this.platformId)) {
      return 'en';
    }

    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'es' ? 'es' : 'en';
    } catch {
      return 'en';
    }
  }

  private updateDocumentLanguage(language: Language): void {
    this.document.documentElement.lang = language;
  }
}
