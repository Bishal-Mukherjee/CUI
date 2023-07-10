import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  Button,
  Box,
  Container,
  Paper,
  TextField,
  Stack,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Helmet } from 'react-helmet-async';

import dayjs from 'dayjs';
import { storeactions, firestore } from '../../firebase/firebase';

import { useObjContext } from '../../context/context';
import UserDialog from './UserDialog';

const columns = [
  { field: 'id', headerName: 'ID', width: 170 },
  { field: 'name', headerName: 'Name', width: 170 },
  { field: 'email', headerName: 'Email Address', width: 170 },
  { field: 'designation', headerName: 'Designation', width: 170 },
  { field: 'platformname', headerName: 'Platform Name', width: 170 },
  {
    field: 'brandname',
    headerName: 'Associated Brand',
    width: 170,
  },
  {
    field: 'addedOn',
    headerName: 'Added On',
    width: 170,
  },
];

const Users = () => {
  const { user } = useObjContext();

  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [existingBrands, setExistingBrands] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [users, setUsers] = useState([]);

  const handleGetExistingBrands = async () => {
    try {
      setShowLoader(true);
      const { doc, getDoc, collection } = storeactions;
      const { platformname } = user;
      const docRef = doc(collection(firestore, 'platforms'), platformname);
      const existingDoc = await getDoc(docRef);

      if (existingDoc.data()) {
        const documentData = existingDoc.data();
        const tempBrands = Object.keys(documentData)?.map((k) => ({
          label: k,
        }));

        setExistingBrands(tempBrands);
        setSelectedBrand(tempBrands[0].label);
      }
      setShowLoader(false);
    } catch (err) {
      console.log(err);
      setShowLoader(false);
    }
  };

  const handleGetBrandUsers = async () => {
    try {
      if (selectedBrand) {
        setShowLoader(true);
        const { doc, getDoc, collection } = storeactions;
        const { email } = user;
        const docRef = doc(collection(firestore, 'users'), email);
        const existingDoc = await getDoc(docRef);

        if (existingDoc.data()) {
          const documentData = existingDoc.data();
          const addedUsers = documentData.users[selectedBrand]?.map((user, index) => ({
            id: index + 1,
            name: user.name,
            email: user.email,
            designation: user.designation,
            platformname: user.platformname,
            brandname: user.brandname,
            addedOn: dayjs(user.addedOn).format('DD.MM.YYYY'),
          }));
          if (addedUsers) {
            setUsers(addedUsers);
          } else {
            setUsers([]);
          }
        }
        setShowLoader(false);
      }
    } catch (err) {
      console.log(err);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    handleGetExistingBrands();
  }, [user]);

  useEffect(() => {
    handleGetBrandUsers();
  }, [selectedBrand]);

  return (
    <>
      <Helmet>
        <title> User Management </title>
      </Helmet>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showLoader}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Container maxWidth={'xl'} sx={{ mt: 10 }}>
        <Stack direction={'row'} sx={{ mt: 5 }}>
          <Box>
            <Autocomplete
              disablePortal
              value={selectedBrand}
              onChange={(event, newValue) => {
                setSelectedBrand(newValue.label);
              }}
              onInputChange={(event, newInputValue) => {
                if (newInputValue.label) setSelectedBrand(newInputValue.label);
              }}
              options={existingBrands}
              sx={{ width: 350 }}
              ListboxProps={{ style: { maxHeight: 185 } }}
              renderInput={(params) => <TextField {...params} label="Choose brand" />}
            />
          </Box>

          <Box sx={{ ml: 'auto' }}>
            <Button sx={{ height: '7vh' }} variant="contained" onClick={() => setOpen(true)}>
              Add User
            </Button>
          </Box>
        </Stack>

        <Paper sx={{ mt: 5 }}>
          <div style={{ height: 400, width: '100%', marginTop: 10 }}>
            <DataGrid
              rows={users || []}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          </div>
        </Paper>

        {open ? <UserDialog open={open} setOpen={setOpen} existingBrands={existingBrands} /> : null}
      </Container>
    </>
  );
};

export default Users;
