import { useState } from "react";
import { Header } from "@/components/Header";
import { PredictionForm } from "@/components/PredictionForm";
import { PredictionResult } from "@/components/PredictionResult";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface Result {
  prediction: number;
  failure_probability: number;
  result: string;
  risk_window?: string;
  selected_timeframe?: string;
}

const Index = () => {
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResult = (newResult: Result) => {
    setResult(newResult);
    setError(null);
  };

  return (
    <div className="min-h-screen industrial-grid">
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Header />

        <main className="space-y-6">
          {error && (
            <Alert variant="destructive" className="max-w-2xl mx-auto bg-destructive/10 border-destructive/30 animate-slide-up">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-destructive-foreground">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <PredictionForm
            onResult={handleResult}
            onLoading={setIsLoading}
            onError={setError}
          />

          {isLoading && (
            <div className="flex items-center justify-center gap-3 py-8 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-lg font-medium">Analyzing sensor data...</span>
            </div>
          )}

          {result && !isLoading && (
            <PredictionResult
              prediction={result.prediction}
              failureProbability={result.failure_probability}
              result={result.result}
              riskWindow={result.risk_window}
              selectedTimeframe={result.selected_timeframe}
            />
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Predictive Maintenance System • Industrial IoT Analytics</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
