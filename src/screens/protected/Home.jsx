import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Sizes } from "../../util/theme";
import { IconButton, useTheme } from "react-native-paper";
import NoteCard from "../../components/Card/NoteCard";
import { AuthContext } from "../../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import moment from "moment";
const Home = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const theme = useTheme();
	const { colors } = theme;
	const [loading, setLoading] = useState(false);
	const [notes, setNotes] = useState(null);
	useEffect(() => {
		state && state.user && getNotes();
	}, [state && state.user]);
	const getNotes = async () => {
		try {
			setLoading(true);
			const docRef = doc(db, "Notes", state.user.uid);
			onSnapshot(docRef, (doc) => {
				if (doc.exists()) {
					const { notes } = doc.data();
					const sortedNotes = notes.sort((noteA, noteB) => {
						// Sort by descending order of createdAt timestamps
						return (
							moment(noteB.createdAt.seconds * 1000) -
							moment(noteA.createdAt.seconds * 1000)
						);
					});
					setNotes(sortedNotes);
				} else {
					setNotes(null);
				}
				setLoading(false);
			});
		} catch (error) {
			setLoading(false);
			alert("Error fetching notes");
			console.log(error);
		}
	};
	return (
		<View style={styles.container}>
			<View style={styles.wrapper}>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginTop: 10,
						height: "10%",
					}}
				>
					<Text
						style={{
							fontSize: Sizes.h1,
							fontWeight: "bold",
							color: `${colors.title}`,
						}}
					>
						My Notes
					</Text>
					<IconButton
						icon="plus-circle"
						color={colors.primary}
						mode="contained"
						size={30}
						onPress={() => navigation.navigate("AddNote")}
					/>
				</View>
				<View style={{ height: "85%" }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View>
							{notes ? (
								notes.map((note, index) => <NoteCard key={index} data={note} />)
							) : (
								<Text>No notes Found</Text>
							)}
						</View>
					</ScrollView>
				</View>
			</View>
		</View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	wrapper: {
		width: Sizes.width * 0.9,
	},
});
