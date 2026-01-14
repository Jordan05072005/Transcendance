import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { NotificationProvider } from './components/ui/Notification';

function App() {
	return (
		<NotificationProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/privacy-policy" element={<PrivacyPolicy />} />
					<Route path="/terms-of-service" element={<TermsOfService />} />
				</Routes>
			</BrowserRouter>
		</NotificationProvider>
	);
}

export default App
