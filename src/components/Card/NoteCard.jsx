import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Avatar, IconButton, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const NoteCard = ({ data }) => {
	const theme = useTheme();
	const { colors } = theme;
	const navigation = useNavigation();
	return (
		<TouchableOpacity
			style={{
				display: "flex",
				justifyContent: "space-between",
				flexDirection: "row",
				alignItems: "center",
				backgroundColor: `${colors.inputBg}`,
				padding: 10,
				marginVertical: 5,
				borderRadius: 10,
				shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.25,
				elevation: 2,
			}}
			onPress={() => navigation.navigate("EditNote", { data })}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 15,
				}}
			>
				<Avatar.Icon size={50} icon="file" />
				<View>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							color: `${colors.title}`,
						}}
					>
						{data.title}
					</Text>
					<Text
						style={{
							color: `${colors.subTitle}`,
							fontSize: 15,
							fontWeight: "bold",
						}}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{data.desc.length > 20 ? `${data.desc.slice(0, 20)}...` : data.desc}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default NoteCard;

const styles = StyleSheet.create({});
