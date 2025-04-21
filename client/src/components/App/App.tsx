import Auth from '../../pages/Auth/Auth';
import Error from '../../pages/Error/Error';
import Main from '../../pages/Main/Main';
import PlacingOrder from '../../pages/PlacingOrder/PlacingOrder';
import Profil from '../../pages/Profil/Profil';
import Bascet from '../Bascet/Bascet';
import Header from '../Header/Header';
import Pay from '../Pay/Pay';
import './App.css'
import { Routes, Route, } from "react-router-dom";

const App = () => {
  return (
    <div className="continer">
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/bascet" element={<Bascet />} />
        <Route path="/profil/*" element={<Profil />} />
        <Route path="/replenish/balance" element={<Error />} />
        <Route path="/placing/order" element={<PlacingOrder />} />
        <Route path="/pay" element={<Pay />} />
      </Routes>
    </div>
  );
}

export default App