import { Header } from "@tanstack/react-table"

type TColumnOptPopper = {
    colPopupState: TColOptPopupState
    setColPopupState: React.Dispatch<React.SetStateAction<TColOptPopupState>>
}

type TColOptPopupState = {
    selectedColumnID: number | null,
    columnOptionPopperDisplayState: boolean,
    position: { top: number, left: number }
}

type TRowOptPopper = {
    rowPopupState: TRowOptPopupState
    setRowPopupState: React.Dispatch<React.SetStateAction<TRowOptPopupState>>
}

type TRowOptPopupState = {
    selectedRowID: number | null,
    rowOptionPopperDisplayState: boolean,
    position: { top: number, left: number }
}

type THeaderProps = {
    header: Header<any, unknown>,
    table: any,
    columnResizeMode: any,
    setColPopupState: React.Dispatch<React.SetStateAction<TColOptPopupState>>
}

type TColumn = {
    columnID: number,
    columnLabel: string,
    datatype: string,
    colSheetID?: number,
    positionIndex?: number
}

type TColumnDef = {
    accessorKey: string;
    id: string;
    header: string;
    datatype: string;
    columnID: number;
    colSheetID: number;
    positionIndex?: number;
    columnLabel?: string;
}

export type { TColOptPopupState, THeaderProps, TColumn, TColumnDef, TColumnOptPopper, TRowOptPopper, TRowOptPopupState }