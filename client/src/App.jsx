//here i will type all the routes
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Header } from "./components/Header";
import SignUp from "./pages/Signup";
import Signin from "./pages/signin";
import PrivateRoute from "./components/Privateroute";
import Profile from "./pages/Profile";
import Createlisting from "./pages/Createlisting";
import Updatelisting from "./pages/Updatelisting";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import About from "./pages/about";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        {/* /here i am typing the listing page out side of the private route to be shown by users */}
        <Route path="/listing/:theidtodisplay" element={<Listing />} />
        <Route path="search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/createlisting" element={<Createlisting />} />
          <Route
            path="/editlisting/:theidtobeupdated" //here the id is essential for updating
            element={<Updatelisting />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
