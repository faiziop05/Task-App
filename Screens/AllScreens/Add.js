import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { screenHeight, screenWidth } from "../../Dimentions";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../services/Config";
import { setTodoList } from "../../redux/TodoSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { auth } from "../../services/Config";
import { collection, getDocs,addDoc, query, where } from "firebase/firestore";
const Add = () => {
  const isFocused = useIsFocused();
  const [selected, setSelected] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [loading, setLoading] = useState(false);



  // Function to handle the selection of date/time
  const [TodoList, setTodoList] = useState([]);
  const user = useSelector((state) => state.loginstatus.user);
  const fetchTodysTodos = async (userInfo) => {
    const newdate = new Date();
    try {
      const q = query(
        collection(db, "todos"), // Reference to the 'todos' collection
        where("userId", "==", userInfo.uid), // First condition: match userId
      );
      const querySnapshot = await getDocs(q); // Fetch the matching documents
      if (!querySnapshot.empty) {
        // Map over the docs to return data along with document ID
        const fetchedData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id, // Add document ID to each object
        }));
        return fetchedData;
      } else {
        console.log("No matching documents found!");
        return [];
      }
    } catch (error) {
      console.log("Error fetching documents:", error);
      return [];
    }
  };


  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await AsyncStorage.getItem("TodoList");
        if (res) {
          setTodoList(JSON.parse(res)); // Set the fetched data in one go
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [isFocused]);

  const onChangetime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTime(Platform.OS === "ios"); // Keep picker open for iOS, hide for Android
    setTime(currentTime);
  };
  const onChangedate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === "ios"); // Keep picker open for iOS, hide for Android
    setDate(currentDate);
  };

  const data = [
    { key: "2", value: "Home" },
    { key: "3", value: "Work" },
    { key: "5", value: "Sports" },
    { key: "6", value: "Task" },
    { key: "7", value: "Others" },
  ];

  const handleSubmit = async () => {
    setLoading(true)
    const getUser = await AsyncStorage.getItem("user");
    const user = JSON.parse(getUser);
    if (user && title != "" && description != "") {
      try {
        const newTodo = {
          title: title,
          description: description,
          category: selected,
          time: time.toTimeString(),
          date: date.toDateString(),
          userId: user.uid,
          completed: false,
        };
        await addDoc(collection(db, "todos"), newTodo);
        const fetchedd=await fetchTodysTodos(user)
        const asyncStore = JSON.stringify(fetchedd);
        await AsyncStorage.setItem("TodoList", asyncStore);
        Alert.alert("Successfully Added ToDo");
        setTitle("");
        setDescription("");
        setSelected("");
        setTime(new Date());
        setDate(new Date());
        setShowTime(false);
        setShowDate(false);
        setLoading(false)
      } catch (error) {
        Alert.alert("Error adding ToDo");
        console.log(error);
      }
      finally{
        setLoading(false)
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.InnerContainer}>
        <View>
          <View style={styles.InputandtextWrapper}>
          {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="orange" />
            <Text>Adding...</Text>
          </View>
        )}
            <Text style={styles.inputHeading}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="Add Title"
            />
          </View>
          <View style={styles.InputandtextWrapper}>
            <Text style={styles.inputHeading}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline={true}
              style={styles.inputDesc}
            />
          </View>
          <View style={styles.InputandtextWrapper}>
            <Text style={styles.inputHeading}>Select Category</Text>
            <SelectList
              setSelected={(val) => setSelected(val)}
              data={data}
              save="value"
              boxStyles={{
                backgroundColor: "#ddd6",
                width: screenWidth - 40,
                borderWidth: 1,
                borderColor: "#0001",
              }}
              dropdownStyles={{
                backgroundColor: "#ddd6",
                borderWidth: 1,
                borderColor: "#0002",
              }}
            />
          </View>
          <View style={styles.InputandtextWrapper}>
            <TouchableOpacity
              style={styles.datetimeBtn}
              onPress={() => setShowDate("date")}
            >
              <Text style={styles.Datetimetext}>Select Due Date</Text>
            </TouchableOpacity>
            {showDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                is24Hour={true}
                display="default"
                onChange={onChangedate}
              />
            )}
          </View>
          <View style={styles.InputandtextWrapper}>
            <TouchableOpacity
              style={styles.datetimeBtn}
              onPress={() => setShowTime("time")}
            >
              <Text style={styles.Datetimetext}>Select Due Time</Text>
            </TouchableOpacity>
            {showTime && (
              <DateTimePicker
                testID="dateTimePicker"
                value={time}
                mode={"time"}
                is24Hour={true}
                display="default"
                onChange={onChangetime}
                style={{
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </View>
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitbtn}>
          <Text style={styles.Datetimetext}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  InnerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#ddd6",
    padding: 10,
    borderRadius: 8,
    height: 50,
    width: screenWidth - 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#0001",
  },
  inputDesc: {
    backgroundColor: "#ddd6",
    padding: 10,
    borderRadius: 8,
    height: 100,
    width: screenWidth - 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#0001",
  },
  inputHeading: {
    fontSize: 18,
    fontWeight: "500",
    color: "#555",
  },
  InputandtextWrapper: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 15,
  },
  datetimeBtn: {
    paddingHorizontal: 20,
    width: screenWidth - 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0ab68b",
    borderRadius: 10,
    marginBottom: 10,
  },
  submitbtn: {
    width: screenWidth - 40,
    paddingHorizontal: 20,
    alignSelf: "stretch",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
    borderRadius: 10,
    marginBottom: 10,
  },
  Datetimetext: {
    color: "white",
    fontSize: 16,
  },
  loadingBox: {
    alignItems: "center",
    justifyContent: "center",
  },
});
