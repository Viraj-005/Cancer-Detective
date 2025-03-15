import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <div className="medical-background-layer">
    <div className="cell-icon normal">🔬</div>
    <div className="cell-icon abnormal">🧬</div>
    <div className="cell-icon normal">🩺</div>
    <div className="cell-icon abnormal">💉</div>
    <div className="cell-icon normal">📊</div>
    </div>
  </StrictMode>,
);