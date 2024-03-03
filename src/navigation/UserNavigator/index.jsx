import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/protected/Home";
import { Switch, useTheme } from "react-native-paper";
import AddNote from "../../screens/protected/Notes/AddNote";
import EditNote from "../../screens/protected/Notes/EditNote";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Stack = createNativeStackNavigator();
const index = () => {
	const { state, setState } = useContext(AuthContext);
	const theme = useTheme();
	const [mode, setMode] = useState("light");
	useEffect(() => {
		if (state && state.user) {
			setMode(state.themeMode);
		}
	}, [state && state.user]);
	const onToggleSwitch = async () => {
		const newMode = mode === "light" ? "dark" : "light";
		setMode(newMode);
		setState({
			...state,
			themeMode: newMode,
		});
		AsyncStorage.setItem("note_theme_mode", JSON.stringify(newMode));
	};
	const handleLogout = async () => {
		setState({
			...state,
			user: null,
		});
		AsyncStorage.removeItem("note_auth");
	};
	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{ headerShown: false, animation: "slide_from_right" }}
		>
			<Stack.Screen
				name="Home"
				component={Home}
				options={() => ({
					headerShown: true,
					headerTitle: "Notes",
					headerStyle: {
						backgroundColor: theme.colors.primary,
					},
					headerRight: () => (
						<>
							<>
								<MaterialIcons name="light-mode" size={24} color="white" />
								<Switch
									value={mode === "light" ? false : true}
									onValueChange={onToggleSwitch}
									color={theme.colors.title}
								/>
								<MaterialIcons name="dark-mode" size={24} color="black" />
							</>
							<>
								<MaterialIcons
									style={{ marginLeft: 10 }}
									name="logout"
									size={30}
									color={theme.colors.error}
									onPress={handleLogout}
								/>
							</>
						</>
					),
				})}
			/>
			<Stack.Screen
				name="AddNote"
				component={AddNote}
				options={() => ({
					headerShown: true,
					headerTitle: "Add Note",
					headerStyle: {
						backgroundColor: theme.colors.primary,
					},
				})}
			/>
			<Stack.Screen
				name="EditNote"
				component={EditNote}
				options={() => ({
					headerShown: true,
					headerTitle: "Note Details",
					headerStyle: {
						backgroundColor: theme.colors.primary,
					},
				})}
			/>
		</Stack.Navigator>
	);
};

export default index;
