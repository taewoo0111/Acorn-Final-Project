export interface orderDetail {
    infoDto: OrderInfo;
    itemList: Array<OrderItem>;
}

export interface OrderInfo {
    tmp: boolean;				// 임시 저장 여부 
    orderId: number;
    totalPrice: number;
    ordDate: string;
    orderName: string;
    userId: number;		// 발주자 계정 번호
    cdStatus: string;
    storeName: string;
    storeCall: string;
    memoRequest: string;
    memoReply: string;
}

export interface OrderItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    calPrice: number;
    cdCategory: string;
}

export interface OrderSimple {
    tmp: boolean;
    orderId: number;
    ordDate: string;
    orderName: string;
    totalPrice: number;
    cdStatus: string;
}

export interface PageInfo {
    status: string;
    strDate: string;
    endDate: string;
    startPageNum: number;
    endPageNum: number;
    totalPageCount: number;
    pageNum: number;
    totalRow: number;
    startRowNum: number;
    endRowNum: number;
    list: Array<OrderSimple>
}

export interface FilterCondition {
    strDate: string;
    endDate: string;
    status: string;
    pnum: number;
}

export interface OrderDetailProps {
    orderItem: OrderItem,
    clickCnt: number,
    orderId: number | undefined
}

export interface PrdListProps {
    setOrderItem: React.Dispatch<React.SetStateAction<OrderItem>>;
    clickCnt: number;
    setClickCnt: React.Dispatch<React.SetStateAction<number>>;
}