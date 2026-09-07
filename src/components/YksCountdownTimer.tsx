import React, { useState, useEffect } from 'react';
import { Timer, Sparkles } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const YksCountdownTimer: React.FC = () => {
  // Target: YKS 2027 - 19 June 2027, 10:15 AM (UTC+3)
  const targetDate = useMemoTargetDate();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="yks-countdown-banner">
      <div className="yks-banner-header">
        <div className="yks-title-group">
          <Timer className="yks-timer-icon" />
          <span className="yks-title">2027 YKS'ye Kalan Süre</span>
          <Sparkles className="yks-sparkle-icon" />
        </div>
        <span className="yks-target-date">19 Haziran 2027 • 10:15</span>
      </div>

      <div className="yks-countdown-grid">
        <div className="yks-time-box">
          <span className="yks-num">{padZero(timeLeft.days)}</span>
          <span className="yks-label">GÜN</span>
        </div>
        <span className="yks-colon">:</span>
        <div className="yks-time-box">
          <span className="yks-num">{padZero(timeLeft.hours)}</span>
          <span className="yks-label">SAAT</span>
        </div>
        <span className="yks-colon">:</span>
        <div className="yks-time-box">
          <span className="yks-num">{padZero(timeLeft.minutes)}</span>
          <span className="yks-label">DAKİKA</span>
        </div>
        <span className="yks-colon">:</span>
        <div className="yks-time-box yks-sec-box">
          <span className="yks-num">{padZero(timeLeft.seconds)}</span>
          <span className="yks-label">SANİYE</span>
        </div>
      </div>
    </div>
  );
};

function useMemoTargetDate() {
  // 19 June 2027, 10:15:00 Local Time
  return new Date(2027, 5, 19, 10, 15, 0).getTime();
}

function calculateTimeLeft(targetTimestamp: number): TimeLeft {
  const now = Date.now();
  const diff = targetTimestamp - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}
