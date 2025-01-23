import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import TextInput from "../Inputs/TextInput";
import SelectInput from "../Inputs/SelectInput";
// import TextareaInput from "../Inputs/TextareaInput";
import CheckboxInput from "../Inputs/CheckboxInput";
import RadioButton from "../Inputs/RadiobuttonInput";
// import RadiobuttonInput from "../Inputs/RadiobuttonInput";
import TextLabel from "../Labels/TextLabel";
import Axios from "axios";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import "./RegistrationStepper.css";
import { FaEye } from "react-icons/fa";
import { ImUpload2 } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { Calendar } from "primereact/calendar";
import RadiobuttonInput from "../Inputs/RadiobuttonInput";
import { Input } from "postcss";
import { LuCalendarClock } from "react-icons/lu";
import { FaArrowLeftLong } from "react-icons/fa6";

const RegistrationStepper = ({ closeregistration, handlecloseregister }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState({
    medicalIssue: false,
  });


  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let prevMonth = month === 0 ? 11 : month - 1;
  let prevYear = prevMonth === 11 ? year - 1 : year;
  let nextMonth = month === 11 ? 0 : month + 1;
  let nextYear = nextMonth === 0 ? year + 1 : year;

  const [date, setDate] = useState(null);

  let minDate = new Date();

  minDate.setMonth(prevMonth);
  minDate.setFullYear(prevYear);

  let maxDate = new Date();

  maxDate.setMonth(nextMonth);
  maxDate.setFullYear(nextYear);

  const [inputs, setInputs] = useState({
    userid: "",
    email: "",
    fname: "",
    lname: "",
    phoneno: "",
    whatsappno: "",
    emgContaxt: "",
    dob: "",
    age: "",
    gender: "",
    maritalstatus: "",
    kidsCount: "",
    anniversarydate: "",
    caretakername: "",
    qualification: "",
    occupation: "",
    addressboth: false,
    tempaddess: "",
    tempstate: "",
    tempcity: "",
    tempincode: "",
    tempdoorno: "",
    tempstreetname: "",
    peraddress: "",
    perdoorno: "",
    perstreetname: "",
    perstate: "",
    percity: "",
    perpincode: "",
    height: "",
    weight: "",
    bloodgroup: "",
    classtype: "",
    bmi: 0,
    bp: "",
    bpValue: "",
    injuries: "",
    breaks: "",
    activities: "",
    anthingelse: "",
    memberlist: "",
    weekDaysTiming: "",
    weekEndTiming: "",
    sessiontype: "",
    branch: "",
    others: "",
    medicaldetails: "",
    doctorname: "",
    hospitalname: "",
    painscale: "",
    painscaleValue: "",
    duration: "",
    past: "",
    family: "",
    therapyanything: "",
    monthStart: "",
    monthEnd: "",
  });

  const decrypt = (encryptedData, iv, key) => {
    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
      },
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    // Convert decrypted data to UTF-8 string and then parse it as JSON
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    // Parse the string into a JSON object
    return JSON.parse(decryptedString);
  };

  // CHANGES BY THIRU
  const [selectedValue, setSelectedValue] = useState(null); // No default selection
  const [stepperactive, setStepperactive] = useState(1);
  const [nextStepperValue, setNextStepperValue] = useState(null); // Store nextStepperValue in state
  const [newStepperValue, setNewStepperValue] = useState(null)


  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value); // Update the selected value

    // Determine the next stepper value based on the radio button selection
    if (value === 'first') {
      console.log(3); // Log 3 if the first radio is selected
      setNextStepperValue(3); // Update the nextStepperValue
    } else if (value === 'second') {
      console.log(6); // Log 6 if the second radio is selected
      setNextStepperValue(6); // Update the nextStepperValue
    }
  };

  // useEffect to listen for changes in nextStepperValue
  useEffect(() => {
    if (nextStepperValue !== null) {
      setNewStepperValue(nextStepperValue);
    }
  }, [newStepperValue]);


  const handleNext = () => {
    setStepperactive((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const handleBack = () => {
    setStepperactive((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const [addessschecked, setAddressChecked] = useState(false);
  const [agreementchecked, setAgreementchecked] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [packageSelect, setPackageSelect] = useState(0);

  const [uploadDocuments, setUploadDocuments] = useState([
    {
      refMedDocName: "",
      refMedDocPath: "",
      refMedDocFile: { contentType: "", content: "" },
      refMedDocUpload: false,
      refMedDocUpBtn: false,
    },
  ]);

  const handleRemoveDocument = (index) => {
    console.log(
      "uploadDocuments[index].refMedDocPath",
      uploadDocuments[index].refMedDocPath
    );
    if (uploadDocuments[index].refMedDocPath == "") {
      setUploadDocuments((prev) => prev.filter((_, idx) => idx !== index));
    } else {
      try {
        Axios.post(
          import.meta.env.VITE_API_URL + "profile/deleteMedicalDocument",
          { filePath: uploadDocuments[index].refMedDocPath },
          {
            headers: {
              Authorization: localStorage.getItem("JWTtoken"),
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => {
            console.log(res, "res");

            const data = decrypt(
              res.data[1],
              res.data[0],
              import.meta.env.VITE_ENCRYPTION_KEY
            );
            console.log("data", data);

            if (data.success) {
              console.log("Success delete");
              setUploadDocuments((prev) =>
                prev.filter((_, idx) => idx !== index)
              );
            }
          })
          .catch((err) => {
            console.error("Error Deleting the File:", err);
          });
      } catch (error) {
        console.error("Error in Delete Document:", error);
      }
    }
  };

  const handlePreviewDocument = (dataArray, index) => {
    console.log("dataArray", dataArray);
    const file = dataArray[index]?.refMedDocFile;
    console.log("file", file);
    if (file) {
      try {
        const binaryContent = atob(file.content);
        const byteArray = new Uint8Array(binaryContent.length);
        for (let i = 0; i < binaryContent.length; i++) {
          byteArray[i] = binaryContent.charCodeAt(i);
        }

        const blob = new Blob([byteArray], { type: file.contentType });
        const url = URL.createObjectURL(blob);
        let content;
        if (file.contentType == "application/pdf") {
          content = `<iframe src="${url}" width="100%" height="450px" style="border: none;"></iframe>`;
        } else {
          content = `<img src="${url}" alt="Document Preview" style="max-width: 100%; max-height: 450px; object-fit: contain; display: block; margin: 0 auto;">`;
        }
        const targetDiv = document.getElementById("target-container");

        Swal.fire({
          title: "Medical Document Preview",
          html: `
          <div style="display: flex; justify-content:center;align-item:center;">     
          ${content} 
          </div>
            <div style="margin-top: 10px; text-align: center; width: 100%; display: flex; justify-content: center;">
              <a href="${url}" download="document.pdf" style="padding: 10px 20px; width: 80%; background-color: #f95005; color: white; text-decoration: none; border-radius: 4px; text-align: center;">
                Download
              </a>
            </div>
          `,
          showCloseButton: true,
          showConfirmButton: false,
          target: targetDiv,
          customClass: {
            title: "custom-title",
            popup: "custom-popup",
          },
        });
      } catch (error) {
        console.error("Error previewing document:", error);
      }
    } else {
      console.error("No file to preview");
    }
  };

  const storeDocument = (index) => {
    const uploadDocument = uploadDocuments[index];
    try {
      Axios.post(
        import.meta.env.VITE_API_URL + "profile/userHealthReportUpload",
        uploadDocument.refMedDocFile,
        {
          headers: {
            Authorization: localStorage.getItem("JWTtoken"),
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then((res) => {
          const data = decrypt(
            res.data[1],
            res.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );
          setUploadDocuments((prev) => {
            const updatedDocuments = [...prev];
            updatedDocuments[index] = {
              ...updatedDocuments[index],
              refMedDocPath: data.filePath,
              refMedDocFile: data.file,
              refMedDocUpload: true,
            };
            return updatedDocuments;
          });
        })
        .catch((err) => {
          console.error("Error uploading file:", err);
        });
    } catch (error) {
      console.error("Error in storeDocument:", error);
    }
  };

  const handleAddDocument = () => {
    setUploadDocuments((prev) => [
      ...prev,
      {
        refMedDocName: "",
        refMedDocPath: "",
        refMedDocFile: { contentType: "", content: "" },
        refMedDocUpload: false,
        refMedDocUpBtn: false,
      },
    ]);
  };

  // Fetch states when component mounts (you can replace 'IN' with any country code)
  useEffect(() => {
    const countryStates = State.getStatesOfCountry("IN"); // 'IN' for India
    setStates(countryStates);
  }, []);

  const handleStateChange = (event) => {
    1909;
    if (event.target.name != "tempstate") {
      const stateCode = event.target.value;
      setSelectedState(stateCode);
      if (stateCode) {
        const stateCities = City.getCitiesOfState("IN", stateCode); // 'IN' for India
        setCities(stateCities);
      } else {
        setCities([]); // Reset cities if no state is selected
      }

      setInputs({
        ...inputs,
        [event.target.name]: event.target.value,
      });
    }
  };

  const [selectedOption, setSelectedOption] = useState({
    accident: "",
    breaks: "",
    care: "",
    backpain: "",
    bp: "",
  });

  const [branchList, setBranchList] = useState([]);

  const [memberList, setMemberList] = useState([]);

  const [preferWeekDaysTiming, setpreferWeekDaysTiming] = useState([]);
  const [preferWeekEndTiming, setpreferWeekEndTiming] = useState([]);
  const [browsher, setBrowsher] = useState();
  const [viewBrowsher, setViewBrowsher] = useState(false);

  const [sessiontype, setSessionType] = useState([]);

  const [counts, setCounts] = useState({
    weekends: 0,
    weekdays: 0,
  });

  const datePicker = (date) => {
    if (!date) return null; // Return null for invalid input
    const parsedDate = new Date(date); // Convert to Date object
    if (isNaN(parsedDate)) {
      console.error("Invalid date input:", date);
      return null;
    }
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = parsedDate.getFullYear();
    return `${month}/${year}`;
  };

  const calculateWeekendsAndWeekdays = (e) => {
    // Format the inputs
    const monthStart = datePicker(inputs.monthStart);
    const monthEnd = datePicker(e.value);

    console.log("Formatted monthStart:", monthStart);
    console.log("Formatted monthEnd:", monthEnd);

    // Check for empty values
    if (!monthStart || !monthEnd) {
      console.error("Invalid input: monthStart or monthEnd is missing.");
      return;
    }

    // Parse the month and year
    const [startMonth, startYear] = monthStart.split("/").map(Number);
    const [endMonth, endYear] = monthEnd.split("/").map(Number);

    console.log("Parsed startMonth:", startMonth, "startYear:", startYear);
    console.log("Parsed endMonth:", endMonth, "endYear:", endYear);

    // Ensure parsed values are valid numbers
    if (!startMonth || !startYear || !endMonth || !endYear) {
      console.error(
        "Invalid parsing: startMonth, startYear, endMonth, or endYear is invalid."
      );
      return;
    }

    // Create date objects
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 0);

    console.log("startDate:", startDate);
    console.log("endDate:", endDate);

    // Check if startDate is after endDate
    if (startDate > endDate) {
      console.error("Start date cannot be after end date.");
      return;
    }

    let weekends = 0;
    let weekdays = 0;

    // Loop through all dates
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const day = date.getDay(); // Get day of the week
      console.log("Current date:", date, "Day:", day);
      if (day === 0 || day === 6) {
        weekends++;
      } else {
        weekdays++;
      }
    }

    console.log("weekends:", weekends);
    console.log("weekdays:", weekdays);

    // Update state
    setCounts({ weekends, weekdays });
    console.log("Updated counts:", { weekends, weekdays });
  };

  // const [personalHealthProblem, setPersonalHealthProblem] = useState([]);

  const branchOptions = Object.entries(branchList).map(([value, label]) => ({
    value, // Key (e.g., '1')
    label, // Value (e.g., 'Chennai')
  }));

  const memberlistOptions = Object.entries(memberList).map(
    ([value, label]) => ({
      value, // Key (e.g., '1')
      label, // Value (e.g., 'Chennai')
    })
  );

  const preferWeekDaysTimingOption = Object.entries(preferWeekDaysTiming).map(
    ([value, label]) => ({
      value, // Key (e.g., '1')
      label, // Value (e.g., 'Chennai')
    })
  );
  const preferWeekEndTimingOption = Object.entries(preferWeekEndTiming).map(
    ([value, label]) => ({
      value, // Key (e.g., '1')
      label, // Value (e.g., 'Chennai')
    })
  );

  console.log("sessiontype", sessiontype);
  const sessionTypeOption = Object.entries(sessiontype).map(
    ([value, label]) => ({
      value, // Key (e.g., '1')
      label, // Value (e.g., 'Chennai')
    })
  );

  const [modeofcontact, setModeofContact] = useState();

  useEffect(() => {
    Axios.get(
      import.meta.env.VITE_API_URL + "profile/passRegisterData",
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json",
        },
      },
      {}
    )
      .then((res) => {
        const data = decrypt(
          res.data[1],
          res.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        if (data.token == false) {
          navigate("/expired");
        }

        console.log("-------------->", data);

        if (data.success) {
          const Dob = myFormatToDatePicker(data.data.ProfileData.dob);
          localStorage.setItem("JWTtoken", "Bearer " + data.token + "");
          setBranchList(data.data.branchList);
          setInputs({
            ...inputs,
            fname: data.data.ProfileData.fname,
            lname: data.data.ProfileData.lname,
            userid: data.data.ProfileData.username,
            dob: Dob,
            age: data.data.ProfileData.age,
            email: data.data.ProfileData.email,
            phoneno: data.data.ProfileData.phone,
          });

          setModeofContact(
            data.data.CommunicationLabel.map((item) => ({
              value: item.refCtId, // Use refCtId as the value
              label: item.refCtText, // Use refCtText as the label
            }))
          );

          // Map personal health problem data into the required structure
          const healthConditions = Object.entries(
            data.data.presentHealthProblem
          ).map(([value, label]) => ({
            label,
            value: Number(value), // Ensure the value is a number
            checked: 0, // Set default checked value as 0
          }));

          // Set the mapped conditions
          setConditions(healthConditions);
        }
      })
      .catch((err) => {
        // Catching any 400 status or general errors
        console.error("Error: ", err);
      });
  }, []); // Ensure the effect runs only once on component mount

  const [conditions, setConditions] = useState([]); // Start with an empty array since conditions will be set after the API call

  // Function to handle checkbox changes
  const handleCheckboxChange = (index) => {
    setConditions((prevConditions) =>
      prevConditions.map((condition, i) =>
        i === index
          ? { ...condition, checked: condition.checked === 1 ? 0 : 1 }
          : condition
      )
    );
  };

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust age if the current date is before the birth date in the current year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  const handleInput = (e) => {
    console.log("e", e.target);
    const { name, value } = e.target;
    console.log("value", value);
    console.log("name", name);

    let updatedInputs = {
      ...inputs,
      [name]: value,
    };



    // If the "addressboth" flag is true, copy the permanent address fields to temporary fields
    if (updatedInputs.addressboth) {
      updatedInputs = {
        ...updatedInputs,
        tempdoorno: updatedInputs.perdoorno,
        tempstreetname: updatedInputs.perstreetname,
        tempaddess: updatedInputs.peraddress,
        tempstate: updatedInputs.perstate,
        tempincode: updatedInputs.perpincode,
        tempcity: updatedInputs.percity,
      };
    }

    if (name === "branch") {
      Axios.post(
        import.meta.env.VITE_API_URL + "profile/MemberList",
        {
          branchId: value,
          refAge: inputs.age,
        },
        {
          headers: {
            Authorization: localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          const data = decrypt(
            res.data[1],
            res.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );
          if (data.token == false) {
            navigate("/expired");
          }
          setMemberList(data.data); // Make sure this updates memberList
          // setpreferTiming([]);
          setSessionType([]);
        })
        .catch((err) => {
          console.error("Error: ", err);
        });
    } else if (name === "classtype") {
      Axios.post(
        import.meta.env.VITE_API_URL + "profile/sectionTime",
        {
          sectionId: parseInt(inputs.memberlist),
          branch: parseInt(inputs.branch),
          classType: parseInt(value),
        },
        {
          headers: {
            Authorization: localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          const data = decrypt(
            res.data[1],
            res.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );
          if (data.token == false) {
            navigate("/expired");
          }
          console.log(" -----------", data);
          // setpreferTiming(data.SectionTime);
          setSessionType(data.SectionTime);
        })
        .catch((err) => {
          // Catching any 400 status or general errors
          console.error("Error: ", err);
        });
    } else if (name === "sessiontype") {

      updatedInputs = {
        ...inputs,
        [name]: value,
        weekDaysTiming: "",
        weekEndTiming: ""
      };

      Axios.post(
        import.meta.env.VITE_API_URL + "profile/PackageTime",
        {
          packageId: parseInt(value),
          branchId: parseInt(inputs.branch),
        },
        {
          headers: {
            Authorization: localStorage.getItem("JWTtoken"),
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          const data = decrypt(
            res.data[1],
            res.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );
          if (data.token == false) {
            navigate("/expired");
          }
          console.log("Timing List -----------", data);
          setpreferWeekDaysTiming(data.packageWTiming);
          setpreferWeekEndTiming(data.packageWeTiming);
          setBrowsher(data.browsher)
          // setSessionType(data.SectionTime);
        })
        .catch((err) => {
          // Catching any 400 status or general errors
          console.error("Error: ", err);
        });
    } else if (name === "maritalstatus") {
      if (value === "single") {
        updatedInputs = {
          ...updatedInputs,
          anniversarydate: "",
        };
      }
    } else if (name === "dob") {
      updatedInputs = {
        ...updatedInputs,
        age: calculateAge(value),
      };
    } else if (name === "height") {
      const bmi = calculateBMI(inputs.weight, value);
      updatedInputs = {
        ...updatedInputs,
        bmi: bmi,
      };
    } else if (name === "weight") {
      const bmi = calculateBMI(value, inputs.height);
      updatedInputs = {
        ...updatedInputs,
        bmi: bmi,
      };
    }
    if (name === "kidsCount") {
      if (value === 1) {
        updatedInputs = {
          ...updatedInputs,
          kidsCount: "",
        };
      }
    }

    setInputs(updatedInputs);
  };

  function calculateBMI(weight, height) {
    // Convert height from cm to meters
    let heightInMeters = height / 100;

    // Calculate BMI
    let bmi = weight / heightInMeters ** 2;

    // Return the BMI rounded to two decimal places
    return bmi.toFixed(2);
  }

  const submitForm = () => {
    let updatedHealthProblem = [];

    // console.log("uploadDocuments line ------------- 557", uploadDocuments);
    conditions.forEach((element) => {
      if (element.checked === 1) {
        updatedHealthProblem.push(element.value);
      }
    });
    setLoading(true);
    const Dob = datePickerToMyFormat(inputs.dob);

    Axios.post(
      import.meta.env.VITE_API_URL + "profile/RegisterData",

      {
        address: {
          addresstype: inputs.addressboth,
          refAdFlat1: inputs.perdoorno,
          refAdArea1: inputs.perstreetname,
          refAdAdd1: inputs.peraddress,

          refAdCity1: inputs.percity,
          refAdState1: State.getStateByCode(inputs.perstate).name,
          refAdPincode1: parseInt(inputs.perpincode),
          refAdFlat2: inputs.tempdoorno,
          refAdAred2: inputs.tempstreetname,
          refAdAdd2: inputs.tempaddess,

          refAdCity2: inputs.tempcity,
          refAdState2: State.getStateByCode(inputs.tempstate).name,
          refAdPincode2: parseInt(inputs.tempincode),
        },
        MedicalDocuments: { uploadDocuments },
        personalData: {
          ref_su_fname: inputs.fname,
          ref_su_lname: inputs.lname,
          ref_su_mailid: inputs.email,
          ref_su_phoneno: inputs.phoneno,
          ref_su_emgContaxt: inputs.emgContaxt,
          ref_su_Whatsapp: inputs.whatsappno,
          ref_su_dob: Dob,
          ref_su_age: inputs.age,
          ref_su_gender: inputs.gender,
          ref_su_qulify: inputs.qualification,
          ref_su_occu: inputs.occupation,
          ref_su_guardian: inputs.caretakername,
          ref_su_branchId: parseInt(inputs.branch),
          ref_Batch_Id: parseInt(inputs.memberlist),
          ref_Weekend_Timing: parseInt(inputs.weekDaysTiming),
          ref_Weekdays_Timing: parseInt(inputs.weekEndTiming),
          ref_HealthIssue: options.medicalIssue,
          ref_Package_Id: parseInt(inputs.sessiontype), // 
          ref_su_MaritalStatus: inputs.maritalstatus,
          ref_su_kidsCount: parseInt(inputs.kidsCount),
          ref_su_WeddingDate: inputs.anniversarydate
            ? datePickerToMyFormat(inputs.anniversarydate)
            : null,
          ref_su_deliveryType: inputs.deliveryType ? inputs.deliveryType : null,

          ref_su_communicationPreference: parseInt(inputs.mode),
          ref_Class_Mode: parseInt(inputs.classtype), //
          ref_Session_From: inputs.monthStart
            ? datePickerToMyFormat(inputs.monthStart)
            : null,
          ref_Session_To: inputs.monthEnd
            ? datePickerToMyFormat(inputs.monthEnd)
            : null,
        },
        generalhealth: {
          refHeight: parseInt(inputs.height),
          refWeight: parseInt(inputs.weight),
          refBlood: inputs.bloodgroup,
          refBMI: inputs.bmi,

          refRecentInjuries: selectedOption.accident === "yes" ? true : false,
          refRecentInjuriesReason: inputs.injuries,
          refRecentFractures: selectedOption.breaks === "yes" ? true : false,
          refRecentFracturesReason: inputs.breaks,
          refOthers: inputs.activities,
          refElse: inputs.anthingelse,
          refOtherActivities: inputs.others,
          refPresentHealth: updatedHealthProblem,
          refMedicalDetails: inputs.medicaldetails,
          refUnderPhysicalCare: selectedOption.care === "yes" ? true : false,
          refDoctor: inputs.doctorname,
          refHospital: inputs.hospitalname,
          refBackPain:
            selectedOption.backpain === "no" ? "No" : inputs.painscale,
          refIfBp: selectedOption.bp,
          refBpType: inputs.bp,
          refBP: inputs.bpValue,
          refProblem: inputs.duration,
          refPastHistory: inputs.past,
          refFamilyHistory: inputs.family,
          refAnythingelse: inputs.therapyanything,
        },
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json", // Ensure the content type is set
        },
      }
    )
      .then((res) => {
        const data = decrypt(
          res.data[1],
          res.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        console.log(data.success);

        if (data.success) {
          navigate("/");
          handlecloseregister();
          closeregistration();
          swal({
            title: "Registration Completed!",
            text: "Your registration was successful! Our team will contact you shortly.",
            icon: "success",
            customClass: {
              title: "swal-title",
              content: "swal-text",
            },
          });
        }
      })
      .catch((err) => {
        // Catching any 400 status or general errors
        console.log("Error: ", err);
      });
  };

  function myFormatToDatePicker(dateString) {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date
  }

  function datePickerToMyFormat(date) {
    console.log("date", date);

    // Ensure `date` is a Date object
    if (!(date instanceof Date)) {
      try {
        date = new Date(date);
      } catch (error) {
        console.error("Invalid date provided:", date);
        return null; // Return null if the conversion fails
      }
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid Date object:", date);
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // const handleMedicalIssueChange = (value) => {
  //   if (value === "yes") {
  //     setStepperactive((prevStep) => prevStep + 1); // Go to the next step
  //   } else if (value === "no") {
  //     // setStepperactive(5); // Directly set stepperActive to 5
  //     setStepperactive((prevStep) => prevStep + 3)
  //   }
  // };

  return (
    <div className="w-[100%] lg:w-[100%] h-[100vh] bg-black/80 blur-[0.2px]  flex justify-center items-center fixed z-50">
      <div
        className="w-[95%] lg:w-[70%] h-[90vh] bg-white rounded shadow-sm"
        align="center"
      >
        {stepperactive === 1 && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStepperactive((prev) => (prev < 2 ? prev + 1 : prev));
              }}
            >
              <div className="w-full h-[7vh] flex justify-center items-center">
                <div className="w-[90%] justify-between flex h-[7vh] items-center">
                  <h1 className="text-[20px] justify-center font-semibold text-[#ff5001]">
                    Personal Details
                  </h1>
                  <div
                    onClick={() => {
                      closeregistration();
                    }}
                  >
                    <i className="fa-solid fa-xmark text-[20px] cursor-pointer"></i>
                  </div>
                </div>
              </div>
              <hr />
              <div className="w-full h-[73vh] overflow-y-auto">
                <div className="w-[90%] mb-[20px] mt-3" align="start">
                  {/* <TextInput
                    id="userid"
                    type="text"
                    name="userid"
                    placeholder="your name"
                    label="Username *"
                    required
                    readonly
                    value={inputs.userid}
                    onChange={(e) => handleInput(e)}
                  /> */}
                </div>

                <div className="w-[90%] mb-[20px]" align="start">
                  <TextInput
                    id="emailid"
                    type="email"
                    name="email"
                    placeholder="your name"
                    label="Email ID *"
                    required
                    readonly
                    value={inputs.email}
                    onChange={(e) => handleInput(e)}
                  />
                </div>
                <div
                  className="w-[90%] mb-[20px] flex justify-between"
                  align="start"
                >
                  <div className="w-[48%]">
                    <TextInput
                      id="fname"
                      type="text"
                      name="fname"
                      placeholder="your name"
                      label="First Name *"
                      required
                      readonly
                      value={inputs.fname}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div className="w-[48%]">
                    <TextInput
                      id="lname"
                      type="text"
                      name="lname"
                      placeholder="your name"
                      label="Last Name *"
                      required
                      readonly
                      value={inputs.lname}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                </div>

                <div
                  className="w-[90%] mb-[20px] flex justify-between"
                  align="start"
                >
                  <div className=" w-[48%]">
                    <TextInput
                      id="phonenumber"
                      type="number"
                      name="phoneno"
                      placeholder="your name"
                      label="Phone Number *"
                      required
                      value={inputs.phoneno}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div className="w-[48%]">
                    {/* <TextInput
                      id="emergencyno"
                      type="number"
                      name="emgContaxt "
                      label="Emergency Contact number *"
                      value={inputs.emgContaxt}
                      onChange={(e) => handleInput(e)}
                      required
                    /> */}

                    <TextInput
                      id="emergencyno"
                      type="number"
                      name="emgContaxt"
                      placeholder="your name"
                      label="Emergency Contact Number *"
                      required
                      value={inputs.emgContaxt}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                </div>

                <div
                  className="w-[90%] mb-[20px] flex flex-wrap  justify-between"
                  align="start"
                >
                  <div className="w-[75%] lg:w-[75%]">
                    <TextInput
                      id="whatsappno"
                      type="number"
                      name="whatsappno"
                      placeholder="your name"
                      label={`WhatsApp Number * `}
                      required
                      value={inputs.whatsappno}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div
                    onClick={() => {
                      setInputs({
                        ...inputs,
                        whatsappno: inputs.phoneno,
                      });
                    }}
                    className="w-[30%] lg:w-[20%] border-2 border-[#ff621b] bg-[#ff621b] text-[#fff] hover:bg-[#fff] hover:text-[#ff621b] transition-all duration-300 cursor-pointer font-bold rounded text-center text-[15px] flex justify-center items-center"
                  >
                    Use Same Number
                  </div>
                </div>

                <div
                  className="w-[90%] mb-[20px] flex justify-between"
                  align="start"
                >
                  {/* <div className="w-[68%]"> */}

                  <div className="flex flex-col w-[70%] -mt-[13px]">
                    <label className="bg-[#fff] text-[#ff621b] -mb-[15px] z-50 w-[120px] ml-[10px]">
                      &nbsp;Date of Birth *
                    </label>

                    <Calendar
                      label="Date of Birth *"
                      className="relative w-full mt-1 h-10 px-3 placeholder-transparent transition-all border-2 rounded outline-none peer border-[#b3b4b6] text-[#4c4c4e] autofill:bg-white dateInput"
                      value={inputs.dob}
                      onChange={(e) => {
                        console.log("e data-----------------", e);
                        handleInput(e);
                      }}
                      name="dob"
                      dateFormat="dd/mm/yy" // Set the date format here
                      showIcon // Optional: Adds a calendar icon to the input field
                    />
                  </div>

                  {/* <TextInput
                      id="dob"
                      type="date"
                      name="dob"
                      placeholder="your name"
                      label="Date of Birth *"
                      required
                      value={inputs.dob}
                      onChange={(e) => handleInput(e)}
                    /> */}
                  {/* </div> */}
                  <div className="w-[28%]">
                    <TextInput
                      id="age"
                      type="tel"
                      name="age"
                      placeholder="your name"
                      label="Age *"
                      value={inputs.age}
                      required
                      readonly
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                </div>

                <div
                  className="w-[90%] mb-[20px] flex justify-between"
                  align="start"
                >
                  <SelectInput
                    id="gender"
                    name="gender"
                    label="Gender *"
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "notperfer", label: "Not Perfer to say" },
                    ]}
                    required
                    value={inputs.gender}
                    onChange={(e) => handleInput(e)}
                  />
                </div>

                <div
                  className="w-[90%] mb-[20px] flex justify-between"
                  align="start"
                >
                  <div className="w-[48%]">
                    <SelectInput
                      id="maritalstatus"
                      name="maritalstatus"
                      label="Marital Status *"
                      options={[
                        { value: "single", label: "Single" },
                        { value: "married", label: "Married" },
                      ]}
                      required
                      disabled={inputs.age > 18 ? false : true}
                      value={inputs.maritalstatus}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  {/* <div className="w-[48%]">
                    <TextInput
                      id=""
                      type="date"
                      name="anniversarydate"
                      placeholder="your name"
                      label="Anniversary Date *"
                      required
                      disabled={
                        inputs.maritalstatus === "married" ? false : true
                      }
                      value={inputs.anniversarydate}
                      onChange={(e) => handleInput(e)}
                    />
                  </div> */}

                  <div className="flex flex-col w-[48%] -mt-[13px]">
                    <label
                      disabled={
                        inputs.maritalstatus === "married" ? false : true
                      }
                      className={`bg-[#fff] text-[#ff621b] -mb-[15px] z-50 w-[150px] ml-[10px] 
                        ${inputs.maritalstatus === "married"
                          ? ""
                          : "text-[#79879b]"
                        }`}
                    >
                      &nbsp; Anniversary Date *
                    </label>

                    <Calendar
                      label="Anniversary Date"
                      className={`relative w-full mt-1 h-10 px-3 placeholder-transparent transition-all border-2 rounded outline-none peer border-[#b3b4b6] text-[#4c4c4e] autofill:bg-white dateInput ${inputs.maritalstatus === "married"
                        ? ""
                        : "cursor-not-allowed"
                        }`}
                      // className="relative w-full mt-1 h-10 px-3 placeholder-transparent transition-all border-2 rounded outline-none peer border-[#b3b4b6] text-[#4c4c4e] autofill:bg-white dateInput"
                      value={inputs.anniversarydate}
                      onChange={(e) => handleInput(e)}
                      readOnlyInput
                      dateFormat="dd/mm/yy"
                      disabled={
                        inputs.maritalstatus === "married" ? false : true
                      }
                      name="anniversarydate"
                    />
                  </div>
                </div>

                <div
                  className="w-[90%] mb-[20px] flex justify-between"
                  align="start"
                >
                  <div className="w-[48%]">
                    <TextInput
                      id="kidsCount"
                      name="kidsCount"
                      label="No of Kid's *"
                      type="number"
                      required
                      disabled={
                        (inputs.gender === "female" ? false : true) ||
                        (inputs.maritalstatus === "married" ? false : true)
                      }
                      value={inputs.kidsCount}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div className="w-[48%]">
                    <SelectInput
                      id="deliveryType"
                      name="deliveryType"
                      placeholder="22"
                      label="Delivery Type *"
                      options={[
                        { value: "Normal", label: "Normal" },
                        { value: "C-Section", label: "C-Section" },
                      ]}
                      required
                      disabled={
                        (inputs.kidsCount > 0 ? false : true) ||
                        (inputs.gender === "female" ? false : true) ||
                        (inputs.maritalstatus === "married" ? false : true)
                      }
                      value={inputs.deliveryType}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                </div>

                <div className="w-[90%] mb-[20px]" align="start">
                  <TextInput
                    id="father"
                    type="text"
                    name="caretakername"
                    placeholder="your name"
                    label="Father / Spouse's Name *"
                    required
                    value={inputs.caretakername}
                    onChange={(e) => handleInput(e)}
                  />
                </div>

                <div
                  className="w-[90%] mb-[20px] flex justify-between"
                  align="start"
                >
                  <div className="w-[48%]">
                    <TextInput
                      id="qualification"
                      type="text"
                      name="qualification"
                      placeholder="your name"
                      label="Qualification"
                      // required
                      disabled={inputs.age > 18 ? false : true}
                      value={inputs.qualification}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div className="w-[48%]">
                    <TextInput
                      id="occupation"
                      type="text"
                      name="occupation"
                      placeholder="your name"
                      label="Occupation *"
                      required
                      disabled={inputs.age > 20 ? false : true}
                      value={inputs.occupation}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                </div>
                {/* <div
                  className="w-[90%] mb-[20px] flex justify-between items-center"
                  align="start"
                >
                  <CheckboxInput
                    checked={addessschecked}
                    id="bothaddress"
                    label="Use Communication Address & Permanent Address as Same."
                    onChange={() => {
                      if (addessschecked) {
                        setAddressChecked(false);
                        setInputs({
                          ...inputs,
                          addressboth: false,
                        });
                      } else {
                        setAddressChecked(true);
                        setInputs({
                          ...inputs,
                          addressboth: true,
                        });
                      }
                    }}
                  />
                </div> */}

                <div
                  className="w-[90%] mb-2 flex flex-col justify-between"
                  align="start"
                >
                  <div className="w-full" align="center">
                    <label className="text-[#45474b] mb-[20px] text-[18px] font-semibold">
                      Permanent Address
                    </label>
                    <div
                      className="w-[100%] mb-[20px] flex justify-between"
                      align="start"
                    >
                      <div className="w-[48%]">
                        <div className="relative w-full">
                          <TextInput
                            id="doorno"
                            type="text"
                            name="perdoorno"
                            label="Door no *"
                            required
                            value={inputs.perdoorno}
                            onChange={(e) => handleInput(e)}
                          />
                        </div>
                      </div>

                      <div className="w-[48%]">
                        <div className="relative w-full">
                          <TextInput
                            id="streetname"
                            type="text"
                            name="perstreetname"
                            label="Street Name *"
                            required
                            value={inputs.perstreetname}
                            onChange={(e) => handleInput(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-[20px]">
                      <TextInput
                        id="tempaddress"
                        name="peraddress"
                        label="Locality *"
                        placeholder="Write your message"
                        rows={3}
                        required
                        value={inputs.peraddress}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                    <div
                      className="w-[100%] mb-[20px] flex justify-between"
                      align="start"
                    >
                      <div className="w-[48%]">
                        <div className="relative w-full">
                          <select
                            id="perstate"
                            name="perstate"
                            required
                            value={inputs.perstate}
                            onChange={handleStateChange}
                            className="relative w-full h-10 px-3 transition-all bg-white border-2 rounded outline-none appearance-none peer border-[#b3b4b6] text-[#4c4c4e] autofill:bg-white focus:border-[#ff5001] focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="" disabled selected></option>
                            {states.map((state) => (
                              <option key={state.isoCode} value={state.isoCode}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                          <label
                            htmlFor="permanentstate"
                            className="pointer-events-none absolute left-2 z-[1] -top-2 px-2 text-[14px] text-[#ff5001] transition-all before:absolute before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-[#000000] peer-valid:text-[14px] peer-focus:text-[14px] peer-focus:text-[#ff5001] peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                          >
                            State *
                          </label>
                        </div>
                      </div>

                      <div className="w-[48%]">
                        <div className="relative w-full">
                          <select
                            id="permanentcity"
                            name="percity"
                            required
                            value={inputs.percity}
                            onChange={(e) => {
                              const { name, value } = e.target;

                              let updatedInputs = {
                                ...inputs,
                                [name]: value,
                              };

                              // If the "addressboth" flag is true, copy the permanent address fields to temporary fields
                              if (updatedInputs.addressboth) {
                                updatedInputs = {
                                  ...updatedInputs,
                                  tempdoorno: updatedInputs.perdoorno,
                                  tempstreetname: updatedInputs.perstreetname,
                                  tempaddess: updatedInputs.peraddress,
                                  tempstate: updatedInputs.perstate,
                                  tempincode: updatedInputs.perpincode,
                                  tempcity: updatedInputs.percity,
                                };
                              }

                              // Set the final updated inputs
                              setInputs(updatedInputs);
                            }}
                            disabled={!selectedState}
                            className="relative w-full h-10 px-3 transition-all bg-white border-2 rounded outline-none appearance-none peer border-[#b3b4b6] text-[#4c4c4e] autofill:bg-white focus:border-[#ff5001] focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="" disabled selected></option>
                            {cities.map((city) => (
                              <option key={city.name} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                          <label
                            htmlFor="permanentcity"
                            className="pointer-events-none absolute left-2 z-[1] -top-2 px-2 text-[14px] text-[#ff5001] transition-all before:absolute before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-[#000000] peer-valid:text-[14px] peer-focus:text-[14px] peer-focus:text-[#ff5001] peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-white"
                          >
                            City *
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="w-[100%] mb-[20px]" align="start">
                      <TextInput
                        id="perpincode"
                        type="tel"
                        name="perpincode"
                        placeholder="your name"
                        label="Pincode *"
                        required
                        value={inputs.perpincode}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                  </div>

                  <div
                    className="w-[90%] mb-[20px] flex justify-between items-center"
                    align="start"
                  >
                    <CheckboxInput
                      checked={addessschecked}
                      id="bothaddress"
                      label="Use Communication Address & Permanent Address as Same."
                      onChange={() => {
                        if (addessschecked) {
                          setInputs({
                            ...inputs,
                            tempdoorno: "",
                            tempstreetname: "",
                            tempaddess: "",
                            tempstate: "",
                            tempincode: "",
                            tempcity: "",
                            addressboth: false,
                          });
                          setAddressChecked(false);
                        } else {
                          setAddressChecked(true);
                          setInputs({
                            ...inputs,
                            tempdoorno: inputs.perdoorno,
                            tempstreetname: inputs.perstreetname,
                            tempaddess: inputs.peraddress,
                            tempstate: inputs.perstate,
                            tempincode: inputs.perpincode,
                            tempcity: inputs.percity,
                            addressboth: true,
                          });
                        }
                      }}
                    />
                  </div>

                  <div className="w-full" align="center">
                    <label className="text-[#45474b] mb-[20px] text-[18px] font-semibold">
                      Communication Address
                    </label>
                    <div
                      className="w-[100%] mb-[20px] flex justify-between"
                      align="start"
                    >
                      <div className="w-[48%]">
                        <div className="relative w-full">
                          <TextInput
                            id="doorno"
                            type="text"
                            name="tempdoorno"
                            label="Door no *"
                            required
                            value={inputs.tempdoorno}
                            onChange={(e) => handleInput(e)}
                          />
                        </div>
                      </div>

                      <div className="w-[48%]">
                        <div className="relative w-full">
                          <TextInput
                            id="streetname"
                            type="text"
                            name="tempstreetname"
                            label="Street Name *"
                            required
                            value={inputs.tempstreetname}
                            onChange={(e) => handleInput(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-[100%] mb-[20px]">
                      <TextInput
                        id="tempaddress"
                        name="tempaddess"
                        label="Locality *"
                        placeholder="Write your message"
                        rows={3}
                        required
                        value={inputs.tempaddess}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                    <div
                      className="w-[100%] mb-[20px] flex justify-between"
                      align="start"
                    >
                      <div className="w-[48%]">
                        <div className="relative w-full">
                          <select
                            id="tempstate"
                            name="tempstate"
                            required
                            onChange={handleStateChange}
                            value={inputs.tempstate}
                            className="relative w-full h-11 px-3 transition-all bg-white border-2 rounded outline-none appearance-none peer border-[#b3b4b6] text-[#4c4c4e] autofill:bg-white focus:border-[#ff5001] focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="" disabled selected></option>
                            {states.map((state) => (
                              <option key={state.isoCode} value={state.isoCode}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                          <label
                            htmlFor="tempstate"
                            className="pointer-events-none absolute left-2 z-[1] -top-2 px-2 text-[14px] text-[#ff5001] transition-all before:absolute before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-[#000000] peer-valid:text-[14px] peer-focus:text-[14px] peer-focus:text-[#ff5001] peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-white"
                          >
                            State *
                          </label>
                        </div>
                      </div>

                      <div className="w-[48%]">
                        <div className="relative w-full">
                          <select
                            id="tempcity"
                            name="tempcity"
                            required
                            value={inputs.tempcity}
                            onChange={(e) => {
                              if (!inputs.addressboth) {
                                setInputs({
                                  ...inputs,
                                  [e.target.name]: e.target.value,
                                });
                              }
                            }}
                            disabled={!selectedState}
                            className="relative w-full h-11 px-3 transition-all bg-white border-2 rounded outline-none appearance-none peer border-[#b3b4b6] text-[#4c4c4e] autofill:bg-white focus:border-[#ff5001] focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            <option value="" disabled selected></option>
                            {cities.map((city) => (
                              <option key={city.name} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                          <label
                            htmlFor="tempcity"
                            className="pointer-events-none absolute left-2 z-[1] -top-2 px-2 text-[14px] text-[#ff5001] transition-all before:absolute before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-[#000000] peer-valid:text-[14px] peer-focus:text-[14px] peer-focus:text-[#ff5001] peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-white"
                          >
                            City *
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="w-[100%] mb-2" align="start">
                      <TextInput
                        id="pincode"
                        type="tel"
                        name="tempincode"
                        placeholder="your name"
                        label="Pincode *"
                        required
                        value={inputs.tempincode}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="w-[90%] lg:w-[95%] h-[10vh] flex justify-end items-center">
                <button
                  type="submit"
                  className="disabled:bg-[#ff7a3c] disabled:font-[#fff] disabled:hover:cursor-not-allowed disabled:hover:text-[#fff] disabled:border-[#ff7a3c] bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                >
                  Next&nbsp;&nbsp;
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </form>
          </>
        )}

        {stepperactive === 2 && (
          <>

            {viewBrowsher ? <>
              <div className="flex flex-col p-5 gap-5 h-full">
                <button
                  className="text-xl"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewBrowsher(false);
                  }}
                >
                  <FaArrowLeftLong />
                </button>
                <div className="overflow-auto h-[calc(100vh-100px)]">
                  <img className="w-full" src={browsher[0].refBroLink} alt="Brochure" />
                </div>
              </div>

            </> : <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  setStepperactive((prev) => {
                    console.log('prev', prev)
                    console.log("before \n", prev);
                    const updatedValue = !options.medicalIssue
                      ? (prev < 3 ? prev + 4 : prev)
                      : (prev < 3 ? prev + 1 : prev);
                    console.log("after \n", updatedValue);
                    return updatedValue; // Return the updated value
                  });
                  alert(prev)
                }}
              >
                <div className="w-full h-[7vh] flex justify-center items-center">
                  <div className="w-[90%] justify-between flex h-[7vh] items-center">
                    <h1 className="text-[20px] justify-center font-semibold text-[#ff5001]">
                      General Health Details
                    </h1>
                    <div
                      onClick={() => {
                        closeregistration();
                      }}
                    >
                      <i className="fa-solid fa-xmark text-[20px] cursor-pointer"></i>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="w-full h-[73vh] overflow-auto">
                  <div
                    className="w-[90%] mt-3 mb-[20px] flex justify-between"
                    align="start"
                  >
                    <div className="w-[48%]">
                      <TextInput
                        id="height"
                        type="number"
                        name="height"
                        placeholder="your name"
                        label="Height in CM *"
                        required
                        value={inputs.height}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                    <div className="w-[48%]">
                      <TextInput
                        id="weight"
                        type="number"
                        name="weight"
                        placeholder="your name"
                        label="Weight in KG *"
                        required
                        value={inputs.weight}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                  </div>

                  <div
                    className="w-[90%] mb-[20px] flex justify-between"
                    align="start"
                  >
                    <div className="w-[48%]">
                      <SelectInput
                        id="bloodgroup"
                        name="bloodgroup"
                        label="Blood Group *"
                        options={[
                          { value: "A+", label: "A+" },
                          { value: "A-", label: "A-" },
                          { value: "B+", label: "B+" },
                          { value: "B-", label: "B-" },
                          { value: "AB+", label: "AB+" },
                          { value: "AB-", label: "AB-" },
                          { value: "O+", label: "O+" },
                          { value: "O-", label: "O-" },
                        ]}
                        required
                        value={inputs.bloodgroup}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                    <div className="w-[48%]">
                      <TextInput
                        id="bmi"
                        type="tel"
                        name="bmi"
                        placeholder="your name"
                        label="BMI"
                        readonly
                        value={inputs.bmi}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-[18px] mt-4  font-semibold text-[#ff5001] mb-4">
                      Packages
                    </h1>

                  </div>

                  <div className="w-[90%] flex justify-between mb-[20px]">
                    <div className="w-[48%]">
                      <SelectInput
                        id="branch"
                        name="branch"
                        label="Branch *"
                        options={branchOptions}
                        required
                        value={inputs.branch}
                        onChange={(e) => {
                          setPackageSelect(1), handleInput(e);
                        }}
                      />
                    </div>

                    <div className="w-[48%]">
                      <SelectInput
                        id="memberlist"
                        name="memberlist"
                        label="Batch *"
                        required
                        options={memberlistOptions}
                        value={inputs.memberlist}
                        onChange={(e) => {
                          setPackageSelect(2), handleInput(e);
                        }}
                        disabled={packageSelect > 0 ? false : true}
                      />
                    </div>
                  </div>
                  <div
                    className="w-[90%] mb-[20px] flex justify-between"
                    align="start"
                  >
                    <div className="w-[48%]">
                      <SelectInput
                        id="classtype"
                        name="classtype"
                        label="Class Type *"
                        options={[
                          { value: "1", label: "Online" },
                          { value: "2", label: "Offline" },
                        ]}
                        required
                        value={inputs.classtype}
                        disabled={packageSelect > 1 ? false : true}
                        onChange={(e) => {
                          setPackageSelect(3), handleInput(e);
                        }}
                      />
                    </div>
                    <div className="w-[48%]">
                      <SelectInput
                        id="sessiontype"
                        name="sessiontype"
                        label="Class Package *"
                        placeholder="Select Package"
                        disabled={packageSelect > 2 ? false : true}
                        options={sessionTypeOption}
                        required
                        value={inputs.sessiontype}
                        onChange={(e) => {
                          setPackageSelect(4); // Update the packageSelect state
                          handleInput(e);
                          console.log('e line ---- 1833', e.target);
                        }}
                      />
                    </div>
                  </div>

                  {/* Conditionally render the notes */}
                  {packageSelect > 3 && (
                    <div>
                      <div className="w-[90%] text-2xl text-[#ff5001] mb-[25px] flex justify-start gap-3">
                        <button onClick={(e) => {
                          e.preventDefault();
                          setViewBrowsher(true);
                        }}>  <LuCalendarClock /> </button>
                        <p className="text-base">
                          Click on this icon to view the package timings.
                        </p>
                      </div>
                    </div>
                  )}
                  {preferWeekDaysTimingOption.length > 0 ?
                    <>
                      <div className="w-[90%] flex justify-between mb-[20px]">
                        <div className="w-[100%]">
                          <SelectInput
                            id="weekDaysTiming"
                            name="weekDaysTiming"
                            label="WeekDays Class Timing*"
                            options={preferWeekDaysTimingOption}
                            required
                            disabled={packageSelect > 3 ? false : true}
                            value={inputs.weekDaysTiming}

                            onChange={(e) => {
                              setPackageSelect(5), handleInput(e);
                            }}
                          />
                        </div>
                      </div></> : <></>}

                  {preferWeekEndTimingOption.length > 0 ? <> <div className="w-[90%] flex justify-between mb-[20px]">
                    <div className="w-[100%]">
                      <SelectInput
                        id="weekEndTiming"
                        name="weekEndTiming"
                        label="Weekend Class Timing*"
                        options={preferWeekEndTimingOption}
                        required
                        disabled={packageSelect > 3 ? false : true}
                        value={inputs.weekEndTiming}

                        onChange={(e) => {
                          setPackageSelect(5), handleInput(e);
                        }}
                      />
                    </div>
                  </div></> : <></>}



                  <div
                    className="w-[90%] mb-[20px] flex justify-between"
                    align="start"
                  >
                    <div className="flex flex-col w-[48%] -mt-[13px]">
                      <label
                        className={`bg-[#fff] ${packageSelect > 4 ? "text-[#ff621b]" : "text-[#a4b0c2]"
                          } -mb-[15px] z-50 w-[130px] ml-[10px]`}
                      >
                        &nbsp;Starting Month *
                      </label>

                      <Calendar
                        label="Starting Month *"
                        className={`relative w-full mt-1 h-10 px-3 placeholder-transparent transition-all border-2 rounded outline-none peer 
                        ${packageSelect > 4
                            ? "border-[#ff621b] text-[#4c4c4e]"
                            : "border-[#a4b0c2] text-[#a4b0c2]"
                          } autofill:bg-white dateInput`}
                        readOnlyInput
                        dateFormat="mm/yy"
                        view="month"
                        name="monthStart"
                        value={inputs.monthStart}
                        disabled={packageSelect > 4 ? false : true}
                        onChange={(e) => {
                          setPackageSelect(6), handleInput(e);
                        }}
                      />
                    </div>
                    <div className="flex flex-col w-[48%] -mt-[13px]">
                      <label
                        className={`bg-[#fff] ${packageSelect > 5 ? "text-[#ff621b]" : "text-[#a4b0c2]"
                          } -mb-[15px] z-50 w-[130px] ml-[10px]`}
                      >
                        &nbsp; Ending Month *
                      </label>

                      <Calendar
                        label="Ending Month"
                        className={`relative w-full mt-1 h-10 px-3 placeholder-transparent transition-all border-2 rounded outline-none peer 
                        ${packageSelect > 5
                            ? "border-[#ff621b] text-[#4c4c4e]"
                            : "border-[#a4b0c2] text-[#a4b0c2]"
                          } autofill:bg-white dateInput`}
                        readOnlyInput
                        dateFormat="mm/yy"
                        view="month"
                        name="monthEnd"
                        value={inputs.monthEnd}
                        disabled={packageSelect > 5 ? false : true}
                        onChange={(e) => {
                          setPackageSelect(7),
                            handleInput(e),
                            calculateWeekendsAndWeekdays(e);
                        }}
                      />
                    </div>
                  </div>
                  {packageSelect > 5 ? (
                    <>
                      <div className="mt-0 text-[#ff621b] flex flex-row justify-center align-middle gap-5">
                        <p>
                          The Weekend class count is {counts.weekends} and The
                          Weekday's class count is {counts.weekdays} .
                        </p>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className="w-[100%] lg:w-[90%] my-[1%]">
                    <label className="w-[100%] text-[#f95005] font-bold text-[1.0rem] lg:text-[20px] text-start">
                      Medical Issue *{" "}
                    </label>
                    <div className="w-[100%] flex justify-start mt-[10px]">
                      <div className="mr-10">
                        <RadiobuttonInput
                          id="medicalIssue"
                          value="yes"
                          name="medicalIssue"
                          selectedOption={options.medicalIssue ? "yes" : ""}
                          onChange={() => {
                            setOptions({
                              ...options,
                              medicalIssue: true,
                            });
                          }}
                          label="Yes"
                          required
                        />
                      </div>
                      <div className="">
                        <RadiobuttonInput
                          id="medicalIssue"
                          value="no"
                          name="medicalIssue"
                          label="No"
                          onChange={() => {
                            setOptions({
                              ...options,
                              medicalIssue: false,
                            });
                          }}
                          selectedOption={!options.medicalIssue ? "no" : ""}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-2 text-[#ff621b] flex flex-row justify-center align-middle gap-5">
                      <p>
                        Note * : If you have any medical history, any medical problems, or feel that you have any body pain or other health issues, click 'Yes.' Otherwise, click 'No'.
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="w-[90%] lg:w-[95%] h-[10vh] flex justify-between items-center">
                  <button
                    type="button"
                    className="bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded my-4 transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                    onClick={handleBack}
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    &nbsp;&nbsp;Back
                  </button>
                  <button
                    type="submit"
                    className="disabled:bg-[#ff7a3c] disabled:font-[#fff] disabled:hover:cursor-not-allowed disabled:hover:text-[#fff] disabled:border-[#ff7a3c] bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                  // onClick={handleNext}
                  >
                    Next&nbsp;&nbsp;
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </form></>}

          </>
        )}

        {stepperactive === 3 && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                setStepperactive((prev) => (prev < 4 ? prev + 1 : prev));
              }}
            >
              <div className="w-full h-[7vh] flex justify-center items-center">
                <div className="w-[90%] justify-between flex h-[7vh] items-center">
                  <h1 className="text-[20px] justify-center font-semibold text-[#ff5001]">
                    Past or Present Health Problems
                  </h1>
                  <div
                    onClick={() => {
                      closeregistration();
                    }}
                  >
                    <i className="fa-solid fa-xmark text-[20px] cursor-pointer"></i>
                  </div>
                </div>
              </div>
              <hr />
              <div className="w-full h-[73vh] overflow-auto">
                <h1 className="text-[18px] mt-4 justify-center font-semibold text-[#ff5001]">
                  Health issues
                </h1>
                <div className="w-[90%] flex flex-wrap my-4  items-center justify-start gap-x- lg:gap-x-10 gap-y-4">
                  {conditions.map((condition, index) => (
                    <div className="w-[160px]" key={index}>
                      <CheckboxInput
                        id={`condition-${index}`}
                        checked={condition.checked === 1}
                        label={condition.label}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </div>
                  ))}
                </div>

                <div className="w-[90%] mb-[20px]">
                  <TextInput
                    id="others"
                    type="text"
                    name="others"
                    placeholder="your name"
                    label="Others "
                    value={inputs.others}
                    onChange={(e) => handleInput(e)}
                  />
                </div>

                <div className="w-[90%] mb-[20px]">
                  <TextInput
                    id="medicationdetails"
                    type="text"
                    name="medicaldetails"
                    placeholder="your name"
                    label="Current Medicines"
                    value={inputs.medicaldetails}
                    onChange={(e) => handleInput(e)}
                  />
                </div>

                <div className="w-[90%]" align="start">
                  <div>
                    <TextLabel label={"Under Physician's Care *"} />
                  </div>
                  <div className="flex w-[90%] gap-x-10 mt-2 mb-[20px]">
                    <RadioButton
                      id="careyes"
                      value="yes"
                      name="care"
                      selectedOption={selectedOption.care || ""}
                      onChange={(e) => {
                        setSelectedOption({
                          ...selectedOption,
                          care: e.target.value,
                        });
                      }}
                      label="Yes"
                      required
                    />
                    <RadioButton
                      id="careno"
                      value="no"
                      name="care"
                      selectedOption={selectedOption.care || ""}
                      onChange={(e) => {
                        setSelectedOption({
                          ...selectedOption,
                          care: e.target.value,
                        });
                      }}
                      label="No"
                      required
                    />
                  </div>
                  <div className="mb-[20px]">
                    <TextInput
                      id="doctorname"
                      type="text"
                      name="doctorname"
                      label="Doctor Name"
                      placeholder="Write your message"
                      rows={2}
                      disabled={selectedOption.care === "yes" ? false : true}
                      required
                      value={inputs.doctorname}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div className="mt-3 mb-[20px]">
                    <TextInput
                      id="hospital"
                      type="text"
                      name="hospitalname"
                      label="Hospital"
                      placeholder="Write your message"
                      rows={2}
                      disabled={selectedOption.care === "yes" ? false : true}
                      required
                      value={inputs.hospitalname}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                </div>

                <div className="w-[90%]" align="start">
                  <div>
                    <TextLabel label={"Back Pain *"} />
                  </div>
                  <div className="flex w-[90%] gap-x-10 mt-2 mb-[20px]">
                    <RadioButton
                      id="backpainyes"
                      value="yes"
                      name="backpain"
                      selectedOption={selectedOption.backpain || ""}
                      onChange={(e) => {
                        setSelectedOption({
                          ...selectedOption,
                          backpain: e.target.value, // Corrected: updating backpain instead of care
                        });
                      }}
                      label="Yes"
                      required
                    />
                    <RadioButton
                      id="backpainno"
                      value="no"
                      name="backpain"
                      selectedOption={selectedOption.backpain || ""}
                      onChange={(e) => {
                        setSelectedOption({
                          ...selectedOption,
                          backpain: e.target.value, // Corrected: updating backpain instead of care
                        });
                      }}
                      label="No"
                      required
                    />
                  </div>
                  <div className="flex flex-row w-[100%] justify-between">
                    <div className="mb-[20px] w-[48%]">
                      <SelectInput
                        id="pain"
                        name="painscale"
                        label="Pain Scale"
                        options={[
                          { value: "upper", label: "Upper" },
                          { value: "middle", label: "Middle" },
                          { value: "lower", label: "Lower" },
                        ]}
                        disabled={
                          selectedOption.backpain === "yes" ? false : true
                        }
                        required
                        value={inputs.painscale}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                    <div className="mb-[20px] w-[48%]">
                      <TextInput
                        id="painValue"
                        name="painscaleValue"
                        label="Additional Content (Back Pain)"
                        disabled={
                          selectedOption.backpain === "yes" ? false : true
                        }
                        required
                        value={inputs.painscaleValue}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-[90%]" align="start">
                  <div>
                    <TextLabel label={"BP *"} />
                  </div>
                  <div className="flex w-[90%] gap-x-10 mt-2 mb-[20px]">
                    <RadioButton
                      id="bpyes"
                      value="yes"
                      name="bp"
                      selectedOption={selectedOption.bp || ""}
                      onChange={(e) => {
                        setSelectedOption({
                          ...selectedOption,
                          bp: e.target.value, // Corrected: updating backpain instead of care
                        });
                      }}
                      label="Yes"
                      required
                    />

                    <RadioButton
                      id="bpno"
                      value="no"
                      name="bp"
                      selectedOption={selectedOption.bp || ""}
                      onChange={(e) => {
                        setSelectedOption({
                          ...selectedOption,
                          bp: e.target.value, // Corrected: updating backpain instead of care
                        });
                      }}
                      label="No"
                      required
                    />
                  </div>
                  <div className="flex flex-row w-[100%] justify-between">
                    <div className="mb-[20px] w-[48%]">
                      <SelectInput
                        id="bp"
                        name="bp"
                        label="BP"
                        options={[
                          { value: "low", label: "Low" },
                          { value: "high", label: "High" },
                        ]}
                        disabled={selectedOption.bp === "yes" ? false : true}
                        required
                        value={inputs.bp}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                    <div className="mb-[20px] w-[48%]">
                      <TextInput
                        id="bp"
                        name="bpValue"
                        label="BP Value (120/80)"
                        disabled={selectedOption.bp === "yes" ? false : true}
                        required
                        value={inputs.bpValue}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="w-[90%] lg:w-[95%] h-[10vh] flex justify-between items-center">
                <button
                  type="button"
                  className="bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded my-4 transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                  onClick={handleBack}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  &nbsp;&nbsp;Back
                </button>
                <button
                  type="submit"
                  className="disabled:bg-[#ff7a3c] disabled:font-[#fff] disabled:hover:cursor-not-allowed disabled:hover:text-[#fff] disabled:border-[#ff7a3c] bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                >
                  Next&nbsp;&nbsp;
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </form>
          </>
        )}

        {stepperactive === 4 && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStepperactive((prev) => (prev < 5 ? prev + 1 : prev));
              }}
            >
              <div className="w-full h-[7vh] flex justify-center items-center">
                <div className="w-[90%] justify-between flex h-[7vh] items-center">
                  <h1 className="text-[20px] justify-center font-semibold text-[#ff5001]">
                    Health Problems History
                  </h1>
                  <div onClick={() => closeregistration()}>
                    <i className="fa-solid fa-xmark text-[20px] cursor-pointer"></i>
                  </div>
                </div>
              </div>
              <hr />
              <div className="w-full h-[73vh] overflow-auto ">
                <div className="w-full h-[73vh] overflow-auto">
                  <div className="w-[90%] mt-3 mb-[20px]">
                    <TextInput
                      id="durationproblem"
                      type="text"
                      name="duration"
                      placeholder="your name"
                      label="Duration of the Problem *"
                      value={inputs.duration}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div className="w-[90%] mb-[20px]">
                    <TextInput
                      id="relevantpasthistory"
                      type="text"
                      name="past"
                      label="Relevant past History"
                      placeholder="Write your message"
                      value={inputs.past}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div className="w-[90%] mb-[20px]">
                    <TextInput
                      id="relevantfamilyhistory"
                      type="text"
                      name="family"
                      label="Relevant Family History"
                      placeholder="Write your message"
                      value={inputs.family}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div className="w-[90%] mb-[20px]">
                    <TextInput
                      id="anythingelsetherapy"
                      name="therapyanything"
                      label="Add your Comments"
                      type="text"
                      value={inputs.therapyanything}
                      onChange={(e) => handleInput(e)}
                    />
                  </div>
                  <div className="w-[90%]" align="start">
                    <div>
                      <TextLabel
                        label={
                          "Recent Injuries / Accidents / Surgeries / Fractures / Sprains *"
                        }
                      />
                    </div>
                    <div className="flex w-[90%] gap-x-10 mt-2 mb-[20px]">
                      <RadioButton
                        id="breaksyes"
                        value="yes"
                        name="breaks"
                        selectedOption={selectedOption.breaks || ""}
                        onChange={(e) => {
                          setSelectedOption({
                            ...selectedOption,
                            breaks: e.target.value,
                          });
                        }}
                        label="Yes"
                        required
                      />
                      <RadioButton
                        id="breaksno"
                        value="no"
                        name="breaks"
                        selectedOption={selectedOption.breaks || ""}
                        onChange={(e) => {
                          setSelectedOption({
                            ...selectedOption,
                            breaks: e.target.value,
                          });
                        }}
                        label="No"
                        required
                      />
                    </div>
                    <div className="mb-[20px]">
                      <TextInput
                        id="breaksdetail"
                        type="text"
                        name="breaks"
                        placeholder="your name"
                        label="Description"
                        disabled={
                          selectedOption.breaks === "yes" ? false : true
                        }
                        value={inputs.breaks}
                        onChange={(e) => handleInput(e)}
                        maxLength={500} // Sets the character limit to 100
                      />
                    </div>
                  </div>{" "}
                  <div className="w-[90%] mb-[20px]">
                    <div className="w-full">
                      <TextInput
                        id="otheractivities"
                        type="text"
                        name="activities"
                        placeholder="your name"
                        label="Other Activities"
                        disabled={
                          selectedOption.breaks === "yes" ? false : true
                        }
                        value={inputs.activities}
                        onChange={(e) => handleInput(e)}
                        maxLength={500}
                      />
                    </div>
                  </div>
                  <div className="w-[90%] mb-[20px]">
                    <div className="w-full">
                      <TextInput
                        id="anythingelse"
                        type="text"
                        name="anthingelse"
                        placeholder="your name"
                        label="Add your Comments"
                        disabled={
                          selectedOption.breaks === "yes" ? false : true
                        }
                        value={inputs.anthingelse}
                        onChange={(e) => handleInput(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr />
              <div className="w-[90%] lg:w-[95%] h-[10vh] flex justify-between items-center">
                {loading ? (
                  <div className="flex w-full justify-end items-end">
                    <svg className="loadersvg my-4" viewBox="25 25 50 50">
                      <circle
                        className="loadercircle"
                        r="20"
                        cy="50"
                        cx="50"
                      ></circle>
                    </svg>
                  </div>
                ) : (
                  <>
                    <button
                      className="bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded my-4 transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                      type="button"
                      onClick={handleBack}
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                      &nbsp;&nbsp;Back
                    </button>
                    <button
                      type="submit"
                      className="disabled:bg-[#ff7a3c] disabled:font-[#fff] disabled:hover:cursor-not-allowed disabled:hover:text-[#fff] disabled:border-[#ff7a3c] bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                    >
                      Next&nbsp;&nbsp;
                      <i className="fa-solid fa-check"></i>
                    </button>
                  </>
                )}
              </div>
            </form>
          </>
        )}

        {stepperactive === 5 && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStepperactive((prev) => (prev < 6 ? prev + 1 : prev));
              }}
            >
              <div className="w-full h-[7vh] flex justify-center items-center">
                <div className="w-[90%] justify-between flex h-[7vh] items-center">
                  <h1 className="text-[20px] justify-center font-semibold text-[#ff5001]">
                    Medical Documents Upload
                  </h1>
                  <div
                    onClick={() => {
                      closeregistration();
                    }}
                  >
                    <i className="fa-solid fa-xmark text-[20px] cursor-pointer"></i>
                  </div>
                </div>
              </div>
              <hr />

              <div className="w-full h-[73vh] overflow-auto">
                <div className="w-[90%] flex flex-wrap my-4 items-center justify-end gap-x- lg:gap-x-10 gap-y-4">
                  <button
                    type="button"
                    className="py-2 px-4 bg-[#f95005] text-white rounded hover:bg-[#f95005]"
                    onClick={handleAddDocument}
                  >
                    Add Document
                  </button>
                </div>
                {uploadDocuments.map((document, index) => (
                  <div
                    key={index}
                    className="w-[100%] flex flex-row justify-evenly lg:p-[10px] mt-5 lg:mt-0"
                  >
                    <div>
                      {document.refMedDocUpload && (
                        <div className="pt-5 align-content-start">
                          <FaEye
                            className="w-[30px] h-[25px] text-[#f95005] cursor-pointer"
                            onClick={() =>
                              handlePreviewDocument(uploadDocuments, index)
                            }
                          />
                        </div>
                      )}
                    </div>

                    <div className="mb-4 w-[40%] flex flex-col justify-start text-start">
                      <label className="block text-gray-700 font-medium mb-2">
                        Enter File Name:
                      </label>
                      <input
                        type="text"
                        placeholder="Enter a name for the file"
                        className="w-full border border-gray-300 rounded px-4 py-2"
                        value={document.refMedDocName || ""}
                        onChange={(e) => {
                          setUploadDocuments((prev) => {
                            const updatedDocuments = [...prev];
                            updatedDocuments[index].refMedDocName =
                              e.target.value;
                            return updatedDocuments;
                          });
                        }}
                        required
                      />
                    </div>
                    <div className="mb-4 w-[40%] flex flex-col justify-start text-start">
                      <label className="block text-gray-700 font-medium mb-2">
                        Upload File:
                      </label>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="w-full border border-gray-300 rounded px-4 py-2 uploadfile disabled:cursor-not-allowed disabled:text-slate-400 disabled:before:bg-transparent"
                        disabled={document.refMedDocUpload}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append("file", file);
                            setUploadDocuments((prev) => {
                              const updatedDocuments = [...prev];
                              updatedDocuments[index].refMedDocFile = formData;
                              updatedDocuments[index].refMedDocUpBtn = true;
                              return updatedDocuments;
                            });
                          }
                        }}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className={`text-[green] disabled:cursor-not-allowed disabled:text-slate-400 disabled:before:bg-transparent`}
                      onClick={() => storeDocument(index)}
                      disabled={
                        document.refMedDocUpload === true ||
                        document.refMedDocUpBtn === false
                      }
                    >
                      <ImUpload2 className="w-[30px] h-[25px]" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="text-[red]"
                    >
                      <MdDelete className="w-[30px] h-[30px]" />
                    </button>
                  </div>
                ))}
                <div>
                  {" "}
                  <p className="text-[#ff5001] p-5 mt-10">
                    Note: If you need to upload a medical document, please do so
                    now (the file size must be below 5 MB). Otherwise, click the
                    delete icon to remove it and proceed to the next step.
                  </p>
                </div>
              </div>

              <hr />
              <div className="w-[90%] lg:w-[95%] h-[10vh] flex justify-between items-center">
                {loading ? (
                  <div className="flex w-full justify-end items-end">
                    <svg className="loadersvg my-4" viewBox="25 25 50 50">
                      <circle
                        className="loadercircle"
                        r="20"
                        cy="50"
                        cx="50"
                      ></circle>
                    </svg>
                  </div>
                ) : (
                  <>
                    <button
                      className="bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded my-4 transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                      type="button"
                      onClick={handleBack}
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                      &nbsp;&nbsp;Back
                    </button>
                    <button
                      type="submit"
                      className="disabled:bg-[#ff7a3c] disabled:font-[#fff] disabled:hover:cursor-not-allowed disabled:hover:text-[#fff] disabled:border-[#ff7a3c] bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                    >
                      Next&nbsp;&nbsp;
                      <i class="fa-solid fa-check"></i>
                    </button>
                  </>
                )}
              </div>
            </form>
          </>
        )}
        {stepperactive === 6 && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                submitForm();
              }}
            >
              <div className="w-full h-[7vh] flex justify-center items-center">
                <div className="w-[90%] justify-between flex h-[7vh] items-center">
                  <h1 className="text-[20px] justify-center font-semibold text-[#ff5001]">
                    Disclaimer (Please Read Carefully)
                  </h1>
                  <div
                    onClick={() => {
                      closeregistration();
                    }}
                  >

                    <i className="fa-solid fa-xmark text-[20px] cursor-pointer"></i>
                  </div>
                </div>
              </div>
              <hr />

              <div className="w-full h-[73vh] overflow-auto">
                <div className="w-[90%] mb-[20px]">
                  {/* <label className="w-[100%] text-[#f95005] font-bold text-[1rem] lg:text-[20px] text-start">
                    Disclaimer (Please Read Carefully)
                  </label> */}
                  <label className="w-[100%] text-[#f95005]  text-[1rem] lg:text-[20px] text-start">
                    Personal Responsibility
                  </label>
                  <div className="text-[#45474b] text-[16px] font-semibold text-justify pl-[30px] ">
                    <ul>
                      <li style={{ listStyle: "disc" }}>
                        I have provided all the necessary and relevant
                        information required for the yoga class.
                      </li>
                      <li style={{ listStyle: "disc" }}>
                        I understand the importance of listening to my body and
                        respecting its limits during every session.
                      </li>
                      <li style={{ listStyle: "disc" }}>
                        If I feel any discomfort or strain during a session, I
                        will gently exit the posture and rest as needed.
                      </li>
                      <li style={{ listStyle: "disc" }}>
                        I accept that neither the instructor nor the hosting
                        facility is liable for any injury or damages, to person
                        or property, resulting from participation in these
                        sessions.
                      </li>
                    </ul>
                  </div>
                  <label className="w-[100%] text-[#f95005]  text-[1rem] lg:text-[20px] text-start">
                    Medical Advisory
                  </label>
                  <div className="text-[#45474b] text-[16px] font-semibold text-justify pl-[30px] ">
                    <ul>
                      <li style={{ listStyle: "disc" }}>
                        I will consult my doctor before beginning any yoga
                        program for my overall well-being.
                      </li>
                      <li style={{ listStyle: "disc" }}>
                        I understand it is my responsibility to inform the
                        instructor of any serious illness or injury before the
                        session.
                      </li>
                      <li style={{ listStyle: "disc" }}>
                        I will avoid performing any posture that causes strain
                        or pain.
                      </li>
                    </ul>
                  </div>
                  <label className="w-[100%] text-[#f95005]  text-[1rem] lg:text-[20px] text-start">
                    Confidentiality
                  </label>
                  <div className="text-[#45474b] text-[16px] font-semibold text-justify pl-[30px] ">
                    <ul>
                      <li style={{ listStyle: "disc" }}>
                        I acknowledge that the information I provide for the
                        yoga sessions will be kept strictly confidential.
                      </li>
                    </ul>
                  </div>
                  <label className="w-[100%] text-[#f95005]  text-[1rem] lg:text-[20px] text-start">
                    Non-Refundable Policy
                  </label>
                  <div className="text-[#45474b] text-[16px] font-semibold text-justify pl-[30px] ">
                    <ul>
                      <li style={{ listStyle: "disc" }}>
                        All purchases of services, including classes, workshops,
                        events, and therapy sessions, are non-refundable.
                      </li>
                      <li style={{ listStyle: "disc" }}>
                        Fees cannot be transferred or carried forward under any
                        circumstances.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="w-[90%] mb-[20px]">
                  <CheckboxInput
                    checked={agreementchecked}
                    id="agreementchecked"
                    label="By participating, I agree to adhere to these terms *"
                    required
                    onChange={() => {
                      agreementchecked
                        ? setAgreementchecked(false)
                        : setAgreementchecked(true);
                    }}
                  />
                </div>
              </div>

              <hr />
              <div className="w-[90%] lg:w-[95%] h-[10vh] flex justify-between items-center">
                {loading ? (
                  <div className="flex w-full justify-end items-end">
                    <svg className="loadersvg my-4" viewBox="25 25 50 50">
                      <circle
                        className="loadercircle"
                        r="20"
                        cy="50"
                        cx="50"
                      ></circle>
                    </svg>
                  </div>
                ) : (
                  <>
                    <button
                      className="bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded my-4 transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!options.medicalIssue) {
                          setStepperactive((prev) => (prev > 1 ? prev - 4 : prev));
                        }
                        else {
                          handleBack()
                        }
                      }

                      }
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                      &nbsp;&nbsp;Back
                    </button>
                    <button
                      type="submit"
                      className="disabled:bg-[#ff7a3c] disabled:font-[#fff] disabled:hover:cursor-not-allowed disabled:hover:text-[#fff] disabled:border-[#ff7a3c] bg-[#ff5001] border-2 border-[#ff5001] text-[#fff] font-semibold px-3 py-2 rounded transition-colors duration-300 ease-in-out hover:bg-[#fff] hover:text-[#ff5001]"
                    >
                      Register&nbsp;&nbsp;
                      <i class="fa-solid fa-check"></i>
                    </button>
                  </>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegistrationStepper;
