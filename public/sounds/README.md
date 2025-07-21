# Notification Sound Assets

This directory contains audio files for notification feedback.

## Sound Files

### Priority-based Sounds
- `critical-alert.mp3` - For critical system alerts (loud, attention-grabbing)
- `high-priority.mp3` - For high priority notifications (clear, noticeable)
- `medium-notification.mp3` - For standard notifications (gentle, pleasant)
- `low-notification.mp3` - For low priority notifications (subtle, quiet)

### Type-based Sounds
- `success.mp3` - For success notifications (positive, uplifting)
- `error.mp3` - For error notifications (alert, but not alarming)
- `warning.mp3` - For warning notifications (cautionary)
- `info.mp3` - For informational notifications (neutral)

## Audio Specifications

### Recommended Format
- **Format**: MP3 (for broad browser compatibility)
- **Bitrate**: 128 kbps (good quality, reasonable file size)
- **Duration**: 1-3 seconds (short and non-intrusive)
- **Sample Rate**: 44.1 kHz

### Volume Guidelines
- **Critical**: Louder, more attention-grabbing
- **High**: Moderate volume, clear
- **Medium**: Standard notification volume
- **Low**: Quiet, subtle

## Browser Compatibility

### Supported Formats by Browser
- **Chrome/Edge**: MP3, WAV, OGG
- **Firefox**: MP3, WAV, OGG
- **Safari**: MP3, WAV, AAC

### Fallback Strategy
The notification system gracefully handles missing sound files:
1. Attempts to load specified sound
2. Falls back to silent notification if sound fails
3. Logs warnings for debugging

## Implementation Notes

### Auto-play Policy
Modern browsers require user interaction before playing audio:
- Sounds only play after user has interacted with the page
- First notification may be silent until user clicks something
- This is a browser security feature, not a bug

### Performance Considerations
- All sounds are preloaded on app initialization
- Audio elements are reused to minimize memory usage
- Failed loads don't block the notification system

## Customization

### Adding Custom Sounds
1. Add audio file to this directory
2. Update `src/utils/notificationSounds.ts` configuration
3. Test with the notification test component

### Sound Preferences
Users can control sound settings:
- Enable/disable notification sounds
- Adjust master volume
- Settings are saved in localStorage

## Testing

Use the notification test component at `/notification-test` to:
- Test individual sound files
- Adjust volume levels
- Verify browser compatibility

## Licensing

Ensure all sound files have appropriate licensing for commercial use.
Consider using:
- Creative Commons licensed sounds
- Royalty-free sound libraries
- Custom-created audio assets

## File Size Optimization

Keep sound files small for better performance:
- Target 10-50 KB per file
- Use compression tools if needed
- Consider OGG format for smaller file sizes (with MP3 fallback)
