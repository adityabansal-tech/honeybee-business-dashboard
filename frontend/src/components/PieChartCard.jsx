import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#D98E04", "#2F4550", "#5C7A5C", "#B5533C", "#8A7FBA"];

export default function PieChartCard({ title, note, data }) {
  return (
    <div className="chart-card">
      <h2>{title}</h2>
      {note && <div className="chart-note">{note}</div>}
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E8E2D4", fontSize: 13 }} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: 12.5, color: "#6B6459" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
