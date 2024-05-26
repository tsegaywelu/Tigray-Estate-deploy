import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase";
import {
  updateuserstart,
  updateusersuccess,
  updateuserfailure,
  deletestart,
  deletesuccess,
  deletefailure,
  signoutstart,
  signoutsuccess,
  signoutfailure,
} from "../redux/user/user.slice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

//later on github i will use this
// allow read;
//      allow write : if
//       request.resource.size < 2*1024*1024 &&
//       request.resource.contentType.matches('image/.*');  from firbase storage

const Profile = () => {
  const dispatch = useDispatch();

  const fileRef = useRef(null);

  const { currentuser, loading, error } = useSelector((state) => state.user);
  const [file, setfile] = useState(undefined);
  const [filepersent, setfilepercent] = useState(0);
  const [formdata, setformdata] = useState({});
  const [fileuploaderror, setfileuploaderror] = useState(false);
  const [updategood, setupdategood] = useState(false);
  //console.log(file);

  //  console.log(filepersent);
  //console.log(formdata);
  //  console.log(fileuploaderror);

  useEffect(() => {
    if (file) {
      handleFileUpload(file); //if there is file go to upload it
    }
  }, [file]);
  //first go to firbase and  create link to image profile of user   then upload to database
  const handleFileUpload = (file) => {
    //this works with firbase storage
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; //to make it unique name i add the date
    const storageRef = ref(storage, fileName);
    const uploadtask = uploadBytesResumable(storageRef, file);
    uploadtask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log(progress);
        setfilepercent(Math.round(progress));
      },
      (error) => {
        // This 'error' parameter is scoped to this callback function. no conflict out side of this function
        //this is not decleared and warnning  omit it no problem
        setfileuploaderror(true);
      },
      () => {
        getDownloadURL(uploadtask.snapshot.ref).then((downloadURL) => {
          setformdata({ ...formdata, avatar: downloadURL });
        });
      }
    );
  };

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.id]: e.target.value });
  };

  // i am updating user information
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateuserstart());

      const response = await fetch(
        `http://localhost:3000/api/user/update/${currentuser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formdata),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success === false) {
        console.log("Error response:", data.message);
        dispatch(updateuserfailure(data.message));
        return;
      }

      dispatch(updateusersuccess(data.user));
      setupdategood(true);
    } catch (error) {
      console.error("Error caught:", error);
      updateuserfailure(error.message);
    }
  };
  //to delete user account permanently
  const handledelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(deletestart());
      const response = await fetch(
        `http://localhost:3000/api/user/delete/${currentuser._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success === false) {
        dispatch(deletefailure(data.message));
        return;
      }

      dispatch(deletesuccess(data.message));
    } catch (error) {
      dispatch(deletefailure(error.message));
      console.error("Error caught:", error);
    }
  };

  const handlelogout = async (e) => {
    e.preventDefault();

    try {
      dispatch(signoutstart());
      const response = await fetch("http://localhost:3000/api/auth/signout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(signoutfailure(data.message));
        return;
      }

      dispatch(signoutsuccess(data.message));
    } catch (error) {
      console.error("Error caught:", error);
    }
  };
  //console.log(file);

  //i am feching the lists from back-end
  const [mylist, setmylist] = useState([]);
  const [errorlist, seterrorlist] = useState(false);
  const showlists = async () => {
    try {
      seterrorlist(false);
      const response = await fetch(
        `http://localhost:3000/api/user/getlist/${currentuser._id}`,
        {
          //default is get so no need to pass method
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success == false) {
        seterrorlist(true);
      }
      setmylist(data.listings);
    } catch (error) {
      console.log(error);
      seterrorlist(true);
    }
  };

  //here to delete and edit listings  also mylist variable must updated to remove the deleted list

  const handledeletelist = async (theidtobedeleted) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/listing/deletelisting/${theidtobedeleted}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      showlists();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handlesubmit}>
        <input
          type="file"
          placeholder="upload your image "
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setfile(e.target.files[0])}
        />

        <img
          src={formdata.avatar || currentuser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />
        <span className="self-center text-sm ">
          {fileuploaderror ? (
            <p className="text-red-700">
              File upload error(image size must be less than 2 megabytes)
            </p>
          ) : filepersent > 0 && filepersent < 100 ? (
            <p className="text-slate-700">{`Uploading ${filepersent}%`}</p>
          ) : filepersent === 100 ? (
            <p className="text-green-700">Image successfully uploaded!</p>
          ) : null}
        </span>

        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentuser.username}
          className="border p-3 rounded-lg"
          onChange={handlechange}
        />
        <input
          type="email"
          defaultValue={currentuser.email}
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handlechange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handlechange}
        />
        <button
          disabled={loading}
          type="submit"
          className="border p-3 rounded-lg bg-slate-700  text-white "
        >
          {loading ? "loading..." : "Update"}
        </button>
        <Link
          to="/createlisting"
          className="bg-green-800 p-3 hover:opacity-95 rounded-lg"
        >
          Create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handledelete}>
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handlelogout}>
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updategood ? "user updated succesfully!" : ""}
      </p>
      <button
        onClick={showlists}
        className="bg-green-700 p-3 rounded-lg w-full max-w-4xl"
      >
        show your list
      </button>
      <p className="text-red-700 text-sm text-center">
        {" "}
        {errorlist ? "there is problem on finding list!" : ""}
      </p>
      {mylist && mylist.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            your listing
          </h1>
          {mylist.map((lists) => (
            <div
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
              key={lists._id}
            >
              <Link to={`listing/${lists._id}`}>
                <img
                  src={lists.imageUrls[0]}
                  alt="dfew"
                  className="w-16 h-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`listing/${lists._id}`}
              >
                <p>{lists.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handledeletelist(lists._id)}
                  //here if there is parenthesis  it does not wait for click it runs immediately so use arrow function
                  className="text-red-700 uppercase"
                >
                  delete
                </button>
                <Link to={`/editlisting/${lists._id}`}>
                  <button className="text-green-700 uppercase">edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
