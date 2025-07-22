/**
 * Notification Sound Manager
 * Handles audio feedback for different notification priorities and types
 */

export interface SoundConfig {
  url: string;
  volume: number;
  loop: boolean;
  priority: number; // Higher number = higher priority
}

export interface NotificationSounds {
  critical: SoundConfig;
  high: SoundConfig;
  medium: SoundConfig;
  low: SoundConfig;
  success: SoundConfig;
  error: SoundConfig;
  warning: SoundConfig;
  info: SoundConfig;
}

// Default sound configuration
const DEFAULT_SOUNDS: NotificationSounds = {
  critical: {
    url: '/sounds/critical-alert.mp3',
    volume: 0.8,
    loop: false,
    priority: 4
  },
  high: {
    url: '/sounds/high-priority.mp3',
    volume: 0.6,
    loop: false,
    priority: 3
  },
  medium: {
    url: '/sounds/medium-notification.mp3',
    volume: 0.4,
    loop: false,
    priority: 2
  },
  low: {
    url: '/sounds/low-notification.mp3',
    volume: 0.3,
    loop: false,
    priority: 1
  },
  success: {
    url: '/sounds/success.mp3',
    volume: 0.5,
    loop: false,
    priority: 2
  },
  error: {
    url: '/sounds/error.mp3',
    volume: 0.7,
    loop: false,
    priority: 3
  },
  warning: {
    url: '/sounds/warning.mp3',
    volume: 0.6,
    loop: false,
    priority: 3
  },
  info: {
    url: '/sounds/info.mp3',
    volume: 0.4,
    loop: false,
    priority: 1
  }
};

class NotificationSoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isEnabled: boolean = true;
  private masterVolume: number = 1.0;
  private currentlyPlaying: HTMLAudioElement | null = null;
  private soundQueue: Array<{ audio: HTMLAudioElement; priority: number }> = [];

  constructor() {
    this.loadSounds();
    this.loadUserPreferences();
  }

  /**
   * Load all sound files and create audio elements
   */
  private async loadSounds(): Promise<void> {
    for (const [key, config] of Object.entries(DEFAULT_SOUNDS)) {
      try {
        const audio = new Audio(config.url);
        audio.volume = config.volume * this.masterVolume;
        audio.preload = 'auto';
        
        // Handle loading errors gracefully
        audio.addEventListener('error', (e) => {
          console.warn(`Failed to load notification sound: ${config.url}`, e);
        });

        // Handle successful loading
        audio.addEventListener('canplaythrough', () => {
          console.log(`Notification sound loaded: ${key}`);
        });

        this.sounds.set(key, audio);
      } catch (error) {
        console.warn(`Error creating audio element for ${key}:`, error);
      }
    }
  }

  /**
   * Load user preferences from localStorage
   */
  private loadUserPreferences(): void {
    try {
      const preferences = localStorage.getItem('notification-sound-preferences');
      if (preferences) {
        const parsed = JSON.parse(preferences);
        this.isEnabled = parsed.enabled ?? true;
        this.masterVolume = parsed.volume ?? 1.0;
      }
    } catch (error) {
      console.warn('Failed to load sound preferences:', error);
    }
  }

  /**
   * Save user preferences to localStorage
   */
  private saveUserPreferences(): void {
    try {
      const preferences = {
        enabled: this.isEnabled,
        volume: this.masterVolume
      };
      localStorage.setItem('notification-sound-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save sound preferences:', error);
    }
  }

  /**
   * Play notification sound based on priority
   */
  public async playNotificationSound(
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium',
    type?: 'success' | 'error' | 'warning' | 'info'
  ): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    // Determine which sound to play
    const soundKey = type || priority;
    const audio = this.sounds.get(soundKey);
    
    if (!audio) {
      console.warn(`Notification sound not found: ${soundKey}`);
      return;
    }

    try {
      // Get priority for queue management
      const config = DEFAULT_SOUNDS[soundKey as keyof NotificationSounds];
      
      // Handle sound queue based on priority
      if (this.currentlyPlaying) {
        const currentPriority = this.getCurrentPlayingPriority();
        
        if (config.priority > currentPriority) {
          // Higher priority sound - stop current and play immediately
          this.stopCurrentSound();
          await this.playAudio(audio);
        } else if (config.priority === currentPriority) {
          // Same priority - add to queue
          this.soundQueue.push({ audio, priority: config.priority });
        }
        // Lower priority - ignore (don't interrupt)
      } else {
        // No sound currently playing - play immediately
        await this.playAudio(audio);
      }
    } catch (error) {
      console.warn(`Failed to play notification sound: ${soundKey}`, error);
    }
  }

  /**
   * Play audio element
   */
  private async playAudio(audio: HTMLAudioElement): Promise<void> {
    try {
      // Reset audio to beginning
      audio.currentTime = 0;
      
      // Set current volume
      audio.volume = (DEFAULT_SOUNDS[this.getSoundKey(audio) as keyof NotificationSounds]?.volume || 0.5) * this.masterVolume;
      
      // Play the audio
      await audio.play();
      
      this.currentlyPlaying = audio;
      
      // Set up end event listener
      const handleEnded = () => {
        this.currentlyPlaying = null;
        audio.removeEventListener('ended', handleEnded);
        this.playNextInQueue();
      };
      
      audio.addEventListener('ended', handleEnded);
      
    } catch (error) {
      console.warn('Failed to play audio:', error);
      this.currentlyPlaying = null;
    }
  }

  /**
   * Stop currently playing sound
   */
  private stopCurrentSound(): void {
    if (this.currentlyPlaying) {
      this.currentlyPlaying.pause();
      this.currentlyPlaying.currentTime = 0;
      this.currentlyPlaying = null;
    }
  }

  /**
   * Play next sound in queue
   */
  private playNextInQueue(): void {
    if (this.soundQueue.length > 0) {
      // Sort by priority (highest first)
      this.soundQueue.sort((a, b) => b.priority - a.priority);
      const next = this.soundQueue.shift();
      
      if (next) {
        this.playAudio(next.audio);
      }
    }
  }

  /**
   * Get priority of currently playing sound
   */
  private getCurrentPlayingPriority(): number {
    if (!this.currentlyPlaying) return 0;
    
    const soundKey = this.getSoundKey(this.currentlyPlaying);
    return DEFAULT_SOUNDS[soundKey as keyof NotificationSounds]?.priority || 0;
  }

  /**
   * Get sound key from audio element
   */
  private getSoundKey(audio: HTMLAudioElement): string {
    for (const [key, element] of this.sounds.entries()) {
      if (element === audio) return key;
    }
    return 'medium';
  }

  /**
   * Enable/disable notification sounds
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.saveUserPreferences();
    
    if (!enabled) {
      this.stopCurrentSound();
      this.soundQueue = [];
    }
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.saveUserPreferences();
    
    // Update volume for all loaded sounds
    for (const audio of this.sounds.values()) {
      const soundKey = this.getSoundKey(audio);
      const config = DEFAULT_SOUNDS[soundKey as keyof NotificationSounds];
      if (config) {
        audio.volume = config.volume * this.masterVolume;
      }
    }
  }

  /**
   * Test a specific sound
   */
  public async testSound(soundKey: keyof NotificationSounds): Promise<void> {
    const audio = this.sounds.get(soundKey);
    if (audio) {
      await this.playAudio(audio);
    }
  }

  /**
   * Get current settings
   */
  public getSettings(): { enabled: boolean; volume: number } {
    return {
      enabled: this.isEnabled,
      volume: this.masterVolume
    };
  }

  /**
   * Check if sounds are supported
   */
  public isSupported(): boolean {
    return typeof Audio !== 'undefined';
  }

  /**
   * Preload all sounds
   */
  public async preloadSounds(): Promise<void> {
    const promises = Array.from(this.sounds.values()).map(audio => {
      return new Promise<void>((resolve) => {
        if (audio.readyState >= 2) {
          resolve();
        } else {
          const handleCanPlay = () => {
            audio.removeEventListener('canplaythrough', handleCanPlay);
            resolve();
          };
          audio.addEventListener('canplaythrough', handleCanPlay);
        }
      });
    });

    try {
      await Promise.allSettled(promises);
      console.log('All notification sounds preloaded');
    } catch (error) {
      console.warn('Some notification sounds failed to preload:', error);
    }
  }
}

// Create singleton instance
export const notificationSoundManager = new NotificationSoundManager();

// Export convenience functions
export const playNotificationSound = (
  priority: 'critical' | 'high' | 'medium' | 'low' = 'medium',
  type?: 'success' | 'error' | 'warning' | 'info'
) => notificationSoundManager.playNotificationSound(priority, type);

export const setNotificationSoundsEnabled = (enabled: boolean) => 
  notificationSoundManager.setEnabled(enabled);

export const setNotificationVolume = (volume: number) => 
  notificationSoundManager.setMasterVolume(volume);

export const testNotificationSound = (soundKey: keyof NotificationSounds) => 
  notificationSoundManager.testSound(soundKey);

export default notificationSoundManager;
