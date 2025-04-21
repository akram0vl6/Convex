import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App/App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <App />
        </SnackbarProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
