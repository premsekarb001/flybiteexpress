import React, { useEffect, useRef } from 'react';
import { DroneTelemetry } from '../../types';
import { ShieldCheck, Battery, Navigation, Wind, Compass } from 'lucide-react';

interface DroneRadarHUDProps {
  drone: DroneTelemetry;
  flightProgress: number; // 0 to 100%
}

export const DroneRadarHUD: React.FC<DroneRadarHUDProps> = ({ drone, flightProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const smoothProgressRef = useRef<number>(flightProgress);

  useEffect(() => {
    let animId: number;
    const animateTarget = () => {
      const diff = flightProgress - smoothProgressRef.current;
      if (Math.abs(diff) > 0.05) {
        smoothProgressRef.current += diff * 0.05;
        animId = requestAnimationFrame(animateTarget);
      } else {
        smoothProgressRef.current = flightProgress;
      }
    };
    animateTarget();
    return () => cancelAnimationFrame(animId);
  }, [flightProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 15;

      ctx.clearRect(0, 0, width, height);

      // Background Radar Circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#090d16';
      ctx.fill();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Concentric Distance Rings (1km, 2km, 3km)
      [0.33, 0.66, 1].forEach((scale) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Axis Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.stroke();

      // Radar Sweep Line
      angle += 0.025;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + 0.35);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Restaurant Hub (Origin)
      const startX = centerX - radius * 0.6;
      const startY = centerY + radius * 0.4;
      ctx.beginPath();
      ctx.arc(startX, startY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316';
      ctx.fill();

      // Customer Landing Pad (Destination)
      const endX = centerX + radius * 0.6;
      const endY = centerY - radius * 0.4;
      ctx.beginPath();
      ctx.arc(endX, endY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Flight Vector Trajectory Line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Interpolated Smooth Drone Position along Vector
      const currentProgress = smoothProgressRef.current;
      const currentDroneX = startX + (endX - startX) * (currentProgress / 100);
      const currentDroneY = startY + (endY - startY) * (currentProgress / 100);

      // Pulse ring around drone
      const pulseSize = 6 + Math.sin(Date.now() / 150) * 4;
      ctx.beginPath();
      ctx.arc(currentDroneX, currentDroneY, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(currentDroneX, currentDroneY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-6 glow-cyan">
      
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>{drone.codeName}</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                {drone.droneId}
              </span>
            </h3>
            <p className="text-xs text-slate-400">{drone.model}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DGCA Green Corridor Clearance</span>
        </div>
      </div>

      {/* Radar Canvas & Telemetry Display */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* HTML5 Canvas Radar */}
        <div className="flex justify-center relative">
          <canvas
            ref={canvasRef}
            width={260}
            height={260}
            className="rounded-full shadow-2xl border border-cyan-500/20"
          />
          <div className="absolute top-2 left-4 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
            RADAR HUD 5.0
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Altitude</span>
            </div>
            <p className="text-lg font-black text-white font-mono">{drone.altitudeMeters} M</p>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Air Speed</span>
            </div>
            <p className="text-lg font-black text-white font-mono">{drone.speedKmh} km/h</p>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span>Battery SOC</span>
            </div>
            <p className="text-lg font-black text-emerald-400 font-mono">{drone.batteryPercent}%</p>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Wind className="w-3.5 h-3.5 text-purple-400" />
              <span>Wind Shear</span>
            </div>
            <p className="text-lg font-black text-white font-mono">{drone.windSpeedKnots} Knots</p>
          </div>
        </div>
      </div>

    </div>
  );
};
