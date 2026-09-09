import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, X, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Start camera stream when modal opens or facingMode changes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsInitializing(false);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Kamera erişim izni reddedildi. Lütfen tarayıcı izinlerini kontrol edin.'
          : 'Kamera açılamadı veya cihazınızda kullanılabilir kamera bulunamadı.'
      );
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleTakeSnap = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions equal to current video stream
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if front camera for natural mirror effect
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      onClose();
    }
  };

  const handleFallbackFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Fotoğraf boyutu çok yüksek (Maksimum 8 MB).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onCapture(reader.result as string);
      stopCamera();
      onClose();
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="camera-modal-backdrop" onClick={onClose}>
      <div className="camera-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="camera-modal-header">
          <div className="camera-modal-title">
            <Camera className="icon-camera text-indigo" />
            <span>Fotoğraf Çek / Foto Ekle</span>
          </div>
          <button className="camera-close-btn" onClick={onClose} title="Kapat">
            <X />
          </button>
        </div>

        {/* Viewfinder Body */}
        <div className="camera-viewfinder-box">
          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {capturedImage ? (
            /* Captured Snapshot Preview */
            <div className="captured-snap-wrapper">
              <img src={capturedImage} alt="Captured Snap" className="captured-snap-img" />
              <div className="snap-badge">📸 Çekilen Fotoğraf</div>
            </div>
          ) : cameraError ? (
            /* Camera Permission / Access Error Fallback */
            <div className="camera-error-box">
              <AlertCircle className="error-icon" />
              <p className="error-text">{cameraError}</p>
              <div className="fallback-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  id="camera-fallback-file"
                  className="hidden-file-input"
                  onChange={handleFallbackFileUpload}
                />
                <label htmlFor="camera-fallback-file" className="fallback-upload-btn">
                  <ImageIcon className="btn-icon" />
                  <span>Cihaz Galerisinden Fotoğraf Seç</span>
                </label>
              </div>
            </div>
          ) : (
            /* Live Camera Feed */
            <div className="live-video-wrapper">
              {isInitializing && (
                <div className="camera-loading-overlay">
                  <RefreshCw className="spinner-icon" />
                  <span>Kamera Başlatılıyor...</span>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`camera-video-feed ${facingMode === 'user' ? 'mirror-mode' : ''}`}
              />
              
              {/* Camera Grid Overlay */}
              <div className="camera-grid-lines">
                <div className="grid-line horizontal-1"></div>
                <div className="grid-line horizontal-2"></div>
                <div className="grid-line vertical-1"></div>
                <div className="grid-line vertical-2"></div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="camera-action-bar">
          {capturedImage ? (
            <>
              <button type="button" className="camera-btn retake-btn" onClick={handleRetake}>
                <RefreshCw className="btn-icon-sm" />
                <span>Tekrar Çek</span>
              </button>
              <button type="button" className="camera-btn confirm-btn" onClick={handleConfirmPhoto}>
                <Check className="btn-icon-sm" />
                <span>Fotoğrafı Kullan</span>
              </button>
            </>
          ) : !cameraError ? (
            <>
              <button
                type="button"
                className="camera-btn flip-btn"
                onClick={handleFlipCamera}
                title="Kamerayı Değiştir"
              >
                <RefreshCw className="btn-icon-sm" />
                <span>Kamera Çevir</span>
              </button>

              <button
                type="button"
                className="shutter-trigger-btn"
                onClick={handleTakeSnap}
                title="Fotoğraf Çek"
                disabled={isInitializing}
              >
                <div className="shutter-inner-circle"></div>
              </button>

              <div className="gallery-fallback-btn-box">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  id="camera-action-file"
                  className="hidden-file-input"
                  onChange={handleFallbackFileUpload}
                />
                <label htmlFor="camera-action-file" className="camera-btn gallery-btn" title="Galeriden Seç">
                  <ImageIcon className="btn-icon-sm" />
                  <span>Galeri</span>
                </label>
              </div>
            </>
          ) : (
            <button type="button" className="camera-btn retake-btn" onClick={startCamera}>
              <RefreshCw className="btn-icon-sm" />
              <span>Kamerayı Yeniden Dene</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
