/*
 * Class for handling the tempo and timing of the sketch
 */

class TempoManager{
  
  // creates a new object with BPM bpm and stepsPerBeat steps per beat
  // stepsPerBeat is the maximum resolution of a song needed
  // 
  // For example: if a song is 100 BPM and the song contains nothing
  // shorter than 16th notes, use:
  // new TempoManager(100, 16)
  
  constructor(bpm, stepsPerBeat){
    this.bpm = bpm;
    this.stepsPerBeat = stepsPerBeat;
    this.millisecondsPerStep = 60000 / bpm / stepsPerBeat; 
  }
  
  
  // returns the beats per minute value
  getBPM(){
    return this.bpm;
  }
  
  // returns the amount of steps in a beat
  getStepsPerBeat(){
    return this.getStepsPerBeat;
  }
  
  // returns the number of milliseconds each step lasts
  getMilliseconds(){
    return this.millisecondsPerStep;
  }
}