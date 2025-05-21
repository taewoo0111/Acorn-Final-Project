import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../../Layout';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,PieChart, Pie, Cell, ResponsiveContainer
  } from 'recharts';
import { Button, Form } from 'react-bootstrap';
import api from '../../api';
import { AdminSalesStatDto } from '../../types/AdminSalesStatDto';

type MonthlyData = {
    sMonth: string;
    profit: number | null;
    cost: number | null;
  };
type LectureSalesData = {
    subject: string|null;
    sales: number|0;
};

function SalesStatus(props) {
    const [storeName, setStoreName] = useState<string>('');
    const [userId, setUserId]=useState();
    const [thisYear, setThisYear]=useState<string>(new Date().getFullYear().toString());
    const [selected, setSelected] = useState("condition"); // 초기값 설정
    const [sYearList, setSYearList] = useState<string[]>([]);
    const [sMonthList, setSMonthList] = useState<AdminSalesStatDto[]>([]);
    const [sYear, setSYear] = useState(thisYear);
    const [sMonth, setSMonth] = useState("");
    const [selectedSub, setSelectedSub]=useState("");
    const [availableMonths, setAvailableMonths] = useState<string[]>([]); // 월 드롭다운용
    const [allYearData, setAllYearData] = useState<AdminSalesStatDto[]>([]);
    const [hideSubCondition, setHideSubCondition] = useState(true);
    const [salesData, setSalesData]= useState<MonthlyData[]>([]);
    const whenYearChange = (e)=> {
        setSYear(e.target.value);
    }
    const whenMonthChange = (e)=> {
        setSMonth(e.target.value);
    }
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        setStoreName(user.storeName);
        console.log('localStorage user:', user);
        setUserId(user.userId)

        // 컴포넌트가 마운트될 때 연도별 매출 데이터 가져오기 
        fetchYearlySales();
        setSelected("salesByYear"); // 초기 선택값 설정
        setHideSubCondition(false)
        
    },[])
    useEffect(() => {
        if (selected === "salesByLecture") {
            setSMonth(""); // 월 초기화
            setMonthlySalesByLecture([]);
            setYearlySalesByLecture([]);
            fetchLectureSales();
        } else if (selected === "salesByYear") {
            setSalesData([]);
            fetchYearlySales();
        } else {
            setSalesData([]); // 다른 조건 선택 시 초기화
            setSYearList([]); // 연도 목록 초기화
            setSMonthList([]); // 월 목록 초기화
        }
    }, [selected]);
   // useEffect에서 allYearData가 변경될 때 salesData를 업데이트
    useEffect(() => {
        if (selected === "salesByYear" && allYearData.length > 0) {
            const selectedYearData = allYearData.find(item => item.syear === sYear);
            console.log("selectedYearData", selectedYearData)
            if (selectedYearData?.profitList || selectedYearData?.costList) {
                const profitMap = new Map<string, number>();
                const costMap = new Map<string, number>();

                // profitList, costList에서 월별 데이터를 매핑
                selectedYearData.profitList?.forEach(item => {
                    if (item.smonth && item.price !== undefined) {
                        profitMap.set(item.smonth, item.price);
                    }
                });

                selectedYearData.costList?.forEach(item => {
                    if (item.smonth && item.price !== undefined) {
                        costMap.set(item.smonth, item.price);
                    }
                })
                const formatted = Array.from({ length: 12 }, (_, i) => {
                    const monthNum = i + 1;
                    const paddedMonth = monthNum.toString().padStart(2, '0'); // '01' ~ '12'
                    const key = `${sYear}-${paddedMonth}`; // '2025-01' ~ '2025-12'
                    return {
                        sMonth: monthNum.toString(), // 그래프에 표시할 월
                        profit: profitMap.get(key) || null,
                        cost: costMap.get(key) || null,
                    };
                });
                
                console.log(formatted, "formatted")
                setSalesData(formatted);
            } else {
                setSalesData([]); // 데이터 없으면 빈 배열
            }
        }
    }, [allYearData, selected, sYear]);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value)
        console.log(selected)
        if (e.target.value === "condition") {
            setHideSubCondition(true);  // 선택한 경우 서브 조건 숨기기
        } else {
            setHideSubCondition(false);  // "연도별"을 선택한 경우 서브 조건 보이기
        }
    };
    const fetchYearlySales =() => {
        api.get(`/sales/YearlySale/${sYear}`, {params:{userId:userId}})
        .then((res) => {
            const allyearlist= res.data.syearList;
            setAllYearData(allyearlist);
            const yearKeys = allyearlist.map(item => item.syear);
            setSYearList(yearKeys);
        })
        .catch((error) => {
            console.error("연도별 매출 데이터를 불러오는 중 오류 발생:", error);
        });    
    };

    const DEFAULT_COLORS = [
        '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a28ee6',
        '#00C49F', '#FFBB28', '#0088FE', '#FF6666', '#66CCFF',
        '#CC66FF', '#FFCC66', '#66FF66', '#FF99CC', '#9966CC',
        '#66FFFF', '#FF9933', '#6699FF', '#FF66B2', '#A3E4D7',
        '#F1948A', '#BB8FCE', '#F7DC6F', '#48C9B0', '#F0B27A',
        '#D7BDE2', '#AED6F1', '#F8C471', '#DC7633', '#5499C7'
    ];

    const [yearlySalesByLecture, setYearlySalesByLecture] = useState<LectureSalesData[]>([]);
    const [monthlySalesByLecture, setMonthlySalesByLecture] = useState<LectureSalesData[]>([]);
    
    const fetchLectureSales =() => {
        console.log(sYear, "sYear")
        api.get(`/sales/LectureSale/${sYear}`, {params:{userId:userId}})
        .then((res) => {    
            console.log(res.data, "res.data")
            const yearData: AdminSalesStatDto[] = res.data.syearList || [];
            //연도 목록 드롭다운용
            const yearKeys = yearData.map(item => item.syear);
            setSYearList(yearKeys);  // 
            const foundYear = yearData.find(item => item.syear === sYear);
            if (!foundYear) {
                setYearlySalesByLecture([]);
                setMonthlySalesByLecture([]);
                setAvailableMonths([]);
                return;
            }
            // 연간 강의 매출
            const yearlySales = (foundYear.lectSaleYearly || []).map(item => ({
                subject: item.lectureName,
                sales: item.total || 0,
            }));
            setYearlySalesByLecture(yearlySales);
            // ⬇️ 월 목록 드롭다운용
            const monthKeys = (foundYear.smonthList || []).map(month => month.smonth);
            setAvailableMonths(monthKeys);
            console.log(monthKeys+"는 선택 가능한 달")
            // ⬇️ 기본 선택 월
            const firstMonth = monthKeys[0]
            const selectedMonth=foundYear.smonthList?.[0]
            console.log(firstMonth+"가 첫번째 달")
            if (selectedMonth) {
                setSMonth(firstMonth); // 현재 선택된 월 설정
                const monthlySales = (selectedMonth.lectSaleMonthly || []).map(item => ({
                    subject: item.lectureName,
                    sales: item.total || 0,
                }));
                setMonthlySalesByLecture(monthlySales);
            } else {
                setMonthlySalesByLecture([]);
            }
           
        })
        .catch((error) => { 
            console.error("과목별 매출 데이터를 불러오는 중 오류 발생:", error);
        });  

    }
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth= e.target.value
        setSMonth(selectedMonth);  // 선택만 저장
        api.get(`/sales/LectureSale/${sYear}`, {params:{userId:userId}})
        .then((res) => {
            const yearData: AdminSalesStatDto[] = res.data.syearList || [];
            const foundYear = yearData.find(item => item.syear === sYear);
            const foundMonth = foundYear?.smonthList?.find(m => m.smonth === selectedMonth);
            if (foundMonth) {
                const monthlySales = (foundMonth.lectSaleMonthly || []).map(item => ({
                    subject: item.lectureName ?? "알 수 없음",
                    sales: item.total || 0,
                }));
                setMonthlySalesByLecture(monthlySales);
            } else {
                setMonthlySalesByLecture([]);
            }
        })
        .catch(error => {
            console.error("월별 매출 불러오기 실패:", error);
        });
    };
    const handleMonthlySearchClick = () => {

    };
    // 1. sYear가 바뀔 때 강의별 연매출/월매출 데이터 불러오기
    useEffect(() => {
        if (selected === "salesByLecture") {
            fetchLectureSales();
        }
    }, [sYear]);

    // 2. sMonth가 바뀔 때 해당 월의 강의 매출 조회
    useEffect(() => {
        if (selected === "salesByLecture" && sMonth) {
            handleMonthlySearchClick();
        }
    }, [sMonth]);
    //연도변경시 초기화
    useEffect(() => {
        if (selected === "salesByLecture") {
            setMonthlySalesByLecture([]);
            setAvailableMonths([]);
            setSMonth("");
        }
    }, [sYear]);
    //월변경시 월별데이터 초기화
    useEffect(() => {
        if (selected === "salesByLecture" && !sMonth) {
            setMonthlySalesByLecture([]);
        }
    }, [sMonth]);
    const [subjectColorMap, setSubjectColorMap] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (selected === "salesByLecture") {
            const allSubjects = new Set<string>();
            yearlySalesByLecture.forEach(item => allSubjects.add(item.subject || "알 수 없음"));
            monthlySalesByLecture.forEach(item => allSubjects.add(item.subject || "알 수 없음"));

            const newMap: { [key: string]: string } = {};
            const usedColors = new Set<string>(Object.values(subjectColorMap)); // 이미 할당된 색상
            let colorIndex = 0;

            for (let subject of allSubjects) {
                if (!subjectColorMap[subject]) {
                    // 중복되지 않는 색상 찾기
                    while (usedColors.has(DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length])) {
                        colorIndex++;
                        // 무한루프 방지 (색상이 부족한 경우), 임시 예외 처리
                        if (colorIndex > DEFAULT_COLORS.length * 2) break;
                    }
                    const selectedColor = DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length];
                    newMap[subject] = selectedColor;
                    usedColors.add(selectedColor); // 사용한 색상으로 등록
                    colorIndex++;
                }
            }

            setSubjectColorMap(prev => ({ ...prev, ...newMap }));
        }
    }, [yearlySalesByLecture, monthlySalesByLecture, selected]);

    //전체 div에 적용될 css
    const centerStyle: React.CSSProperties ={
        maxWidth:"1600px",
        margin:"0 auto",
        padding:"2rem",
        textAlign:"center"
    }
    return (
        <div style={centerStyle}>
            <div className="mb-3"> 
                <div className="d-flex align-items-center justify-content-center">
                    <h2 className = "fw-bold" style={{ marginTop: '60px',marginBottom: '60px' }}>{storeName} 매출 통계</h2>
                </div>
         
                <div className="mb-3">
                    <div style={{ width: '100%', minWidth: '800px', margin: '0 auto' }}>
                        <Form className="d-flex align-items-end" style={{ paddingLeft: '100px' }} >
                            <Form.Select value={selected} onChange={handleSelect} size="sm" aria-label="yearorlecture" className='me-2 w-auto' >
                                <option value="salesByYear">연별 매출</option>
                                <option value="salesByLecture">과목별 매출</option>
                            </Form.Select>
                            <Form.Select hidden={hideSubCondition} size="sm" aria-label="year" className='me-2 w-auto'   value={sYear} onChange={(e)=> {whenYearChange(e)}}>
                                <option value="selectyearcondition">연도 선택</option>
                                {sYearList.map((item, index) => (
                                    <option key={index}>{item}</option>
                                ))}
                            </Form.Select>
                            <Button className='btn btn-secondary me-2 w-auto' size="sm" style={{ width: "120px", backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}>검색</Button>
                        </Form>
                    </div>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                    {
                        selected==="salesByYear"?
                        <LineChart width={1000} height={600} data={salesData} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="sMonth"  type="category"  padding={{ left: 50 }} />
                            <Tooltip formatter={(value) => {
                                if (typeof value === 'number') return `${value.toLocaleString()}원`;
                                return value;
                            }} />
                            <YAxis tickFormatter={(value) => {
                                if (typeof value === 'number') return `${value.toLocaleString()}`;
                                return value;
                            }} />
                            <Legend formatter={(value) => {
                                        if (value === 'profit') return '수입'; // profit에 대해 한글로 변경
                                        if (value === 'cost') return '지출';  // cost에 대해 한글로 변경
                                        return value;
                            }} />
                            <Line type="monotone" dataKey="profit" stroke="#1E90FF" connectNulls={false} />
                            <Line type="monotone" dataKey="cost" stroke="#FF6347" connectNulls={false} />
                        </LineChart>
                        :
                        <div>
                        </div>
                    }
                    {   
                        selected==="salesByLecture"?
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div>
                                    <h5>과목별 연매출</h5>
                                </div>
                                <ResponsiveContainer width={500} height={400}>
                                    <PieChart>
                                    <Pie
                                        data={yearlySalesByLecture}
                                        dataKey="sales"
                                        nameKey="subject"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {yearlySalesByLecture.map((entry, index) => (
                                        <Cell
                                            key={`cell-yearly-${index}`}
                                            fill={subjectColorMap[entry.subject ?? '알 수 없음'] || '#ccc'}
                                        />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex',flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div className="d-flex align-items-center">
                                    <Form className="d-flex align-items-center flex-row gap-2" style={{ flexWrap: 'nowrap' }}>
                                        <div className="d-flex align-items-center">
                                            <h5 className="mb-0">해당 연도의 월매출</h5>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <Form.Select hidden={hideSubCondition} size="sm" aria-label="year" style={{ minWidth: '150px' }} value={sMonth} onChange={handleMonthChange}>
                                                <option value="condition">월 선택</option>
                                                {availableMonths.map((month, index) => (
                                                    <option key={index} value={month}>{month}월</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <Button className="btn btn-secondary" size="sm">검색</Button>
                                        </div>
                                    </Form>
                                </div>
                                <ResponsiveContainer width={500} height={400}>
                                    <PieChart>
                                    <Pie data={monthlySalesByLecture} dataKey="sales" nameKey="subject" 
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {monthlySalesByLecture.map((entry, index) => (
                                        <Cell
                                            key={`cell-monthly-${index}`}
                                            fill={subjectColorMap[entry.subject ?? '알 수 없음'] || '#ccc'}
                                        />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div> 
                        :
                        <div>
                        </div>
                    }
                </div>
                    
                </div>

            </div>

        </div>
    );
}
export default SalesStatus;