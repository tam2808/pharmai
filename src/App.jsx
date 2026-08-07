import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import AppRouter from './routes/AppRouter';
import { ToastProvider } from './components/ui';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* AppRouter contains nested route structure & animations */}
        <AppRouter />
        
        {/* ToastProvider supplies top-right notifications */}
        <ToastProvider />
      </BrowserRouter>
    </Provider>
  );
}
