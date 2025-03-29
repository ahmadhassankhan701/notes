import { StyleSheet } from "react-native";
import React from "react";
import { TextInput, useTheme } from "react-native-paper";
import { Sizes } from "../../util/theme";

const InputText = ({
	title,
	icon,
	name,
	handleChange,
	showPassword,
	setShowPassword,
	value,
}) => {
	const theme = useTheme();
	return (
		<TextInput
			label={""}
			placeholder={title}
			left={icon && <TextInput.Icon icon={icon} />}
			right={
				name == "password" && (
					<TextInput.Icon
						onPress={() => setShowPassword(!showPassword)}
						icon={"eye"}
					/>
				)
			}
			mode="outlined"
			style={{
				backgroundColor: `${theme.colors.inputBg}`,
				width: Sizes.width - 50,
				marginVertical: 10,
				fontSize: 12,
				height: name === "desc" ? 150 : 50,
			}}
			outlineColor="transparent"
			activeOutlineColor={"transparent"}
			selectionColor={`${theme.colors.title}`}
			onChangeText={(text) => handleChange(name, text)}
			secureTextEntry={name == "password" && !showPassword}
			multiline={name == "desc" ? true : false}
			numberOfLines={name == "desc" ? 8 : 1}
			value={value}
			keyboardType={"default"}
			maxLength={name == "desc" ? 500 : null}
		/>
	);
};

export default InputText;

const styles = StyleSheet.create({});
