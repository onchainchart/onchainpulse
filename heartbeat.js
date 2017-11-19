class Heartbeat {
  constructor(heartId, titleId, beatWav, bgWav) {
    if (!heartId || !titleId || !beatWav || !bgWav) throw new Error();

    this.__heartElem = document.getElementById(heartId);
    this.__titleElem = document.getElementById(titleId);

    let promises = [];
    promises.push(new Promise(resolve => this.__beatPlayer = new Tone.Player(beatWav, resolve).toMaster()));
    promises.push(new Promise(resolve => this.__bgPlayer = new Tone.Player(bgWav, resolve).toMaster()));
    this.loading = Promise.all(promises);

    this.__beatPlayer.retrigger = true;
    this.__bgPlayer.loop = true;

    this.__titleContent = null;
    this.__titleChanged = false;
    this.__stopped = true;

    this.bpm = null;
  }

  set title(content) {
    if (this.__titleContent !== content) {
      this.__titleChanged = true;
      this.__titleContent = content;
    }
  }

  get title() {
    return this.__titleContent;
  }

  isStarted() {
    return !this.__stopped;
  }

  start() {
    this.__stopped = false;
    this.__beat();
    this.__bgPlayer.start();
  }

  stopBeats() {
    this.__stopped = true;
  }

  stopBg() {
    this.__bgPlayer.stop();
  }

  /* beat-pause-beat-pause... */
  __beat() {
    const ONE_MINUTE = 1000 * 60;
    if (this.__beatTimeout) {
      clearTimeout(this.__beatTimeout);
    }
    if (this.__stopped) return;
    if (!this.bpm) throw new Error();
    this.__beatPlayer.stop();

    let one_beat_duration = this.__beatPlayer.buffer.duration * 1.05 * 1000;

    if (ONE_MINUTE < one_beat_duration * this.bpm) {
      let k = one_beat_duration * this.bpm / ONE_MINUTE;
      one_beat_duration /= k;
      this.__beatPlayer.playbackRate = k;
    }
    let pause = one_beat_duration + (ONE_MINUTE - one_beat_duration * this.bpm) / this.bpm;
    this.__beatPlayer.start();
    this.__triggerHeart(one_beat_duration / 2);
    this.__updateTitle(100);

    this.__beatTimeout = setTimeout(() => this.__beat(), pause);
  }

  __triggerHeart(duration) {
    this.__heartElem.style.transition = '100ms linear';
    if (duration < 200) {
      let k = duration / 200;
      this.__heartElem.style.transition = (100 * k) + 'ms linear';
    }
    this.__heartElem.style.transform = "scale(1.1)";
    setTimeout(() => this.__heartElem.style.transform = "scale(1)", duration - 100);
  }

  __updateTitle(duration) {
    if (!this.__titleChanged) return;
    this.__titleChanged = false;
    this.__titleElem.style.filter = 'blur(3px)';
    this.__titleElem.style.color = 'red';
    setTimeout(() => {
      this.__titleElem.style.filter = '';
      this.__titleElem.style.color = 'white';
      this.__titleElem.innerHTML = this.__titleContent;
    }, duration);
  }
}