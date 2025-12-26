"use client";

export function Bees() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Bee 1 - Figure-8 pattern */}
      <div 
        className="absolute top-1/3 left-1/4 animate-bee-figure8"
        style={{ animationDelay: "0s" }}
      >
        <div className="relative">
          {/* Bee body */}
          <div className="flex items-center gap-0.5">
            {/* Head */}
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
            
            {/* Body segments */}
            <div className="flex flex-col gap-0.5">
              <div className="w-5 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500" 
                style={{ 
                  background: "repeating-linear-gradient(90deg, hsl(45 95% 60%) 0px, hsl(45 95% 60%) 3px, hsl(25 30% 12%) 3px, hsl(25 30% 12%) 4px)"
                }}
              />
            </div>
          </div>

          {/* Wings with buzz animation */}
          <div className="absolute -top-1 left-2">
            <div className="flex gap-1">
              <div 
                className="w-4 h-3 rounded-full bg-white/40 border border-white/60 animate-wing-buzz"
                style={{ animationDelay: "0s" }}
              />
              <div 
                className="w-4 h-3 rounded-full bg-white/40 border border-white/60 animate-wing-buzz"
                style={{ animationDelay: "0.05s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bee 2 - Linear flight path */}
      <div 
        className="absolute top-1/2 left-0 animate-bee-flight"
        style={{ animationDelay: "3s" }}
      >
        <div className="relative animate-bee-hover">
          {/* Bee body */}
          <div className="flex items-center gap-0.5">
            {/* Head */}
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
            
            {/* Body with stripes */}
            <div className="w-5 h-2 rounded-full" 
              style={{ 
                background: "repeating-linear-gradient(90deg, hsl(45 95% 60%) 0px, hsl(45 95% 60%) 3px, hsl(25 30% 12%) 3px, hsl(25 30% 12%) 4px)"
              }}
            />
          </div>

          {/* Wings */}
          <div className="absolute -top-1 left-2">
            <div className="flex gap-1">
              <div 
                className="w-4 h-3 rounded-full bg-white/40 border border-white/60 animate-wing-buzz"
                style={{ animationDelay: "0s" }}
              />
              <div 
                className="w-4 h-3 rounded-full bg-white/40 border border-white/60 animate-wing-buzz"
                style={{ animationDelay: "0.05s" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hide second bee on mobile for performance */}
      <style jsx>{`
        @media (max-width: 768px) {
          .absolute:nth-child(2) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
