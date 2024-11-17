import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { address as ContractAddress } from "../../../utils/abis/attendance.json";
import toast from "react-hot-toast";

const AddStudent = (props: {
  setAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [address, setAddress] = useState("");
  const [toastID, setToastID] = useState<string>();

  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isFailed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    console.log(error);
  }, [error]);

  async function markAttendance(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (age <= 0 || !name || !address) {
      toast.error("provide all student details");
      return;
    }

    writeContract({
      abi: [
        {
          type: "function",
          name: "createStudent",
          inputs: [
            {
              name: "_students",
              type: "tuple",
              internalType: "struct Student",
              components: [
                {
                  name: "age",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "attendanceCount",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "name",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "isRegistered",
                  type: "bool",
                  internalType: "bool",
                },
                {
                  name: "studentAddress",
                  type: "address",
                  internalType: "address",
                },
              ],
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ],

      address: ContractAddress as `0x${string}`,
      functionName: "createStudent",
      args: [
        {
          age: BigInt(age),
          attendanceCount: BigInt(0),
          name,
          isRegistered: false,
          studentAddress: address as `0x${string}`,
        },
      ],
    });
  }
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
        }, 2000);
      } else if (isFailed) {
        toast.error("Failed!", {
          duration: 2000,
          id: toastID,
        });
        setToastID("");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  }, [isConfirming, isConfirmed, isFailed]);

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        onClick={() => props.setAddForm(false)}
        className="absolute inset-0"
      ></div>
      <div className="z-10 w-1/3 space-y-8 rounded-2xl border border-black/5 bg-white p-8 text-center shadow-xl">
        <h1 className="text-4xl font-semibold">Add a Student</h1>
        <form
          onSubmit={markAttendance}
          className="flex w-full flex-col items-start gap-4"
        >
          <label className="flex w-full flex-col gap-2 text-left">
            <h2>Student Name</h2>
            <input
              type="text"
              name="name"
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#e3e3e3] px-5 py-2.5 text-lg"
            />
          </label>
          <label className="flex w-full flex-col gap-2 text-left">
            <h2>Student Age</h2>
            <input
              type="number"
              name="age"
              placeholder="Enter student Age"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full rounded-lg border border-[#e3e3e3] px-5 py-2.5 text-lg"
            />
          </label>
          <label className="flex w-full flex-col gap-2 text-left">
            <h2>Student Address</h2>
            <input
              type="text"
              name="address"
              placeholder="Enter student address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-[#e3e3e3] px-5 py-2.5 text-lg"
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending || isConfirming}
              className={`${isPending || isConfirming ? "cursor-not-allowed bg-custom-gradient-disable text-white" : "bg-custom-gradient"} mt-4 flex items-center gap-2 rounded-lg border px-8 py-2.5 shadow-sm`}
            >
              Add Student
            </button>
            <button
              onClick={() => props.setAddForm(false)}
              disabled={isPending || isConfirming}
              className={`${isPending || isConfirming ? "cursor-not-allowed bg-custom-gradient-disable" : "bg-red-500"} mt-4 flex items-center gap-2 rounded-lg border px-8 py-2.5 text-white shadow-sm`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddStudent;
