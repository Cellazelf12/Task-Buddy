import { collection, doc, setDoc, deleteDoc, getDocs, query } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { auth } from "./firebaseConfig";

export function addTask(task) {

  const userId = auth.currentUser.uid;

  const userRef = collection(db, "users", userId, "tasks");

  const taskData = Object.assign({}, task);

  taskData.objectives = taskData.objectives.map((obj) =>
    Object.assign({}, obj)
  );
  const taskRef = doc(userRef, task.id);

  setDoc(taskRef, taskData);
}

export function deleteTaskOnDoc(task) {
  const userId = auth.currentUser.uid;

  const userRef = collection(db, "users", userId, "tasks");

  const taskRef = doc(userRef, task.id);

  deleteDoc(taskRef)
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

export const loadTasks = (setTasks) => {

  if(!isConnected()) return;

  const userId = auth.currentUser.uid;

  const userRef = query(collection(db, "users", userId, "tasks"));

  getDocs(userRef).then((querySnapshot) => {
    const tasksAdapted = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return { id: doc.id, ...data }
    });

    setTasks(tasksAdapted);
  })
    .catch((error) => {
      //console.log("Error getting documents: ", error);
    });

}

function isConnected(){
  return (auth.currentUser != null);
}