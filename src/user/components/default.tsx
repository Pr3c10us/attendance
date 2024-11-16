import {
  useAccount,
  useWriteContract,
  useReadContract,
  useBalance,
  useWaitForTransactionReceipt,
  useDisconnect,
} from "wagmi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { address as ContractAddress } from "../../../utils/abis/attendance.json";
import { SiHiveBlockchain } from "react-icons/si";
import { IoAdd } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import StudentRow from "./studentrow";
import { BsFillXCircleFill } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import AddStudent from "./addForm";

export type Student = {
  id: bigint;
  age: bigint;
  attendanceCount: bigint;
  name: string;
  isRegistered: boolean;
  studentAddress: `0x${string}`;
};

const Default = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [owner, setOwner] = useState(false);
  const [studentCount, setStudentCount] = useState<bigint>(BigInt(0));
  const [courseInput, setCourseInput] = useState<string>(
    searchParams.get("course") || "",
  );
  const [course, setCourse] = useState<string>(
    searchParams.get("course") || "",
  );
  const [selected, setSelected] = useState<Student[]>([]);
  const [toastID, setToastID] = useState<string>();
  const [addForm, setAddForm] = useState(false);

  const {
    writeContract,
    data: hash,
    isPending,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isFailed,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const account = useAccount();
  const balance = useBalance({
    address: account.address,
  });
  //   const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect();
  const {
    data: contractOwner,
    isLoading: oIsLoading,
    isError: oIsError,
  } = useReadContract({
    address: ContractAddress as `0x${string}`,
    abi: [
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "address",
          },
        ],
        stateMutability: "view",
      },
    ],
    functionName: "owner",
  });
  const {
    data: contractStudentCount,
    isLoading,
    isError,
  } = useReadContract({
    address: ContractAddress as `0x${string}`,
    abi: [
      {
        type: "function",
        name: "studentCount",
        inputs: [],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        stateMutability: "view",
      },
    ],
    functionName: "studentCount",
  });
  const {
    data: contractCourseRep,
    isLoading: ocrIsLoading,
    isError: ocrIsError,
  } = useReadContract({
    address: ContractAddress as `0x${string}`,
    abi: [
      {
        type: "function",
        name: "authorizedCourseReps",
        inputs: [
          {
            name: "",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [
          {
            name: "",
            type: "bool",
            internalType: "bool",
          },
        ],
        stateMutability: "view",
      },
    ],
    functionName: "authorizedCourseReps",
    args: [course as `0x${string}`, account.address as `0x${string}`],
  });

  async function addressHandler() {
    try {
      if (account.status === "connected") {
        setOwner(
          contractOwner?.toLowerCase() === account.address?.toLowerCase(),
        );
        setStudentCount(contractStudentCount || BigInt(0));
      }
    } catch (error) {
      console.log(error);
      toast.error("error");
    }
  }

  useEffect(() => {
    addressHandler();
  }, [
    isLoading,
    contractStudentCount,
    isError,
    oIsLoading,
    oIsError,
    contractOwner,
    ocrIsLoading,
    ocrIsError,
  ]);

  useEffect(() => {
    if (courseInput.length < 1 && !isPending && !isConfirming) {
      setCourse("");
      setSearchParams((prev) => {
        prev.set("course", courseInput);
        return prev;
      });
    }
  }, [courseInput]);

  useEffect(() => {
    if (hash) {
      if (isConfirming) {
        setToastID(toast.loading("Processing...", { duration: Infinity }));
      } else if (isConfirmed) {
        toast.success("Complete!", {
          duration: 2000,
          id: toastID,
        });
        setToastID("");
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } else if (isFailed) {
        toast.error("Failed!", {
          duration: 2000,
          id: toastID,
        });
        setToastID("");
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    }
  }, [isConfirming, isConfirmed, isFailed]);

  async function deregisteredStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selected.length > 1) {
      toast.error("only one student at a time");
      return;
    } else if (selected.length < 1) {
      toast.error("select a student to deregister");
      return;
    }
    if (!selected[0].isRegistered) {
      toast.error("student is not registered");
      return;
    }
    writeContract({
      abi: [
        {
          type: "function",
          name: "deregisterStudent",
          inputs: [
            {
              name: "_course",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "_studentId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ],
      address: ContractAddress as `0x${string}`,
      functionName: "deregisterStudent",
      args: [course as `0x${string}`, selected[0].id],
    });
  }

  async function registerStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selected.length > 1) {
      toast.error("only one student at a time");
      return;
    } else if (selected.length < 1) {
      toast.error("select a student to register");
      return;
    }
    if (selected[0].isRegistered) {
      toast.error("student already registered");
      return;
    }

    writeContract({
      abi: [
        {
          type: "function",
          name: "registerStudent",
          inputs: [
            {
              name: "_course",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "_studentId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ],

      address: ContractAddress as `0x${string}`,
      functionName: "registerStudent",
      args: [course as `0x${string}`, selected[0].id],
    });
  }

  async function markAttendance(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selected.length > 1) {
      toast.error("only one student at a time");
      return;
    } else if (selected.length < 1) {
      toast.error("select a student to register");
      return;
    }
    if (!selected[0].isRegistered) {
      toast.error("student is not registered to course");
      return;
    }

    writeContract({
      abi: [
        {
          type: "function",
          name: "incrementAttendance",
          inputs: [
            {
              name: "_course",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "_studentId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ],

      address: ContractAddress as `0x${string}`,
      functionName: "incrementAttendance",
      args: [course as `0x${string}`, selected[0].id],
    });
  }

  return (
    <>
      <main className="space-y-8 px-8 py-4">
        <nav className="flex items-center justify-between p-4">
          <section className="flex items-center gap-4">
            <div className="relative aspect-square w-10">
              <img
                src="./logoblue.svg"
                alt="logoblack"
                className="absolute top-1 w-full"
              />
              <img
                src="./logoblack.svg"
                alt="logoblack"
                className="absolute w-full"
              />
            </div>
            <h1 className="text-2xl font-extrabold">Student Attendance DAPP</h1>
          </section>
          <section className="flex justify-end">
            {account.status === "connected" && (
              <>
                <div className="mr-4 flex items-center gap-2 rounded-md border-2 px-6 py-2">
                  <div>{account.chain?.name}</div>
                  <SiHiveBlockchain className="inline-block h-5 w-5 text-[#86e7b8]" />
                </div>
                <div
                  onClick={() => disconnect()}
                  className="cursor-pointer space-x-2 rounded-md border-2 px-6 py-2"
                >
                  <span>
                    {Number(balance.data?.formatted).toFixed(3) == "NaN"
                      ? "0.000"
                      : Number(balance.data?.formatted).toFixed(3)}
                    {` `}
                    {account.chain?.nativeCurrency.symbol}
                  </span>
                  <span className={``}>
                    {account.address
                      .substring(0, 8)
                      .concat(`...${account.address.slice(-4)}`)}
                  </span>
                </div>
              </>
            )}
          </section>
        </nav>

        <div className="mx-12 rounded-xl border border-[#eee] pt-5">
          <header className="mt-4 flex items-center gap-4 px-8 text-3xl font-bold">
            <h1>
              {" "}
              Students List {isLoading || (studentCount < 1 && "loading...")}
            </h1>
            {owner && (
              <span
                className="flex aspect-square w-12 cursor-pointer items-center justify-center rounded-full bg-accent text-white"
                onClick={() => setAddForm(true)}
              >
                <IoAdd className="text-4xl" />
              </span>
            )}
          </header>
          {isLoading || studentCount < 1 ? (
            <div className="flex w-full items-center justify-center py-8">
              <span className="aspect-square w-12 animate-spin rounded-full border-2 border-r-0 border-t-0 border-accent"></span>
            </div>
          ) : (
            <>
              <section className="flex w-full items-center justify-between px-6 py-5">
                <label className="flex w-full items-center gap-2">
                  <input
                    type="text"
                    name="course"
                    placeholder="Enter course code"
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    className="w-1/2 max-w-96 rounded-lg border border-[#e3e3e3] px-5 py-2.5 text-lg"
                  />
                  <button
                    disabled={
                      courseInput.length < 1 ||
                      courseInput == course ||
                      isPending ||
                      isConfirming
                    }
                    onClick={() => {
                      setSelected([]);
                      setCourse(courseInput);
                      setSearchParams((prev) => {
                        prev.set("course", courseInput);
                        return prev;
                      });
                    }}
                    className={`flex items-center gap-2 rounded-lg ${courseInput.length < 1 || courseInput == course || isPending || isConfirming ? "cursor-not-allowed bg-[#eee]" : "bg-black"} px-8 py-2.5 text-white`}
                  >
                    Apply
                  </button>
                </label>

                {course.length > 0 && contractCourseRep && (
                  <div className="flex w-full items-center justify-end gap-2">
                    <form onSubmit={markAttendance}>
                      <button
                        type="submit"
                        disabled={isPending || isConfirming}
                        className={`${(isPending || isConfirming) && "bg-custom-gradient-disable cursor-not-allowed border-0 text-white"} flex items-center gap-2 rounded-lg border border-accent px-8 py-2.5 text-accent shadow-sm`}
                      >
                        <span>
                          <FaCheck className="text-xl" />
                        </span>
                        Mark Attendance
                      </button>
                    </form>{" "}
                    <form onSubmit={deregisteredStudent}>
                      <button
                        type="submit"
                        disabled={isPending || isConfirming}
                        className={`flex items-center gap-2 rounded-lg border px-8 py-2.5 shadow-sm ${(isPending || isConfirming) && "bg-custom-gradient-disable cursor-not-allowed text-white"}`}
                      >
                        <span>
                          <ImExit />
                        </span>
                        Deregister
                      </button>
                    </form>
                    <form onSubmit={registerStudent}>
                      <button
                        type="submit"
                        disabled={isPending || isConfirming}
                        className={`${isPending || isConfirming ? "bg-custom-gradient-disable cursor-not-allowed text-white" : "bg-custom-gradient"} flex items-center gap-2 rounded-lg border px-8 py-2.5 shadow-sm`}
                      >
                        <span>
                          <IoAdd className="text-xl" />
                        </span>
                        Register
                      </button>
                    </form>
                  </div>
                )}
              </section>
              <table className="over w-full divide-y divide-[#eee] text-center">
                <thead className="border-t bg-[#FCFCFD]">
                  <tr className="text-[#757575] [&>th]:px-8 [&>th]:py-3 [&>th]:font-normal [&>th]:capitalize">
                    <th>
                      <button
                        disabled={selected.length < 1}
                        onClick={() => {
                          setSelected([]);
                        }}
                        className={`flex aspect-square w-6 items-center justify-center text-xl ${selected.length > 0 && "text-red-500"}`}
                      >
                        <BsFillXCircleFill />
                      </button>
                    </th>
                    <th>Name</th>
                    <th>Student Address</th>
                    <th>Age</th>
                    <th>Attendance Count</th>
                    {course.length > 0 && <th>Registered</th>}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee]">
                  {new Array(Number(studentCount)).fill(null).map((_, i) => {
                    return (
                      <StudentRow
                        key={`jj${i}`}
                        ID={BigInt(i)}
                        Course={course}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    );
                  })}
                  {/* <tr className="[&>td]:px-4 [&>td]:py-3">
                  <td>
                    <div className="flex aspect-square w-5 items-center justify-center rounded-md border text-white">
                      <IoCheckmarkOutline />
                    </div>
                  </td>
                  <td>John Doe</td>
                  <td>123 Elm Street</td>
                  <td>25</td>
                  <td>12</td>
                  {course.length > 0 && <td>Yes</td>}
                </tr>
                <tr className="[&>td]:px-4 [&>td]:py-3">
                  <td>
                    <div className="flex aspect-square w-5 items-center justify-center rounded-md border text-white">
                      <IoCheckmarkOutline />
                    </div>
                  </td>
                  <td>John Doe</td>
                  <td>123 Elm Street</td>
                  <td>25</td>
                  <td>12</td>
                  {course.length > 0 && <td>Yes</td>}
                </tr> */}
                </tbody>
              </table>
            </>
          )}
        </div>
      </main>
      {addForm && owner && (
        <>
          <AddStudent setAddForm={setAddForm} />
        </>
      )}
    </>
  );
};

export default Default;
