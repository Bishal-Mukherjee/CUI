import React, { useEffect, useState } from 'react';
import { Box, Typography, Drawer, CircularProgress, Stack, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import { useObjContext } from '../../../../context/context';
import { firestore, storeactions } from '../../../../firebase/firebase';

// ----------------------------------------------------------------------

const ThemeCard = ({ primary, secondary, isselected, selectTheme }) => (
  <Box
    sx={{
      bgcolor: isselected ? secondary : '',
      width: 80,
      height: 60,
      borderRadius: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderStyle: 'dotted',
      borderWidth: 1,
      borderColor: '#C4CDD5',
      cursor: 'pointer',
      ':hover': {
        bgcolor: secondary,
      },
    }}
    onClick={() => selectTheme()}
  >
    <Icon icon={'prime:circle-fill'} width={isselected ? 25 : 15} style={{ color: primary }} />
  </Box>
);

export default function ThemeDrawer({ setOpen }) {
  const { editingObj, user, saveChangesToCloud } = useObjContext();
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [showSaveLoader, setShowSaveLoader] = useState(false);

  const themes = {
    '#5BE49B': '#C8FAD6',
    '#FF5630': '#FFE9D5',
    '#FFAB00': '#FFF5CC',
    '#00B8D9': '#CAFDF5',
  };

  const handleSaveTheme = () => {
    try {
      setShowSaveLoader(true);
      saveChangesToCloud({
        theme: selectedTheme,
      });
      setShowSaveLoader(false);
    } catch (err) {
      console.log(err);
      setShowSaveLoader(false);
    }
  };

  const handleGetSavedTheme = async () => {
    try {
      setShowLoader(true);
      const { doc, getDoc, collection } = storeactions;

      const { platformname } = user;
      const docRef = doc(collection(firestore, 'platforms'), platformname);
      const existingDoc = await getDoc(docRef);

      const { brandname, version } = editingObj;

      if (existingDoc.exists()) {
        const documentData = existingDoc.data();
        const { template } = documentData[brandname][version];

        if (template.theme) {
          setSelectedTheme(template.theme);
          console.log(template.theme);
        } else {
          setSelectedTheme('');
        }
      }

      setShowLoader(false);
    } catch (err) {
      console.log(err);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    handleGetSavedTheme();
  }, [user]);

  return (
    <Drawer anchor={'right'} open onClose={() => setOpen(false)}>
      <Box sx={{ width: 320, height: '100%' }}>
        {showLoader ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress sx={{ color: 'black' }} />
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: '100%' }}>
            <Stack direction={'column'} sx={{ p: 2 }}>
              <Typography variant="subtitle2" color={'GrayText'}>
                Themes
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                {Object.keys(themes).map((t, index) => (
                  <Grid item xs={4} md={4} key={index}>
                    <ThemeCard
                      primary={t}
                      secondary={themes[t]}
                      isselected={selectedTheme === themes[t]}
                      selectTheme={() => setSelectedTheme(themes[t])}
                    />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 1 }}>
                <LoadingButton variant="contained" onClick={() => handleSaveTheme()} loading={showSaveLoader}>
                  Save
                </LoadingButton>
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
