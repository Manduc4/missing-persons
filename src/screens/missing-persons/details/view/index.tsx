import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Box,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { dispatch } from "../../../../services/store";
import { fetchMissingPersons } from "../../../../services/store/actions/users";

// Reaproveitando interfaces
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

const DetalhesPessoa = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<PessoaDesaparecida | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const getPersonDetails = async (id: number) => {
    try {
      // Reaproveitando fetchMissingPersons para buscar só 1 item
      const response: any = await dispatch(
        fetchMissingPersons({ pagina: 0, porPagina: 1 })
      );
      if (response.meta.requestStatus === "fulfilled") {
        setPerson(response.payload.content[0]);
      } else {
        enqueueSnackbar(response.payload.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Erro ao carregar detalhes.", { variant: "error" });
    }
  };

  useEffect(() => {
    if (id) {
      getPersonDetails(Number(id));
    }
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
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Voltar
      </Button>

      <Card sx={{ boxShadow: 4, borderRadius: 2, overflow: "hidden" }}>
        <Grid container>
          <Grid item xs={12} md={7}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1a237e" }}>
                {person.nome}
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Typography variant="body1">
                <strong>Idade:</strong> {person.idade} anos
              </Typography>
              <Typography variant="body1">
                <strong>Sexo:</strong> {person.sexo}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong>{" "}
                {person.ultimaOcorrencia.dataLocalizacao
                  ? person.ultimaOcorrencia.encontradoVivo
                    ? "Encontrado com vida"
                    : "Encontrado sem vida"
                  : "Desaparecido"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Data do desaparecimento:</strong>{" "}
                {new Date(person.ultimaOcorrencia.dtDesaparecimento).toLocaleDateString("pt-BR")}
              </Typography>
              {person.ultimaOcorrencia.dataLocalizacao && (
                <Typography variant="body1">
                  <strong>Data da localização:</strong>{" "}
                  {new Date(person.ultimaOcorrencia.dataLocalizacao).toLocaleDateString("pt-BR")}
                </Typography>
              )}
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Local do desaparecimento:</strong>{" "}
                {person.ultimaOcorrencia.localDesaparecimentoConcat}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Vestimentas:</strong>{" "}
                {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.vestimentasDesaparecido}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Informações adicionais:</strong>{" "}
                {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao}
              </Typography>

              {/* Cartazes se existirem */}
              {person.ultimaOcorrencia.listaCartaz && person.ultimaOcorrencia.listaCartaz.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6">Cartazes</Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {person.ultimaOcorrencia.listaCartaz.map((cartaz, idx) => (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                        <CardMedia
                          component="img"
                          image={cartaz}
                          alt={`Cartaz ${idx + 1}`}
                          sx={{
                            borderRadius: 2,
                            boxShadow: 2,
                            cursor: "pointer",
                            transition: "0.2s",
                            "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default DetalhesPessoa;
