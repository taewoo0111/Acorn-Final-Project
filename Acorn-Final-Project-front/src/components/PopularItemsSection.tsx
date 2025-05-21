import { FaCrown, FaUserFriends } from "react-icons/fa";

type Item = {
  cdLecture: string;
  lectureCount: number;
};

interface PopularItemsSectionProps {
  items: Item[];
}

const rankColors = [
  "bg-yellow-400 text-white", // 1등
  "bg-gray-400 text-white",   // 2등
  "bg-orange-400 text-white", // 3등
];

const PopularItemsSection = ({ items }: PopularItemsSectionProps) => {
  // 최소 3개의 항목을 보장하기 위해 빈 항목 추가
  const displayItems = [...items];
  while (displayItems.length < 3) {
    displayItems.push({ cdLecture: '-', lectureCount: 0 });
  }

  return (
    <section className="w-full lg:w-80 bg-white rounded-lg shadow p-6 min-h-[600px] flex flex-col justify-center">
      <div className="text-2xl font-bold mb-4">제일 많이 생성된 강좌</div>
      <ul className="space-y-4 flex-1 flex flex-col justify-center">
        {displayItems.map((item, idx) => (
          <li
            key={`${item.cdLecture}-${idx}`}
            className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover:shadow-md transition-all"
          >
            <span className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg ${rankColors[idx] || "bg-gray-200 text-gray-700"}`}>
              {idx === 0 ? <FaCrown /> : idx + 1}
            </span>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{item.cdLecture}</div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <FaUserFriends className="inline" /> {item.lectureCount || 0}강좌
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PopularItemsSection; 