import { firestore, storeactions } from '../firebase/firebase';

export const signUp = async ({ platformname, email, password }) => {
  try {
    const { doc, getDoc, setDoc, collection } = storeactions;

    const docRef = doc(collection(firestore, 'users'), email);
    const existingDoc = await getDoc(docRef);

    if (existingDoc.exists()) {
      console.log('Existing doc found!');
      return {
        message: {
          type: 'error',
          text: 'User already exists',
        },
      };
    }

    const userObj = {
      platformname,
      email,
      password,
    };

    await setDoc(docRef, userObj);
    return {
      message: {
        type: 'success',
        text: 'Registration successfull! Please login',
      },
    };
  } catch (err) {
    console.log(err);
    return {
      message: {
        type: 'error',
        text: 'Failed to register',
      },
    };
  }
};
