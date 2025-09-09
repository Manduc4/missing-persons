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
  Chip,
} from '@mui/material';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { PersonsViewProps } from '../model';
import { getPersonUrl } from '../../../../utils/getPersonUrl';

const View = ({
  getPersons,
  persons,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  total,
}: PersonsViewProps) => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    nome: Yup.string().optional(),
    faixaIdadeInicial: Yup.number().min(0, 'Idade mínima inválida').optional(),
    faixaIdadeFinal: Yup.number()
      .min(Yup.ref('faixaIdadeInicial'), 'Final deve ser maior que inicial')
      .optional(),
    sexo: Yup.string().oneOf(['MASCULINO', 'FEMININO', ''], 'Sexo inválido'),
    status: Yup.string().oneOf(
      ['DESAPARECIDO', 'ENCONTRADO', ''],
      'Status inválido',
    ),
  });

  const formik = useFormik({
    initialValues: {
      nome: '',
      faixaIdadeInicial: 0,
      faixaIdadeFinal: 0,
      sexo: '',
      status: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setPage(0);
      getPersons({
        ...values,
        pagina: 0,
        porPagina: rowsPerPage,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    getPersons({
      ...formik.values,
      pagina: page,
      porPagina: rowsPerPage,
    });
  }, [page, rowsPerPage]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Desaparecidos
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2}>
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
            <Grid item xs={12} sm={1} md={2}>
              <Button type="submit" variant="contained" fullWidth size="large">
                Buscar
              </Button>
            </Grid>
          </Grid>
        </form>

        <Grid container spacing={4} sx={{ mt: 3 }} alignItems="stretch">
          {persons.map((missingPerson) => {
            const statusLabel = missingPerson.ultimaOcorrencia.dataLocalizacao
              ? missingPerson.ultimaOcorrencia.encontradoVivo
                ? 'Encontrado com vida'
                : 'Encontrado sem vida'
              : 'Desaparecido';

            const statusColor =
              statusLabel === 'Desaparecido'
                ? 'warning'
                : statusLabel === 'Encontrado com vida'
                  ? 'success'
                  : 'error';

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={missingPerson.id}
                sx={{ height: '100%' }}
              >
                <Card
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: 0,
                    boxShadow: 4,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 8,
                    },
                    maxWidth: '350px',
                  }}
                  onClick={() => navigate(`/${missingPerson.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="280px"
                    image={getPersonUrl(missingPerson)}
                    alt={`Foto de ${missingPerson.nome}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: '#000000',
                      }}
                    >
                      {missingPerson.nome}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1" color="text.primary">
                      Idade: <strong>{missingPerson.idade} anos</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'error.main' }}>
                      Desaparecimento:{' '}
                      {new Date(
                        missingPerson.ultimaOcorrencia.dtDesaparecimento,
                      ).toLocaleDateString('pt-BR')}
                    </Typography>
                    <Chip
                      label={statusLabel}
                      color={statusColor as any}
                      sx={{ mb: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
