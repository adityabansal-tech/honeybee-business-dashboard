import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

const COLORS = ["#D98E04", "#2F4550", "#5C7A5C", "#B5533C", "#8A7FBA", "#C7A24D"];

export default function BarChartCard({ title, note, data, fullWidth, horizontal }) {
  return (
    <div className={`chart-card ${fullWidth ? "full-width" : ""}`}>
      <h2>{title}</h2>
      {note && <div className="chart-note">{note}</div>}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ top: 8, right: 12, left: horizontal ? 40 : 0, bottom: 8 }}
        >
          <CartesianGrid stroke="#E8E2D4" vertical={!horizontal} horizontal={horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" tick={{ fontSize: 12, fill: "#6B6459" }} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: "#201C16" }} width={110} />
            </>
          ) : (
            <>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B6459" }} interval={0} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12, fill: "#6B6459" }} />
            </>
          )}
          <Tooltip
            contentStyle={{ borderRadius: 10, border: "1px solid #E8E2D4", fontSize: 13 }}
            cursor={{ fill: "rgba(217,142,4,0.06)" }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
