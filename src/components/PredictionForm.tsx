import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Activity, Gauge, Thermometer, RotateCw, Settings2, Timer, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

interface FormData {
  type: string;
  airTemp: string;
  processTemp: string;
  rotSpeed: string;
  torque: string;
  toolWear: string;
  timeframe: string;
}

interface PredictionResult {
  prediction: number;
  failure_probability: number;
  result: string;
  risk_window?: string;
  selected_timeframe?: string;
}

interface PredictionFormProps {
  onResult: (result: PredictionResult) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
}

const initialFormData: FormData = {
  type: "",
  airTemp: "",
  processTemp: "",
  rotSpeed: "",
  torque: "",
  toolWear: "",
  timeframe: "24h",
};

const healthyExample: FormData = {
  type: "M",
  airTemp: "300",
  processTemp: "310",
  rotSpeed: "1500",
  torque: "40",
  toolWear: "100",
  timeframe: "24h",
};

const failureRiskExample: FormData = {
  type: "L",
  airTemp: "305",
  processTemp: "315",
  rotSpeed: "1200",
  torque: "70",
  toolWear: "220",
  timeframe: "7d",
};

export function PredictionForm({ onResult, onLoading, onError }: PredictionFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onError(null);
  };

  const handleHealthyExample = () => {
    setFormData(healthyExample);
    onError(null);
  };

  const handleFailureRiskExample = () => {
    setFormData(failureRiskExample);
    onError(null);
  };

  const validateForm = (): boolean => {
    const { type, airTemp, processTemp, rotSpeed, torque, toolWear } = formData;
    if (!type || !airTemp || !processTemp || !rotSpeed || !torque || !toolWear) {
      onError("Please fill all fields");
      return false;
    }
    return true;
  };

  const handlePredict = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    onLoading(true);
    onError(null);

    try {
      const response = await fetch("https://machine-failure-backend.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.type,
          air_temp: parseFloat(formData.airTemp),
          process_temp: parseFloat(formData.processTemp),
          rot_speed: parseFloat(formData.rotSpeed),
          torque: parseFloat(formData.torque),
          tool_wear: parseFloat(formData.toolWear),
          timeframe: formData.timeframe,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const result: PredictionResult = await response.json();
      onResult(result);
    } catch (err) {
      onError("Failed to connect to prediction service. Please try again.");
    } finally {
      setIsLoading(false);
      onLoading(false);
    }
  };

  return (
    <Card className="card-industrial w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Sensor Data Input</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter machine parameters for health analysis
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Machine Type */}
        <div className="space-y-2">
          <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            Machine Type
          </Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
            <SelectTrigger className="input-industrial h-11">
              <SelectValue placeholder="Select machine type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">L - Low Quality</SelectItem>
              <SelectItem value="M">M - Medium Quality</SelectItem>
              <SelectItem value="H">H - High Quality</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Temperature Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="airTemp" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              Air Temperature [K]
            </Label>
            <Input
              id="airTemp"
              type="number"
              placeholder="e.g., 300"
              value={formData.airTemp}
              onChange={(e) => handleInputChange("airTemp", e.target.value)}
              className="input-industrial h-11 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="processTemp" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              Process Temperature [K]
            </Label>
            <Input
              id="processTemp"
              type="number"
              placeholder="e.g., 310"
              value={formData.processTemp}
              onChange={(e) => handleInputChange("processTemp", e.target.value)}
              className="input-industrial h-11 font-mono"
            />
          </div>
        </div>

        {/* Speed and Torque */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rotSpeed" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <RotateCw className="w-4 h-4 text-muted-foreground" />
              Rotational Speed [rpm]
            </Label>
            <Input
              id="rotSpeed"
              type="number"
              placeholder="e.g., 1500"
              value={formData.rotSpeed}
              onChange={(e) => handleInputChange("rotSpeed", e.target.value)}
              className="input-industrial h-11 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="torque" className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              Torque [Nm]
            </Label>
            <Input
              id="torque"
              type="number"
              placeholder="e.g., 40"
              value={formData.torque}
              onChange={(e) => handleInputChange("torque", e.target.value)}
              className="input-industrial h-11 font-mono"
            />
          </div>
        </div>

        {/* Tool Wear */}
        <div className="space-y-2">
          <Label htmlFor="toolWear" className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Timer className="w-4 h-4 text-muted-foreground" />
            Tool Wear [min]
          </Label>
          <Input
            id="toolWear"
            type="number"
            placeholder="e.g., 100"
            value={formData.toolWear}
            onChange={(e) => handleInputChange("toolWear", e.target.value)}
            className="input-industrial h-11 font-mono"
          />
        </div>

        {/* Prediction Timeframe */}
        <div className="space-y-2">
          <Label htmlFor="timeframe" className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Prediction Timeframe
          </Label>
          <Select value={formData.timeframe} onValueChange={(value) => handleInputChange("timeframe", value)}>
            <SelectTrigger className="input-industrial h-11">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Next 24 hours</SelectItem>
              <SelectItem value="7d">Next 7 days</SelectItem>
              <SelectItem value="30d">Next 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handlePredict}
            disabled={isLoading}
            className="flex-1 h-12 btn-primary-glow text-primary-foreground font-semibold transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 mr-2" />
                Predict
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleHealthyExample}
            disabled={isLoading}
            className="flex-1 h-12 border-success/50 text-success hover:bg-success/10 font-medium transition-all duration-200"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Healthy Example
          </Button>
          <Button
            variant="outline"
            onClick={handleFailureRiskExample}
            disabled={isLoading}
            className="flex-1 h-12 border-danger/50 text-danger hover:bg-danger/10 font-medium transition-all duration-200"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Failure Risk Example
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
