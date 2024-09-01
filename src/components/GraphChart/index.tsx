import type { FC } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./index.module.scss";

type GraphChartProps = {
  data: {
    x: number;
    y: number;
  }[];
};

const GraphChart: FC<GraphChartProps> = ({ data }) => {
  return (
    <div className={styles["graph-chart"]}>
      <LineChart
        width={730}
        height={250}
        data={[{ x: 0, y: 0 }, ...data]}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          dot={false}
          name="差玉"
        />
      </LineChart>
    </div>
  );
};

export default GraphChart;
