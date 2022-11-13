import React, { useEffect, useState, useRef } from "react";
import TopBar from "../../components/TopBar";
import { publicFetch } from "../../utils/fetch";
import { GiCheckMark } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

export default function Landing() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [dsrRemark, setDSRRemark] = React.useState("");
  const [geminiRemark, setGeminiRemark] = React.useState("");
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalDetail, setModalDetail] = React.useState();
  const [showAddModal, setAddShowModal] = React.useState(false);
  const [showBatchModal, setShowBatchModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [assignee, setAssignee] = useState("");

  // add task
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [phase, setPhase] = useState("");
  const [clientID, setClientID] = useState("");
  const [releaseTag, setReleaseTag] = useState("");
  const [isBatch, setIsBatch] = useState(false);
  //  edit task
  const [editTaskDetail, setEditTaskDetail] = useState([]);
  const [editTaskID, setEditTaskID] = useState("");
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editPhase, setEditPhase] = useState("");
  const [editClientID, setEditClientID] = useState("");
  const [editReleaseTag, setEditReleaseTag] = useState("");
  const [editisBatch, setEditIsBatch] = useState(false);

  const history = useNavigate();
  const childRef = useRef();
  const getTasks = async () => {
    try {
      const response = await publicFetch.get("/task");
      setTasks(response.data);
    } catch (err) {
      console.log(err.response);
    }
  };
  const moveToDSR = async (task) => {
    console.log(task);
    if (task.isGeminiReport && task.isDSRReport) {
      try {
        const response = await publicFetch.patch(`/update-task/${task._id}`, {
          name: task.name,
          description: task.description,
          flag: "dsr",
          isDSRReport: task.isDSRReport,
          isGeminiReport: task.isGeminiReport,
          clientID: task.clientID,
          releaseTag: task.releaseTag,
          DSRReportNote: task.DSRReportNote,
          GeminiReportNote: task.GeminiReportNote,
          assignee: "Shailee Gorkhali",
        });
        setTasks(response.data);
      } catch (err) {
        console.log(err.response.data);
      }
    } else {
      setModalDetail(task);
      setShowModal(true);
    }
  };
  const moveToBatchDSR = async (task) => {
    console.log(task);
    if (task.isGeminiReport && task.isDSRReport) {
      try {
        const response = await publicFetch.patch(`/update-task/${task._id}`, {
          name: task.name,
          description: task.description,
          flag: "batch dsr",
          isDSRReport: task.isDSRReport,
          clientID: task.clientID,
          releaseTag: task.releaseTag,
          isGeminiReport: task.isGeminiReport,
          DSRReportNote: task.DSRReportNote,
          assignee: "Shailee Gorkhali",

          GeminiReportNote: task.GeminiReportNote,
        });
        setTasks(response.data);
      } catch (err) {
        console.log(err.response.data);
      }
    } else {
      setModalDetail(task);
      setShowBatchModal(true);
    }
  };

  // edit task
  const editTask = async () => {
    try {
      let editAssignee;
      if (editPhase === "dsr" || editPhase === "batch dsr") {
        editAssignee = "Shailee Gorkhali";
      } else {
        editAssignee = "Deepak Maharjan";
      }
      const response = await publicFetch.patch(`/update-task/${editTaskID}`, {
        name: editTaskName,
        description: editTaskDescription,

        flag: editPhase,
        clientID: editClientID,
        releaseTag: editReleaseTag,
        isDSRReport: false,
        isGeminiReport: false,
        assignee: editAssignee,
        DSRReportNote: "",
        GeminiReportNote: "",
      });

      console.log(response);
      setShowEditModal(false);
      toast.success(response.data.message);

      setTasks(response.data);
    } catch (err) {
      console.log(err.response);
    }
  };
  const addTask = async () => {
    try {
      let taskAssignee;
      if (phase === "dsr" || phase === "batch dsr") {
        taskAssignee = "Shailee Gorkhali";
      } else {
        taskAssignee = "Deepak Maharjan";
      }
      const response = await publicFetch.post(`/add-task`, {
        name: taskName,
        description: taskDescription,
        flag: phase,
        clientID: clientID,
        releaseTag: releaseTag,
        assignee: taskAssignee,
      });
      console.log(response);
      toast.success(response.data.message);
      getTasks();
      setAddShowModal(false);
      setTaskName("");
      setTaskDescription("");
      setPhase("");
      // setTasks(response.data);
    } catch (err) {
      toast.error(err.response.data.message);

      console.log(err.response);
    }
  };

  // close add modal
  const closeAddModal = async () => {
    setAddShowModal(false);
    setTaskName("");
    setTaskDescription("");
    setPhase("");
  };

  const forceMovetoDSR = async () => {
    console.log(dsrRemark);
    console.log(geminiRemark);
    console.log(modalDetail);
    try {
      const response = await publicFetch.patch(
        `/update-task/${modalDetail._id}`,
        {
          name: modalDetail.name,
          description: modalDetail.description,
          flag: "dsr",
          isDSRReport: modalDetail.isDSRReport,
          isGeminiReport: modalDetail.isGeminiReport,
          clientID: modalDetail.clientID,
          releaseTag: modalDetail.releaseTag,
          DSRReportNote: dsrRemark,
          assignee: "Shailee Gorkhali",

          GeminiReportNote: geminiRemark,
        }
      );
      setTasks(response.data);
      setShowModal(false);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const forceMovetoBatchDSR = async () => {
    console.log(dsrRemark);
    console.log(geminiRemark);
    console.log(modalDetail);
    try {
      const response = await publicFetch.patch(
        `/update-task/${modalDetail._id}`,
        {
          name: modalDetail.name,
          description: modalDetail.description,
          flag: "batch dsr",
          isDSRReport: modalDetail.isDSRReport,
          isGeminiReport: modalDetail.isGeminiReport,
          clientID: modalDetail.clientID,
          releaseTag: modalDetail.releaseTag,
          DSRReportNote: dsrRemark,
          assignee: "Shailee Gorkhali",

          GeminiReportNote: geminiRemark,
        }
      );
      setTasks(response.data);
      setShowBatchModal(false);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  // Delete task
  const deleteTask = async (task) => {
    console.log(task);
    try {
      const response = await publicFetch.delete(`/delete-task/${task._id}`);
      console.log(response.data);
      getTasks();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const moveToImport = async (task) => {
    try {
      const response = await publicFetch.patch(`/update-task/${task._id}`, {
        name: task.name,
        description: task.description,
        flag: "import",
        isDSRReport: task.isDSRReport,
        clientID: task.clientID,
        releaseTag: task.releaseTag,
        isGeminiReport: task.isGeminiReport,
        assignee: "Deepak Maharjan",
        DSRReportNote: task.DSRReportNote,
        GeminiReportNote: task.GeminiReportNote,
      });
      setTasks(response.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const moveToBatchImport = async (task) => {
    try {
      const response = await publicFetch.patch(`/update-task/${task._id}`, {
        name: task.name,
        description: task.description,
        flag: "batch import",
        isDSRReport: task.isDSRReport,
        isGeminiReport: task.isGeminiReport,
        clientID: task.clientID,
        releaseTag: task.releaseTag,
        assignee: "Deepak Maharjan",

        DSRReportNote: task.DSRReportNote,
        GeminiReportNote: task.GeminiReportNote,
      });
      setTasks(response.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  useEffect(() => {
    getTasks();
  }, []);

  // edit modal open
  const editModalOpen = (task) => {
    setShowEditModal(true);
    setEditTaskDetail(task);
    setEditTaskID(task._id);
    setEditTaskName(task.name);
    setEditTaskDescription(task.description);
    setEditClientID(task.clientID);
    setEditReleaseTag(task.releaseTag);
    setEditPhase(task.flag);
  };

  return (
    <div class="bg-gray-100 min-h-screen">
      <ToastContainer />
      <TopBar setAddShowModal={setAddShowModal} />
      {/* <h1>This is heading</h1> */}
      <div class=" flex justify-center ">
        {tasks.success ? (
          <div class="grid grid-cols-4 gap-6 mt-3 p-2">
            <div class="bg-white px-4 py-1 rounded-sm w-80 min-h-screen">
              <h1 className="p-3 font-bold text-center text-md ">
                {" "}
                Batch Import
              </h1>
              {tasks.result.map((task) => (
                <div className="">
                  {task.flag === "batch import" && (
                    <div class="w-full rounded overflow-hidden   bg-gray-100 mb-4">
                      {/* <img class="w--full" src="/img/card-top.jpg" alt="Sunset in the mountains"> */}
                      <div class="p-3">
                        <Link to={`/task/${task._id}`}>
                          <div className="flex justify-between">
                            <div class="font-bold text-lg mb-2 w-64">
                              CDF Prep for {task.name}
                            </div>
                            <div
                              className="w-[52px] h-[46px] rounded-full  bg-gray-500  flex 
 justify-center items-center text-white font-xl font-medium text-lg "
                            >
                              {task?.assignee
                                ?.split(" ")[0]
                                .charAt(0)
                                .toUpperCase()}
                              {task?.assignee
                                ?.split(" ")
                                .pop()
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          </div>
                          <p className="bg-indigo-800 text-white text-sm rounded-sm px-2 w-fit">
                            {task.name}
                          </p>

                          <p class="text-gray-700 text-base mt-1">
                            {task.description}
                          </p>
                        </Link>
                      </div>
                      <div class="flex gap-2 px-3 pt-2 pb-4 items-center text-center">
                        <button
                          type="button"
                          class="text-white basis-[80%] bg-blue-700 hover:bg-blue-800 w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={
                            () => moveToBatchDSR(task)
                            // validateFile(task._id, task.name, task.description)
                          }
                        >
                          <div className="flex justify-center">
                            Move to Batch DSR
                            {/* <svg
                              aria-hidden="true"
                              class="ml-2 -mr-1 w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                              ></path>
                            </svg> */}
                          </div>
                        </button>
                        <button
                          type="button"
                          class="text-white basis-[10%] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={
                            () => editModalOpen(task)
                            // validateFile(task._id, task.name, task.description)
                          }
                        >
                          <div className="flex justify-center">
                            <MdEdit size={18} />
                          </div>
                        </button>
                        <button
                          type="button"
                          class="text-white basis-[10%] bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                          onClick={
                            () => deleteTask(task)
                            // validateFile(task._id, task.name, task.description)
                          }
                        >
                          <div className="flex justify-center">
                            <MdDelete size={18} />
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                  {showBatchModal ? (
                    <>
                      <div
                        key={task._id}
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none "
                      >
                        <div className="relative w-full max-w-3xl mx-auto my-6 ">
                          {/*content*/}
                          <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            {/*header*/}

                            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                              <h3 className="text-3xl font-semibold">
                                {modalDetail.name}
                              </h3>
                              <button
                                className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                                onClick={() => setShowModal(false)}
                              >
                                <span className="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-5 focus:outline-none">
                                  ×
                                </span>
                              </button>
                            </div>
                            {/*body*/}
                            <div className="relative flex-auto p-6">
                              <div>
                                {modalDetail.isGeminiReport ? (
                                  <div className="flex flex-row justify-between">
                                    <label
                                      class="block text-gray-700 text-md font-bold mb-2"
                                      for="geminiReport"
                                    >
                                      Gemini Report
                                    </label>
                                    <GiCheckMark color="green" size={26} />
                                  </div>
                                ) : (
                                  <div className="flex flex-row justify-between">
                                    <label
                                      class="block text-gray-700 text-md font-bold mb-2"
                                      for="geminiReport"
                                    >
                                      No Gemini Report
                                    </label>
                                    <input
                                      class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                                      id="geminiReport"
                                      type="text"
                                      placeholder="Write a reason"
                                      onChange={(e) =>
                                        setGeminiRemark(e.target.value)
                                      }
                                    ></input>
                                  </div>
                                )}
                              </div>
                              <div className="pt-5">
                                {modalDetail.isDSRReport ? (
                                  <div className="flex flex-row items-center justify-between">
                                    <label
                                      class="block text-gray-700 text-md font-bold mb-2"
                                      for="geminiReport"
                                    >
                                      DSR Note
                                    </label>
                                    <GiCheckMark color="green" size={26} />
                                  </div>
                                ) : (
                                  <div className="flex flex-row items-center justify-between">
                                    <label
                                      class="block text-gray-700 text-md font-bold mb-2"
                                      for="geminiReport"
                                    >
                                      No DSR Note Attached
                                    </label>
                                    <input
                                      class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                                      id="geminiReport"
                                      type="text"
                                      placeholder="Write a reason"
                                      onChange={(e) =>
                                        setDSRRemark(e.target.value)
                                      }
                                    ></input>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-slate-200">
                              <button
                                className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                type="button"
                                onClick={() => setShowBatchModal(false)}
                              >
                                Close
                              </button>
                              <button
                                className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none"
                                type="button"
                                onClick={() => forceMovetoBatchDSR()}
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
            <div class="bg-white px-4 py-1 rounded-sm w-80">
              <h1 className="p-3 font-bold text-center text-md">Batch DSR</h1>
              {tasks.result.map((task) => (
                <>
                  {task.flag === "batch dsr" && (
                    <div class="w-full rounded overflow-hidden   bg-gray-100 mb-4">
                      {/* <img class="w--full" src="/img/card-top.jpg" alt="Sunset in the mountains"> */}
                      <div class="p-3">
                        <Link to={`/task/${task._id}`}>
                          <div className="flex justify-between">
                            <div class="font-bold text-lg mb-2 w-64">
                              CDF Prep for {task.name}
                            </div>
                            <div
                              className="w-[52px] h-[46px] rounded-full  bg-gray-500  flex 
 justify-center items-center text-white font-xl font-medium text-lg "
                            >
                              {task?.assignee
                                ?.split(" ")[0]
                                .charAt(0)
                                .toUpperCase()}
                              {task?.assignee
                                ?.split(" ")
                                .pop()
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          </div>
                          <p className="bg-pink-600 text-white text-sm rounded-sm px-2 w-fit">
                            {task.name}
                          </p>

                          <p class="text-gray-700 text-base mt-1">
                            {task.description}
                          </p>
                        </Link>
                      </div>
                      <div class="flex gap-2 px-3 pt-2 pb-4 items-center text-center">
                        <button
                          type="button"
                          class="text-white basis-[80%] bg-blue-700 hover:bg-blue-800 w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={() => moveToBatchImport(task)}
                        >
                          Move to Batch Import
                        </button>
                        <button
                          type="button"
                          class="text-white basis-[10%] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={
                            () => editModalOpen(task)
                            // validateFile(task._id, task.name, task.description)
                          }
                        >
                          <div className="flex justify-center">
                            <MdEdit size={18} />
                          </div>
                        </button>
                        <button
                          type="button"
                          class="text-white basis-[10%] bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                          onClick={
                            () => deleteTask(task)
                            // validateFile(task._id, task.name, task.description)
                          }
                        >
                          <div className="flex justify-center">
                            <MdDelete size={18} />
                          </div>
                        </button>
                        {/* <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #photography
              </span>
              <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #travel
              </span>
              <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #winter
              </span> */}
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
            <div class="bg-white px-4 py-1 rounded-sm w-80 min-h-screen">
              <h1 className="p-3 font-bold text-center text-md">Import</h1>
              {tasks.result.map((task) => (
                <div className="">
                  {task.flag === "import" && (
                    <div class="w-full rounded overflow-hidden   bg-gray-100 mb-4">
                      {/* <img class="w--full" src="/img/card-top.jpg" alt="Sunset in the mountains"> */}
                      <div class="p-3">
                        <Link to={`/task/${task._id}`}>
                          <div className="flex justify-between">
                            <div class="font-bold text-lg mb-2 w-64">
                              CDF Prep for {task.name}
                            </div>
                            <div
                              className="w-[52px] h-[46px] rounded-full  bg-gray-500  flex 
 justify-center items-center text-white font-xl font-medium text-lg "
                            >
                              {task?.assignee
                                ?.split(" ")[0]
                                .charAt(0)
                                .toUpperCase()}
                              {task?.assignee
                                ?.split(" ")
                                .pop()
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          </div>
                          <p className="bg-indigo-800 text-white text-sm rounded-sm px-2 w-fit">
                            {task.name}
                          </p>

                          <p class="text-gray-700 text-base mt-1">
                            {task.description}
                          </p>
                        </Link>
                      </div>
                      <div class="flex gap-2 px-3 pt-4 pb-2 items-center text-center">
                        <button
                          type="button"
                          class="text-white basis-[80%]  bg-blue-700 hover:bg-blue-800 w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={
                            () => moveToDSR(task)
                            // validateFile(task._id, task.name, task.description)
                          }
                        >
                          <div className="flex justify-center">Move to DSR</div>
                        </button>
                        <button
                          type="button"
                          class="text-white basis-[10%] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={
                            () => editModalOpen(task)
                            // {
                            //   setShowEditModal(true);
                            //   setEditTaskDetail(task);
                            //   setEditTaskID(task._id);
                            //   setEditTaskName(task.name);
                            //   setEditTaskDescription(task.description);
                            //   setEditPhase(task.flag);
                            // }
                            // validateFile(task._id, task.name, task.description)
                          }
                        >
                          <div className="flex justify-center">
                            <MdEdit size={18} />
                          </div>
                        </button>
                        <button
                          type="button"
                          class="text-white basis-[10%] bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                          onClick={
                            () => deleteTask(task)
                            // validateFile(task._id, task.name, task.description)
                          }
                        >
                          <div className="flex justify-center">
                            <MdDelete size={18} />
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                  {showModal ? (
                    <>
                      <div
                        key={task._id}
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
                      >
                        <div className="relative w-full max-w-3xl mx-auto my-6 ">
                          {/*content*/}
                          <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                              <h3 className="text-3xl font-semibold">
                                {modalDetail.name}
                              </h3>
                              <button
                                className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                                onClick={() => showModal(false)}
                              >
                                <span className="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-5 focus:outline-none">
                                  ×
                                </span>
                              </button>
                            </div>
                            {/*body*/}
                            <div className="relative flex-auto p-6">
                              <div>
                                {modalDetail.isGeminiReport ? (
                                  <div className="flex flex-row justify-between">
                                    <label
                                      class="block text-gray-700 text-md font-bold mb-2"
                                      for="geminiReport"
                                    >
                                      Gemini Report
                                    </label>
                                    <GiCheckMark color="green" size={26} />
                                  </div>
                                ) : (
                                  <div className="flex flex-row justify-between">
                                    <label
                                      class="block text-gray-700 text-md font-bold mb-2"
                                      for="geminiReport"
                                    >
                                      No Gemini Report
                                    </label>
                                    <input
                                      class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                                      id="geminiReport"
                                      type="text"
                                      placeholder="Write a reason"
                                      onChange={(e) =>
                                        setGeminiRemark(e.target.value)
                                      }
                                    ></input>
                                  </div>
                                )}
                              </div>
                              <div className="pt-5">
                                {modalDetail.isDSRReport ? (
                                  <div className="flex flex-row items-center justify-between">
                                    <label
                                      class="block text-gray-700 text-md font-bold mb-2"
                                      for="geminiReport"
                                    >
                                      DSR Note
                                    </label>
                                    <GiCheckMark color="green" size={26} />
                                  </div>
                                ) : (
                                  <div className="flex flex-row items-center justify-between">
                                    <label
                                      class="block text-gray-700 text-md font-bold mb-2"
                                      for="geminiReport"
                                    >
                                      No DSR Note Attached
                                    </label>
                                    <input
                                      class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                                      id="geminiReport"
                                      type="text"
                                      placeholder="Write a reason"
                                      onChange={(e) =>
                                        setDSRRemark(e.target.value)
                                      }
                                    ></input>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-slate-200">
                              <button
                                className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                                type="button"
                                onClick={() => setShowModal(false)}
                              >
                                Close
                              </button>
                              <button
                                className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none"
                                type="button"
                                onClick={() => forceMovetoDSR()}
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                    </>
                  ) : null}
                </div>
              ))}
            </div>

            <div class="bg-white px-4 py-1 rounded-sm w-80">
              <h1 className="p-3 font-bold text-center text-md">DSR</h1>
              {tasks.result.map((task) => (
                <>
                  {task.flag === "dsr" && (
                    <div class="w-full rounded overflow-hidden   bg-gray-100 mb-4">
                      {/* <img class="w--full" src="/img/card-top.jpg" alt="Sunset in the mountains"> */}
                      <div class="p-3">
                        <Link to={`/task/${task._id}`}>
                          <div className="flex justify-between">
                            <div class="font-bold text-lg mb-2 w-64">
                              CDF Prep for {task.name}
                            </div>
                            <div
                              className="w-[52px] h-[46px] rounded-full  bg-gray-500  flex 
 justify-center items-center text-white font-xl font-medium text-lg "
                            >
                              {task?.assignee
                                ?.split(" ")[0]
                                .charAt(0)
                                .toUpperCase()}
                              {task?.assignee
                                ?.split(" ")
                                .pop()
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          </div>
                          <p className="bg-pink-600 text-white text-sm rounded-sm px-2 w-fit">
                            {task.name}
                          </p>

                          <p class="text-gray-700 text-base mt-1">
                            {task.description}
                          </p>
                        </Link>
                      </div>
                      <div class="flex gap-2 px-3 pt-2 pb-4 items-center text-center">
                        {/* <button onClick={() => moveToImport(task)}>
                          Move Back to Import
                        </button> */}
                        <button
                          type="button"
                          class="text-white basis-[80%] bg-blue-700 hover:bg-blue-800 w-full focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={() => moveToImport(task)}
                        >
                          Move Back to Import
                        </button>
                        <button
                          type="button"
                          class="text-white basis-[10%] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={
                            () => editModalOpen(task)
                            // validateFile(task._id, task.name, task.description)
                          }
                        >
                          <div className="flex justify-center">
                            <MdEdit size={18} />
                          </div>
                        </button>
                        <button
                          type="button"
                          class="text-white basis-[10%] bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                          onClick={
                            () => deleteTask(task)
                            // validateFile(task._id, task.name, task.description)
                          }
                        >
                          <div className="flex justify-center">
                            <MdDelete size={18} />
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
            {showAddModal ? (
              <>
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                  <div className="relative w-full max-w-3xl mx-auto my-6 ">
                    {/*content*/}
                    <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                        <h3 className="text-3xl font-semibold">
                          {/* {modalDetail.name} */}
                          Title Add
                        </h3>
                        <button
                          className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                          onClick={() => setAddShowModal(false)}
                        >
                          <span className="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-5 focus:outline-none">
                            ×
                          </span>
                        </button>
                      </div>
                      {/*body*/}
                      <div className="relative flex-auto px-6 pt-6 pb-2">
                        <div>
                          <div className="flex flex-row justify-between mb-3">
                            <label
                              class="block text-gray-700 text-md font-bold mb-2"
                              for="taskName"
                            >
                              Task Name
                            </label>
                            <input
                              class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                              id="taskName"
                              type="text"
                              // placeholder="Write a reason"
                              onChange={(e) => setTaskName(e.target.value)}
                              required
                            ></input>
                          </div>
                          <div className="flex flex-row justify-between mb-3">
                            <label
                              class="block text-gray-700 text-md font-bold mb-2"
                              for="taskName"
                              required
                            >
                              Verscend Application ID
                            </label>
                            <input
                              class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                              id="taskName"
                              type="text"
                              // placeholder="Write a reason"
                              onChange={(e) => setClientID(e.target.value)}
                              required
                            ></input>
                          </div>
                          <div className="flex flex-row justify-between mb-3">
                            <label
                              class="block text-gray-700 text-md font-bold mb-2"
                              for="taskName"
                            >
                              Release Tag
                            </label>
                            <input
                              class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                              id="taskName"
                              type="text"
                              required
                              // placeholder="Write a reason"
                              onChange={(e) => setReleaseTag(e.target.value)}
                            ></input>
                          </div>
                          <div className="flex flex-row justify-between mb-3">
                            <label
                              class="block text-gray-700 text-md font-bold mb-2"
                              for="taskName"
                            >
                              Phase
                            </label>
                            <select
                              id="countries"
                              class="rounded border w-1/2 px-2 py-2"
                              onChange={(e) => setPhase(e.target.value)}
                              required
                            >
                              <option selected>Select Phase</option>
                              <option value="batch import">Batch Import</option>
                              {/* <option value="batch dsr">Batch DSR</option> */}
                              <option value="import">Import</option>
                              {/* <option value="dsr">DSR</option> */}
                            </select>
                          </div>

                          <div className="flex flex-row justify-between mt-4">
                            <label
                              class="block text-gray-700 text-md font-bold mb-2"
                              for="taskDesc"
                            >
                              Task description
                            </label>
                            <textarea
                              rows="5"
                              class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                              id="taskDesc"
                              type="text"
                              // placeholder="Write a reason"
                              onChange={(e) =>
                                setTaskDescription(e.target.value)
                              }
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      {/*footer*/}
                      <div className="flex items-center justify-end p-4 border-t border-solid rounded-b border-slate-200">
                        <button
                          className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                          type="button"
                          onClick={() => closeAddModal()}
                        >
                          Close
                        </button>
                        <button
                          className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none"
                          type="button"
                          onClick={() => addTask()}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
              </>
            ) : null}
          </div>
        ) : (
          <>
            <p>Loading</p>
          </>
        )}

        {showEditModal ? (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
              <div className="relative w-full max-w-3xl mx-auto my-6 ">
                {/*content*/}
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                    <h3 className="text-3xl font-semibold">
                      {/* {modalDetail.name} */}
                      Edit
                    </h3>
                    <button
                      className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                      onClick={() => setAddShowModal(false)}
                    >
                      <span className="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-5 focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative flex-auto px-6 pt-6 pb-2">
                    <div>
                      <div className="flex flex-row justify-between mb-3">
                        <label
                          class="block text-gray-700 text-md font-bold mb-2"
                          for="taskName"
                        >
                          Task Name
                        </label>
                        <input
                          class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                          id="taskName"
                          type="text"
                          // placeholder="Write a reason"
                          value={editTaskName}
                          onChange={(e) => setEditTaskName(e.target.value)}
                        ></input>
                      </div>
                      <div className="flex flex-row justify-between mb-3">
                        <label
                          class="block text-gray-700 text-md font-bold mb-2"
                          for="taskName"
                          required
                        >
                          Verscend Application ID
                        </label>
                        <input
                          class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                          id="taskName"
                          type="text"
                          value={editClientID}
                          // placeholder="Write a reason"
                          onChange={(e) => setEditClientID(e.target.value)}
                          required
                        ></input>
                      </div>
                      <div className="flex flex-row justify-between mb-3">
                        <label
                          class="block text-gray-700 text-md font-bold mb-2"
                          for="taskName"
                        >
                          Release Tag
                        </label>
                        <input
                          class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                          id="taskName"
                          type="text"
                          required
                          value={editReleaseTag}
                          // placeholder="Write a reason"
                          onChange={(e) => setEditReleaseTag(e.target.value)}
                        ></input>
                      </div>
                      <div className="flex flex-row justify-between mb-3">
                        <label
                          class="block text-gray-700 text-md font-bold mb-2"
                          for="taskName"
                        >
                          Phase
                        </label>
                        <select
                          id="countries"
                          class="rounded border w-1/2 px-2 py-2"
                          onChange={(e) => setEditPhase(e.target.value)}
                          initialvalue={editPhase}
                        >
                          <option selected>Select Phase</option>
                          <option value="batch import">Batch Import</option>
                          {/* <option value="batch dsr">Batch DSR</option> */}
                          <option value="import">Import</option>
                          {/* <option value="dsr">DSR</option> */}
                        </select>
                        {/* <input
                              class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                              id="taskName"
                              type="text"
                              // placeholder="Write a reason"
                              onChange={(e) => setPhase(e.target.value)}
                            ></input> */}
                      </div>

                      <div className="flex flex-row justify-between mt-4">
                        <label
                          class="block text-gray-700 text-md font-bold mb-2"
                          for="taskDesc"
                        >
                          Task description
                        </label>
                        <textarea
                          rows="5"
                          class=" appearance-none border rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                          id="taskDesc"
                          type="text"
                          value={editTaskDescription}
                          // placeholder="Write a reason"
                          onChange={(e) =>
                            setEditTaskDescription(e.target.value)
                          }
                        ></textarea>
                      </div>
                    </div>
                    <label className="flex flex-row justify-between mt-2">
                      Note: Please leave the Batch Number 0 if don't have batch
                      processing.
                    </label>
                  </div>

                  {/*footer*/}
                  <div className="flex items-center justify-end p-4 border-t border-solid rounded-b border-slate-200">
                    <button
                      className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                      type="button"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none"
                      type="button"
                      onClick={() => editTask()}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
          </>
        ) : null}
      </div>

      {/* <button
        className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-pink-500 rounded shadow outline-none active:bg-pink-600 hover:shadow-lg focus:outline-none"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Open regular modal
      </button> */}
    </div>
  );
}
