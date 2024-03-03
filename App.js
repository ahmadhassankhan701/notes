import { AuthProvider } from "./src/context/AuthContext";

import AppRoute from "./AppRoute";

export default function App() {
	return (
		// Wrap the AppRoute with AuthProvider for User state
		<AuthProvider>
			<AppRoute />
		</AuthProvider>
	);
}
