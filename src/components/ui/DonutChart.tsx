import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
    data: ChartData<'doughnut'>;
    options?: ChartOptions<'doughnut'>;
}

export const DonutChart = ({ data, options }: DonutChartProps) => {
    return (
        <div className="w-32 h-32">
            <Doughnut data={data} options={options} />
        </div>
    );
};
