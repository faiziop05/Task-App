import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import Add from "./Add";
import Settings from "./Settings";
import AllTasks from "./AllTasks";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
const Tab = createBottomTabNavigator();

function TabNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerTitleAlign: "center",
        headerTitleStyle: { fontSize: 22 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={26}
              color={focused ? "orange" : "gray"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AllTasks"
        component={AllTasks}
        options={{
          unmountOnBlur: true,
          headerShown: true,
          title: "All Tasks",
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="tasks"
              size={24}
              color={focused ? "orange" : "gray"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          unmountOnBlur: true,
          headerShown: true,
          title: "Add ToDo",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="plus-square-o"
              size={26}
              color={focused ? "orange" : "gray"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="setting"
              size={26}
              color={focused ? "orange" : "gray"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNav;
