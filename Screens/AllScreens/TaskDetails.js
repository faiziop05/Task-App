import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";

import { screenHeight, screenWidth } from "../../Dimentions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../services/Config";

const TaskDetails = ({ route, navigation }) => {
  const { data } = route.params;
  const [loading, setLoading] = useState(false);


  const fetchTodysTodos = async (userInfo) => {
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


  const handleMarkClick = async () => {
    setLoading(true)
    const getUser = await AsyncStorage.getItem("user");
    const user = JSON.parse(getUser);
    if (user && data.title != "" && data.description != "") {
      try {
        const newTodo = {
          title: data.title,
          description: data.description,
          category: data.category,
          time:data.time,
          date: data.date,
          userId: user.uid,
          completed: true,
        };
        
        const userDocRef = doc(db, 'todos', data.docId); 
        
        await updateDoc(userDocRef, newTodo);
        const fetchedd=await fetchTodysTodos(user)
        const asyncStore = JSON.stringify(fetchedd);
        await AsyncStorage.setItem("TodoList", asyncStore);
        Alert.alert("Successfully Marked Complete");
        setLoading(false)
      } catch (error) {
        Alert.alert("There is some Problem in Marking Task Complete");
        console.log(error);
      }
      finally{
        setLoading(false)
      }
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
      {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="orange" />
          </View>
        )}
        <View>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.dateTimeWrapper}>
            <Text style={styles.date}>Complete Before: </Text>
            <Text style={styles.date}>{data.date}, </Text>
            <Text style={styles.time}>{data.time}</Text>
          </View>
          <View style={styles.CompletebtnWrapper}>
            <Text style={styles.completedBtnText}>Mark Completed</Text>
            <TouchableOpacity
              onPress={handleMarkClick}
              style={styles.editupdatebtn}
            >
              <Feather name="check-square" size={24} color="orange" />
            </TouchableOpacity>
          </View>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>{data.description}</Text>
          </View>
        </View>
        <View style={styles.btnWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Edit", { TaskData: data })}
            style={styles.editupdatebtn}
          >
            <Feather name="edit" size={24} color="orange" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: screenHeight,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "500",
    color: "#555",
  },
  description: {
    fontSize: 20,
    fontWeight: "400",
    color: "#fff",
    minHeight: screenHeight - 500,
  },
  descriptionWrapper: {
    backgroundColor: "#0a866b",
    padding: 10,
    borderRadius: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: "400",
    color: "#028184",
  },
  time: {
    fontSize: 16,
    fontWeight: "400",
    color: "#028184",
  },
  dateTimeWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: "orange",
    width: screenWidth - 40,
  },
  btnWrapper: {
    display: "flex",
    flexDirection: "row", // Horizontal alignment of buttons
    alignItems: "center",
    justifyContent: "flex-end", // Align buttons to the right
    padding: 10, // Optional padding for spacing
  },
  CompletebtnWrapper: {
    display: "flex",
    flexDirection: "row", // Horizontal alignment of buttons
    alignItems: "center",
    justifyContent: "flex-end", // Align buttons to the right
    marginBottom: 10, // Optional padding for spacing
  },
  editupdatebtn: {
    marginHorizontal: 5,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#0001",
  },
  completedBtnText: {
    fontSize: 16,
    fontWeight: "500",
    // color: "#028184",
  },
});
