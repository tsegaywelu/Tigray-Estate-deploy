//this is for both sigin and sginup using google account
import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";
import { app } from "../Firebase";
import { useDispatch } from "react-redux";
import { signinSuccess } from "../redux/user/user.slice";
import { useNavigate } from "react-router-dom";

const Outh = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlegoogleauthentication = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app); //this app is comming from firebase.js
      const result = await signInWithPopup(auth, provider);
      //console.log(result) //here i am displaying users name and gmail and photo from his email.

      //to register user lets send to db  username,email and photo
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      console.log(data);
      dispatch(signinSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("you can not log in with google", error);
    }
  };
  return (
    <button
      type="button"
      onClick={handlegoogleauthentication}
      className="bg-red-700  uppercase p-3 rounded-lg text-white hover:opacity-95 "
    >
      contlinue with google
    </button>
  );
};

export default Outh;
