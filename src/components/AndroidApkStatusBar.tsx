import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Smartphone, 
  Download, 
  Check, 
  Sparkles,
  Signal
} from 'lucide-react';

export const AndroidApkStatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).replace(' ', '')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateInstall = () => {
    setIsInstalled(true);
    setTimeout(() => {
      setShowInstallBanner(false);
    }, 2000);
  };

  return (
    <div className="w-full bg-slate-900 text-slate-200 select-none z-30">
      {/* Android Native Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 text-[11px] font-mono font-medium tracking-wide">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-white">{currentTime || '10:05 AM'}</span>
          <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-1 py-0.2 rounded font-bold">5G</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-[10px] font-semibold text-emerald-400">Jio True 5G</span>
          <Signal className="w-3 h-3 text-slate-200 fill-slate-200" />
          <Wifi className="w-3 h-3 text-slate-200" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] font-bold text-slate-200">98%</span>
            <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* APK Notice strip / Quick APK badge */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 px-4 py-1 border-t border-b border-indigo-800/40 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-tight">DataSell APK v3.4.2</span>
          <span className="text-[9px] text-indigo-200 bg-indigo-800/50 px-1.5 py-0.5 rounded font-mono">
            SECURE
          </span>
        </div>

        <button
          onClick={() => setShowInstallBanner(!showInstallBanner)}
          className="flex items-center gap-1 text-[10px] font-extrabold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>{isInstalled ? 'APK Installed' : 'Get APK App'}</span>
        </button>
      </div>

      {/* Slide-down APK Install Banner */}
      {showInstallBanner && (
        <div className="bg-slate-800 p-3 border-b border-slate-700 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">DataSell Official Mobile APK</p>
                <p className="text-[10px] text-slate-300">Install native app on Android & iOS home screen.</p>
              </div>
            </div>

            <button
              onClick={handleSimulateInstall}
              disabled={isInstalled}
              className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 transition-all ${
                isInstalled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
              }`}
            >
              {isInstalled ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isInstalled ? 'Installed' : 'Install APK'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
