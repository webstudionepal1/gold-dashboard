
import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
    data: any;
    options: any;
}

const BarChart = ({ data, options }: BarChartProps) => {
    return <Bar data={data} options={options} />;
};

export default React.memo(BarChart);
