import { AuthProvider } from "./src/context/AuthContext";

import AppRoute from "./AppRoute";

export default function App() {
	return (
		<AuthProvider>
			<AppRoute />
		</AuthProvider>
	);
}
