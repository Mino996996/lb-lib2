import { initializeApp } from 'firebase/app';
import { getAuth, signOut, signInAnonymously } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';

import { CategoryInfo, UploadFileData, UploadFileImageData, EventLog } from '../components/utilTypes';
// import {urlInfoList} from "../fixtures/stab/urlStab";
import { Obj } from '../components/EventComponents/cardFunctions';
import { createId } from '../utils/utilFinctions';

const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const functions = getFunctions(firebaseApp, 'asia-northeast1');
const storage = getStorage(firebaseApp);

// 外部functionsの呼び出し
const firebaseFunction = httpsCallable(functions, 'helloWorld');

// サインイン
// export const signIn = () => {
//   signInWithEmailAndPassword(auth, process.env.REACT_APP_SIGNIN_EMAIL!,  process.env.REACT_APP_SIGNIN_PASSWORD!)
//     .then((userCredential) => {
//       console.log('OKOK123')
//     })
//     .catch((error) => {
//       // const errorCode = error.code;
//       // const errorMessage = error.message;
//     });
// }

export const signIn = (): void => {
  signInAnonymously(auth)
    .then((userCredential) => {
      console.log('OKOK123');
      console.log(userCredential.user.uid);
    })
    .catch((error) => {
      console.error(error);
      // const errorCode = error.code;
      // const errorMessage = error.message;
    });
};

export const firebaseSignOut = async (): Promise<void> => {
  await signOut(auth);
};

// 情報源urlとタブ情報などを登録する
export const addUrl = async (urlInfo: EventLog): Promise<void> => {
  const urlData = { ...urlInfo };
  const urlDocRef = doc(db, 'url', urlInfo.id);
  await setDoc(urlDocRef, urlData);
};

// 情報源urlとタブ情報などを登録する
export const updateUrl = async (urlInfo: EventLog): Promise<void> => {
  const urlData = { ...urlInfo };
  const urlDocRef = doc(db, 'url', urlInfo.id);
  await updateDoc(urlDocRef, urlData);
};

// 情報源urlの削除
export const deleteUrl = async (urlInfo: EventLog): Promise<void> => {
  const urlDocRef = doc(db, 'url', urlInfo.id);
  await deleteDoc(urlDocRef);
};

// こういうことはOKなのか？
// prototypeを使うのか？
// メモリ管理について大丈夫なのか？
export const urlDb = {
  add: addUrl,
  update: updateUrl,
  delete: deleteUrl,
};

// メインカテゴリ
export const addCategory = async (categoryData: CategoryInfo): Promise<void> => {
  const category = { ...categoryData };
  const urlDocRef = doc(db, 'category', categoryData.id);
  await setDoc(urlDocRef, category);
};

export const updateCategory = async (categoryData: CategoryInfo): Promise<void> => {
  const category = { ...categoryData };
  console.log(category);
  const urlDocRef = doc(db, 'category', categoryData.id);
  await updateDoc(urlDocRef, category);
};

export const deleteCategory = async (categoryData: CategoryInfo): Promise<void> => {
  const urlDocRef = doc(db, 'category', categoryData.id);
  await deleteDoc(urlDocRef);
};

export const categoryDb = {
  add: addCategory,
  update: updateCategory,
  delete: deleteCategory,
};

// 全カテゴリデータ取得
export const getAllCategories = async (): Promise<CategoryInfo[]> => {
  const categoryRef = collection(db, 'category');
  const cateDoc = await getDocs(categoryRef);
  if (!cateDoc.empty) {
    return cateDoc.docs.map((value) => value.data()) as CategoryInfo[];
  } else {
    return [];
  }
};

export const checkCategoryName = async (categoryName: string): Promise<boolean> => {
  const categoryRef = collection(db, 'category');
  const q = query(categoryRef, where('category', '==', categoryName));
  const cateDoc = await getDocs(q);
  return cateDoc.empty;
};

// 全URLデータ取得
export const getAllUrls = async (): Promise<EventLog[]> => {
  const query = collection(db, 'url');
  const urlDocs = await getDocs(query);
  if (!urlDocs.empty) {
    return urlDocs.docs.map((value) => value.data()) as EventLog[];
  } else {
    return [];
  }
};

// Firebaseに登録したファンクションを経由してOGPデータを取得する
export const getOgpData = async (message: string): Promise<Obj> => {
  const result = await firebaseFunction(message);
  return result.data as Obj;
};

/* storage */
export const fbStorageUpload = async (file: File): Promise<UploadFileData> => {
  const fileId = `${createId(8)}_${file.name}`;
  const storageRef = ref(storage, fileId);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return {
    id: fileId,
    name: file.name,
    url,
  };
};

export const fbPdfImageUpload = async (base64Data: string): Promise<UploadFileImageData> => {
  // Base64から画像ファイルに
  const tmp = base64Data.split(',');
  const data = atob(tmp[1]);
  const mime = tmp[0].split(':')[1].split(';')[0];
  const buf = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    buf[i] = data.charCodeAt(i);
  }
  const blob = new Blob([buf], { type: mime });
  const imageFile = new File([blob], 'image.png', {
    lastModified: new Date().getTime(),
  });
  // アップロードしたのちにURL取得
  const fileId = `image/${createId(12)}_fileImage.png`;
  const storageRef = ref(storage, fileId);
  const metadata = {
    contentType: 'image/png',
  };
  await uploadBytes(storageRef, imageFile, metadata);
  const url = await getDownloadURL(storageRef);
  return {
    id: fileId,
    url,
  };
};

export const fbStorageDelete = async (fileId: string): Promise<void> => {
  const storageRef = ref(storage, fileId);
  await deleteObject(storageRef);
};
