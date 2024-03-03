import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import React, { useContext, useState } from "react";
import { Button, TextInput, useTheme } from "react-native-paper";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { AuthContext } from "../../../context/AuthContext";
const AddNote = () => {
	const { state } = useContext(AuthContext);
	const uid = state && state.user ? state.user.uid : "";
	const [detail, setDetail] = useState({
		title: "",
		desc: "",
	});
	const [loading, setLoading] = useState(false);
	const colors = useTheme().colors;
	const handleChange = (name, value) => {
		setDetail({ ...detail, [name]: value });
	};
	const getRandomNumbers = (length = 6) => {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let newString;

		while (!newString || newString.length !== length) {
			newString = "";
			for (let i = 0; i < length; i++) {
				newString += characters.charAt(
					Math.floor(Math.random() * characters.length)
				);
			}
		}

		return newString;
	};
	const handleSubmit = async () => {
		if (detail.title == "" || detail.desc == "") {
			alert("Please fill all the fields");
			return;
		}
		try {
			setLoading(true);
			// Random id for each note
			const newNote = {
				noteId: getRandomNumbers(),
				title: detail.title,
				desc: detail.desc,
				createdAt: new Date(),
			};
			const docRef = doc(db, "Notes", uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				// If document exists, update the notes array
				await updateDoc(docRef, {
					notes: arrayUnion(newNote),
				});
			} else {
				// If document does not exist, create a new document
				await setDoc(docRef, {
					notes: [newNote],
				});
			}
			setDetail({ ...detail, title: "", desc: "" });
			setLoading(false);
			alert("Note added successfully");
		} catch (error) {
			setLoading(false);
			alert("Something went wrong");
			console.log(error);
		}
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
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
						source={require("../../../../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 80,
							height: 80,
						}}
					/>
				</View>
			)}

			<View style={{ flex: 0.1 }}>
				<TextInput
					label={""}
					mode="flat"
					placeholder="Title"
					value={detail.title}
					selectionColor={colors.title}
					style={{ backgroundColor: colors.inputBg, flex: 1 }}
					onChangeText={(text) => handleChange("title", text)}
					theme={{ roundness: 0 }}
				/>
			</View>
			<ScrollView
				contentContainerStyle={{ flex: 1 }}
				showsVerticalScrollIndicator={false}
			>
				<TextInput
					label={""}
					placeholder="Description"
					value={detail.desc}
					mode="flat"
					multiline
					numberOfLines={10}
					selectionColor={colors.title}
					style={{ backgroundColor: colors.inputBg, flex: 1 }}
					onChangeText={(text) => handleChange("desc", text)}
					theme={{ roundness: 0 }}
				/>
			</ScrollView>
			<View style={{ flex: 0.1 }}>
				<Button
					mode="contained"
					buttonColor={colors.primary}
					textColor={colors.background}
					style={{
						alignSelf: "center",
						borderRadius: 0,
						width: "100%",
					}}
					onPress={handleSubmit}
				>
					Add Note
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
};

export default AddNote;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
