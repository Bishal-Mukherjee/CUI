import React, { useState, useEffect, useContext, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import { firestore, storeactions, auth } from '../firebase/firebase';

const Context = createContext({
  user: {},
  editingObj: {},
  setEditingObj: () => {},
  saveChangesToCloud: () => {},
});

export function useObjContext() {
  return useContext(Context);
}

export const AppObjContext = ({ children }) => {
  const { Provider } = Context;
  const { getAuth, onAuthStateChanged } = auth;
  const location = useLocation();

  const [snackbar, setSnackbar] = useState({ text: '', type: '' });
  const [user, setUser] = useState({});
  const [editingObj, setEditingObj] = useState({});

  // to prevent accidental deletion of unsaved changes
  //   window.onbeforeunload = function (e) {
  //     const mainObjLength = JSON.stringify(mainObj);
  //     if (mainObjLength.length > 0) {
  //       return window.confirm('Confirm refresh?');
  //     }
  //     return true;
  //   };

  const saveChangesToCloud = async (params) => {
    try {
      const confirmChanges = window.confirm('Are you sure you want to save changes?');
      if (confirmChanges) {
        const { doc, getDoc, setDoc, collection } = storeactions;

        const { platformname } = user;

        const docRef = doc(collection(firestore, 'platforms'), platformname);
        const existingDoc = await getDoc(docRef);

        if (existingDoc.exists()) {
          const documentData = existingDoc.data();

          const { brandname, version } = editingObj;

          const updatedDoc = {
            ...documentData,
            [brandname]: {
              ...documentData[brandname],
              [version]: {
                ...documentData[brandname][version],
                template: {
                  ...documentData[brandname][version].template,
                  ...params,
                },
              },
            },
          };

          await setDoc(docRef, updatedDoc);
          setSnackbar({ ...snackbar, type: 'success', text: 'Changes uploaded to cloud!' });
        } else {
          await setDoc(docRef, params);
          setSnackbar({ ...snackbar, type: 'success', text: 'Changes uploaded to cloud!' });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getUserDetails = async (userEmail) => {
    try {
      const { doc, getDoc, collection } = storeactions;
      const docRef = doc(collection(firestore, 'users'), userEmail);
      const existingDoc = await getDoc(docRef);
      const { users, password, ...rest } = existingDoc.data();
      return rest;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  useEffect(() => {
    const authInstance = getAuth();
    onAuthStateChanged(authInstance, async (authuser) => {
      if (authuser) {
        const userCollection = await getUserDetails(authuser.email);
        const tempuser = {
          ...userCollection,
          ...authuser,
        };
        setUser(tempuser);
      } else {
        setUser(null);
      }
    });
  }, [location]);

  const contextobj = {
    user,
    editingObj,
    setEditingObj,
    saveChangesToCloud,
  };

  return (
    <Provider value={contextobj}>
      {snackbar.text ? (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(Object.values(snackbar).length)}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ type: '', text: '' })}
        >
          <Alert sx={{ color: 'white', minWidth: 200 }} variant="filled" severity={snackbar.type}>
            {snackbar.text}
          </Alert>
        </Snackbar>
      ) : null}
      {children}
    </Provider>
  );
};
