import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

type SalesDataItem = {
  month: string;
  sales: number;
};

interface SalesAnalyticsSectionProps {
  salesData: SalesDataItem[];
}

const SalesAnalyticsSection = ({ salesData }: SalesAnalyticsSectionProps) => (
  <section className="flex-1 bg-white rounded-lg shadow p-6 min-h-[600px] flex flex-col">
    <div className="text-2xl font-bold mb-4">작년 월 매출 현황</div>
    <div className="flex-1 flex items-center">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={salesData}
          margin={{ top: 30, right: 40, left: 40, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2CA87F" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#2CA87F" stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
          <Legend />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#2CA87F"
            fillOpacity={1}
            fill="url(#colorSales)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </section>
);

export default SalesAnalyticsSection; 