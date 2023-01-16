class Instrument {
  constructor(sound, monophonic, volume) {
    this.sound = sound;
    this.monophonic = monophonic;
    this.sound.setVolume(volume);
  }

  setVolumePan(volume, panning){
    this.sound.setVolume(volume);
    this.sound.pan(panning);
  }
  
  // plays the sound 'note' semitones above the base pitch
  playNote(note) {
    // if the instrument is monophonic, stop all other sounds
    if (this.monophonic) this.sound.stop();
    // repitch the sample to the right note
    this.sound.rate(1 * pow(1.05946, note));
    // start the sample
    this.sound.play();
  }
}
