import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Container, Stack, Typography, LinearProgress, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfile } from "src/sections/account/account-profile";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import { WorkoutsTable } from 'src/sections/customer/workouts-table';
import api from "../../utils/api";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { customerId } = router.query;


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/user/${customerId}`);
      if (data) {
        console.log("🚀 ~ fetchData ~ data:", data)
        setUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };
  const updateCustomer = async (newCustomer) => {
    const response = await api.put(`/user/${customerId}`, newCustomer);
    if (response.status === 201) {
      setData(data);
      setOpen(false);
    }

  };


  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }
  return (
    <>
      <Head>
        <title>Clientes</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Grid container
                spacing={3}>
                <Grid item
                  xs={12}
                  md={12}
                  lg={12}>
                    <Box >
                    <AccountProfile user={user} />
                  </Box>
                  <Box >
                    <AccountProfileDetails
                      props={user}
                      onUpdateCustomer={updateCustomer}
                    />
                  </Box>
                  <Box >
                    <WorkoutsTable
                      workouts={user.workouts}
                    />
                  </Box>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
