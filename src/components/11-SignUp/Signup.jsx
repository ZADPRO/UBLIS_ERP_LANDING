import logo from "../../assets/logo/logo.jpeg";
import { Stepper } from "../../pages/Stepper/Stepper";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  console.log("navigate", navigate);

  return (
    <div
      className="w-full min-h-screen bg-[#f9f3eb] flex flex-col pt-10 lg:flex-row justify-center items-center px-6"
    >
      {/* Left Section: Logo & Text */}
      <div className="flex flex-col w-full lg:w-[50%] items-center text-center">
        <img src={logo} className="mt-5 w-[150px]" alt="logo" />
        <h1 className="text-[#000] text-[30px] pt-2 font-normal">
          Create an Account
        </h1>
        <h1 className="text-[#000] text-[20px] pt-2 font-bold">
          Sign Up to access <span className="text-[#ff5001]">Ublis Yoga</span>{" "}
          Login
        </h1>

        {/* Navigation Links */}
        <div className="mt-4">
          <h1
            className="text-[#000] cursor-pointer text-[18px] font-semibold"
            onClick={() => navigate("/signin")}
          >
            Already Have an Account?
          </h1>
          <h1
            className="text-[#ff5001] cursor-pointer mt-3 text-[20px] font-semibold"
            onClick={() => navigate("/")}
          >
            Back to Site <i className="fa-solid fa-arrow-right-to-bracket"></i>
          </h1>
        </div>
      </div>

      {/* Right Section: Stepper Form */}
      <div className="w-full lg:w-[50%] flex justify-center">
        <div className="w-full max-w-[500px] p-5 ">
          <Stepper />
        </div>
      </div>
    </div>
  );
}
