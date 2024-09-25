import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setFalse, setUser } from "../../redux/loginSlice";
import { useDispatch } from "react-redux";
import { setTodoList } from "../../redux/TodoSlice";
import { screenHeight, screenWidth } from "../../Dimentions";

const Settings = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await AsyncStorage.clear();
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutbtn} onPress={handleLogout}>
        <Text style={styles.logoutbtnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#fff',
    height:screenHeight,
    alignItems:"center"
  },
  logoutbtn:{
    backgroundColor:'red',
    borderRadius:20,
    width:screenWidth-40,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginVertical:20
    
  },
  logoutbtnText:{
    color:'white'
  }
});
