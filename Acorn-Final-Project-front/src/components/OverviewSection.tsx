type OverviewItem = {
  title: string;
  value: string;
  color: string;
};

interface OverviewSectionProps {
  overview: OverviewItem[];
}

const OverviewSection = ({ overview }: OverviewSectionProps) => (
  <div className="mb-2">
    <div className="text-2xl font-bold text-gray-700 mb-4">개요</div>
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {overview.map((o) => (
        <div
          key={o.title}
          className="
            bg-white rounded-3xl shadow p-6 flex flex-col justify-center min-h-[180px]
            transition-all duration-200
            hover:shadow-lg hover:scale-105 cursor-pointer
          "
        >
          <span className="text-gray-500 text-sm mb-1">{o.title}</span>
          <span className={`text-2xl font-bold ${o.color}`}>
            {o.value}
          </span>
        </div>
      ))}
    </section>
  </div>
);

export default OverviewSection; 