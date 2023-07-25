import React, { useState, useEffect, useContext } from "react";
import { firestore, updatePassword } from "../firebase";
import { collection, setDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import AuthContext from "../utils/AuthContext";
import { getAuth, deleteUser } from "firebase/auth";
import { UserDeleteAccount } from "../utils/UserDeleteAccount";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../utils/ForgotPassword";

export default function EditAccount() {
  const { user, userData } = useContext(AuthContext);

  //For redirecting user when they exit out
  const navigate = useNavigate();

  //   storing the updated input values
  const [isEmailUpdated, setIsEmailUpdated] = useState(false);
  const [updatedFirstName, setUpdatedFirstName] = useState(userData?.firstName || "");
  const [updatedLastName, setUpdatedLastName] = useState(userData?.lastName || "");
  const [updatedDevRole, setUpdatedDevRole] = useState(userData?.devRole || "");
  const [updatedEmail, setUpdatedEmail] = useState(user?.email || "");
  const [updatedUsername, setUpdatedUsername] = useState(user?.userName || "");
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  useEffect(() => {
    setUpdatedFirstName(userData?.firstName || "");
    setUpdatedLastName(userData?.lastName || "");
    setUpdatedDevRole(userData?.devRole || "");
    setUpdatedEmail(user?.email || "");
    setUpdatedUsername(user?.userName || "");
  }, [userData, user]);

  // Event handler for updating account information
  const handleEditAccount = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(firestore, "Users", user.uid);

      //object with new update user
      const updatedData = {
        firstName: updatedFirstName,
        lastName: updatedLastName,
        devRole: updatedDevRole,
      };
      await setDoc(userDocRef, updatedData, { merge: true });

      if (isEmailUpdated) {
        await handleUpdateEmail(updatedEmail);
      }

      //Showing user if successful update
      setIsUpdateSuccess(true);
      setTimeout(() => setIsUpdateSuccess(false), 2000);
    } catch (error) {
      return error;
    }
  };

  //Updating Email
  const handleUpdateEmail = async (updatedEmail) => {
    try {
      await updateEmail(user, updatedEmail);
    } catch (error) {
      console.error(error);
    }
  };

  // Get the delete account function from the custom hook
  const handleDeleteAccount = UserDeleteAccount();

  const handleExit = () => {
    navigate('/profile')
  }

  return (
    <>
      {" "}
      <div className="flex items-center justify-center h-screen">
        <form
          className=" relative flex flex-col  bg-black text-white rounded shadow-lg p-12 mt-12 border border-white"
          action=""
        >
          <div className="flex flex-col  text-yellow-500 ">
            <h3 className="p-2 my-3 text-2xl text-center">
              {" "}
              Account Information
            </h3>

            {/* FirstName */}
            <div className="mb-4 md:flex md:justify-between">
              <div className="mb-4 md:mr-2 md:mb-0">
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  First Name
                </label>
                <input
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={updatedFirstName || ""}
                  onChange={(e) => setUpdatedFirstName(e.target.value)}
                />
              </div>

              {/* LastName */}
              <div className="md:ml-2">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={updatedLastName || ""}
                  onChange={(e) => setUpdatedLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Username */}
            <div className="mb-4 md:flex md:justify-between">
              <div className="mb-4 md:mr-2 md:mb-0">
                <label className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="lastName"
                >
                  Username
                </label>
                <input
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="lastName"
                  type="text"
                  placeholder="Username"
                  value={updatedUsername || ""}
                  onChange={(e) => setUpdatedLastName(e.target.value)}
                />
                {/* Password */}
                <label className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="password"
                >
                  Password
                  <div className="hover:text-yellow-500">
                    <ForgotPassword />
                  </div>
                </label>
              </div>
            </div>


            {/* Email */}
            <div className=" flex flex-col items-start">
              <label
                className="mb-2 text-sm font-bold text-gray-700"
                htmlFor="usernameField"
              >
                {" "}
                Email
              </label>
              <input
                className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Email"
                value={updatedEmail || user?.email || ""}
                onChange={(e) => setUpdatedEmail(e.target.value)}
              />


              {/* Developer Role  */}
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="phoneNumberField"
              >
                {" "}
                Developer Role
              </label>
              <input
                className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Dev Role"
                value={updatedDevRole || ""}
                onChange={(e) => setUpdatedDevRole(e.target.value)}
              />
            </div>

            {/* SaveChanges and Delete Account Buttons */}
            <div className="flex items-center justify-center">
              <button
                className="flex items-center justify-center h-12 px-6 w-64 bg-yellow-500 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-yellow-300
                  hover:rounded-3xl
                  hover:border-2
                  hover:border-amber-700
                  hover:w-80 ease-in-out duration-300"
                onClick={handleEditAccount}
              >
                Save Changes
              </button>
            </div>
            {isUpdateSuccess && (
              <div className="flex items-center justify-center mt-4 text-green-500">
                Account updated successfully!
              </div>
            )}
            <div className="flex mt-6 justify-center text-xs">
              <a
                href="#"
                className="text-blue-499 hover:text-yellow-300"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </a>
            </div>
          </div>
          <button className="absolute top-2 right-2 px-2 py-2" onClick={handleExit}>X</button>
        </form>
      </div>
    </>
  );
}
