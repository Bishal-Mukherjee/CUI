import { firestore, storeactions } from '../firebase/firebase';

export const getExistingData = async ({ user, editingObj, sectionName }) => {
  try {
    const { doc, getDoc, collection } = storeactions;
    const { platformname } = user;
    const docRef = doc(collection(firestore, 'platforms'), platformname);
    const existingDoc = await getDoc(docRef);

    if (existingDoc.exists()) {
      const documentData = existingDoc.data();

      const { brandname, version } = editingObj;
      const brandVersionData = documentData[brandname][version];
      return brandVersionData.template[sectionName];
    }
    return {};
  } catch (err) {
    console.log(err);
    return err;
  }
};
