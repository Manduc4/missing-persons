import { useState } from 'react';
import View from './view';
import {
  fetchPerson,
  fetchPersonOccurence,
  PersonResponseProps,
  updatePersonOccurence,
  UpdatePersonOccurenceResponseProps,
} from '../../../services/store/actions/persons';
import { dispatch } from '../../../services/store';
import { useSnackbar } from 'notistack';

const Person = () => {
  const [person, setPerson] = useState<PersonResponseProps | null>(null);
  const [personOccurrence, setPersonOccurrence] = useState<
    UpdatePersonOccurenceResponseProps[]
  >([]);
  const { enqueueSnackbar } = useSnackbar();

  const getPerson = async (id: number) => {
    try {
      const response: any = await dispatch(fetchPerson({ id }));
      if (response.meta.requestStatus === 'fulfilled') {
        setPerson(response.payload);
      } else {
        enqueueSnackbar(response.payload.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Erro ao carregar detalhes.', { variant: 'error' });
    }
  };

  const getPersonOccurrence = async (id: number) => {
    try {
      const response: any = await dispatch(
        fetchPersonOccurence({ ocorrenciaId: id }),
      );
      if (response.meta.requestStatus === 'fulfilled') {
        setPersonOccurrence(response.payload);
      } else {
        enqueueSnackbar(response.payload.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Erro ao carregar detalhes.', { variant: 'error' });
    }
  };

  const updatePersonOccurrence = async (
    props: UpdatePersonOccurenceResponseProps,
  ) => {
    try {
      const response: any = await dispatch(updatePersonOccurence({ ...props }));
      if (response.meta.requestStatus === 'fulfilled') {
        enqueueSnackbar('Ocorrência registrada', { variant: 'success' });
      } else {
        enqueueSnackbar(response.payload.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Erro ao carregar detalhes.', { variant: 'error' });
    }
  };

  return (
    <View
      {...{
        person,
        getPerson,
        getPersonOccurrence,
        updatePersonOccurrence,
        personOccurrence,
      }}
    />
  );
};

export default Person;
