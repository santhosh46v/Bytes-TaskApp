import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isSwipeActionsVisible, setIsSwipeActionsVisible] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#6BCF7F';
      default: return '#FFD93D';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Med';
      case 'low': return 'Low';
      default: return 'Med';
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'work': return '#8B5CF6';
      case 'personal': return '#10B981';
      case 'study': return '#F59E0B';
      case 'health': return '#EF4444';
      case 'shopping': return '#EC4899';
      case 'family': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowDay = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    if (taskDay.getTime() === todayDay.getTime()) {
      return 'Today';
    } else if (taskDay.getTime() === tomorrowDay.getTime()) {
      return 'Tomorrow';
    }
    
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !task.completed;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        translateX.setOffset(translateX._value);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        translateX.flattenOffset();
        
        if (gestureState.dx < -50) {
          setIsSwipeActionsVisible(true);
          Animated.spring(translateX, {
            toValue: -80,
            useNativeDriver: true,
          }).start();
        } else {
          setIsSwipeActionsVisible(false);
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const hideSwipeActions = () => {
    setIsSwipeActionsVisible(false);
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: hideSwipeActions
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            hideSwipeActions();
            setTimeout(() => onDelete(task.id), 200);
          }
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[
      styles.taskContainer,
      task.completed && styles.completedTaskContainer
    ]}>
      <View style={styles.swipeContainer}>
        <View style={styles.deleteActionContainer}>
          <TouchableOpacity 
            style={styles.deleteAction}
            onPress={confirmDelete}
          >
            <View style={styles.deleteActionCircle}>
              <Ionicons name="trash-outline" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Task Item */}
        <Animated.View 
          style={[
            styles.taskItem,
            task.completed && styles.completedTaskItem,
            { transform: [{ translateX }] }
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity 
            onPress={() => onToggle(task.id)} 
            style={styles.checkboxContainer}
          >
            <View style={[
              styles.checkbox, 
              task.completed && styles.checkboxCompleted,
              isOverdue(task.dueDate) && !task.completed && styles.checkboxOverdue
            ]}>
              {task.completed && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
          </TouchableOpacity>
          
          <View style={styles.taskContent}>
            <View style={styles.taskHeader}>
              <Text style={[
                styles.taskTitle, 
                task.completed && styles.completedText
              ]}>
                {task.title}
              </Text>
              
              {task.category && (
                <View style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor(task.category) }
                ]}>
                  <Text style={styles.categoryText}>
                    {task.category}
                  </Text>
                </View>
              )}
            </View>

            {task.description && (
              <Text style={[
                styles.taskDescription, 
                task.completed && styles.completedText
              ]} numberOfLines={1}>
                {task.description}
              </Text>
            )}
            
            <View style={styles.taskFooter}>
              {task.dueDate && (
                <Text style={[
                  styles.dueDateInside, 
                  isOverdue(task.dueDate) && !task.completed && styles.overdueDateText,
                  task.completed && styles.completedText
                ]}>
                  Due: {formatDate(task.dueDate)}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.taskRight}>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(task.priority) }
            ]}>
              <Text style={styles.priorityText}>
                {getPriorityText(task.priority)}
              </Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                onPress={() => {
                  hideSwipeActions();
                  onEdit(task);
                }} 
                style={styles.actionButton}
              >
                <Ionicons name="pencil" size={16} color="#666" />
              </TouchableOpacity>
              
              {isOverdue(task.dueDate) && !task.completed && (
                <View style={styles.overdueIndicator}>
                  <Ionicons name="warning" size={16} color="#FF6B6B" />
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    marginBottom: 12,
  },
  completedTaskContainer: {
    opacity: 0.7,
  },
  swipeContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  deleteActionContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteAction: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 2,
  },
  completedTaskItem: {
    backgroundColor: '#F8F9FA',
    shadowOpacity: 0.03,
    elevation: 1,
  },
  checkboxContainer: {
    marginRight: 14,
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxCompleted: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  checkboxOverdue: {
    borderColor: '#FF6B6B',
  },
  taskContent: {
    flex: 1,
    paddingRight: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  dueDateInside: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 60,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 8,
  },
  overdueIndicator: {
    padding: 4,
  },
  overdueDateText: {
    color: '#EF4444',
    fontWeight: '600',
  },
});

export default TaskItem;