"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function Chart({ data, index, categories, colors, className, showLegend }) {
  return (
    <ResponsiveContainer width="100%" height={300} className={className}>
      <BarChart data={data}>
        <XAxis dataKey={index} stroke="#888888" fontSize={12} />
        <YAxis stroke="#888888" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        {categories.map((cat, i) => (
          <Bar key={cat} dataKey={cat} fill={colors[i] || "#8884d8"} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-md border bg-background p-2 shadow-sm">
      {payload.map((item, i) => (
        <div key={i} className="text-sm text-muted-foreground">
          <span className="font-medium">{item.name}:</span> {item.value}
        </div>
      ))}
    </div>
  );
}

export const ChartTooltip = ({ content }) => content;
export const ChartTooltipContent = () => null;
