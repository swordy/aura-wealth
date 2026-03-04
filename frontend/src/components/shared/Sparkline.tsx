interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

export default function Sparkline({ data, width = 80, height = 24, positive = true }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;
  const fillPath = `${linePath} L${width},${height} L0,${height} Z`;

  const color = positive ? "#4ADE80" : "#F87171";
  const fillColor = positive ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)";

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block">
      <path d={fillPath} fill={fillColor} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}
