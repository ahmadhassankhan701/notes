import React, { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [state, setState] = useState({
		user: null,
		themeMode: "light",
	});
	// navigation
	useEffect(() => {
		const loadFromAsyncStorage = async () => {
			let data = await AsyncStorage.getItem("note_auth");
			let themaMode = await AsyncStorage.getItem("note_theme_mode");
			const as = JSON.parse(data);
			const thema = JSON.parse(themaMode);
			if (thema) {
				setState({
					...state,
					themeMode: thema,
				});
			}
			if (as) {
				setState({
					...state,
					user: as.user,
				});
			}
		};
		loadFromAsyncStorage();
	}, []);

	return (
		<AuthContext.Provider value={{ state, setState }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
