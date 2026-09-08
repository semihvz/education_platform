import React, { useState, useEffect } from 'react';
import { Timer, Sparkles, Skull } from 'lucide-react';

interface TimeLeft {
  years?: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const YKS_2027_TARGET = new Date(2027, 5, 19, 10, 15, 0).getTime();
const YKS_2028_TARGET = new Date(2028, 5, 17, 10, 15, 0).getTime();
const TARGET_15_YEAR = new Date(2041, 8, 9, 0, 0, 0).getTime(); // 15 Yıllık Ölüm Sayacı (9 Eylül 2041)

export const YksCountdownTimer: React.FC = () => {
  const [time2027, setTime2027] = useState<TimeLeft>(() => calculateTimeLeft(YKS_2027_TARGET));
  const [time2028, setTime2028] = useState<TimeLeft>(() => calculateTimeLeft(YKS_2028_TARGET));
  const [time15Year, setTime15Year] = useState<TimeLeft>(() => calculateTimeLeftWithYears(TARGET_15_YEAR));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime2027(calculateTimeLeft(YKS_2027_TARGET));
      setTime2028(calculateTimeLeft(YKS_2028_TARGET));
      setTime15Year(calculateTimeLeftWithYears(TARGET_15_YEAR));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="yks-dual-countdown-container">
      {/* 2027 YKS Countdown */}
      <div className="yks-countdown-banner yks-banner-2027">
        <div className="yks-banner-header">
          <div className="yks-title-group">
            <Timer className="yks-timer-icon icon-2027" />
            <span className="yks-title">Countdown to 2027 YKS Exam</span>
            <Sparkles className="yks-sparkle-icon" />
          </div>
          <span className="yks-target-date">June 19, 2027 • 10:15 AM</span>
        </div>

        <div className="yks-countdown-grid">
          <div className="yks-time-box">
            <span className="yks-num">{padZero(time2027.days)}</span>
            <span className="yks-label">DAYS</span>
          </div>
          <span className="yks-colon">:</span>
          <div className="yks-time-box">
            <span className="yks-num">{padZero(time2027.hours)}</span>
            <span className="yks-label">HOURS</span>
          </div>
          <span className="yks-colon">:</span>
          <div className="yks-time-box">
            <span className="yks-num">{padZero(time2027.minutes)}</span>
            <span className="yks-label">MINS</span>
          </div>
          <span className="yks-colon">:</span>
          <div className="yks-time-box yks-sec-box">
            <span className="yks-num">{padZero(time2027.seconds)}</span>
            <span className="yks-label">SECS</span>
          </div>
        </div>
      </div>

      {/* 2028 YKS Countdown */}
      <div className="yks-countdown-banner yks-banner-2028">
        <div className="yks-banner-header">
          <div className="yks-title-group">
            <Timer className="yks-timer-icon icon-2028" />
            <span className="yks-title">Countdown to 2028 YKS Exam</span>
            <Sparkles className="yks-sparkle-icon" />
          </div>
          <span className="yks-target-date">June 17, 2028 • 10:15 AM</span>
        </div>

        <div className="yks-countdown-grid">
          <div className="yks-time-box">
            <span className="yks-num">{padZero(time2028.days)}</span>
            <span className="yks-label">DAYS</span>
          </div>
          <span className="yks-colon">:</span>
          <div className="yks-time-box">
            <span className="yks-num">{padZero(time2028.hours)}</span>
            <span className="yks-label">HOURS</span>
          </div>
          <span className="yks-colon">:</span>
          <div className="yks-time-box">
            <span className="yks-num">{padZero(time2028.minutes)}</span>
            <span className="yks-label">MINS</span>
          </div>
          <span className="yks-colon">:</span>
          <div className="yks-time-box yks-sec-box">
            <span className="yks-num">{padZero(time2028.seconds)}</span>
            <span className="yks-label">SECS</span>
          </div>
        </div>
      </div>

      {/* 15-Year Memento Mori Timer */}
      <div className="yks-countdown-banner yks-banner-15year">
        <div className="yks-banner-header">
          <div className="yks-title-group">
            <Skull className="yks-timer-icon icon-15year" />
            <span className="yks-title">15-Year Memento Mori Timer</span>
            <Sparkles className="yks-sparkle-icon" />
          </div>
          <span className="yks-target-date">Sep 9, 2041 • Remaining Life & Time</span>
        </div>

        <div className="yks-countdown-grid">
          <div className="yks-time-box">
            <span className="yks-num">{padZero(time15Year.years || 0)}</span>
            <span className="yks-label">YEARS</span>
          </div>
          <span className="yks-colon">:</span>
          <div className="yks-time-box">
            <span className="yks-num">{padZero(time15Year.days)}</span>
            <span className="yks-label">DAYS</span>
          </div>
          <span className="yks-colon">:</span>
          <div className="yks-time-box">
            <span className="yks-num">{padZero(time15Year.hours)}</span>
            <span className="yks-label">HOURS</span>
          </div>
          <span className="yks-colon">:</span>
          <div className="yks-time-box">
            <span className="yks-num">{padZero(time15Year.minutes)}</span>
            <span className="yks-label">MINS</span>
          </div>
          <span className="yks-colon">:</span>
          <div className="yks-time-box yks-sec-box">
            <span className="yks-num">{padZero(time15Year.seconds)}</span>
            <span className="yks-label">SECS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

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

function calculateTimeLeftWithYears(targetTimestamp: number): TimeLeft {
  const now = Date.now();
  const diff = targetTimestamp - now;

  if (diff <= 0) {
    return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const msPerDay = 1000 * 60 * 60 * 24;

  const years = Math.floor(diff / msPerYear);
  const remainingAfterYears = diff % msPerYear;
  const days = Math.floor(remainingAfterYears / msPerDay);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { years, days, hours, minutes, seconds };
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}


