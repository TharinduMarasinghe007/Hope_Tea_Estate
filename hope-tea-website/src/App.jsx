import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Collection from "./pages/Collection";
import ProductDetails from "./pages/ProductDetails";
import TeaJourney from "./pages/TeaJourney";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/journey" element={<TeaJourney />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;