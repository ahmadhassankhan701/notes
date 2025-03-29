import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Button, useTheme } from "react-native-paper";
import InputText from "../components/Input/InputText";
import { Sizes } from "../util/theme";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
const Register = ({ navigation }) => {
	const theme = useTheme();
	const { colors } = theme;
	const [details, setDetails] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handleChange = async (name, value) => {
		if (name === "name") {
			setDetails({ ...details, name: value });
			if (value.length > 32) {
				setErrors({ ...errors, name: "Name is too long" });
			} else {
				setErrors({ ...errors, name: "" });
			}
		}
		if (name === "email") {
			handleEmail(value);
		}
		if (name === "password") {
			handlePassword(value);
		}
	};
	const handlePassword = async (val) => {
		setDetails({ ...details, password: val });
		if (val.length < 8 || val.length > 20) {
			setErrors({
				...errors,
				password: "Password should be 8-20 characters",
			});
		} else {
			setErrors({
				...errors,
				password: "",
			});
		}
	};
	const handleEmail = async (val) => {
		setDetails({ ...details, email: val });
		const regex =
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		if (regex.test(val) === false) {
			setErrors({
				...errors,
				email: "Email is invalid",
			});
		} else {
			setErrors({
				...errors,
				email: "",
			});
		}
	};
	const handleSubmit = async () => {
		if (details.email == "" || details.password == "" || details.name == "") {
			alert("Please fill all the fields");
			return;
		}
		var emptyError =
			errors.name == "" && errors.email == "" && errors.password == "";
		if (emptyError == false) {
			alert("Please clear the errors");
			return;
		}
		try {
			setLoading(true);
			// Create user with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				details.email,
				details.password
			);
			updateProfile(auth.currentUser, {
				displayName: details.name,
			});
			manageUserState(userCredential.user);
		} catch (error) {
			setLoading(false);
			if (error.code === "auth/email-already-in-use") {
				alert("Email already registered. Try using different email");
			} else {
				// Handle other errors during user creation
				alert("Error creating user:", error.message);
			}
			console.error(error);
		}
	};
	const manageUserState = async (users) => {
		try {
			let user = {
				name: details.name,
				email: details.email,
				image: "",
				createdAt: new Date(),
			};
			await setDoc(doc(db, "Users", users.uid), user);
			setLoading(false);
			alert("User created. You can login now!");
		} catch (e) {
			setLoading(false);
			alert("Error adding user");
			console.log(e);
		}
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
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
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ flex: 1, marginTop: 30 }}
			>
				<View>
					<View style={styles.wrapper}>
						<View
							style={{
								height: "20%",
								display: "flex",
								justifyContent: "flex-end",
								alignItems: "center",
							}}
						>
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
						</View>
						<View
							style={{
								height: "80%",
							}}
						>
							<View>
								<InputText
									title={"Name"}
									name={"name"}
									handleChange={handleChange}
									value={details.name}
								/>
								{errors.name != "" && (
									<Text
										style={{
											color: `${colors.error}`,
											textAlign: "center",
										}}
									>
										{errors.name}
									</Text>
								)}
								<InputText
									title={"Email"}
									name={"email"}
									handleChange={handleChange}
									value={details.email}
								/>
								{errors.email != "" && (
									<Text
										style={{
											color: `${colors.error}`,
											textAlign: "center",
										}}
									>
										{errors.email}
									</Text>
								)}
								<InputText
									title={"Set password"}
									name={"password"}
									handleChange={handleChange}
									value={details.password}
									showPassword={showPassword}
									setShowPassword={setShowPassword}
								/>
								{errors.password != "" && (
									<Text
										style={{
											color: `${colors.error}`,
											textAlign: "center",
										}}
									>
										{errors.password}
									</Text>
								)}
								<Button
									mode="contained"
									style={{
										borderRadius: 0,
										marginVertical: 20,
									}}
									buttonColor={`${colors.primary}`}
									textColor={`${colors.background}`}
									onPress={handleSubmit}
								>
									Sign up
								</Button>
								<View
									style={{
										display: "flex",
										alignItems: "center",
										flexDirection: "row",
									}}
								>
									<Text style={{ color: colors.title }}>
										Already have an account?{" "}
									</Text>
									<TouchableOpacity
										onPress={() => navigation.navigate("Login")}
									>
										<Text
											style={{
												fontWeight: "800",
												color: `${colors.tertiary}`,
											}}
										>
											Sign in
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default Register;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	wrapper: {
		width: Sizes.width - 50,
		marginTop: 50,
	},
});
