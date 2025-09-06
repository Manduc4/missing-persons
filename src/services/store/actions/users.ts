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

