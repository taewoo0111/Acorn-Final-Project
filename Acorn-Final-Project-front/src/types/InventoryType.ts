// 재고 세부 내역 정보 타입
export interface InventoryItemDetail {
    productId: number;
    productName: string;
    invId: number;
    invDate: string;
    invPlus?: number;
    invMinus?: number;
    div: number;
    qty: number;
    userId: number;
}

// 모달창 띄우기 관련 상태값
export interface InvtoryModal {
    isShow: boolean;
    invId: number;
    proId: number;
}

// 모달창 정보 타입 
export interface InvModalDetail {
    isShow: boolean;            // 모달 정보    
    info: InventoryItemDetail;  // 내용 정보
}

// 재고 현황 타입
export interface InventoryItemList {
    cdCategory: string;
    productId: number;
    productName: string;
    qty: number;
  }

  // Inventory 에서 InvSum 으로 전달하는 Props 타입
  export interface InvListProps {
    setPId: React.Dispatch<React.SetStateAction<number>>  | null;
    filterType: string;
    setFilterType: React.Dispatch<React.SetStateAction<string>>;
    keyword: string;
    setKeyword: React.Dispatch<React.SetStateAction<string>>;
    filteredData: InventoryItemList[];
    setFilteredData: React.Dispatch<React.SetStateAction<InventoryItemList[]>>;
    refreshList: () => void;
    context: string;
  }

  export interface InvDetailProps {
    refreshDetail: () => void,
    strDate: string,
    endDate: string,
    setStrDate: React.Dispatch<React.SetStateAction<string>>,
    setEndDate: React.Dispatch<React.SetStateAction<string>>,
    itemDetail: InventoryItemDetail[],
    refreshList: () => void,
  }

  export interface InvModalProps {
    invModal: InvtoryModal,
    setInvModal: React.Dispatch<React.SetStateAction<InvtoryModal>>,
    refreshDetail: () => void,
    refreshList: () => void,
    pname: string;
  }