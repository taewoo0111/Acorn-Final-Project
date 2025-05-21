import { Home, ShoppingCart, Percent, SpellCheck2, StickyNote, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const menuItems = [
    { name: "대시보드", icon: Home, path: "/ceo" },
    {
        name: "기본 관리",
        icon: SpellCheck2,
        subItems: [
            { name: "코드 관리", path: "/ceo/code" },
            { name: "학원 관리", path: "/ceo/store" }
        ]
    },
    { name: "공지사항", icon: StickyNote, path: "/posts" },
    { 
        name: "발주 관리", 
        icon: ShoppingCart,
        path: "ceo 발주관리 경로",
        subItems: [
            { name: "발주 품목 관리", path: "/ceo/product" },
            { name: "발주 현황", path: "/ceo/orders" }
            // { name: "발주 승인/반려", path: "ceo 발주승인반려 경로" }
        ] 
    },
    { 
        name: "매출 관리", 
        icon: Percent,
        subItems: [
            { name: "발주 수익", path: "/ceo/ordersale" },
            { name: "매출 수익", path: "/ceo/viewsale" }
        ] 
    }
];

export default function CeoNavbar() {
  const [selected, setSelected] = useState("대시보드");
  const [open, setOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMenuClick = (item: {
    name: string;
    path?: string;
    subItems?: { name: string; path: string }[];
  }) => {
    if (item.subItems && item.subItems.length > 0) {
      setOpen(open === item.name ? null : item.name);
      setSelected(item.name);
    } else if (item.path) {
      setSelected(item.name);
      setOpen(null);
      navigate(item.path);
    }
  };

  return (
    <aside className="h-screen w-64 bg-[#2e8b57] flex flex-col justify-between rounded-2xl m-2 shadow-lg">
      {/* 로고 */}
      <div>
        <div className="flex items-center gap-2 px-6 py-8">
          <span className="bg-white rounded-full w-20 h-10 flex items-center justify-center text-[#2e8b57] font-bold text-xl shadow">CEO</span>
          <span className="font-bold text-xl text-white">학원이름</span>
        </div>
        {/* 메뉴 */}
        <nav className="mt-6">
          <ul className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  onClick={() => handleMenuClick(item)}
                  className={
                    `flex items-center gap-3 px-6 py-3 rounded-lg transition-colors ` +
                    (selected === item.name && !item.subItems
                      ? "bg-white text-[#2e8b57] font-semibold shadow"
                      : "text-white hover:bg-[#3fa97b] hover:text-white")
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
                {/* 서브메뉴 */}
                {item.subItems && open === item.name && (
                  <ul className="ml-10 mt-1 flex flex-col gap-1">
                    {item.subItems.map((sub) => (
                      <li key={sub.name}>
                        <a
                          href="#"
                          onClick={e => {
                            e.preventDefault();
                            setSelected(sub.name);
                            navigate(sub.path);
                          }}
                          className={
                            `block px-3 py-2 rounded transition-colors text-sm ` +
                            (selected === sub.name
                              ? "bg-[#e6f4ee] text-[#2e8b57] font-semibold"
                              : "text-[#e6f4ee] hover:bg-[#3fa97b] hover:text-white")
                          }
                        >
                          {sub.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* 로그아웃 */}
      <div className="px-6 py-6">
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            localStorage.removeItem('user');
            navigate("/");
          }}
          className="flex items-center gap-3 text-white opacity-70 hover:opacity-100 transition-opacity"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </a>
      </div>
    </aside>
  );
}
