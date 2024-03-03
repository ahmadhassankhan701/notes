import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Button, TextInput, useTheme } from "react-native-paper";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { AuthContext } from "../../../context/AuthContext";
const EditNote = ({ navigation, route }) => {
	const { state } = useContext(AuthContext);
	const uid = state && state.user ? state.user.uid : "";
	const { data } = route.params;
	const [detail, setDetail] = useState({
		title: "",
		desc: "",
	});
	const [loading, setLoading] = useState(false);
	const colors = useTheme().colors;
	useEffect(() => {
		if (data) {
			setDetail({
				...detail,
				title: data.title,
				desc: data.desc,
			});
		}
	}, [data]);

	const handleChange = (name, value) => {
		setDetail({ ...detail, [name]: value });
	};
	const handleSubmit = async () => {
		if (detail.title == "" || detail.desc == "") {
			alert("Please fill all the fields");
			return;
		}
		try {
			setLoading(true);
			const docRef = doc(db, "Notes", uid);
			const docSnap = await getDoc(docRef);
			let items = [];
			if (docSnap.exists()) {
				const { notes } = docSnap.data();
				// Update the note in the array
				notes.map((note) => {
					if (note.noteId == data.noteId) {
						note.title = detail.title;
						note.desc = detail.desc;
						note.createdAt = new Date();
					}
					items.push(note);
				});
				await updateDoc(docRef, {
					notes: items,
				});
			}
			setLoading(false);
			alert("Note updated successfully");
		} catch (error) {
			setLoading(false);
			alert("Something went wrong");
			console.log(error);
		}
	};
	const handleDelete = async () => {
		try {
			setLoading(true);
			const docRef = doc(db, "Notes", uid);
			const docSnap = await getDoc(docRef);
			let items = [];
			if (docSnap.exists()) {
				const { notes } = docSnap.data();
				notes.map((note) => {
					// Remove the note from the array
					if (note.noteId != data.noteId) {
						items.push(note);
					}
				});
				await updateDoc(docRef, {
					notes: items,
				});
			}
			setDetail({
				...detail,
				title: "",
				desc: "",
			});
			setLoading(false);
			alert("Note deleted successfully");
			navigation.navigate("Home");
		} catch (error) {
			setLoading(false);
			alert("Deletion Failed");
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
			<View style={{ flex: 0.2 }}>
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
					Update Note
				</Button>
				<Button
					mode="contained"
					buttonColor={colors.error}
					textColor={colors.background}
					style={{
						alignSelf: "center",
						borderRadius: 0,
						width: "100%",
					}}
					onPress={handleDelete}
				>
					Delete Note
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
};

export default EditNote;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
