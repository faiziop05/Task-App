import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { screenWidth } from "../../Dimentions";
import { ScrollView } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/Config";
import { SelectList } from "react-native-dropdown-select-list";

const monthMap = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const AllTasks = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date().toDateString());
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.loginstatus.user);
  const [Alldates, setAlltDates] = useState([]);

  const [yearMonth, setYearMonth] = useState(new Date().toDateString());

  const Tasks = data.length > 0 && data.filter((item) => item.date == date);
  const dates = data.length > 0 && data.map((item) => item.date);

  useEffect(() => {
    try {
      if (yearMonth) {
        const [monthAbbr, year] = yearMonth.split(" ");
        const month = monthMap[monthAbbr.toUpperCase()];
        if (month !== undefined) {
          const validDate = new Date(year, month, 1).toDateString();
          const currentMothDates =
            data.length > 0 &&
            data
              .map((item) => item.date)
              .filter(
                (item) =>
                  new Date(item).getMonth().toLocaleString() ==
                    new Date(validDate).getMonth().toLocaleString() &&
                  new Date(item).getFullYear().toLocaleString() ==
                    new Date(validDate).getFullYear().toLocaleString()
              );
          if (currentMothDates.length > 0) {
            setAlltDates(currentMothDates);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [yearMonth]);

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
    };
    fetch();
  }, [isFocused]);
  const getUniqueItems = (arr) =>
    [...new Set(arr)].sort((a, b) => {
      return new Date(a).getDate() - new Date(b).getDate();
    });

  const getUniqueItems2 = (arr) =>
    [...new Set(arr)].sort((a, b) => {
      return new Date(a).getFullYear() - new Date(b).getFullYear();
    });

  const year =
    dates.length > 0 &&
    dates
      .map((item) => {
        const yearValue = `${months[new Date(item).getMonth()]} ${new Date(
          item
        ).getFullYear()}`;
        return {
          key: yearValue,
          value: yearValue,
        };
      })
      .filter(
        (value, index, arr) =>
          arr.findIndex((item) => item.key === value.key) === index
      );

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
      setAlltDates([]);
      setYearMonth();
      setLoading(false);
      Alert.alert("Document Deleted");
    } catch (error) {
      console.log("Error deleting document: ", error);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.InputandtextWrapper}>
          <Text style={styles.inputHeading}>Select Year and Month</Text>
          <SelectList
            setSelected={(val) => setYearMonth(val)}
            data={year && getUniqueItems2(year)}
            save="value"
            boxStyles={{
              backgroundColor: "#ddd6",
              width: screenWidth - 40,
              borderWidth: 1,
              borderColor: "#0001",
              alignSelf: "center",
            }}
            dropdownStyles={{
              backgroundColor: "#ddd6",
              borderWidth: 1,
              borderColor: "#0002",
              width: screenWidth - 40,
              alignSelf: "center",
            }}
          />
        </View>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="orange" />
            <Text>Deleting...</Text>
          </View>
        )}
        <ScrollView horizontal>
          {Alldates
            ? Alldates.length > 0 &&
              getUniqueItems(Alldates).map((item, index) => {
                const dayNum = new Date(item).getDay();
                const day = daysOfWeek[dayNum];
                const date = new Date(item).getDate();
                return (
                  <TouchableOpacity
                    onPress={() => setDate(item)}
                    style={styles.datesWrapperBtn}
                    key={index}
                  >
                    <Text style={styles.dateAndDay}>{day}</Text>
                    <Text style={styles.dateAndDay}>{date}</Text>
                  </TouchableOpacity>
                );
              })
            : dates.length > 0 &&
              getUniqueItems(dates).map((item, index) => {
                const dayNum = new Date(item).getDay();
                const day = daysOfWeek[dayNum];
                const date = new Date(item).getDate();
                return (
                  <TouchableOpacity
                    onPress={() => setDate(item)}
                    style={styles.datesWrapperBtn}
                    key={index}
                  >
                    <Text style={styles.dateAndDay}>{day}</Text>
                    <Text style={styles.dateAndDay}>{date}</Text>
                  </TouchableOpacity>
                );
              })}
        </ScrollView>
        {Tasks.length > 0 &&
          Tasks.map((task, index) => {
            const dateObject = new Date(task.date);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-based
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
          })}
      </View>
    </ScrollView>
  );
};

export default AllTasks;

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
  inputHeading: {
    fontSize: 20,
    marginBottom: 10,
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
  datesWrapperBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 20,
    backgroundColor: "orange",
    padding: 5,
    minWidth: 60,
    borderRadius: 10,
  },
  dateAndDay: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
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
