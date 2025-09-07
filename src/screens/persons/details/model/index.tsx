import { PersonResponseProps } from "../../../../services/store/actions/persons";

export interface FormValues {
  informacao: string;
  data: string;
}

export interface PersonViewProps {
    person: PersonResponseProps | null
    getPerson:  (id: number) => Promise<void>,
    updatePersonOccurrence: (id: number) => Promise<void>,
    getPersonOccurrence: (id: number) => Promise<void>,
}