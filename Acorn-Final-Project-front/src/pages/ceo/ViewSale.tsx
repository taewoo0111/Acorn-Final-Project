import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

function ViewSale() {
    const [userId, setUserId] = useState(1);
    const [users, setUsers] = useState<{ USER_ID: number; STORE_NAME: string }[]>([]);
    const [year, setYear] = useState(new Date().getFullYear() - 1);
    const [years, setYears] = useState<number[]>([]);
    const [sales, setSales] = useState<{ MONTH: string; TOTAL_PRICE: number }[]>([]);

    // 지점 목록 불러오기
    useEffect(() => {
        fetch('/api/viewusers')
            .then(res => res.json())
            .then(data => {
                console.log('지점 목록:', data);
                setUsers(data);
            });
    }, []);

    // 매출 데이터 가져오기
    useEffect(() => {
        let mounted = true;
        fetch(`/api/viewsale/${userId}/${year}`)
            .then(res => res.json())
            .then(data => { if (mounted) setSales(data); });
        return () => { mounted = false; };
    }, [userId, year]);

    // 사용 가능한 연도 리스트 가져오기
    useEffect(() => {
        let mounted = true;
        fetch(`/api/viewyear/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (mounted) {
                    setYears(data);
                    if (data.length > 0) setYear(data[0]);
                }
            });
        return () => { mounted = false; };
    }, [userId]);

    // 그래프용 데이터 포맷 변환 (0, 1~12월 모두 포함)
    const monthMap = new Map(sales.map(item => [Number(item.MONTH), item.TOTAL_PRICE]));
    const graphData = Array.from({ length: 13 }, (_, i) => ({
      month: `${i}월`,
      sales: monthMap.get(i) ?? 0
    }));

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">각 지점 매출 순수익</h1>
            <div className="flex gap-4 mb-6">
                <div>
                    <span className="mr-2">지점 선택:</span>
                    <Select value={userId.toString()} onValueChange={(v: string) => setUserId(Number(v))}>
                        <SelectTrigger className="w-[200px] z-50">
                            <SelectValue placeholder="지점 선택" />
                        </SelectTrigger>
                        <SelectContent className="z-50" position="popper">
                            {users
                                .filter(user => user && user.USER_ID !== undefined && user.STORE_NAME !== undefined)
                                .map(user => (
                                    <SelectItem key={user.USER_ID} value={user.USER_ID.toString()}>
                                        {user.USER_ID} - {user.STORE_NAME}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <span className="mr-2">연도 선택:</span>
                    {years.length > 0 && (
                        <Select
                            value={years.includes(year) ? year.toString() : ""}
                            onValueChange={(v: string) => setYear(Number(v))}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="연도 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(y => (
                                    <SelectItem key={y} value={y.toString()}>{y}년</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>
            <div className="bg-white rounded shadow p-6 mt-20 overflow-visible">
                <ResponsiveContainer width="100%" height={700}>
                    <ComposedChart data={graphData} margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value.toLocaleString()}원`, '매출']} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="sales"
                            fill="#8884d8"
                            fillOpacity={0.3}
                            stroke="none"
                            name="매출"
                            legendType="none"
                        />
                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="매출"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ViewSale;