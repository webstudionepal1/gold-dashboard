import React, { Suspense, lazy } from 'react';
import { ChartData, ChartOptions } from 'chart.js';

// Lazy load chart components
const LazySalesChart = lazy(() => import('./SalesChart'));
const LazyBarChart = lazy(() => import('./BarChart'));
const LazyDonutChart = lazy(() => import('./DonutChart'));

interface LazyChartProps {
  type: 'sales' | 'bar' | 'donut';
  data: ChartData<any>;
  options?: ChartOptions<any>;
}

const ChartFallback = () => (
  <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const LazyChart: React.FC<LazyChartProps> = ({ type, data, options }) => {
  const renderChart = () => {
    switch (type) {
      case 'sales':
        return <LazySalesChart data={data} options={options} />;
      case 'bar':
        return <LazyBarChart data={data} options={options} />;
      case 'donut':
        return <LazyDonutChart data={data} options={options} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <Suspense fallback={<ChartFallback />}>
      {renderChart()}
    </Suspense>
  );
};

export default LazyChart;