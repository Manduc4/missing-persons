import { useState } from "react";
import { PersonsViewProps } from "./model";
import View from "./view";
import { useSnackbar } from "notistack";
import { fetchPersons, PersonResponseProps, PersonsPayloadProps } from "../../../services/store/actions/persons";
import { dispatch } from "../../../services/store";

const Persons = () => {
  const [persons, setPersons] = useState<PersonResponseProps[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getPersons = async (filters: PersonsPayloadProps) => {
    try {
      const response: any = await dispatch(fetchPersons(filters));
      if (response.meta.requestStatus === "fulfilled") {
        setPersons(response.payload.content);
        setTotal(response.payload.totalElements);
      } else {
        enqueueSnackbar(response.payload.message, { variant: "error" });
      }
    } catch (error: any) {
      enqueueSnackbar("Ocorreu um erro.", { variant: "error" });
      console.log(error);
    }
  };
  
  return (
    <View {...{persons, getPersons, total, setTotal, page, setPage, rowsPerPage, setRowsPerPage}} />
  )
}

export default Persons