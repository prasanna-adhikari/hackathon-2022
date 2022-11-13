import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TopBar from "../../components/TopBar";
import { publicFetch } from "../../utils/fetch";
import FILE_URL from "../../utils/fileURL";
import dayjs from "dayjs";
import moment from "moment";
export default function TaskDetail() {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);
  const [filePath, setFilePath] = useState("");
  const [showModal, setShowModal] = useState(false);
  const now = dayjs().format("YYYYMMDD");

  const currentDate = moment().format("YYYYMMDD");
  const url = location.pathname.split("/")[2];
  // console.log(location.pathname.split("/")[2]);
  const getTask = async () => {
    try {
      const response = await publicFetch.get(`/single-task/${url}`);
      console.log(response);
      setTasks(response.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  const getFiles = async () => {
    try {
      const response = await publicFetch.get(`/file/${url}`);
      setFiles(response.data);

      // console.log(dayjs(now.,''))
    } catch (err) {
      console.log(err.response);
    }
  };

  const deleteFile = async (id) => {
    try {
      const response = await publicFetch.delete(`/delete-file/${id}`);
      console.log(response.data);
      getFiles();
    } catch (err) {
      console.log(err.response);
    }
  };

  const uploadFile = async () => {
    const beforeOneDay = dayjs().subtract(1, "day").format("YYYYMMDD");
    const twoDayBefore = dayjs().subtract(2, "day").format("YYYYMMDD");
    try {
      const fd = new FormData();
      const filePattern = filePath.name;
      fd.set("task", url);
      fd.set("filePath", filePath);
      const response = await publicFetch.post(`/add-file`, fd);
      const DSRfileGetResponse = await publicFetch.get(
        `/search-file/${url}?search=dsr_note`
      );
      const GeminifileGetResponse = await publicFetch.get(
        `/search-file/${url}?search=gemini_report`
      );
      console.log(filePath.name.indexOf());
      const latestGeminiFile = GeminifileGetResponse?.data?.result[0]?.fileName;
      if (filePath.name.toLowerCase().indexOf("dsr_note") > -1) {
        if (DSRfileGetResponse.data.result.length > 0) {
          console.log("dsr uploaded");
          const latestDSRFile = DSRfileGetResponse?.data?.result[0]?.fileName;
          if (
            latestDSRFile.indexOf(now) > -1 ||
            latestDSRFile.indexOf(beforeOneDay) > -1 ||
            latestDSRFile.indexOf(twoDayBefore) > -1
          ) {
            console.log(latestDSRFile);
            try {
              const response = await publicFetch.patch(
                `/update-task/${tasks.result[0]._id}`,
                {
                  name: tasks.result[0].name,
                  description: tasks.result[0].description,
                  flag: tasks.result[0].flag,
                  isDSRReport: true,
                  batchCount: tasks.result[0].batchCount,
                  isGeminiReport: tasks.result[0].isGeminiReport,
                  releaseTag: tasks.result[0].releaseTag,
                  clientID: tasks.result[0].clientID,
                  assignee: tasks.result[0].assignee,
                  DSRReportNote: "",
                  GeminiReportNote: tasks.result[0].GeminiReportNote,
                }
              );
              console.log(response);
              getTask();
            } catch (err) {
              console.log(err.response.data);
            }
          }
        }
      }
      if (filePath.name.toLowerCase().indexOf("gemini_report") > -1) {
        console.log("gemini uploaded");

        if (GeminifileGetResponse.data.result.length > 0) {
          if (
            latestGeminiFile.indexOf(now) > -1 ||
            latestGeminiFile.indexOf(beforeOneDay) > -1 ||
            latestGeminiFile.indexOf(twoDayBefore) > -1
          ) {
            try {
              const response = await publicFetch.patch(
                `/update-task/${tasks.result[0]._id}`,
                {
                  name: tasks.result[0].name,
                  description: tasks.result[0].description,
                  flag: tasks.result[0].flag,
                  isDSRReport: tasks.result[0].isDSRReport,
                  batchCount: tasks.result[0].batchCount,
                  isGeminiReport: true,
                  releaseTag: tasks.result[0].releaseTag,
                  clientID: tasks.result[0].clientID,
                  DSRReportNote: tasks.result[0].DSRReportNote,
                  assignee: tasks.result[0].assignee,

                  GeminiReportNote: "",
                }
              );
              console.log(response);
              getTask();
            } catch (err) {
              console.log(err.response.data);
            }
          }
        }
      }

      // if (DSRfileGetResponse.data.total === tasks.result[0].batchCount) {
      //   try {
      //     const response = await publicFetch.patch(
      //       `/update-task/${tasks.result[0]._id}`,
      //       {
      //         name: tasks.result[0].name,
      //         description: tasks.result[0].description,
      //         flag: tasks.result[0].flag,
      //         isDSRReport: true,
      //         batchCount: tasks.result[0].batchCount,
      //         isGeminiReport: tasks.result[0].isGeminiReport,
      //         DSRReportNote: tasks.result[0].DSRReportNote,
      //         GeminiReportNote: tasks.result[0].GeminiReportNote,
      //       }
      //     );
      //     console.log(response);
      //     getTask();
      //   } catch (err) {
      //     console.log(err.response.data);
      //   }
      // }
      // if (GeminifileGetResponse.data.total === tasks.result[0].batchCount) {
      //   try {
      //     const response = await publicFetch.patch(
      //       `/update-task/${tasks.result[0]._id}`,
      //       {
      //         name: tasks.result[0].name,
      //         description: tasks.result[0].description,
      //         flag: tasks.result[0].flag,
      //         isDSRReport: tasks.result[0].isDSRReport,
      //         batchCount: tasks.result[0].batchCount,
      //         isGeminiReport: true,
      //         DSRReportNote: tasks.result[0].DSRReportNote,
      //         GeminiReportNote: tasks.result[0].GeminiReportNote,
      //       }
      //     );
      //     console.log(response);
      //     getTask();
      //   } catch (err) {
      //     console.log(err.response.data);
      //   }
      // }

      // if (filePath.name.toLowerCase().indexOf("dsrnote") > -1) {
      //   try {
      //     const response = await publicFetch.patch(
      //       `/update-task/${tasks.result[0]._id}`,
      //       {
      //         name: tasks.result[0].name,
      //         description: tasks.result[0].description,
      //         flag: tasks.result[0].flag,
      //         isDSRReport: true,
      //         batchCount: tasks.result[0].batchCount,
      //         isGeminiReport: tasks.result[0].isGeminiReport,
      //         DSRReportNote: tasks.result[0].DSRReportNote,
      //         GeminiReportNote: tasks.result[0].GeminiReportNote,
      //       }
      //     );
      //     console.log(response);
      //     getTask();
      //   } catch (err) {
      //     console.log(err.response.data);
      //   }
      // }
      // if (filePath.name.toLowerCase().indexOf("geminireport") > -1) {
      //   try {
      //     const response = await publicFetch.patch(
      //       `/update-task/${tasks.result[0]._id}`,
      //       {
      //         name: tasks.result[0].name,
      //         description: tasks.result[0].description,
      //         flag: tasks.result[0].flag,
      //         isDSRReport: tasks.result[0].isDSRReport,
      //         batchCount: tasks.result[0].batchCount,
      //         isGeminiReport: true,
      //         DSRReportNote: tasks.result[0].DSRReportNote,
      //         GeminiReportNote: tasks.result[0].GeminiReportNote,
      //       }
      //     );
      //     setTasks(response.data);
      //   } catch (err) {
      //     console.log(err.response.data);
      //   }
      // }
      setShowModal(false);
      getFiles();
    } catch (err) {
      console.log(err);
      console.log(err.response);
    }
  };
  useEffect(() => {
    if (url) {
      getTask();
      getFiles();
    }
  }, [url]);
  return (
    <>
      <TopBar />
      {tasks.success ? (
        <div className="container px-4 mx-auto py-2">
          <div className="flex flex-row justify-between w-full pb-2 divide-y">
            <h2 class="text-3xl font-semibold leading-7 text-gray-900 sm:truncate  sm:tracking-tight">
              CDF Prep for {tasks.result[0].name} - Oct 2022
            </h2>
            <button
              className="inline-flex items-center justify-center px-4 py-1 ml-8 text-base font-medium text-gray-700 bg-gray-300 border border-transparent rounded-md shadow-sm whitespace-nowrap hover:bg-gray-400"
              onClick={() => setShowModal(true)}
            >
              Upload file
            </button>
            {/* <button
              className="inline-flex items-center justify-center px-4 py-1 ml-8 text-base font-medium text-white bg-blue-700 border border-transparent rounded-md shadow-sm whitespace-nowrap hover:bg-blue-800"
              onClick={() => setShowModal(true)}
            >
              Upload file
            </button> */}
          </div>
          <div class="details mt-3">
            <p className="font-medium">Details</p>
            <div className="flex  py-0.5">
              <div className="flex-initial w-64 text-gray-700">Type:</div>
              <div className="flex-auto w-96 text-gray-700">CDF Data Prep</div>
            </div>
            <div className="flex  py-0.5">
              <div className="flex-initial w-64 text-gray-700">Epic Link:</div>
              <div className="flex-auto w-fit  ">
                <span className="bg-indigo-900 text-white w-fit px-1.5 rounded-sm text-sm">
                  {tasks.result[0].name}
                </span>
              </div>
            </div>
            <div className="flex  py-0.5">
              <div className="flex-initial w-64 text-gray-700">
                Application Product:
              </div>
              <div className="flex-auto w-96 text-gray-700">MI</div>
            </div>
            <div className="flex  py-0.5">
              <div className="flex-initial w-64 text-gray-700">
                Verscend Application ID:
              </div>
              <div className="flex-auto w-96 text-gray-700">
                {tasks.result[0].clientID}
              </div>
            </div>
            <div className="flex  py-0.5">
              <div className="flex-initial w-64 text-gray-700">
                Production Application Name:
              </div>
              <div className="flex-auto w-96 text-gray-700">
                {tasks.result[0].name}
              </div>
            </div>
            <div className="flex  py-0.5">
              <div className="flex-initial w-64 text-gray-700">Status:</div>
              <div className="flex-auto w-96 text-gray-700 uppercase text-sm  ">
                <span className="bg-blue-600 text-white w-fit px-1.5 rounded-sm font-medium">
                  {tasks.result[0].flag}
                </span>
              </div>
            </div>
            <div className="flex  py-0.5">
              <div className="flex-initial w-64 text-gray-700">
                Release Tag:
              </div>
              <div className="flex-auto w-96 text-gray-700">
                {tasks.result[0].releaseTag}
              </div>
            </div>
            <div className="flex  py-0.5">
              <div className="flex-initial w-64 text-gray-700">
                Description:
              </div>
              <div className="flex-auto w-96 text-gray-700">
                {tasks.result[0].description}
              </div>
            </div>
            <div className="flex  py-0.5">
              <div className="flex-initial w-64 text-gray-700">Assignee:</div>
              <div className="flex-auto w-96  text-blue-700 underline">
                {tasks.result[0].assignee}
              </div>
            </div>
          </div>
          <div className="notes mt-4">
            {tasks.result[0].DSRReportNote !== "" ||
            tasks.result[0].GeminiReportNote !== "" ? (
              <>
                <p className="font-medium">Files Notes</p>
                {tasks.result[0].DSRReportNote !== "" ? (
                  <div className="flex  py-0.5">
                    <div className="flex-initial w-64 text-gray-700">
                      DSR Report Note:
                    </div>
                    <div className="flex-auto w-96 text-gray-700">
                      <p> {tasks.result[0].DSRReportNote}</p>
                    </div>
                  </div>
                ) : null}
                {tasks.result[0].GeminiReportNote !== "" ? (
                  <div className="flex  py-0.5">
                    <div className="flex-initial w-64 text-gray-700">
                      Gemini Report Note:
                    </div>
                    <div className="flex-auto w-96 text-gray-700">
                      <p> {tasks.result[0].GeminiReportNote}</p>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
            {/* {tasks.result[0].DSRReportNote !== "" && (
              <>
                {tasks.result[0].DSRReportNote !== "" && (
                  <div className="flex  py-0.5">
                    <div className="flex-initial w-64 text-gray-700">
                      DSR Report Note:
                    </div>
                    <div className="flex-auto w-96 text-gray-700">
                      <p> {tasks.result[0].DSRReportNote}</p>
                    </div>
                  </div>
                )}
                
              </>
            )} */}
          </div>

          <p className="font-medium mt-3">Links</p>
          {files.success ? (
            <>
              {files.result.map((file) => (
                // <Link to={`${FILE_URL}${file.pathName}`}>
                <div className="flex flex-col">
                  <div className=" flex justify-between">
                    <a
                      className="text-blue-500 underline text-sm font-medium cursor-pointer"
                      href={`${FILE_URL}${file.filePath}`}
                      target="_blank"
                    >
                      {file.fileName}
                    </a>
                    <span
                      className="text-red-600 text-sm underline cursor-pointer"
                      onClick={() => {
                        deleteFile(file._id);
                      }}
                    >
                      Delete
                    </span>
                  </div>
                </div>
                // </Link>
              ))}
            </>
          ) : (
            <>Loading</>
          )}
        </div>
      ) : (
        <>
          <p>Loading</p>
        </>
      )}
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-full max-w-3xl mx-auto my-6 ">
              {/*content*/}
              <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                  <h3 className="text-3xl font-semibold">Upload File</h3>
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
                  <div className="flex flex-row items-center justify-between">
                    <label
                      class="block text-gray-700 text-md font-bold mb-2"
                      for="file"
                    >
                      Upload File
                    </label>
                    <input
                      class=" appearance-none  rounded w-6/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                      id="file"
                      type="file"
                      onChange={(e) => setFilePath(e.target.files[0])}
                    ></input>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-4 border-t border-solid rounded-b border-slate-200">
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
                    onClick={uploadFile}
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
    </>
  );
}
