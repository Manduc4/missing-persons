import { PersonResponseProps, UpdatePersonOccurenceResponseProps } from "../../../../services/store/actions/persons";

export interface FormValues {
  informacao: string;
  data: string;
}

export interface PersonViewProps {
    person: PersonResponseProps | null
    getPerson:  (id: number) => Promise<void>,
    updatePersonOccurrence: (props: UpdatePersonOccurenceResponseProps) => Promise<void>,
    getPersonOccurrence: (id: number) => Promise<void>,
    personOccurrence: UpdatePersonOccurenceResponseProps | null
}