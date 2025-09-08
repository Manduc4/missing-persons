import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../instance";
import endpoints from "../../requests/endpoints";

export interface PersonsResponseProps {
    totalPages: number;
    totalElements: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            unsorted: boolean;
            sorted: boolean;
            empty: boolean;
        };
        offset: number;
        unpaged: boolean;
        paged: boolean;
    };
    numberOfElements: number;
    first: boolean;
    last: boolean;
    size: number;
    content: PersonResponseProps[];
}

export interface PersonsPayloadProps {
    nome?: string,
    faixaIdadeInicial?: number,
    faixaIdadeFinal?: number,
    sexo?: string,
    status?: string,
    pagina?: number,
    porPagina: number
}

export interface PersonResponseProps {
    id: number;
    nome: string;
    idade: number;
    sexo: "MASCULINO" | "FEMININO" | string;
    vivo: boolean;
    urlFoto: string;
    ultimaOcorrencia: {
        dtDesaparecimento: string; // ISO date
        dataLocalizacao: string | null;
        encontradoVivo: boolean;
        localDesaparecimentoConcat: string;
        ocorrenciaEntrevDesapDTO: {
            informacao: string;
            vestimentasDesaparecido: string;
        };
        listaCartaz: {
            urlCartaz: string;
            tipoCartaz: "PDF_DESAPARECIDO" | string;
        }[];
        ocoId: number;
    };
}

export interface PersonPayloadProps {
    id: number
}

export interface UpdatePersonOccurenceResponseProps {
    ocoId: number;
    informacao: string;
    data: string;
}

export interface PersonOccurencePayloadProps {
    ocorrenciaId: number
}

export const fetchPersons = createAsyncThunk<PersonsResponseProps, PersonsPayloadProps>(
    "persons.fetchPersons",
    async (data, { rejectWithValue }) => {
        try {
            const api = axiosInstance;
            const searchParams = new URLSearchParams()

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    searchParams.append(key, String(value));
                }
            });

            const response = await api({
                baseURL: `${process.env.REACT_APP_BASE_URL}${endpoints.persons}?${searchParams.toString()}`,
                method: "GET",
                data,
            });
            return response.data;
        } catch (err) {
            console.log('erro', err)
            return rejectWithValue(err);
        }
    }
);

export const fetchPerson = createAsyncThunk<PersonResponseProps, PersonPayloadProps>(
    "persons.fetchPerson",
    async (data, { rejectWithValue }) => {
        try {
            const api = axiosInstance;

            const response = await api({
                baseURL: `${process.env.REACT_APP_BASE_URL}${endpoints.person}/${data.id}`,
                method: "GET",
                data,
            });
            return response.data;
        } catch (err) {
            console.log('erro', err)
            return rejectWithValue(err);
        }
    }
);

export const updatePersonOccurence = createAsyncThunk<UpdatePersonOccurenceResponseProps, UpdatePersonOccurenceResponseProps>(
    "persons.updatePersonOccurence",
    async (data, { rejectWithValue }) => {
        try {
            const api = axiosInstance;
            const searchParams = new URLSearchParams()

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    searchParams.append(key, String(value));
                }
            });

            const response = await api({
                baseURL: `${process.env.REACT_APP_BASE_URL}${endpoints.personOccurence}?${searchParams.toString()}`,
                method: "POST",
                data,
            });
            return response.data;
        } catch (err) {
            console.log('erro', err)
            return rejectWithValue(err);
        }
    }
);

export const fetchPersonOccurence = createAsyncThunk<UpdatePersonOccurenceResponseProps, PersonOccurencePayloadProps>(
    "persons.fetchPersonOccurence",
    async (data, { rejectWithValue }) => {
        try {
            const api = axiosInstance;
            const searchParams = new URLSearchParams()

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    searchParams.append(key, String(value));
                }
            });

            const response = await api({
                baseURL: `${process.env.REACT_APP_BASE_URL}${endpoints.personOccurence}?${searchParams.toString()}`,
                method: "GET",
                data,
            });
            return response.data;
        } catch (err) {
            console.log('erro', err)
            return rejectWithValue(err);
        }
    }
);