import { PersonResponseProps, PersonsPayloadProps } from "../../../../services/store/actions/persons";

export interface PersonsViewProps {
    persons: PersonResponseProps[]
    total: number,
    setTotal: React.Dispatch<React.SetStateAction<number>>,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    rowsPerPage: number
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>,
    getPersons: (filters: PersonsPayloadProps) => Promise<void>
}