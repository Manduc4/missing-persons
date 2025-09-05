import { Container, Grid, Box } from "@mui/material";
import Budget from "../../../components/home/budget";
import TotalCustomers from "../../../components/home/totalCustomers";
import Sales from "../../../components/home/sales";
import TasksProgress from "../../../components/home/taskProgress";
import TotalProfit from "../../../components/home/totalProfit";
import TrafficByDevice from "../../../components/home/trafficByDevice";
import LatestProducts from "../../../components/home/latestProducts";
import LatestOrders from "../../../components/home/latestOrders";
import { dispatch } from "../../../services/store";
import { fetchMissingPersons, fetchUserList } from "../../../services/store/actions/users";

const View = () => {
    const getUsers = async () => {
      try {
        const response: any = await dispatch(fetchUserList());
        
        console.log(response, 'response')    
        if (response.meta.requestStatus === "fulfilled") {
          // setUserList(response.payload)
        } else {
          // enqueueSnackbar("Ocorreu um erro.", { variant: "error" });
        }
      } catch (error: any) {
        // enqueueSnackbar("Ocorreu um erro.", { variant: "error" });
        console.log(error);
      }
    };

    getUsers()

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalCustomers />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TasksProgress />
          </Grid>
          <Grid item xl={3} lg={3} sm={6} xs={12}>
            <TotalProfit sx={{ height: "100%" }} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <Sales />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice sx={{ height: "100%" }} />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts sx={{ height: "100%" }} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default View;
