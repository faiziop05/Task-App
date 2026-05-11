
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../services/Config";
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, getPriorityColor } from "../../theme";
import CustomHeader from "../../components/CustomHeader";
import Button from "../../components/Button";
import CustomAlert from "../../components/CustomAlert";

const TaskDetails = ({ route, navigation }) => {
  const { data } = route.params;
  const [loading, setLoading] = useState(false);
  const priorityColor = getPriorityColor(data.priority);

  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
    showCancel: false,
    onConfirm: null
  });

  const showAlert = (title, message, type = 'info', showCancel = false, onConfirm = null) => {
    setAlertConfig({ visible: true, title, message, type, showCancel, onConfirm });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  // Helper to refresh home data
  const fetchTodysTodos = async (userInfo) => {
    try {
      const q = query(
        collection(db, "todos"),
        where("userId", "==", userInfo.uid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));
      }
      return [];
    } catch (error) {
      console.log("Error fetching documents:", error);
      return [];
    }
  };

  const handleMarkComplete = async () => {
    showAlert(
      "Complete Task",
      "Confirm that you have completed this task?",
      "info",
      true, // Show cancel
      async () => {
        closeAlert();
        await updateTaskStatus(true);
      }
    );
  };

  const updateTaskStatus = async (completed) => {
    setLoading(true);
    try {
      const getUser = await AsyncStorage.getItem("user");
      const user = JSON.parse(getUser);

      if (user) {
        const userDocRef = doc(db, 'todos', data.docId);
        await updateDoc(userDocRef, {
          completed: completed,
          completedAt: completed ? new Date().toISOString() : null
        });

        // Refresh Local Storage
        const todos = await fetchTodysTodos(user);
        await AsyncStorage.setItem("TodoList", JSON.stringify(todos));

        showAlert(
          "Task Completed",
          "Great job! Task has been marked as complete.",
          "success",
          false,
          () => {
            closeAlert();
            navigation.goBack();
          }
        );
      }
    } catch (error) {
      showAlert("Error", "Failed to update task status.", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <CustomHeader
          title="Task Details"
          showBack
          onBackPress={() => navigation.goBack()}
          rightAction={!data.completed}
          rightIcon="edit"
          onRightPress={() => navigation.navigate("Edit", { TaskData: data })}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section: Title & Priority */}
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <View style={[
                styles.statusIndicator,
                {
                  backgroundColor: data.completed ? theme.colors.success : 'transparent',
                  borderColor: data.completed ? theme.colors.success : theme.colors.gray300
                }
              ]}>
                {data.completed && <MaterialIcons name="check" size={16} color="white" />}
              </View>
              <Text style={styles.title}>{data.title}</Text>
            </View>

            <View style={styles.tagsRow}>
              {!data.completed && (
                <View style={[styles.priorityTag, { backgroundColor: priorityColor + '15' }]}>
                  <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                  <Text style={[styles.priorityText, { color: priorityColor }]}>
                    {data.priority ? data.priority.toUpperCase() : "NORMAL"}
                  </Text>
                </View>
              )}

              {data.category && (
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{data.category}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description Card */}
          <View style={styles.cardSection}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="description" size={20} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Description</Text>
            </View>
            <Text style={styles.descriptionText}>
              {data.description || "No description provided for this task."}
            </Text>
          </View>

          {/* Schedule Card */}
          <View style={styles.cardSection}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="schedule" size={20} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Schedule</Text>
            </View>

            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Date</Text>
                <Text style={styles.scheduleValue}>{formatDate(data.date)}</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Time</Text>
                <Text style={styles.scheduleValue}>
                  {data.time ? data.time.split(' ')[0] : 'All Day'}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {!data.completed && (
            <View style={styles.actionContainer}>
              <Button
                title="Mark as Completed"
                onPress={handleMarkComplete}
                loading={loading}
                style={{ backgroundColor: theme.colors.success }}
                icon={<MaterialIcons name="check-circle-outline" size={20} color="white" />}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        showCancel={alertConfig.showCancel}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
        confirmText="Confirm"
      />
    </View>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  headerSection: {
    marginBottom: theme.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    marginTop: 4,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    lineHeight: 32,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingLeft: theme.spacing.xl + 8, // Align with title
  },
  priorityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    gap: 6,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.gray100,
    borderWidth: 0.5,
    borderColor: theme.colors.gray200,
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginBottom: theme.spacing.xl,
  },
  cardSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textPrimary,
  },
  descriptionText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.gray50,
    padding: theme.spacing.base,
  },
  scheduleItem: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  scheduleValue: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.lg,
  },
  actionContainer: {
    marginTop: theme.spacing.md,
  },
});
