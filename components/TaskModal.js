import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const TaskModal = ({ visible, task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    { key: 'work', label: 'Work', icon: 'briefcase-outline', color: '#8B5CF6' },
    { key: 'personal', label: 'Personal', icon: 'person-outline', color: '#10B981' },
    { key: 'study', label: 'Study', icon: 'library-outline', color: '#F59E0B' },
    { key: 'health', label: 'Health', icon: 'fitness-outline', color: '#EF4444' },
    { key: 'shopping', label: 'Shopping', icon: 'bag-outline', color: '#EC4899' },
    { key: 'family', label: 'Family', icon: 'people-outline', color: '#06B6D4' },
  ];

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setPriority(task.priority || 'medium');
      setCategory(task.category || '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate(null);
      setPriority('medium');
      setCategory('');
    }
  }, [task, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority,
      category: category || null,
      completed: task?.completed || false,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(taskData);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#6BCF7F';
      default: return '#DDD';
    }
  };

  const getCategoryColor = (cat) => {
    const categoryObj = categories.find(c => c.key === cat);
    return categoryObj ? categoryObj.color : '#6B7280';
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {task ? 'Edit Task' : 'New Task'}
            </Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Task Title</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter task title"
                placeholderTextColor="#999"
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add description (optional)"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                <View style={styles.categoryContainer}>
                  <TouchableOpacity
                    style={[
                      styles.categoryOption,
                      !category && styles.categoryOptionSelected,
                    ]}
                    onPress={() => setCategory('')}
                  >
                    <View style={styles.categoryContent}>
                      <View style={[styles.categoryIcon, { backgroundColor: '#E5E7EB' }]}>
                        <Ionicons name="close" size={16} color="#6B7280" />
                      </View>
                      <Text style={[
                        styles.categoryOptionText,
                        !category && styles.categoryOptionTextSelected
                      ]}>
                        None
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.categoryOption,
                        category === cat.key && styles.categoryOptionSelected,
                      ]}
                      onPress={() => setCategory(cat.key)}
                    >
                      <View style={styles.categoryContent}>
                        <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                          <Ionicons name={cat.icon} size={16} color="white" />
                        </View>
                        <Text style={[
                          styles.categoryOptionText,
                          category === cat.key && styles.categoryOptionTextSelected
                        ]}>
                          {cat.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Due Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.dateButtonContent}>
                  <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
                  <Text style={styles.dateButtonText}>
                    {dueDate ? dueDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    }) : 'Select due date'}
                  </Text>
                </View>
                {dueDate && (
                  <TouchableOpacity
                    onPress={() => setDueDate(null)}
                    style={styles.removeDateButton}
                  >
                    <Ionicons name="close-circle" size={20} color="#999" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityContainer}>
                {[
                  { key: 'low', label: 'Low', icon: 'chevron-down' },
                  { key: 'medium', label: 'Medium', icon: 'remove' },
                  { key: 'high', label: 'High', icon: 'chevron-up' }
                ].map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    style={[
                      styles.priorityOption,
                      priority === p.key && styles.priorityOptionSelected,
                      { borderColor: getPriorityColor(p.key) }
                    ]}
                    onPress={() => setPriority(p.key)}
                  >
                    <View style={styles.priorityContent}>
                      <View style={[
                        styles.priorityDot, 
                        { backgroundColor: getPriorityColor(p.key) }
                      ]} />
                      <Text style={[
                        styles.priorityOptionText,
                        priority === p.key && styles.priorityOptionTextSelected
                      ]}>
                        {p.label}
                      </Text>
                      <Ionicons 
                        name={p.icon} 
                        size={16} 
                        color={priority === p.key ? getPriorityColor(p.key) : '#999'} 
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  categoryOption: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FAFAFA',
    minWidth: 80,
  },
  categoryOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: '#8B5CF6',
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryOptionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryOptionTextSelected: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  removeDateButton: {
    padding: 4,
  },
  priorityContainer: {
    gap: 12,
  },
  priorityOption: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  priorityOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  priorityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityOptionText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  priorityOptionTextSelected: {
    color: '#333',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});

export default TaskModal;