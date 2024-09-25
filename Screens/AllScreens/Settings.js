import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setFalse, setUser } from "../../redux/loginSlice";
import { useDispatch } from "react-redux";
import { setTodoList } from "../../redux/TodoSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await AsyncStorage.clear();
    // await AsyncStorage.setItem("isLoggedIn", "false");
    // await AsyncStorage.removeItem("TodoList");
    dispatch(setFalse());
    dispatch(setTodoList([]));
    dispatch(
      setUser({
        email: "",
        uid: "",
      })
    );
  };
  return (
    <View>
      <Button onPress={handleLogout} title="Logout" />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({});
