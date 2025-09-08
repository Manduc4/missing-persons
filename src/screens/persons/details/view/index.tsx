import {
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  Divider,
  Button,
  TextField,
  Chip,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormValues, PersonViewProps } from "../model";
import { getPersonUrl } from "../../../../utils/getPersonUrl";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

const View = ({
  getPerson,
  person,
  updatePersonOccurrence,
  getPersonOccurrence,
  personOccurrence = [],
}: PersonViewProps & { personOccurrence?: { data: string; informacao: string }[] }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const formik = useFormik<FormValues>({
    initialValues: {
      informacao: "",
      data: ""
    },
    validationSchema: Yup.object({
      informacao: Yup.string().required("A informação é obrigatória"),
      data: Yup.date()
        .required("A data é obrigatória")
        .typeError("Data inválida"),
    }),
    onSubmit: (values) => {
      if (person) {
        updatePersonOccurrence({
          ...values,
          ocoId: person.ultimaOcorrencia.ocoId,
          data: dayjs(values.data).format("YYYY-MM-DD"),
        });
      }
    },
    enableReinitialize: true,
  });

  const { errors, touched } = formik;

  useEffect(() => {
    if (!Number(id)) {
      navigate("/404");
      return;
    }
    getPerson(Number(id));
  }, [id]);

  useEffect(() => {
    if (person?.ultimaOcorrencia.ocoId) {
      getPersonOccurrence(person.ultimaOcorrencia.ocoId);
    }
  }, [person]);

  if (!person) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Carregando detalhes...</Typography>
      </Container>
    );
  }

  const statusLabel = person.ultimaOcorrencia.dataLocalizacao
    ? person.ultimaOcorrencia.encontradoVivo
      ? "Encontrado com vida"
      : "Encontrado sem vida"
    : "Desaparecido";

  const statusColor =
    statusLabel === "Desaparecido"
      ? "warning"
      : statusLabel === "Encontrado com vida"
      ? "success"
      : "error";

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h2">Desaparecidos</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Foto e status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
            <CardMedia
              component="img"
              image={getPersonUrl(person)}
              alt={person.nome}
              sx={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 3 }}
            />
          </Card>
        </Grid>

        {/* Conteúdo em Tabs */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 4, p: 3, borderRadius: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label="Informações" />
              <Tab label="Viu esta pessoa?" />
            </Tabs>

            {/* Aba Informações */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h4" gutterBottom>
                  {person.nome}
                </Typography>
                <Chip label={statusLabel} color={statusColor as any} sx={{ mb: 2 }} />
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Idade
                    </Typography>
                    <Typography>{person.idade}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Sexo
                    </Typography>
                    <Typography>{person.sexo}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography>{statusLabel}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Data do desaparecimento
                    </Typography>
                    <Typography>
                      {new Date(person.ultimaOcorrencia.dtDesaparecimento).toLocaleDateString(
                        "pt-BR"
                      )}
                    </Typography>
                  </Grid>
                  {person.ultimaOcorrencia.dataLocalizacao && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Data da localização
                      </Typography>
                      <Typography>
                        {new Date(person.ultimaOcorrencia.dataLocalizacao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Local do desaparecimento
                    </Typography>
                    <Typography>{person.ultimaOcorrencia.localDesaparecimentoConcat}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Vestimentas
                    </Typography>
                    <Typography>
                      {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.vestimentasDesaparecido}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Informações adicionais
                    </Typography>
                    <Typography>
                      {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Aba "Viu esta pessoa?" */}
            {tabValue === 1 && (
              <Box>
                <Grid container spacing={4}>
                  {/* Formulário */}
                  <Grid item xs={12} md={6}>
                    <form onSubmit={formik.handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="informacao"
                            label="Informação"
                            multiline
                            rows={3}
                            value={formik.values.informacao}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.informacao && Boolean(formik.errors.informacao)}
                            helperText={formik.touched.informacao && formik.errors.informacao}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DatePicker
                              label="Data"
                              value={formik.values.data}
                              onChange={(newValue) => formik.setFieldValue("data", newValue)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  error={formik.touched.data && Boolean(formik.errors.data)}
                                  helperText={formik.touched.data && formik.errors.data}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                          <Button type="submit" variant="contained" color="primary">
                            Salvar
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>

                  {/* Listagem de ocorrências com scroll */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Ocorrências registradas
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {personOccurrence.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Nenhuma ocorrência registrada.
                      </Typography>
                    ) : (
                      <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
                        <List>
                          {personOccurrence.map((occ, idx) => (
                            <ListItem key={idx} divider>
                              <ListItemText
                                primary={occ.informacao}
                                secondary={new Date(occ.data).toLocaleDateString("pt-BR")}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default View;
