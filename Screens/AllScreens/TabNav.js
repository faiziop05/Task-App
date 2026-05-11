import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import Add from "./Add";
import Settings from "./Settings";
import AllTasks from "./AllTasks";
import CustomTabBar from "../../components/CustomTabBar";

const Tab = createBottomTabNavigator();

function TabNav() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          unmountOnBlur: true,
          title: "Add ToDo",
        }}
      />
      <Tab.Screen
        name="AllTasks"
        component={AllTasks}
        options={{
          unmountOnBlur: true,
          title: "All Tasks",
        }}
      />

    </Tab.Navigator>
  );
}

export default TabNav;
