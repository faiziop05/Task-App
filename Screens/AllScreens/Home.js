
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { db } from "../../services/Config";
import { useIsFocused } from "@react-navigation/native";
import { deleteDoc, doc } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskCard from "../../components/TaskCard";
import EmptyState from "../../components/EmptyState";
import FilterModal from "../../components/FilterModal";
import CustomAlert from "../../components/CustomAlert";
import { theme } from "../../theme";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Home = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter State
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: 'pending',
    priority: 'all',
    sort: 'newest'
  });

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

  const user = useSelector((state) => state.loginstatus.user);

  const fetchData = async () => {
    try {
      if (!isFocused && data.length > 0) return;

      const res = await AsyncStorage.getItem("TodoList");
      if (res) {
        const parsedData = JSON.parse(res);
        setData(parsedData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  // Filter Logic
  useEffect(() => {
    let result = data;

    // 1. Status Filter
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filters.status === 'pending') {
      result = result.filter(item => !item.completed);
    } else if (filters.status === 'completed') {
      result = result.filter(item => item.completed);
    } else if (filters.status === 'overdue') {
      result = result.filter(item => !item.completed && new Date(item.date) < now);
    } else if (filters.status === 'all') {
      result = result.filter(item => !item.completed);
    }

    // 2. Priority Filter
    if (filters.priority !== 'all') {
      result = result.filter(item => item.priority === filters.priority);
    }

    // 3. Sorting
    if (filters.sort === 'newest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filters.sort === 'oldest') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredData(result);
  }, [data, filters]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDelete = async (task) => {
    showAlert(
      "Delete Task",
      "Are you sure you want to permanently delete this task? This action cannot be undone.",
      "warning",
      true, // Show cancel
      async () => {
        closeAlert();
        try {
          if (!user || !user.uid || !task) return;
          setLoading(true);
          const docRef = doc(db, "todos", task.docId);
          await deleteDoc(docRef);

          const newData = data.filter((item) => item.docId !== task.docId);
          setData(newData);
          await AsyncStorage.setItem("TodoList", JSON.stringify(newData));
          setLoading(false);

          // Optional: Show success toast/alert
        } catch (error) {
          console.log("Error deleting document: ", error);
          setLoading(false);
          setTimeout(() => showAlert("Error", "Could not delete task.", "error"), 500);
        }
      }
    );
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const totalTasks = data.length;
  const completedTasks = data.filter(t => t.completed).length;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Custom Header with Greeting */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.greetingText}>{getGreeting()},</Text>
            <Text style={styles.userNameText}>{user?.fullName ? user.fullName : 'User'}</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialIcons name="account-circle" size={40} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.statCount, { color: 'white' }]}>{totalTasks}</Text>
            <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)' }]}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statCount, { color: theme.colors.success }]}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statCount, { color: theme.colors.warning }]}>{totalTasks - completedTasks}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Task List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.sectionHeader}>Your Tasks</Text>
              {/* Active Filter Indicator */}
              {(filters.status !== 'pending' || filters.priority !== 'all') && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>Filtered</Text>
                </View>
              )}
            </View>

            {/* Filter Button Inline */}
            <TouchableOpacity
              style={styles.inlineFilterBtn}
              onPress={() => setFilterVisible(true)}
            >
              <MaterialIcons name="tune" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
          ) : filteredData.length > 0 ? (
            filteredData.map((task, index) => (
              <TaskCard
                key={index}
                task={task}
                onPress={() => navigation.navigate("TaskDetails", { data: task, user: user })}
                onDelete={() => handleDelete(task)}
              />
            ))
          ) : (
            <EmptyState
              icon="filter-list"
              title="No Tasks Found"
              message="Try adjusting your filters."
            />
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        currentFilters={filters}
        onApply={setFilters}
      />

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        showCancel={alertConfig.showCancel}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
        confirmText="Delete"
        cancelText="No, Keep It"
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  profileButton: {
    ...theme.shadows.sm,
    borderRadius: theme.radius.full,
  },
  greetingText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  userNameText: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.base,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCount: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.weights.bold,
    textTransform: 'uppercase',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.base,
  },
  sectionHeader: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  filterBadge: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  inlineFilterBtn: {
    padding: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  }
});
