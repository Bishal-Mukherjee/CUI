import { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
// @mui
import { CircularProgress, Backdrop } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import { firestore, storeactions } from '../../firebase/firebase';
import Navbar from '../../sections/preview/Navbar/Navbar';
import { useObjContext } from '../../context/context';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE,
  //   paddingBottom: theme.spacing(10),
  //   [theme.breakpoints.up('lg')]: {
  //     paddingTop: APP_BAR_DESKTOP,
  //     paddingLeft: theme.spacing(1),
  //     paddingRight: theme.spacing(1),
  //   },
}));

// ----------------------------------------------------------------------

export default function PreviewLayout() {
  const { brandname = 'WhatsApp', version = 'Release1.0' } = useParams();
  const { user } = useObjContext();

  const [mainObj, setMainObj] = useState({});
  const [showLoader, setShowLoader] = useState(false);

  const handleGetMainObj = async () => {
    try {
      setShowLoader(true);
      const { doc, getDoc, collection } = storeactions;

      const { platformname } = user;
      const docRef = doc(collection(firestore, 'platforms'), platformname);
      const existingDoc = await getDoc(docRef);

      if (existingDoc.exists()) {
        const documentData = existingDoc.data();
        const { template } = documentData[brandname][version];

        if (template) {
          setMainObj(template);
        } else {
          setMainObj({});
        }
      }

      setShowLoader(false);
    } catch (err) {
      console.log(err);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    handleGetMainObj();
  }, [version, user]);

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showLoader}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Navbar mainObj={mainObj} />

      <Main>
        <Outlet context={[mainObj, version]} />
      </Main>
    </>
  );
}
