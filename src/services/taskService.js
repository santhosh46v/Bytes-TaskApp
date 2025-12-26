import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  query,
  where
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const COLLECTION_NAME = 'tasks';

export const taskService = {

  async getAllTasks(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required to fetch tasks');
      }
      // Query without orderBy to avoid needing a composite index
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      // Sort by createdAt in descending order (newest first) in JavaScript
      tasks.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Descending order
      });
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  async createTask(taskData, userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required to create a task');
      }
      const taskDataWithUserId = {
        ...taskData,
        userId: userId
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), taskDataWithUserId);
      return { id: docRef.id, ...taskDataWithUserId };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTask(taskId, taskData, userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required to update a task');
      }
      // Ensure userId is not overwritten during update, and preserve createdAt
      const { createdAt, ...taskDataWithoutCreatedAt } = taskData;
      const updateData = {
        ...taskDataWithoutCreatedAt,
        userId: userId,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(doc(db, COLLECTION_NAME, taskId), updateData);
      return { id: taskId, ...updateData };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(taskId, userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required to delete a task');
      }
      await deleteDoc(doc(db, COLLECTION_NAME, taskId));
      return taskId;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  async toggleTaskCompletion(taskId, completed, userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required to toggle task completion');
      }
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