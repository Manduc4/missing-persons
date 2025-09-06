import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { dispatch } from "../../../../services/store";
import { fetchPerson, updatePersonOccurence } from "../../../../services/store/actions/persons";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";

// Interfaces
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

export interface PessoaDesaparecida {
  id: number;
  nome: string;
  idade: number;
  sexo: "MASCULINO" | "FEMININO" | string;
  vivo: boolean;
  urlFoto: string;
  ultimaOcorrencia: UltimaOcorrencia;
}

interface FormValues {
  informacao: string;
  data: string;
}

const DetalhesPessoa = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<PessoaDesaparecida | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const getPersonDetails = async (id: number) => {
    try {
      const response: any = await dispatch(fetchPerson({ id }));
      if (response.meta.requestStatus === "fulfilled") {
        setPerson(response.payload);
      } else {
        enqueueSnackbar(response.payload.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Erro ao carregar detalhes.", { variant: "error" });
    }
  };

    const updatePerson = async (id: number) => {
    try {
      const response: any = await dispatch(updatePersonOccurence({ id }));
      if (response.meta.requestStatus === "fulfilled") {
        setPerson(response.payload);
      } else {
        enqueueSnackbar(response.payload.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Erro ao carregar detalhes.", { variant: "error" });
    }
  };

  const formikConfig = {
    initialValues: {
      informacao: "",
      data: "",
    } as FormValues,
    validationSchema: Yup.object({
      informacao: Yup.string().required("A informação é obrigatória"),
      data: Yup.date().required("A data é obrigatória").typeError("Data inválida"),
    }),
    onSubmit: (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
      if (person) {
        updatePerson(person.ultimaOcorrencia.ocoId)
      }
    },
  };

  useEffect(() => {
    if (id) getPersonDetails(Number(id));
  }, [id]);

  if (!person) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Carregando detalhes...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Voltar
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card sx={{ boxShadow: 4, borderRadius: 3, overflow: "hidden" }}>
            <CardMedia
              component="img"
              image={person.urlFoto || "/placeholder.jpg"}
              alt={person.nome}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ boxShadow: 4, borderRadius: 3, p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nome" value={person.nome} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Idade" value={person.idade} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Sexo" value={person.sexo} disabled />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Status"
                  value={
                    person.ultimaOcorrencia.dataLocalizacao
                      ? person.ultimaOcorrencia.encontradoVivo
                        ? "Encontrado com vida"
                        : "Encontrado sem vida"
                      : "Desaparecido"
                  }
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Data do desaparecimento"
                  value={new Date(person.ultimaOcorrencia.dtDesaparecimento).toLocaleDateString("pt-BR")}
                  disabled
                />
              </Grid>
              {person.ultimaOcorrencia.dataLocalizacao && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Data da localização"
                    value={new Date(person.ultimaOcorrencia.dataLocalizacao).toLocaleDateString("pt-BR")}
                    disabled
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Local do desaparecimento"
                  value={person.ultimaOcorrencia.localDesaparecimentoConcat}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Vestimentas"
                  value={person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.vestimentasDesaparecido}
                  disabled
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Informações adicionais"
                  value={person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao}
                  disabled
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Formulário Formik */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: "bold" }}>
                  Adicionar informações da ocorrência
                </Typography>
                <Formik {...formikConfig}>
                  {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="informacao"
                            label="Informação"
                            multiline
                            rows={5}
                            value={values.informacao}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.informacao && Boolean(errors.informacao)}
                            helperText={touched.informacao && errors.informacao}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="data"
                            label="Data"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={values.data}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.data && Boolean(errors.data)}
                            helperText={touched.data && errors.data}
                          />
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                            Salvar
                          </Button>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetalhesPessoa;
