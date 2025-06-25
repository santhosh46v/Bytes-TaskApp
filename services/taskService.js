import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const COLLECTION_NAME = 'tasks';

export const taskService = {

  async getAllTasks() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  async createTask(taskData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), taskData);
      return { id: docRef.id, ...taskData };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTask(taskId, taskData) {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, taskId), taskData);
      return { id: taskId, ...taskData };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(taskId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, taskId));
      return taskId;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  async toggleTaskCompletion(taskId, completed) {
    try {
      const updateData = {
        completed,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(doc(db, COLLECTION_NAME, taskId), updateData);
      return updateData;
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }
};