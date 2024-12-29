import React, { useEffect } from 'react';

export const FinalScore: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('animate-final-bg');
    return () => {
      document.body.classList.remove('animate-final-bg');
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 animate-glow">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 opacity-30 blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 mb-8 relative">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl animate-logo-pulse"></div> */}
            {/* <div className="absolute inset-2 bg-black rounded-lg"></div> */}
            {/* <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-blue-500 tech-font">链</div> */}
          </div>
          <div className="text-center relative">
            <h1 className="text-5xl font-bold tracking-wider company-text tech-font relative overflow-hidden">
              <span className="relative inline-block">
                链接生涯
                <div className="light-beam"></div>
              </span>
            </h1>
            <div className="h-0.5 w-full mt-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <p className="mt-4 text-gray-400 tracking-widest text-sm uppercase tech-font">
              CONNECT YOUR FUTURE
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      </div>
    </div>
  );
}; 