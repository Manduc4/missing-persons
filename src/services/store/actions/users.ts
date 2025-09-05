import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../instance";
import endpoints from "../../requests/endpoints";

export interface CreateUserResponseProps {
  message: string;
  token: {
    value: string;
    expires: string;
  };
}

export interface CreateUserPayloadProps {
  name: string;
  email: string;
  password: string;
}

export const fetchCreateUser = createAsyncThunk<
  CreateUserResponseProps,
  CreateUserPayloadProps
>("authentication.fetchCreateUser", async (data, { rejectWithValue }) => {
  try {
    const api = axiosInstance;
    const response = await api({
      baseURL: process.env.REACT_APP_BASE_URL + endpoints.register,
      method: "POST",
      data,
    });

    return response.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

interface UpdateUserPayloadProps {
  id: number;
  name: string;
  email: string;
}

interface UpdateUserResponseProps {
  message: string;
  user: {
    name: string;
    email: string;
  };
}

export const fetchUpdateUser = createAsyncThunk<
  UpdateUserResponseProps,
  UpdateUserPayloadProps
>("authentication.fetchUpdateUser", async (data, { rejectWithValue }) => {
  try {
    const api = axiosInstance;
    const response = await api({
      baseURL: `${process.env.REACT_APP_BASE_URL}${endpoints.missingPersons}/${String(
        data.id
      )}`,
      method: "PUT",
      data: {
        name: data.name,
        email: data.email,
      },
    });

    return response.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

export interface UpdatePasswordPayloadProps {
  password: string;
}

export interface UpdatePasswordResponseProps {
  message: string;
}

export const fetchUpdatePassword = createAsyncThunk<
  UpdatePasswordResponseProps,
  UpdatePasswordPayloadProps
>("authentication.fetchUpdatePassword", async (data, { rejectWithValue }) => {
  try {
    const api = axiosInstance;
    const response = await api({
      baseURL: `${process.env.REACT_APP_BASE_URL}${endpoints.changePassword}`,
      method: "PUT",
      data: {
        password: data.password,
      },
    });

    return response.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

export interface RecoveryPayloadProps {
  email: string;
}

export interface RecoveryResponseProps {
  email: string;
}

export const fetchRecovery = createAsyncThunk<
  RecoveryResponseProps,
  RecoveryPayloadProps
>("authentication.fetchRecovery", async (data, { rejectWithValue }) => {
  try {
    const api = axiosInstance;
    const response = await api({
      baseURL: `${process.env.REACT_APP_BASE_URL}${endpoints.recovery}`,
      method: "POST",
      data: {
        email: data.email,
      },
    });

    return response.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

export const fetchUserList = createAsyncThunk<CreateUserResponseProps>(
  "authentication.fetchUserList",
  async (data, { rejectWithValue }) => {
    try {
      const api = axiosInstance;
      const response = await api({
        baseURL: process.env.REACT_APP_BASE_URL + endpoints.missingPersons,
        method: "GET",
        data,
      });

      return response.data;
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

export interface MissingPersonsPayloadProps {
  nome?: string,
  faixaIdadeInicial?: number,
  faixaIdadeFinal?: number,
  sexo?: string,
  status?: string,
  pagina?: number,
  porPagina: number
}

export interface MissingPersonsResponseProps {
  nome: string,
  faixaIdadeInicial: number,
  faixaIdadeFinal: number,
  sexo: string,
  status: string,
  pagina: number,
  porPagina: number
}

// Tipagem do sort
export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

// Tipagem do pageable
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

// Tipagem da ocorrência
export interface OcorrenciaEntrevDesapDTO {
  informacao: string;
  vestimentasDesaparecido: string;
}

export interface UltimaOcorrencia {
  dtDesaparecimento: string;
  dataLocalizacao: string | null;
  encontradoVivo: boolean;
  localDesaparecimentoConcat: string;
  ocorrenciaEntrevDesapDTO: OcorrenciaEntrevDesapDTO;
  listaCartaz: string[] | null;
  ocoId: number;
}

// Tipagem da pessoa desaparecida
export interface PessoaDesaparecida {
  id: number;
  nome: string;
  idade: number;
  sexo: "MASCULINO" | "FEMININO" | string;
  vivo: boolean;
  urlFoto: string;
  ultimaOcorrencia: UltimaOcorrencia;
}

// Tipagem da resposta paginada
export interface PaginacaoPessoaDesaparecida {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: PessoaDesaparecida[];
}


export const fetchMissingPersons = createAsyncThunk<PaginacaoPessoaDesaparecida, MissingPersonsPayloadProps>(
  "authentication.fetchMissingPersons",
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
        baseURL: `https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?${searchParams.toString()}`,
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
