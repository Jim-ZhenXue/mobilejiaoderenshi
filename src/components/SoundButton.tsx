import { useState } from 'react';
import soundManager from '../utils/soundManager';

export const SoundButton = () => {
  const [isMuted, setIsMuted] = useState(soundManager.isMutedStatus());

  const toggleMute = () => {
    const newMutedStatus = soundManager.toggleMute();
    setIsMuted(newMutedStatus);
    soundManager.play('click');
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed top-20 right-5 w-10 h-10 flex items-center justify-center text-white bg-purple-600 rounded-full transition-all hover:bg-purple-700 z-50"
      aria-label={isMuted ? "开启声音" : "关闭声音"}
    >
      {isMuted ? (
        <i className="fas fa-volume-mute"></i>
      ) : (
        <i className="fas fa-volume-up"></i>
      )}
    </button>
  );
};
