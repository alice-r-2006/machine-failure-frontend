import { AlertTriangle, CheckCircle2, Activity, Wrench } from "lucide-react";

interface PredictionResultProps {
  prediction: number;
  failureProbability: number;
  result: string;
}

export function PredictionResult({ prediction, failureProbability, result }: PredictionResultProps) {
  const isFailure = prediction === 1;

  return (
    <div className={`w-full max-w-2xl mx-auto rounded-xl p-6 animate-slide-up ${
      isFailure ? 'result-danger' : 'result-success'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${
          isFailure ? 'bg-white/20' : 'bg-white/20'
        }`}>
          {isFailure ? (
            <AlertTriangle className="w-8 h-8 text-white" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-white" />
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {isFailure ? "⚠️ Machine Failure Predicted" : "✅ No Failure Predicted"}
            </h3>
            <p className="text-white/80 mt-1">{result}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Probability Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-white/70" />
                <span className="text-sm font-medium text-white/70">Failure Probability</span>
              </div>
              <p className="text-3xl font-bold font-mono text-white">
                {failureProbability.toFixed(1)}%
              </p>
            </div>

            {/* Recommendation Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-4 h-4 text-white/70" />
                <span className="text-sm font-medium text-white/70">Recommendation</span>
              </div>
              <p className="text-sm font-medium text-white">
                {isFailure 
                  ? "Schedule maintenance immediately."
                  : "Machine is healthy. Continue monitoring."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
