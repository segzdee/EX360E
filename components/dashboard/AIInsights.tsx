import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar as BarChart, Line as LineChart } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react'

interface AIInsightsProps {
  metrics: any
  predictions: any
  anomalies: any[]
}

export function AIInsights({ metrics, predictions, anomalies }: AIInsightsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>User Satisfaction</span>
              <span className="text-green-600 font-medium">{metrics.satisfaction}%</span>
            </div>
            <BarChart
              data={metrics.sentimentTrend}
              categories={['Positive', 'Neutral', 'Negative']}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Demand Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Next 24h Prediction</span>
              <span className="text-blue-600 font-medium">
                {predictions.staffDemand}
              </span>
            </div>
            <LineChart
              data={predictions.demandTrend}
              categories={['Predicted', 'Actual']}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Anomaly Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalies.map((anomaly, index) => (
              <Alert key={index} variant={anomaly.severity}>
                <AlertTitle>{anomaly.metric}</AlertTitle>
                <AlertDescription>
                  {anomaly.description}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

