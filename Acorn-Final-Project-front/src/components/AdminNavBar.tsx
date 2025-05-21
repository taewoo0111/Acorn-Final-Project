import { Home, ShoppingCart, Percent, StickyNote, LogOut, User, Boxes, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const menuItems = [
    { name: "대시보드", icon: Home, path: "/admin" },
    { name: "공지사항", icon: StickyNote, path: "/admin/notice" },
    { 
        name: "수업 관리", 
        icon: Calendar, 
        subItems: [
          { name: "수업 리스트", path: "/admin/class" },
          { name: "수업 일정표", path: "/admin/calendar" }
      ] 
    },
    { 
        name: "인원 관리",
        icon: User,
        subItems: [
            { name: "학생 관리", path: "/admin/students" },
            { name: "강사 관리", path: "/admin/teachers" }
        ]
    },
    { 
        name: "발주 관리", 
        icon: ShoppingCart,
        path: "admin 발주관리 경로",
        subItems: [
            { name: "발주 현황", path: "/admin/order-list" },
            { name: "발주서 작성", path: "/admin/order" }
        ] 
    },
    { name: "재고 관리", icon: Boxes, path: "/admin/inventory" },
    { 
        name: "매출 관리", 
        icon: Percent,
        subItems: [
            { name: "매출 현황", path: "/admin/salesmanage" },
            { name: "매출 통계", path: "/admin/salesstat" }
        ] 
    }
];

export default function AdminNavbar() {
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
    <aside className="h-screen w-64 bg-[#3b4d82] flex flex-col justify-between rounded-2xl m-2 shadow-lg">
      {/* 로고 */}
      <div>
        <div className="flex items-center gap-2 px-6 py-8">
          <span className="bg-white rounded-full w-20 h-10 flex items-center justify-center text-[#3b4d82] font-bold text-xl shadow">Admin</span>
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
                    (selected === item.name
                      ? "bg-white text-[#3b4d82] font-semibold shadow"
                      : "text-white hover:bg-[#4c62a3] hover:text-white")
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
                              ? "bg-[#eef0f6] text-[#3b4d82] font-semibold"
                              : "text-[#eef0f6] hover:bg-[#4c62a3] hover:text-white")
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
