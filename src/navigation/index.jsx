import React, { useContext } from "react";
import AuthNavigator from "./AuthNavigator/index";
import UserNavigator from "./UserNavigator/index";
import { AuthContext } from "../context/AuthContext";
const index = () => {
	const { state } = useContext(AuthContext);
	return state && state.user ? <UserNavigator /> : <AuthNavigator />;
};

export default index;
