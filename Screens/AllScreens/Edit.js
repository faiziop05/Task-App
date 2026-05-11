
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../services/Config";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from "../../components/CustomHeader";
import { theme } from "../../theme";
import Input from "../../components/Input";
import Button from "../../components/Button";
import CustomAlert from "../../components/CustomAlert";

const Edit = ({ route, navigation }) => {
  const { TaskData } = route.params;
  const [selected, setSelected] = useState("");
  const [priority, setPriority] = useState("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (TaskData) {
      setTitle(TaskData.title);
      setDescription(TaskData.description);
      setSelected(TaskData.category);
      setPriority(TaskData.priority || "medium");
    }
  }, [TaskData]);

  const categoryData = [
    { key: "1", value: "Home" },
    { key: "2", value: "Work" },
    { key: "3", value: "Sports" },
    { key: "4", value: "Task" },
    { key: "5", value: "Others" },
  ];

  const priorityData = [
    { key: "1", value: "High" },
    { key: "2", value: "Medium" },
    { key: "3", value: "Low" },
  ];

  const onChangetime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTime(Platform.OS === "ios");
    setTime(currentTime);
  };

  const onChangedate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === "ios");
    setDate(currentDate);
  };

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

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !selected) {
      showAlert("Missing Fields", "Please make sure to fill in the Title, Description, and Category.", "warning");
      return;
    }

    setLoading(true);
    try {
      const getUser = await AsyncStorage.getItem("user");
      const user = JSON.parse(getUser);

      if (user) {
        const updatedTodo = {
          title,
          description,
          category: selected,
          priority: priority.toLowerCase(),
          time: time.toTimeString(),
          date: date.toDateString(),
          userId: user.uid,
          completed: TaskData.completed || false,
          updatedAt: new Date().toISOString(),
        };

        const userDocRef = doc(db, "todos", TaskData.docId);
        await updateDoc(userDocRef, updatedTodo);

        // Refresh local storage
        const fetchedd = await fetchTodysTodos(user);
        await AsyncStorage.setItem("TodoList", JSON.stringify(fetchedd));

        showAlert(
          "Task Updated",
          "Your task details have been saved successfully.",
          "success",
          false,
          () => {
            closeAlert();
            navigation.navigate("TabNav");
          }
        );
      }
    } catch (error) {
      showAlert("Error", "Failed to update task. Please try again.", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <CustomHeader title="Edit Task" showBack onBackPress={() => navigation.goBack()} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.section}>
              <Input
                label="Title"
                value={title}
                onChangeText={setTitle}
              />
              <Input
                label="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Category</Text>
              <SelectList
                setSelected={setSelected}
                data={categoryData}
                save="value"
                placeholder="Select"
                defaultOption={categoryData.find(c => c.value === TaskData.category)}
                boxStyles={styles.dropdownBox}
                dropdownStyles={styles.dropdownList}
                fontFamily={Platform.OS === 'ios' ? 'System' : 'Roboto'}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Priority</Text>
              <SelectList
                setSelected={setPriority}
                data={priorityData}
                save="value"
                placeholder="Select"
                defaultOption={priorityData.find(p => p.value.toLowerCase() === (TaskData.priority || 'medium'))}
                boxStyles={styles.dropdownBox}
                dropdownStyles={styles.dropdownList}
                fontFamily={Platform.OS === 'ios' ? 'System' : 'Roboto'}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Schedule</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDate(true)}
                >
                  <MaterialIcons name="event" size={20} color={theme.colors.primary} />
                  <Text style={styles.dateTimeText}>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowTime(true)}
                >
                  <MaterialIcons name="access-time" size={20} color={theme.colors.primary} />
                  <Text style={styles.dateTimeText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDate && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangedate}
              />
            )}

            {showTime && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onChangetime}
              />
            )}

            <View style={styles.footer}>
              <Button
                title="Save Changes"
                onPress={handleSubmit}
                loading={loading}
                icon={<MaterialIcons name="save" size={20} color="white" />}
              />
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        showCancel={alertConfig.showCancel}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
        confirmText="OK"
      />
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.base,
    gap: theme.spacing.lg,
  },
  section: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.base,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  dropdownBox: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 0.5,
    borderRadius: theme.radius.base,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  dropdownList: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 0.5,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.base,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  dateTimeText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
  footer: {
    marginTop: theme.spacing.xl,
  },
});
