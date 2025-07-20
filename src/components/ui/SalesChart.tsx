// components/SalesChart.tsx

'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { FC, memo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface SalesChartProps {
    data: ChartData<'line'>;
    options: ChartOptions<'line'>;
}

const SalesChart: FC<SalesChartProps> = ({ data, options }) => {
    return (
        <div className="p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Total Sales</h2>
            </div>
            <div className="h-[240px] w-full">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default memo(SalesChart);
