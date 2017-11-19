document.addEventListener('DOMContentLoaded', function () {
  const WAV_SRC = 'assets/one_beat400.wav';
  const WAV_BG_SRC = 'assets/beat_bg_loud.wav';

  const MAX_HEARTBEAT = 200;
  const MIN_HEARTBEAT = 20;

  const DURATION_MIN = 2000;
  const DURATION_MAX = 2500;

  /* loaded earlier */
  let DATA = window.DATA;

  let max = Math.max(...(DATA.map(k => k[1])));
  let min = Math.min(...(DATA.map(k => k[1])));
  let nData = DATA.map(([date, val]) => (val - min) / (max - min) * (MAX_HEARTBEAT - MIN_HEARTBEAT) + MIN_HEARTBEAT);

  let heartbeat = new Heartbeat('heart', 'title', WAV_SRC, WAV_BG_SRC);

  function upd(k) {
    if (k >= nData.length) {
      heartbeat.stopBeats();
      document.getElementById('title-wrapper').className += 'hidden';
      document.getElementById('container').className += 'hidden';
      document.getElementById('shareRoundIcons').className += 'hidden';
      document.getElementById('last-state').className = '';
      return;
    }

    let duration = (DURATION_MAX - DURATION_MIN) * (nData.length - k - 1) / nData.length + DURATION_MIN;
    heartbeat.bpm = nData[k];
    heartbeat.title = `${DATA[k][0]}<br/>${numeral(DATA[k][1]).format('0,0')} transactions per month`;
    if (!heartbeat.isStarted()) {
      heartbeat.start();
    }
    setTimeout(() => upd(k + 1), duration);
  }

  window.heartbeat = heartbeat;

  heartbeat.loading.then(() => upd(0));
});
