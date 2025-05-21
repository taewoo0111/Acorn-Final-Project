import OverviewSection from "@/components/OverviewSection";
import SalesAnalyticsSection from "@/components/SalesAnalyticsSection";
import PopularItemsSection from "@/components/PopularItemsSection";
import { useEffect } from "react";
import { useCeoStatistics } from "@/hooks/useCeoStatistics";

function Ceo() {
    const { overview, salesData, popularItems, isLoading, error } = useCeoStatistics();

    useEffect(() => {
        // localStorage에서
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        console.log('localStorage user:', user);
    
        // Redux에서
        // const user = useSelector((state) => state.userInfo);
        // console.log('redux user:', user);
    }, []);

    useEffect(() => {
        console.log('popularItems:', popularItems);
    }, [popularItems]);

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러가 발생했습니다</div>;

    return (
        <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
            <OverviewSection overview={overview ?? []} />
            <div className="flex flex-col lg:flex-row gap-6">
                <SalesAnalyticsSection salesData={salesData ?? []} />
                <PopularItemsSection items={popularItems ?? []} />
            </div>
        </div>
    );
}

export default Ceo;