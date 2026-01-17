import { Cpu, Activity } from "lucide-react";

export function Header() {
  return (
    <header className="text-center space-y-4 mb-8">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full"></div>
          <div className="relative p-3 rounded-xl bg-primary/10 border border-primary/30">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-primary tracking-tight">
        Machine Failure Prediction System
      </h1>
      
      <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
        Enter sensor data to predict machine health and prevent breakdowns.
      </p>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="status-indicator status-online"></div>
        <span>System Online</span>
        <span className="text-border">•</span>
        <Activity className="w-4 h-4" />
        <span>Real-time Analysis</span>
      </div>
    </header>
  );
}
