import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useState } from "react";
import { Button, useTheme } from "react-native-paper";
import InputText from "../components/Input/InputText";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Sizes } from "../util/theme";
const Login = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const theme = useTheme();
	const { colors } = theme;
	const [details, setDetails] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handleChange = async (name, value) => {
		setDetails({ ...details, [name]: value });
	};
	const handleSubmit = async () => {
		if (details.email == "" || details.password == "") {
			alert("Please fill all the fields");
			return;
		}
		try {
			setLoading(true);
			// Sign in user with email and password
			const userCredential = await signInWithEmailAndPassword(
				auth,
				details.email,
				details.password
			);
			manageUserState(userCredential.user);
		} catch (error) {
			setLoading(false);
			alert(error.message);
			console.log(error);
		}
	};
	const manageUserState = async (users) => {
		const user = {
			uid: users.uid,
			email: users.email,
			name: users.displayName,
		};
		// Save user data to local storage and update context state
		const stateData = { user };
		setState({
			...state,
			user: stateData.user,
		});
		AsyncStorage.setItem("note_auth", JSON.stringify(stateData));
		setLoading(false);
	};
	return (
		<View
			style={[styles.container, { backgroundColor: `${colors.background}` }]}
		>
			{loading && (
				<View
					style={{
						position: "absolute",
						backgroundColor: `${colors.title}`,
						opacity: 0.7,
						zIndex: 999,
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Image
						source={require("../../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 80,
							height: 80,
						}}
					/>
				</View>
			)}
			<Image
				source={require("../../assets/logo.jpg")}
				alt="logo"
				style={{
					width: 120,
					height: 120,
					marginBottom: 30,
					borderRadius: 100,
				}}
			/>
			<View>
				<InputText
					title={"Email"}
					name={"email"}
					handleChange={handleChange}
					value={details.email}
				/>
				<InputText
					title={"Password"}
					name={"password"}
					handleChange={handleChange}
					value={details.password}
					showPassword={showPassword}
					setShowPassword={setShowPassword}
				/>
				<Button
					mode="contained"
					style={{
						borderRadius: 5,
						marginVertical: 20,
					}}
					buttonColor={`${colors.primary}`}
					textColor={`${colors.background}`}
					onPress={handleSubmit}
				>
					Sign in
				</Button>
				<View
					style={{
						display: "flex",
						alignItems: "center",
						flexDirection: "row",
					}}
				>
					<Text style={{ color: colors.title }}>Don’t have an account? </Text>
					<TouchableOpacity onPress={() => navigation.navigate("Register")}>
						<Text style={{ fontWeight: "800", color: `${colors.tertiary}` }}>
							Sign up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default Login;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
