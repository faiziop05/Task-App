
import React, { useEffect, useState, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SectionList,
  TextInput,
  RefreshControl,
  Keyboard
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { deleteDoc, doc } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from "../../services/Config";
import ModernTaskCard from "../../components/TaskCard";
import CustomHeader from "../../components/CustomHeader";
import EmptyState from "../../components/EmptyState";
import { theme } from "../../theme";

const AllTasks = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector((state) => state.loginstatus.user);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending"); // all, pending, completed, overdue

  const fetchData = async () => {
    try {
      if (!isFocused && data.length > 0) return;

      const res = await AsyncStorage.getItem("TodoList");
      if (res) {
        setData(JSON.parse(res));
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDelete = async (task) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const docRef = doc(db, "todos", task.docId);
              await deleteDoc(docRef);

              const newdata = data.filter((item) => item.docId !== task.docId);
              setData(newdata);
              await AsyncStorage.setItem("TodoList", JSON.stringify(newdata));
              setLoading(false);
            } catch (error) {
              console.log("Error deleting document: ", error);
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    let result = data;

    // 1. Search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery))
      );
    }

    // 2. Tab Filter
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of day for comparison purposes

    switch (activeTab) {
      case 'pending':
        result = result.filter(item => !item.completed);
        break;
      case 'completed':
        result = result.filter(item => item.completed);
        break;
      case 'overdue':
        result = result.filter(item => !item.completed && new Date(item.date) < now);
        break;
      default: // 'all'
        break;
    }

    // Sort by date descending (newest first) or ascending? usually ascending for tasks (soonest first)
    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    return result;
  }, [data, searchQuery, activeTab]);

  // --- Grouping Logic (Sections) ---
  const sections = useMemo(() => {
    const groups = {};

    filteredData.forEach(task => {
      const dateObj = new Date(task.date);
      const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(task);
    });

    // Convert to array of sections
    // Ensure months are sorted chronologically if possible, or key order. 
    // Since input was sorted by date, pushing order implies sort order.
    return Object.keys(groups).map(key => ({
      title: key,
      data: groups[key]
    }));

  }, [filteredData]);

  // --- UI Components ---
  const renderTab = (key, label) => (
    <TouchableOpacity
      style={[styles.tabItem, activeTab === key && styles.tabItemActive]}
      onPress={() => {
        setActiveTab(key);
        // Optional: Dismiss keyboard on tab switch
        Keyboard.dismiss();
      }}
    >
      <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <CustomHeader title="All Tasks" />

        <View style={styles.headerControls}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={theme.colors.textTertiary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks..."
              placeholderTextColor={theme.colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Segmented Tabs */}
          <View style={styles.tabsContainer}>
            {renderTab('all', 'All')}
            {renderTab('pending', 'Pending')}
            {renderTab('completed', 'Done')}
            {renderTab('overdue', 'Overdue')}
          </View>
        </View>

        {/* Task List */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : sections.length > 0 ? (
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item.docId + index}
            renderItem={({ item }) => (
              <ModernTaskCard
                task={item}
                onPress={() => navigation.navigate("TaskDetails", { data: item, user })}
                onDelete={() => handleDelete(item)}
                style={{ marginHorizontal: theme.spacing.base }}
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
            }
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            icon="search-off"
            title="No Tasks Found"
            message="Try adjusting your filters or search."
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default AllTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  headerControls: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.base,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    height: 44,
    marginTop: theme.spacing.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textPrimary,
    height: '100%',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.gray100, // Background for the pill track
    padding: 4,
    borderRadius: theme.radius.md,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: theme.radius.sm,
  },
  tabItemActive: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: theme.spacing['2xl'],
    paddingTop: theme.spacing.sm,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
