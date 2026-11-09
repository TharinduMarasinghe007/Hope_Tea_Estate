import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, Sparkles, Check, Flame, Clock } from "lucide-react";

// Web Audio API pure bronze tea bell chime
function playTeaBellChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5 harmonic

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 2.6);
  } catch {
    // AudioContext not allowed or not supported; gracefully noop
  }
}

export default function SteepingTimer({
  teaName = "Ceylon Black Tea",
  defaultMinutes = 3,
  temperature = "95°C",
  leafRatio = "2.5g (1 tsp) / 220ml",
}) {
  const initialSeconds = defaultMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(defaultMinutes * 60);
      setIsRunning(false);
      setIsFinished(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [defaultMinutes, teaName]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsFinished(true);
            playTeaBellChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    if (isFinished) {
      setTimeLeft(initialSeconds);
      setIsFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(initialSeconds);
  };

  const add30Seconds = () => {
    setTimeLeft((prev) => prev + 30);
    setIsFinished(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = Math.max(0, Math.min(100, ((initialSeconds - timeLeft) / initialSeconds) * 100));

  return (
    <div className="steeping-assistant-card">
      <div className="assistant-header-row">
        <div className="assistant-badge">
          <Sparkles size={14} />
          <span>ESTATE RITUAL COMPANION</span>
        </div>
        <button
          type="button"
          onClick={playTeaBellChime}
          className="test-chime-btn"
          title="Test Bell Chime"
        >
          <Volume2 size={14} />
          <span>Bell Chime</span>
        </button>
      </div>

      <div className="assistant-body-grid">
        {/* Left: Timer Dial */}
        <div className="assistant-timer-visual">
          <div className={`timer-ring-container ${isRunning ? "steaming" : ""}`}>
            {/* Ambient Steam effect */}
            {isRunning && (
              <div className="steam-container">
                <span className="steam-plume plume-1" />
                <span className="steam-plume plume-2" />
                <span className="steam-plume plume-3" />
              </div>
            )}

            <svg className="timer-svg-circle" viewBox="0 0 120 120">
              <circle
                className="timer-circle-bg"
                cx="60"
                cy="60"
                r="52"
              />
              <circle
                className="timer-circle-progress"
                cx="60"
                cy="60"
                r="52"
                style={{
                  strokeDashoffset: `${326.7 - (326.7 * progressPercent) / 100}px`,
                }}
              />
            </svg>

            <div className="timer-display-digits">
              {isFinished ? (
                <div className="timer-steeped-state">
                  <Check size={28} className="steeped-check" />
                  <span>Steeped!</span>
                </div>
              ) : (
                <>
                  <strong className="timer-numbers">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </strong>
                  <span className="timer-sublabel">
                    {isRunning ? "Steeping..." : "Steep Time"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="timer-controls-row">
            <button
              type="button"
              onClick={toggleTimer}
              className={`timer-main-action-btn ${isRunning ? "btn-pause" : "btn-play"}`}
            >
              {isRunning ? (
                <>
                  <Pause size={15} /> Pause
                </>
              ) : isFinished ? (
                <>
                  <RotateCcw size={15} /> Steep Again
                </>
              ) : (
                <>
                  <Play size={15} /> Start Steeping
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetTimer}
              className="timer-secondary-action-btn"
              title="Reset Timer"
            >
              <RotateCcw size={14} />
            </button>

            <button
              type="button"
              onClick={add30Seconds}
              className="timer-secondary-action-btn timer-add-btn"
              title="Add 30 Seconds"
            >
              +30s
            </button>
          </div>
        </div>

        {/* Right: Sommelier Steep Specs */}
        <div className="assistant-specs-column">
          <h4>Estate Steeping Standards</h4>
          <p className="assistant-subnote">
            Crafted for {teaName}. Hewaheta volcanic soil produces dense polyphenols that blossom best with exact timing.
          </p>

          <div className="specs-list-grid">
            <div className="spec-item-box">
              <div className="spec-icon-wrap">
                <Flame size={16} />
              </div>
              <div className="spec-text-wrap">
                <span>WATER TEMPERATURE</span>
                <strong>{temperature}</strong>
              </div>
            </div>

            <div className="spec-item-box">
              <div className="spec-icon-wrap">
                <Clock size={16} />
              </div>
              <div className="spec-text-wrap">
                <span>RECOMMENDED INFUSION</span>
                <strong>{defaultMinutes} Minutes</strong>
              </div>
            </div>

            <div className="spec-item-box">
              <div className="spec-icon-wrap">
                <Sparkles size={16} />
              </div>
              <div className="spec-text-wrap">
                <span>LEAF-TO-WATER RATIO</span>
                <strong>{leafRatio}</strong>
              </div>
            </div>
          </div>

          <div className="sommelier-tip-box">
            <strong>Sommelier's Tip:</strong>
            <span>Keep your teapot or cup covered during the full {defaultMinutes} minutes to trap the volatile highland aromatic oils.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
