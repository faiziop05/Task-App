import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { db } from "../../services/Config";
import { ScrollView } from "react-native-gesture-handler";
import { screenWidth } from "../../Dimentions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useIsFocused } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  deleteDoc,
  doc,
} from "firebase/firestore";
const Home = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.loginstatus.user);
  const date = new Date().toDateString();
  const TodaysTasks =
    data.length > 0 && data.filter((item) => item.date == date);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await AsyncStorage.getItem("TodoList");
        if (res) {
          setData(JSON.parse(res)); // Set the fetched data in one go
        }
      } catch (error) {
        console.log(error);
      }
      finally{
        setLoading(false)
      }
    };
    fetch();
  }, [isFocused]);

  const handleDelete = async (index, datas) => {
    try {
      if (!user || !user.uid || !datas) {
        console.log("User or data is not available");
        return;
      }
      setLoading(true);
      const docRef = doc(db, "todos", datas.docId);
      await deleteDoc(docRef);
      const newdata = data.filter((item) => item.docId != datas.docId);
      setData(newdata);
      await AsyncStorage.setItem("TodoList", JSON.stringify(newdata));
      Alert.alert("Document Deleted");
      setLoading(false);
      await fetchTodysTodos(user); // Re-fetch updated data
    } catch (error) {
      console.log("Error deleting document: ", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.WelcomeText}>Welcome Back</Text>
      <View>
        <Text style={styles.TodaysTaskHeading}>Today's Tasks</Text>
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="orange" />
            <Text>Loading...</Text>
          </View>
        )}
        {TodaysTasks.length > 0 ? (
          TodaysTasks.map((task, index) => {
            const dateObject = new Date(task.date);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, "0");
            const day = String(dateObject.getDate()).padStart(2, "0");
            const datePart = `${year}-${month}-${day}`;
            const time = new Date(
              `${datePart}T${task.time.split(" ")[0]}+05:00`
            );

            const TaskStatus = task.completed
              ? "Completed"
              : time > new Date()
              ? "Pending"
              : "Not Completed";

            return (
              <View style={styles.TodaysTaskCard} key={index}>
                <View style={styles.titledescwraper}>
                  <Text numberOfLines={1} style={styles.TodaysTaskCardTitle}>
                    {task.title}
                  </Text>

                  <Text numberOfLines={2} style={styles.TodaysTaskCarddesc}>
                    {task.description}
                  </Text>
                  <View style={styles.statusWrapper}>
                    <Text style={styles.statusHeading}>Status: </Text>
                    <Text
                      style={[
                        styles.statusText,
                        TaskStatus == "Not Completed" && { color: "#f99" },
                      ]}
                    >
                      {TaskStatus}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleDelete(index, task)}
                    style={styles.TodaysTaskCardNextButton}
                  >
                    <AntDesign name="delete" size={20} color="red" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("TaskDetails", {
                        data: task,
                        user: user,
                      })
                    }
                    style={styles.TodaysTaskCardNextButton}
                  >
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="#8ab66b"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View
            style={{
              textAlign: "center",
              marginTop: 30,
              backgroundColor: "#0a866b",
              alignSelf: "center",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              width: screenWidth - 40,
              height: 150,
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 20,
                color: "white",
              }}
            >
              No tasks for Today.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
  },
  WelcomeText: {
    fontSize: 30,
    fontStyle: "normal",
    fontWeight: "400",
    color: "#555",
  },
  TodaysTaskHeading: {
    fontSize: 23,
    fontStyle: "normal",
    fontWeight: "400",
    color: "#555",
    marginTop: 20,
  },
  TodaysTaskCard: {
    width: screenWidth - 40,
    minHeight: 120,
    backgroundColor: "#0a866b",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  TodaysTaskCardNextButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    marginHorizontal: 2,
  },
  TodaysTaskCardTitleDeateilsWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  TodaysTaskCardTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  TodaysTaskCarddesc: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "400",
  },
  titledescwraper: {
    width: "60%",
  },
  loadingBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  statusHeading: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  statusText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});
