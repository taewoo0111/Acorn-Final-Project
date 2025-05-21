// MUI Popover 사용하기 위한 패키지 설치 
// 캘린더 옆에 작은 상세 팝업 띄우기 Material UI Popover 사용
// npm install react-big-calendar @mui/material @emotion/react @emotion/styled axios
// 툴바 MUI 스타일로 커스터마이징
// npm install @mui/icons-material
// npm install react-datepicker

// ClassCalendar.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Popover, Box, Button, Typography } from '@mui/material';
import api from '../../api';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, Refresh, Today } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// 로컬라이저로 momentLocalizer 설정
const localizer = momentLocalizer(moment);

interface HjClassDto {
  classId: number;
  className: string;
  cdLecture: string;
  userId: number;
  teacherId: number;
  teacherName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  weekday: string;
  currentStudent: number;
  maxStudent: number;
  price: number;
  applyStartDate: string;
  applyEndDate: string;
  cdStatus: string;
  description: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: HjClassDto;
  bgColor: string;
  textColor: 'black' | 'white';
}

const ClassCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<HjClassDto | null>(null);
  const [date, setDate] = useState<Date>(new Date);
 
  // const userId = "2"; // userId 데이터 가져오기
  // const storeName = "스토어01"; // storeName 데이터 가져오기
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user.userId; 
  const storeName = user.storeName;


  // classId 이용해서 HSL 방식으로 고정된 배경색 생성
  function getBgColor(classId: number): string {
    // 간단한 숫자를 기반으로 H(색상값)를 0~360 사이에서 생성
    const hue = classId * 57 % 360; // 57은 소수로 충돌 최소화
    const saturation = 50; // 선명도 (%)
    const lightness = 75; // 밝기 (%)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // 배경색에 따른 글자색 자동 설정(흰색 or 검정색)
  function getTextColor(bgColor: string): 'black' | 'white' {
    // hsl → rgb → 밝기 계산
    const rgb = hslToRgb(bgColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 150 ? 'black' : 'white';
  }
  // HSL 색상을 RGB 로 변환 (밝기 판단)
  function hslToRgb(hsl: string): { r: number, g: number, b: number } {
    const [_, h, s, l] = hsl.match(/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/)!.map(Number);
  
    const sRatio = s / 100;
    const lRatio = l / 100;
  
    const c = (1 - Math.abs(2 * lRatio - 1)) * sRatio;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lRatio - c / 2;
  
    let r = 0, g = 0, b = 0;
  
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
  
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }
 
  // Calendar 네비게이션 처리 함수
  const onNavigate = useCallback((action) => {
    let newDate = new Date(date); // 현재 날짜
    console.log(action); // 네비게이션 동작하는지 확인
  

    if (action === 'PREV') {
      newDate.setMonth(newDate.getMonth() - 1); // 한 달 뒤로
    } else if (action === 'NEXT') {
      newDate.setMonth(newDate.getMonth() + 1); // 한 달 앞으로
    } else if (action === 'TODAY') {
      newDate = new Date(); // 현재 날짜로 돌아오기
    } else if (typeof action === 'object' && action.type === 'DATE') { // action 이 객체인지 확인, 객체의 type 속성 값이 'DATE' 인지 확인
      newDate = action.payload; // action 의 날짜 정보가 담긴 필드 payload 이용하여 선택한 날짜로 이동
    }

    setDate(newDate); // 날짜 상태 업데이트
  }, [date]); // 빈 배열을 의존성으로 설정하여 한 번만 함수가 생성되도록 함

  // 수업 목록 정보를 가져와서 이벤트로 변환
  useEffect(() => {
    api.get(`/class/calendar?userId=${userId}`)
      .then((res) => {
        console.log(res.data);
        const eventList = generateEvents(res.data); // generateEvents 에서 생성된 allEvents 배열을 
        setEvents(eventList); // events 배열 상태값에 저장하여 캘린더에 전달
      })
      .catch(err => {
        console.log(err);
      });
    
  }, []);


  // 받아온 데이터 List<HjClassDto> classList 에서 이벤트를 반복 생성하기 
  // HjClassDto[] -> CalendarEvent[]
  const generateEvents = (classList: HjClassDto[]): CalendarEvent[] => {
      // 이벤트 리스트
      const allEvents: CalendarEvent[] = [];

      classList.forEach(item => { // startDate, endDate, weekday 기준으로 allEvents 에 이벤트 push 
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            const activeDays = getActiveDays(item.weekday); // [1, 3, 5]
        
            // new Date() 에서 Date 객체로 파싱할 때 날짜와 시간 사이를 구분하기 위한 표준 포맷 구분자 'T'
            // 시작(start)과 끝(end) 기준으로 연속된 이벤트 바 하나 생성
            // 반복되는 요일에 반복 이벤트를 생성하기 위해 여러 이벤트 객체로 분할해서 각 이벤트를 events 배열에 push
            // startDate 에서 currentDate 시작, endDate 까지, currentDate 의 날짜 하루씩 증가하면서 for 문 반복
            
            for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
              // getDay(); 0~6 (일~토) 리턴 → (월~일) 로 변환
              const convertedDateIdx = currentDate.getDay() === 0 ? 6 : currentDate.getDay()-1; // 일요일이면 6, 그 외 -1
              if (activeDays.includes(convertedDateIdx)) {
                // 날짜 문자열 생성 : YYYY-MM-DD 형식
                const currentDateStr = currentDate.toISOString().slice(0, 10); // 0부터 10번째 문자까지 
                console.log('currentDateStr:', currentDateStr); // 현재 날짜 출력
                console.log('startTime:', item.startTime, 'endTime:', item.endTime);
                const startDateTime = new Date(`${currentDateStr}T${item.startTime}:00`); // 올바른 ISO 8601 형식(YYYY-MM-DDTHH:mm:ss)으로 변환
                const endDateTime = new Date(`${currentDateStr}T${item.endTime}:00`);
                const bgColor = getBgColor(item.classId);

                allEvents.push({
                  id: `${item.classId} ${currentDateStr}`,
                  title: item.className,
                  start: startDateTime,
                  end: endDateTime,
                  resource: item, // 전체 Dto 내용 저장
                  bgColor,
                  textColor: getTextColor(bgColor),

                });
                console.log('event added:', { title: item.className, startDateTime, endDateTime });
              }
            }
          });
          console.log('최종 events in generateEvents:', allEvents);
          return allEvents; // forEach 는 단순히 반복 실행, map 은 새로운 배열 리턴

        };



  // "0101010" 형식의 요일 문자열을 요일 배열로 변환
  const getActiveDays = (weekday: string): number[] => { // 자바스크립트에서 string 은 iterable 한 객체이기 때문에 배열처럼 동작
    const activeDays = [];

    for (let i = 0; i < weekday.length; i++) {
      if (weekday[i] === '1') {
        activeDays.push(i);  // i는 요일 인덱스 (0: 월요일 ~ 6: 일요일)
      }
    }
  
    return activeDays;
  };

  // 요일 문자열을 한글 문자열로
  const getWeekdayNames = (weekday: string): string => {
    const weekdayNames = ['월', '화', '수', '목', '금', '토', '일'];
    let result : string = "";
    
    for (let i = 0; i < weekday.length; i++) {
       if (weekday[i] === '1') {
         result += weekdayNames[i] + ' / ';
       } 
    }

    return result.replace(/\/ $/, ''); // 마지막 '/' 제거
  };
  
  // 이벤트 클릭 시 상세보기 팝오버 열기
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget); // 클릭한 위치
    setSelectedEvent(event.resource); // dto 내용 담기
  };

  // 상세보기 팝오버 닫기
  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  // 숫자 형식 변환
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // 커스텀 이벤트
const CustomEvent = ({ event }) => {
  const start = new Date(event.start);
  const starttimeStr = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
  const end = new Date(event.end);
  const endtimeStr = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
  const timeStr = `${starttimeStr} ~ ${endtimeStr}`;

  return (
    <span style={{
      height: 15,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      backgroundColor: event.bgColor,
      color: event.textColor,
    }}>
      <strong>{timeStr}</strong> &nbsp;- {event.title} {/* 문자열 내에서 HTML에서 공백을 의미하는 특수 문자(&nbsp;)를 사용 */}
    </span>
  );
};

/*
// Toolbar 자식 컴포넌트에서 버튼 클릭 이벤트를 최상위 컴포넌트에 전달(이전/다음 달 전환)
const navigate = { // navigate 의 action 정의
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY'
};
*/
// 커스텀 툴바
const CalendarToolbar = ({ label, onNavigate }) => {

  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const buttonRef = useRef<HTMLButtonElement | null>(null); // 버튼 참조
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 }); // datePicker 위치 설정

  const handleNavigate = (action) => {
    if (action === 'DATE') {
      if (showPicker) {
        setShowPicker(false); // DatePicker 닫기
      } else {
        setShowPicker(true); // DatePicker 표시
      }
      
    } else {
      onNavigate(action);
    }
  };

  const handleDateChange = (date) => {
    setShowPicker(false);
    setSelectedDate(date);
    onNavigate({ type: 'DATE', payload: date }); // 날짜를 전달
  };

/*
  return (
    <div className="rbc-toolbar">
      <div className="rbc-btn-group">
        <button onClick={() => {handleNavigate('PREV')}}>⏪</button>
      </div>
      <div className="rbc-btn-group">
        <button onClick={() => {handleNavigate('TODAY')}}>📅</button>
      </div>
      <span className="rbc-toolbar-label" style={{ fontSize: '24px' }}><strong>{label}</strong></span>
      <div className="rbc-btn-group">
        <button onClick={() => {handleNavigate('NEXT')}}>⏩</button>
      </div>
    </div>
  );
*/
  const formattedLabel = dayjs(date).format('YYYY년 MM월');

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between" 
      mb={2} 
      px={2}
      sx={{ borderRadius: 2, py: 1 }}
    >
      <Box>
        <Button 
          variant="outlined" 
          startIcon={<ChevronLeft />} 
          onClick={() => handleNavigate('PREV')}
        >
          이전
        </Button>

        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          sx={{ mx: 1 }} 
          onClick={() => handleNavigate('TODAY')}
        >
          현재
        </Button>

        <Button 
          ref={buttonRef} 
          variant="contained" 
          startIcon={<Today />} 
          sx={{ mr: 1 }} 
          onClick={() => {
            if (buttonRef.current) {
              const rect = buttonRef.current?.getBoundingClientRect(); {/* 현재 화면에서 스크롤을 반영한 HTML 요소의 위치와 크기 정보 */}
              setPickerPosition({
                top: rect.bottom + window.scrollY, // 버튼 바로 아래
                left: rect.left + window.scrollX,  // 버튼 왼쪽 맞춤
              });
            }
            setShowPicker((prev) => !prev); // datepicker 보이게 하기
            handleNavigate('DATE');
          }}
        >
        날짜
        </Button>
      {showPicker && (
        <Box sx={{ position: 'absolute', top: pickerPosition.top, left: pickerPosition.left, zIndex: 999 }}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showMonthYearPicker
            dateFormat="yyyy-MM"
            inline
          />
        </Box>
      )}
        <Button 
          variant="outlined" 
          endIcon={<ChevronRight />} 
          onClick={() => handleNavigate('NEXT')}
        >
          다음
        </Button>
      </Box>
      <Typography variant="h5"><strong>{formattedLabel}</strong></Typography>
      <Box sx={{ width: 150 }} /> {/* 오른쪽 공간 확보용 */ }
    </Box>
  ); 
}; 

//전체 div에 적용될 css
const centerStyle: React.CSSProperties ={
    maxWidth:"1600px",
    margin:"0 auto",
    padding:"2rem",
    textAlign:"center"
}

  // 최종적으로 ClassCalendar 함수 자체의 리턴값 Calendar
  return (
    <div style={centerStyle}>
      <h2 className = "fw-bold" style={{ marginTop: '60px',marginBottom: '60px' }}>{storeName} 월간 수업 일정표</h2>
      <Calendar
        date={date} // 내부적으로 날짜 date 상태 관리하여
        onNavigate={onNavigate} // onNavigate 로 date 상태 갱신
        localizer={localizer} // 날짜와 시간의 로컬 형식
        events={events}  // 캘린더에 표시할 이벤트 배열 (start, end, title 포함)
        startAccessor="start"  // 이벤트 객체에서 시작 시간 필드
        endAccessor="end"  // 이벤트 객체에서 종료 시간 필드
        defaultView="month"
        views={['month']}
        style={{ height: 800 }}  // 캘린더 크기
        popup={true}
        onSelectEvent={handleEventClick}  // 이벤트 클릭 시 수행할 동작
        components={{
          event: CustomEvent, // 이벤트 셀 전달
          toolbar: (props) => <CalendarToolbar {...props} onNavigate={onNavigate} />, // CalendarToolbar 연결하여 toolbar 에서 변경 시 반영
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.bgColor,
            color: event.textColor,
            borderRadius: '4px',
            border: 'none',
          },
        })}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2, minWidth: 250 }} style= {{ backgroundColor: getBgColor(selectedEvent?.classId || 0) }}> {/*Popover 에 보여줄 내용*/}
          {selectedEvent && (
            <>
              <Typography variant="h6" style={{ color: getTextColor(getBgColor(selectedEvent?.classId || 0)) }}>[{selectedEvent.classId}] {selectedEvent.className}</Typography>
              <Typography variant="body2" style={{ color: getTextColor(getBgColor(selectedEvent?.classId || 0)) }}>상태: {selectedEvent.cdStatus}</Typography>
              <Typography variant="body2" style={{ color: getTextColor(getBgColor(selectedEvent?.classId || 0)) }}>강사: {selectedEvent.teacherName}</Typography>

              <Typography variant="body2" style={{ color: getTextColor(getBgColor(selectedEvent?.classId || 0)) }}>기간: {selectedEvent.startDate} ~ {selectedEvent.endDate}</Typography>
              <Typography variant="body2" style={{ color: getTextColor(getBgColor(selectedEvent?.classId || 0)) }}>시간: {selectedEvent.startTime} ~ {selectedEvent.endTime}</Typography>
              <Typography variant="body2" style={{ color: getTextColor(getBgColor(selectedEvent?.classId || 0)) }}>요일: {getWeekdayNames(selectedEvent.weekday)}</Typography>
              <Typography variant="body2" style={{ color: getTextColor(getBgColor(selectedEvent?.classId || 0)) }}>총원: {selectedEvent.maxStudent} 명</Typography>
              <Typography variant="body2" style={{ color: getTextColor(getBgColor(selectedEvent?.classId || 0)) }}>교습비: {formatNumber(selectedEvent.price)} 원</Typography>
            </>
          )}
        </Box>
      </Popover>
    </div>
  );
};

export default ClassCalendar;
