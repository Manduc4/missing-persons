import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

export const Layout = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
    </Container>
  );
};
