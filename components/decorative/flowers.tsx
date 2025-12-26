"use client";

export function Flowers() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Flower 1 - Top Left */}
      <div 
        className="absolute top-20 left-10 animate-flower-sway"
        style={{ animationDelay: "0s" }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-30">
          {/* Center */}
          <circle cx="40" cy="40" r="8" fill="hsl(45 95% 60%)" />
          
          {/* Petals */}
          <ellipse cx="40" cy="20" rx="12" ry="18" fill="hsl(340 85% 55%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0s", transformOrigin: "40px 40px" }} />
          <ellipse cx="60" cy="40" rx="18" ry="12" fill="hsl(340 85% 55%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.2s", transformOrigin: "40px 40px" }} />
          <ellipse cx="40" cy="60" rx="12" ry="18" fill="hsl(340 85% 55%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.4s", transformOrigin: "40px 40px" }} />
          <ellipse cx="20" cy="40" rx="18" ry="12" fill="hsl(340 85% 55%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.6s", transformOrigin: "40px 40px" }} />
          
          {/* Diagonal petals */}
          <ellipse cx="28" cy="28" rx="14" ry="14" fill="hsl(330 70% 75%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.3s", transformOrigin: "40px 40px" }} />
          <ellipse cx="52" cy="28" rx="14" ry="14" fill="hsl(330 70% 75%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.5s", transformOrigin: "40px 40px" }} />
          <ellipse cx="52" cy="52" rx="14" ry="14" fill="hsl(330 70% 75%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.7s", transformOrigin: "40px 40px" }} />
          <ellipse cx="28" cy="52" rx="14" ry="14" fill="hsl(330 70% 75%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.1s", transformOrigin: "40px 40px" }} />
        </svg>
      </div>

      {/* Flower 2 - Top Right */}
      <div 
        className="absolute top-32 right-20 animate-flower-sway"
        style={{ animationDelay: "0.8s" }}
      >
        <svg width="100" height="100" viewBox="0 0 80 80" className="opacity-25">
          <circle cx="40" cy="40" r="10" fill="hsl(15 90% 60%)" />
          <ellipse cx="40" cy="18" rx="14" ry="20" fill="hsl(45 95% 60%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.1s", transformOrigin: "40px 40px" }} />
          <ellipse cx="62" cy="40" rx="20" ry="14" fill="hsl(45 95% 60%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.3s", transformOrigin: "40px 40px" }} />
          <ellipse cx="40" cy="62" rx="14" ry="20" fill="hsl(45 95% 60%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.5s", transformOrigin: "40px 40px" }} />
          <ellipse cx="18" cy="40" rx="20" ry="14" fill="hsl(45 95% 60%)" 
            className="animate-petal-flutter" style={{ animationDelay: "0.7s", transformOrigin: "40px 40px" }} />
        </svg>
      </div>

      {/* Flower 3 - Bottom Left */}
      <div 
        className="absolute bottom-24 left-16 animate-flower-quiver"
        style={{ animationDelay: "1.6s" }}
      >
        <svg width="90" height="90" viewBox="0 0 80 80" className="opacity-35">
          <circle cx="40" cy="40" r="9" fill="hsl(280 75% 65%)" />
          <ellipse cx="40" cy="22" rx="13" ry="19" fill="hsl(280 75% 65%)" opacity="0.8"
            className="animate-petal-flutter" style={{ animationDelay: "0.2s", transformOrigin: "40px 40px" }} />
          <ellipse cx="58" cy="40" rx="19" ry="13" fill="hsl(280 75% 65%)" opacity="0.8"
            className="animate-petal-flutter" style={{ animationDelay: "0.4s", transformOrigin: "40px 40px" }} />
          <ellipse cx="40" cy="58" rx="13" ry="19" fill="hsl(280 75% 65%)" opacity="0.8"
            className="animate-petal-flutter" style={{ animationDelay: "0.6s", transformOrigin: "40px 40px" }} />
          <ellipse cx="22" cy="40" rx="19" ry="13" fill="hsl(280 75% 65%)" opacity="0.8"
            className="animate-petal-flutter" style={{ animationDelay: "0.8s", transformOrigin: "40px 40px" }} />
        </svg>
      </div>

      {/* Flower 4 - Bottom Right */}
      <div 
        className="absolute bottom-40 right-24 animate-flower-sway"
        style={{ animationDelay: "2.4s" }}
      >
        <svg width="70" height="70" viewBox="0 0 80 80" className="opacity-40">
          <circle cx="40" cy="40" r="7" fill="hsl(340 85% 55%)" />
          <ellipse cx="40" cy="25" rx="11" ry="16" fill="hsl(330 70% 75%)"
            className="animate-petal-flutter" style={{ animationDelay: "0s", transformOrigin: "40px 40px" }} />
          <ellipse cx="55" cy="40" rx="16" ry="11" fill="hsl(330 70% 75%)"
            className="animate-petal-flutter" style={{ animationDelay: "0.25s", transformOrigin: "40px 40px" }} />
          <ellipse cx="40" cy="55" rx="11" ry="16" fill="hsl(330 70% 75%)"
            className="animate-petal-flutter" style={{ animationDelay: "0.5s", transformOrigin: "40px 40px" }} />
          <ellipse cx="25" cy="40" rx="16" ry="11" fill="hsl(330 70% 75%)"
            className="animate-petal-flutter" style={{ animationDelay: "0.75s", transformOrigin: "40px 40px" }} />
        </svg>
      </div>

      {/* Flower 5 - Center Right */}
      <div 
        className="absolute top-1/2 right-10 -translate-y-1/2 animate-flower-quiver"
        style={{ animationDelay: "3.2s" }}
      >
        <svg width="95" height="95" viewBox="0 0 80 80" className="opacity-30">
          <circle cx="40" cy="40" r="8" fill="hsl(45 95% 60%)" />
          <ellipse cx="40" cy="20" rx="13" ry="18" fill="hsl(145 55% 45%)" opacity="0.6"
            className="animate-petal-flutter" style={{ animationDelay: "0.1s", transformOrigin: "40px 40px" }} />
          <ellipse cx="60" cy="40" rx="18" ry="13" fill="hsl(145 55% 45%)" opacity="0.6"
            className="animate-petal-flutter" style={{ animationDelay: "0.3s", transformOrigin: "40px 40px" }} />
          <ellipse cx="40" cy="60" rx="13" ry="18" fill="hsl(145 55% 45%)" opacity="0.6"
            className="animate-petal-flutter" style={{ animationDelay: "0.5s", transformOrigin: "40px 40px" }} />
          <ellipse cx="20" cy="40" rx="18" ry="13" fill="hsl(145 55% 45%)" opacity="0.6"
            className="animate-petal-flutter" style={{ animationDelay: "0.7s", transformOrigin: "40px 40px" }} />
        </svg>
      </div>

      {/* Mobile - Only show 3 flowers on small screens */}
      <style jsx>{`
        @media (max-width: 768px) {
          .absolute:nth-child(4),
          .absolute:nth-child(5) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
