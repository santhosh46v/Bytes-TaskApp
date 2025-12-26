import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import { taskService } from '../services/taskService';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scaleWidth = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 812) * size;
const scaleFont = (size) => size * (width / 375);

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingTaskId, setDeletingTaskId] = useState(null); 
  const [loggingOut, setLoggingOut] = useState(false);
  
  const { logout, user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      loadTasks();
    }
  }, [user]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery]);

  const loadTasks = async () => {
    if (!user?.uid) {
      return;
    }
    try {
      setLoading(true);
      const tasksData = await taskService.getAllTasks(user.uid);
      setTasks(tasksData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredTasks(filtered);
  };

  const handleSaveTask = async (taskData) => {
    if (!user?.uid) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData, user.uid);
        setTasks(tasks.map(task => 
          task.id === editingTask.id ? { ...task, ...taskData, userId: user.uid } : task
        ));
      } else {
        const newTask = await taskService.createTask(taskData, user.uid);
        setTasks([newTask, ...tasks]);
      }
      setModalVisible(false);
      setEditingTask(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save task');
      console.error('Error saving task:', error);
    }
  };

  const handleToggleTask = async (taskId) => {
    if (!user?.uid) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedCompleted = !task.completed;
      
      await taskService.toggleTaskCompletion(taskId, updatedCompleted, user.uid);
      
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: updatedCompleted } : t
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (deletingTaskId === taskId) {
      return;
    }

    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => setDeletingTaskId(null)
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user?.uid) {
              Alert.alert('Error', 'User not authenticated');
              return;
            }
            try {
              setDeletingTaskId(taskId); 
              await taskService.deleteTask(taskId, user.uid);
              setTasks(tasks.filter(t => t.id !== taskId));
              setDeletingTaskId(null); 
            } catch (error) {
              setDeletingTaskId(null);
              Alert.alert('Error', 'Failed to delete task');
              console.error('Error deleting task:', error);
            }
          },
        },
      ],
      { 
        cancelable: true,
        onDismiss: () => setDeletingTaskId(null)
      }
    );
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleLogout = () => {
    if (loggingOut) return;

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);
              await logout();
            } catch (error) {
              setLoggingOut(false);
              Alert.alert('Error', 'Failed to logout. Please try again.');
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const groupTasksByTimeFrame = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const incompleteTasks = filteredTasks.filter(task => !task.completed);
    const completedTasks = filteredTasks.filter(task => task.completed);

    const todayTasks = [];
    const tomorrowTasks = [];
    const thisWeekTasks = [];
    
    incompleteTasks.forEach(task => {
      if (!task.dueDate) {
        thisWeekTasks.push(task);
        return;
      }
      
      const taskDate = new Date(task.dueDate);
      const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
      
      if (taskDay.getTime() === today.getTime()) {
        todayTasks.push(task);
      } else if (taskDay.getTime() === tomorrow.getTime()) {
        tomorrowTasks.push(task);
      } else if (taskDate <= nextWeek) {
        thisWeekTasks.push(task);
      } else {
        thisWeekTasks.push(task);
      }
    });

    const sortTasks = (taskArray) => {
      return taskArray.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
      });
    };

    const sortedCompletedTasks = completedTasks.sort((a, b) => {
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });

    return {
      today: sortTasks(todayTasks),
      tomorrow: sortTasks(tomorrowTasks),
      thisWeek: sortTasks(thisWeekTasks),
      completed: sortedCompletedTasks,
    };
  };

  const getTaskCounts = () => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.completed).length;
    return { total, completed };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const groupedTasks = groupTasksByTimeFrame();
  const counts = getTaskCounts();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#8B5CF6', '#A78BFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.leftSection}>
            <View style={styles.gridIconContainer}>
              <Ionicons name="grid-outline" size={scaleFont(20)} color="white" />
            </View>
            
            {/* Prominent Search Bar */}
            <View style={styles.mainSearchContainer}>
              <View style={styles.searchCircle}>
                <Ionicons name="search-outline" size={scaleFont(16)} color="#8B5CF6" />
              </View>
              <TextInput
                style={styles.mainSearchInput}
                placeholder=""
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close" size={scaleFont(14)} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.iconButton, loggingOut && styles.iconButtonDisabled]}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <Ionicons name="hourglass-outline" size={scaleFont(20)} color="rgba(255,255,255,0.6)" />
            ) : (
              <Ionicons name="ellipsis-horizontal" size={scaleFont(20)} color="white" />
            )}
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerDate}>
          Today • {new Date().toLocaleDateString('en-US', { 
            day: 'numeric',
            month: 'short'
          })}
        </Text>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Tasks</Text>
          {searchQuery && (
            <Text style={styles.searchResults}>
              {filteredTasks.length} result{filteredTasks.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        
        {/* Task Progress */}
        {counts.total > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {counts.completed}/{counts.total} completed
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(counts.completed / counts.total) * 100}%` }
                ]} 
              />
            </View>
          </View>
        )}
      </LinearGradient>

      {/* Task List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchQuery && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsText}>
              Search results for "{searchQuery}"
            </Text>
          </View>
        )}

        {/* Today Section */}
        {groupedTasks.today.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today</Text>
            {groupedTasks.today.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                searchQuery={searchQuery}
                isDeleting={deletingTaskId === task.id}
              />
            ))}
          </View>
        )}

        {/* Tomorrow Section */}
        {groupedTasks.tomorrow.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tomorrow</Text>
            {groupedTasks.tomorrow.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                searchQuery={searchQuery}
                isDeleting={deletingTaskId === task.id}
              />
            ))}
          </View>
        )}

        {/* This Week Section */}
        {groupedTasks.thisWeek.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This week</Text>
            {groupedTasks.thisWeek.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                searchQuery={searchQuery}
                isDeleting={deletingTaskId === task.id}
              />
            ))}
          </View>
        )}

        {/* Completed Section - with special styling */}
        {groupedTasks.completed.length > 0 && (
          <View style={[styles.section, styles.completedSection]}>
            <View style={styles.completedSectionHeader}>
              <View style={styles.completedTitleContainer}>
                <Ionicons name="checkmark-circle" size={scaleFont(20)} color="#10B981" />
                <Text style={[styles.sectionTitle, styles.completedSectionTitle]}>
                  Completed
                </Text>
              </View>
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>
                  {groupedTasks.completed.length}
                </Text>
              </View>
            </View>
            <View style={styles.completedTasksContainer}>
              {groupedTasks.completed.map((task) => (
                <View key={task.id} style={styles.completedTaskWrapper}>
                  <TaskItem
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    searchQuery={searchQuery}
                    isDeleting={deletingTaskId === task.id}
                    isCompleted={true}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && !searchQuery && (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={scaleFont(63)} color="#DDD" />
            <Text style={styles.emptyStateTitle}>No tasks yet</Text>
            <Text style={styles.emptyStateText}>
              Create your first task to get started!
            </Text>
          </View>
        )}

        {/* No Search Results */}
        {filteredTasks.length === 0 && searchQuery && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={scaleFont(64)} color="#DDD" />
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search terms
            </Text>
          </View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="list" size={scaleFont(24)} color="#8B5CF6" />
          <Text style={styles.activeNavText}>Tasks</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem2}>
          <Ionicons name="calendar-outline" size={scaleFont(24)} color="#9CA3AF" />
          <Text style={styles.navText}>Calendar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={scaleFont(24)} color="white" />
      </TouchableOpacity>
      
      <TaskModal
        visible={modalVisible}
        task={editingTask}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: scaleFont(16),
    color: '#666',
  },
  header: {
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleHeight(40),
    paddingBottom: scaleHeight(24),
    borderBottomLeftRadius: scaleWidth(24),
    borderBottomRightRadius: scaleWidth(24),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleHeight(16),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: scaleWidth(12),
  },
  gridIconContainer: {
    width: scaleWidth(32),
    height: scaleWidth(32),
    borderRadius: scaleWidth(16),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainSearchContainer: {
    width: scaleWidth(250),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: scaleWidth(20),
    paddingHorizontal: scaleWidth(4),
    paddingVertical: scaleHeight(4),
    height: scaleHeight(36),
  },
  searchCircle: {
    width: scaleWidth(28),
    height: scaleWidth(28),
    borderRadius: scaleWidth(14),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleWidth(8),
  },
  mainSearchInput: {
    flex: 1,
    color: '#333',
    fontSize: scaleFont(14),
    padding: 0,
    height: '100%',
  },
  clearButton: {
    width: scaleWidth(20),
    height: scaleWidth(20),
    borderRadius: scaleWidth(10),
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleWidth(4),
  },
  iconButton: {
    width: scaleWidth(32),
    height: scaleWidth(32),
    borderRadius: scaleWidth(16),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    opacity: 0.6,
  },
  headerDate: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: scaleFont(14),
    marginBottom: scaleHeight(4),
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: scaleHeight(16),
  },
  headerTitle: {
    color: 'white',
    fontSize: scaleFont(24),
    fontWeight: 'bold',
  },
  searchResults: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: scaleFont(12),
  },
  progressContainer: {
    marginTop: scaleHeight(8),
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: scaleFont(12),
    marginBottom: scaleHeight(8),
  },
  progressBar: {
    height: scaleHeight(4),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scaleWidth(2),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: scaleWidth(2),
  },
  content: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleHeight(20),
  },
  searchResultsContainer: {
    marginBottom: scaleHeight(16),
  },
  searchResultsText: {
    fontSize: scaleFont(14),
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: scaleHeight(24),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: scaleHeight(12),
  },
  completedSection: {
    backgroundColor: '#F8FBF8',
    borderRadius: scaleWidth(16),
    padding: scaleWidth(16),
    marginBottom: scaleHeight(24),
    borderWidth: 1,
    borderColor: '#E6F7E6',
  },
  completedSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scaleHeight(16),
  },
  completedTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedSectionTitle: {
    color: '#10B981',
    marginLeft: scaleWidth(8),
    marginBottom: 0,
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: scaleWidth(12),
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(4),
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  completedBadgeText: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: '#059669',
  },
  completedTasksContainer: {
    gap: scaleHeight(8),
  },
  completedTaskWrapper: {
    backgroundColor: 'white',
    borderRadius: scaleWidth(12),
    padding: scaleWidth(2),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleHeight(60),
  },
  emptyStateTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: '#333',
    marginTop: scaleHeight(16),
    marginBottom: scaleHeight(8),
  },
  emptyStateText: {
    fontSize: scaleFont(14),
    color: '#666',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleWidth(40),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderTopLeftRadius: scaleWidth(20),
    borderTopRightRadius: scaleWidth(20),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: scaleHeight(6),
    position: 'relative',
    marginRight: scaleWidth(140)
  },
  navItem2: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: scaleHeight(8),
    position: 'relative',
  },
  activeNavText: {
    fontSize: scaleFont(12),
    color: '#8B5CF6',
    fontWeight: '600',
    marginTop: scaleHeight(4),
  },
  navText: {
    fontSize: scaleFont(12),
    color: '#9CA3AF',
    marginTop: scaleHeight(4),
  },
  fab: {
    position: 'absolute',
    bottom: scaleHeight(40),
    right: scaleWidth(165),
    width: scaleWidth(56),
    height: scaleWidth(56),
    borderRadius: scaleWidth(28),
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: scaleHeight(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: scaleHeight(8),
    elevation: 8,
  },
  bottomPadding: {
    height: scaleHeight(100),
  },
});