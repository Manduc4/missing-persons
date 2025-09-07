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
import { FormValues, PersonViewProps } from "../model";

const View = ({getPerson, getPersonOccurrence, person, updatePersonOccurrence}: PersonViewProps) => {
  const { id } = useParams<{ id: string }>();

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
        updatePersonOccurrence(person.ultimaOcorrencia.ocoId)
      }
    },
  };

  useEffect(() => {
    if (id) getPerson(Number(id));
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

export default View;
