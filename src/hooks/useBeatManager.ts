import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export function useBeatManager() {
  const { state, removeBeat } = useStore();
  const { currentTrack, playTrack, clearTrack } = useAudioPlayer();

  const handleDeleteBeat = async (beatIdToDelete: string) => {
    // 1. Remove the beat from the list (using the existing removeBeat which handles backend)
    await removeBeat(beatIdToDelete);
    
    // The beatList is in state.beats
    const updatedList = state.beats.filter(beat => beat.id !== beatIdToDelete);

    // 2. Check if we deleted the beat currently loaded in the player
    if (currentTrack && currentTrack.id === beatIdToDelete) {
      if (updatedList.length > 0) {
        // Switch player to the first remaining beat
        playTrack(updatedList[0]);
        // Update the URL parameter so refresh doesn't reload the deleted ID
        window.history.replaceState(null, '', `?track=${updatedList[0].id}`);
      } else {
        // No beats left: Clear player completely
        clearTrack();
        window.history.replaceState(null, '', window.location.pathname);
      }
    }

    // 3. Clear from LocalStorage if you save last played track there
    if (localStorage.getItem('lastPlayedTrackId') === beatIdToDelete) {
      localStorage.removeItem('lastPlayedTrackId');
    }
  };

  return { handleDeleteBeat };
}
