import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Box,
  TextField,
  MenuItem,
  Button,
  TablePagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  fetchMissingPersons,
  MissingPersonsPayloadProps,
} from "../../../../services/store/actions/users";
import { dispatch } from "../../../../services/store";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

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

// Schema de validação
const validationSchema = Yup.object({
  nome: Yup.string().optional(),
  faixaIdadeInicial: Yup.number().min(0, "Idade mínima inválida").optional(),
  faixaIdadeFinal: Yup.number()
    .min(Yup.ref("faixaIdadeInicial"), "Final deve ser maior que inicial")
    .optional(),
  sexo: Yup.string().oneOf(["MASCULINO", "FEMININO", ""], "Sexo inválido"),
  status: Yup.string().oneOf(["DESAPARECIDO", "ENCONTRADO", ""], "Status inválido"),
  pagina: Yup.number().min(0).required(),
  porPagina: Yup.number().min(1).required(),
});

const View = () => {
  const [missingPersons, setMissingPersons] = useState<PessoaDesaparecida[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [total, setTotal] = useState(0);

  // paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const getMissingPersons = async (filters: MissingPersonsPayloadProps) => {
    try {
      const response: any = await dispatch(fetchMissingPersons(filters));
      if (response.meta.requestStatus === "fulfilled") {
        setMissingPersons(response.payload.content);
        setTotal(response.payload.totalElements);
      } else {
        enqueueSnackbar(response.payload.message, { variant: "error" });
      }
    } catch (error: any) {
      enqueueSnackbar("Ocorreu um erro.", { variant: "error" });
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      nome: "",
      faixaIdadeInicial: 0,
      faixaIdadeFinal: 0,
      sexo: "",
      status: "",
      pagina: page,
      porPagina: rowsPerPage,
    },
    validationSchema,
    onSubmit: (values) => {
      getMissingPersons({
        ...values,
        pagina: page,
        porPagina: rowsPerPage,
      });
    },
  });

  // sincroniza filtros + paginação
  useEffect(() => {
    getMissingPersons({
      ...formik.values,
      pagina: page,
      porPagina: rowsPerPage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Pessoas Desaparecidas
        </Typography>

        {/* Formulário de filtros */}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="Nome"
                name="nome"
                fullWidth
                value={formik.values.nome}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Idade Inicial"
                name="faixaIdadeInicial"
                type="number"
                fullWidth
                value={formik.values.faixaIdadeInicial}
                onChange={formik.handleChange}
                error={!!formik.errors.faixaIdadeInicial}
                helperText={formik.errors.faixaIdadeInicial}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Idade Final"
                name="faixaIdadeFinal"
                type="number"
                fullWidth
                value={formik.values.faixaIdadeFinal}
                onChange={formik.handleChange}
                error={!!formik.errors.faixaIdadeFinal}
                helperText={formik.errors.faixaIdadeFinal}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                select
                label="Sexo"
                name="sexo"
                fullWidth
                value={formik.values.sexo}
                onChange={formik.handleChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="MASCULINO">Masculino</MenuItem>
                <MenuItem value="FEMININO">Feminino</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                select
                label="Status"
                name="status"
                fullWidth
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="DESAPARECIDO">Desaparecido</MenuItem>
                <MenuItem value="ENCONTRADO">Encontrado</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button type="submit" variant="contained" fullWidth sx={{ height: "100%" }}>
                Buscar
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Cards */}
        <Grid container spacing={4} sx={{ mt: 3 }}>
          {missingPersons.map((missingPerson) => (
            <Grid item xs={12} sm={6} md={4} key={missingPerson.id}>
              <Card
                sx={{
                  backgroundColor: "#ffffff",
                  boxShadow: 4,
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 8,
                  },
                }}
                onClick={() => navigate(`/${missingPerson.id}`)}
              >
                <CardMedia
                  component="img"
                  height="280"
                  image={missingPerson.urlFoto}
                  alt={`Foto de ${missingPerson.nome}`}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1a237e" }}>
                    {missingPerson.nome}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1" color="text.primary">
                    Idade: <strong>{missingPerson.idade} anos</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ color: "error.main" }}>
                    Desaparecida em:{" "}
                    {new Date(
                      missingPerson.ultimaOcorrencia.dtDesaparecimento
                    ).toLocaleDateString("pt-BR")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Paginação */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
            }}
            rowsPerPageOptions={[10, 15, 20]}
            labelRowsPerPage="Itens por página"
          />
        </Box>
      </Container>
    </div>
  );
};

export default View;
