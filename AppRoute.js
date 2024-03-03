import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import Navigation from "./src/navigation";
import { LightScheme } from "./src/util/CustomTheme/lightScheme";
import { DarkScheme } from "./src/util/CustomTheme/darkScheme";
import { useContext } from "react";
import { AuthContext } from "./src/context/AuthContext";

const LightTheme = {
	...MD3LightTheme,
	colors: LightScheme,
};

const DarkTheme = {
	...MD3DarkTheme,
	colors: DarkScheme,
};
export default function AppRoute() {
	const { state } = useContext(AuthContext);
	let theme;
	if (state && state.themeMode) {
		if (state.themeMode == "light") {
			theme = LightTheme;
		} else {
			theme = DarkTheme;
		}
	} else {
		theme = LightTheme;
	}
	return (
		<NavigationContainer theme={theme}>
			<PaperProvider theme={theme}>
				<Navigation />
			</PaperProvider>
		</NavigationContainer>
	);
}
