import { PROCESS_STATUS_CONFIG, ProcessStatus } from '../types';
import { Check } from 'lucide-react';

interface ProcessProgressBarProps {
  status: ProcessStatus;
  progress: number;
}

export function ProcessProgressBar({ status, progress }: ProcessProgressBarProps) {
  const stages = Object.entries(PROCESS_STATUS_CONFIG);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        {stages.map(([key, config], index) => {
          const isActive = config.progress <= progress;
          const isCurrent = config.progress === progress;

          return (
            <div key={key} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div
                    className={`flex-1 h-1 transition-colors duration-300 ${
                      isActive ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600 text-white scale-110'
                      : 'bg-gray-300 text-gray-600'
                  } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
                >
                  {isActive && config.progress < progress ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-bold">{config.progress}%</span>
                  )}
                </div>
                {index < stages.length - 1 && (
                  <div
                    className={`flex-1 h-1 transition-colors duration-300 ${
                      config.progress < progress ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
              <p
                className={`text-xs mt-2 text-center font-medium transition-colors duration-300 ${
                  isCurrent ? 'text-blue-600 font-bold' : isActive ? 'text-gray-700' : 'text-gray-500'
                }`}
              >
                {config.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <p className="text-sm text-gray-600">Início</p>
        <p className="text-sm font-bold text-blue-600">{progress}% Concluído</p>
        <p className="text-sm text-gray-600">Conclusão</p>
      </div>
    </div>
  );
}
