/**
 * Notification Sound Manager
 * Handles sound playback for notifications with priority-based selection
 */

export interface NotificationSounds {
  critical: string;
  high: string;
  medium: string;
  low: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface SoundConfig {
  url: string;
  volume: number;
  priority: number; // Higher number = higher priority
  loop: boolean;
}

// Default sound configuration
const DEFAULT_SOUNDS: Record<keyof NotificationSounds, SoundConfig> = {
  critical: {
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    volume: 0.8,
    priority: 4,
    loop: false,
  },
  high: {
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    volume: 0.6,
    priority: 3,
    loop: false,
  },
  medium: {
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    volume: 0.4,
    priority: 2,
    loop: false,
  },
  low: {
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    volume: 0.2,
    priority: 1,
    loop: false,
  },
  success: {
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    volume: 0.5,
    priority: 2,
    loop: false,
  },
  error: {
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    volume: 0.7,
    priority: 4,
    loop: false,
  },
  warning: {
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    volume: 0.6,
    priority: 3,
    loop: false,
  },
  info: {
    url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    volume: 0.3,
    priority: 1,
    loop: false,
  },
};

interface QueuedSound {
  audio: HTMLAudioElement;
  priority: number;
}

class NotificationSoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isEnabled: boolean = true;
  private masterVolume: number = 1.0;
  private currentlyPlaying: HTMLAudioElement | null = null;
  private soundQueue: QueuedSound[] = [];
  private userPreferences: Record<string, any> = {};

  constructor() {
    this.loadUserPreferences();
    this.initializeSounds();
  }

  /**
   * Initialize all sound objects
   */
  private initializeSounds(): void {
    Object.entries(DEFAULT_SOUNDS).forEach(([key, config]) => {
      try {
        const audio = new Audio(config.url);
        audio.volume = config.volume * this.masterVolume;
        audio.preload = "auto";

        // Handle audio events
        audio.addEventListener("ended", () => {
          this.onSoundEnded();
        });

        audio.addEventListener("error", (e) => {
          console.warn(`Failed to load notification sound: ${key}`, e);
        });

        this.sounds.set(key, audio);
      } catch (error) {
        console.warn(`Failed to create audio for ${key}:`, error);
      }
    });
  }

  /**
   * Load user preferences from localStorage
   */
  private loadUserPreferences(): void {
    try {
      const stored = localStorage.getItem(
        "barungems_notification_sound_preferences"
      );
      if (stored) {
        this.userPreferences = JSON.parse(stored);
        this.isEnabled = this.userPreferences.enabled !== false;
        this.masterVolume =
          typeof this.userPreferences.volume === "number"
            ? this.userPreferences.volume
            : 1.0;
      }
    } catch (error) {
      console.warn("Failed to load sound preferences:", error);
    }
  }

  /**
   * Save user preferences to localStorage
   */
  private saveUserPreferences(): void {
    try {
      const preferences = {
        enabled: this.isEnabled,
        volume: this.masterVolume,
        ...this.userPreferences,
      };
      localStorage.setItem(
        "barungems_notification_sound_preferences",
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.warn("Failed to save sound preferences:", error);
    }
  }

  /**
   * Handle sound ended event
   */
  private onSoundEnded(): void {
    this.currentlyPlaying = null;

    // Play next sound in queue
    if (this.soundQueue.length > 0) {
      const nextSound = this.soundQueue.shift();
      if (nextSound) {
        this.playAudio(nextSound.audio);
      }
    }
  }

  /**
   * Play audio with error handling
   */
  private async playAudio(audio: HTMLAudioElement): Promise<void> {
    try {
      this.currentlyPlaying = audio;
      audio.currentTime = 0; // Reset to beginning
      await audio.play();
    } catch (error) {
      console.warn("Failed to play notification sound:", error);
      this.currentlyPlaying = null;
    }
  }

  /**
   * Get priority of currently playing sound
   */
  private getCurrentPlayingPriority(): number {
    if (!this.currentlyPlaying) return 0;

    for (const [key, audio] of this.sounds.entries()) {
      if (audio === this.currentlyPlaying) {
        return DEFAULT_SOUNDS[key as keyof NotificationSounds]?.priority || 0;
      }
    }
    return 0;
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
   * Play notification sound based on priority
   */
  public async playNotificationSound(
    priority: "critical" | "high" | "medium" | "low" = "medium",
    type?: "success" | "error" | "warning" | "info"
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
   * Test a specific sound
   */
  public async testSound(soundKey: keyof NotificationSounds): Promise<void> {
    const audio = this.sounds.get(soundKey);
    if (audio) {
      await this.playAudio(audio);
    } else {
      console.warn(`Sound not found: ${soundKey}`);
    }
  }

  /**
   * Enable/disable notification sounds
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.saveUserPreferences();

    if (!enabled && this.currentlyPlaying) {
      this.stopCurrentSound();
      this.soundQueue = [];
    }
  }

  /**
   * Get enabled status
   */
  public getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));

    // Update all audio volumes
    this.sounds.forEach((audio, key) => {
      const config = DEFAULT_SOUNDS[key as keyof NotificationSounds];
      if (config) {
        audio.volume = config.volume * this.masterVolume;
      }
    });

    this.saveUserPreferences();
  }

  /**
   * Get master volume
   */
  public getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Set volume for specific sound type
   */
  public setSoundVolume(
    soundKey: keyof NotificationSounds,
    volume: number
  ): void {
    const audio = this.sounds.get(soundKey);
    if (audio) {
      const normalizedVolume = Math.max(0, Math.min(1, volume));
      audio.volume = normalizedVolume * this.masterVolume;

      // Save preference
      this.userPreferences[`${soundKey}_volume`] = normalizedVolume;
      this.saveUserPreferences();
    }
  }

  /**
   * Get volume for specific sound type
   */
  public getSoundVolume(soundKey: keyof NotificationSounds): number {
    const audio = this.sounds.get(soundKey);
    return audio ? audio.volume / this.masterVolume : 0;
  }

  /**
   * Stop all sounds
   */
  public stopAllSounds(): void {
    this.stopCurrentSound();
    this.soundQueue = [];
  }

  /**
   * Get current sound status
   */
  public getStatus(): {
    isEnabled: boolean;
    masterVolume: number;
    currentlyPlaying: string | null;
    queueLength: number;
    availableSounds: string[];
  } {
    let currentlyPlayingKey: string | null = null;

    if (this.currentlyPlaying) {
      for (const [key, audio] of this.sounds.entries()) {
        if (audio === this.currentlyPlaying) {
          currentlyPlayingKey = key;
          break;
        }
      }
    }

    return {
      isEnabled: this.isEnabled,
      masterVolume: this.masterVolume,
      currentlyPlaying: currentlyPlayingKey,
      queueLength: this.soundQueue.length,
      availableSounds: Array.from(this.sounds.keys()),
    };
  }

  /**
   * Reset to default settings
   */
  public resetToDefaults(): void {
    this.isEnabled = true;
    this.masterVolume = 1.0;
    this.userPreferences = {};
    this.stopAllSounds();

    // Reinitialize sounds with default volumes
    this.initializeSounds();
    this.saveUserPreferences();
  }

  /**
   * Check if browser supports audio
   */
  public static isAudioSupported(): boolean {
    return typeof Audio !== "undefined";
  }

  /**
   * Check if user has interacted with page (required for audio autoplay)
   */
  public static hasUserInteracted(): boolean {
    // This is a simple check - in practice, you might want to track user interactions
    return document.hasFocus();
  }
}

// Create singleton instance
export const notificationSoundManager = new NotificationSoundManager();

// Export convenience functions
export const playNotificationSound = (
  priority: "critical" | "high" | "medium" | "low" = "medium",
  type?: "success" | "error" | "warning" | "info"
) => notificationSoundManager.playNotificationSound(priority, type);

export const setNotificationSoundsEnabled = (enabled: boolean) =>
  notificationSoundManager.setEnabled(enabled);

export const setNotificationVolume = (volume: number) =>
  notificationSoundManager.setMasterVolume(volume);

export const testNotificationSound = (soundKey: keyof NotificationSounds) =>
  notificationSoundManager.testSound(soundKey);

export default notificationSoundManager;
