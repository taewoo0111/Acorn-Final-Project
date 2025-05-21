import { useOutlet, useLocation } from "react-router-dom";
import CeoNavBar from "@/components/CeoNavBar";
import AdminNavBar from "@/components/AdminNavBar";

function App() {
  const currentOutlet = useOutlet();
  const location = useLocation();
  const isCeoPage = location.pathname.includes('/ceo') || 
                   location.pathname.includes('/post');
  const isAdminPage = location.pathname.includes('/admin');                 

  return (
    <div className="flex">
      {isCeoPage && <CeoNavBar />}
      {isAdminPage && <AdminNavBar />}
      <div className="flex-1">{currentOutlet}</div>
    </div>
  )
}

export default App
