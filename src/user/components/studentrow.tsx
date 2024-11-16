import React, { useEffect, useState } from "react";
import { Student } from "./default";
import { address as ContractAddress } from "../../../utils/abis/attendance.json";
import { useReadContract } from "wagmi";
import { IoCheckmarkOutline } from "react-icons/io5";
interface Props {
  ID: bigint;
  Course: string;
  setSelected: React.Dispatch<React.SetStateAction<Student[]>>;
  selected: Student[];
}

const StudentRow = (props: Props) => {
  const [student, setStudent] = useState<Student>();

  const { data: contractStudent, isLoading: sIsLoading } = useReadContract({
    address: ContractAddress as `0x${string}`,
    abi: [
      {
        type: "function",
        name: "getStudent",
        inputs: [
          {
            name: "_studentId",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [
          {
            name: "student_",
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
        stateMutability: "view",
      },
    ],
    functionName: "getStudent",
    args: [props.ID],
  });

  const { data: contractedCourseStudent, isLoading: scIsLoading } =
    useReadContract({
      address: ContractAddress as `0x${string}`,
      abi: [
        {
          type: "function",
          name: "getStudentByCourse",
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
          outputs: [
            {
              name: "student_",
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
          stateMutability: "view",
        },
      ],
      functionName: "getStudentByCourse",
      args: [props.Course as `0x${string}`, props.ID],
    });
  // Format the student data for easier consumption
  useEffect(() => {
    // console.log(contractStudent, contractedCourseStudent);

    if (props.Course && contractedCourseStudent && contractStudent) {
      setStudent({
        age: contractStudent.age,
        studentAddress: contractStudent.studentAddress,
        name: contractStudent.name,
        isRegistered: contractedCourseStudent.isRegistered,
        attendanceCount: contractedCourseStudent.isRegistered
          ? contractedCourseStudent.attendanceCount
          : 0,
      } as Student);
    } else if (contractStudent) {
      setStudent({
        age: contractStudent.age,
        attendanceCount: contractStudent.attendanceCount,
        name: contractStudent.name,
        isRegistered: false,
        studentAddress: contractStudent.studentAddress,
      } as Student);
    }
  }, [props.Course, sIsLoading, scIsLoading]);

  if (sIsLoading || scIsLoading) {
    return (
      <tr className="[&>td]:px-8 [&>td]:py-3">
        <td>
          <div className="flex aspect-square w-5 cursor-pointer items-center justify-center rounded-md border text-white">
            <IoCheckmarkOutline />
          </div>
        </td>
        <td>loading...</td>
        <td>loading...</td>
        <td>loading...</td>
        <td>loading...</td>
        {props.Course.length > 0 && <td>loading...</td>}
      </tr>
    );
  }

  return (
    <tr className="[&>td]:px-8 [&>td]:py-3">
      <td>
        <div
          onClick={() => {
            if (
              props.selected.filter((student) => props.ID == student.id)
                .length < 1
            ) {
              if (student) {
                student.id = props.ID;
                props.setSelected([...props.selected, student]);
              }
            } else {
              props.setSelected(
                props.selected.filter((student) => props.ID != student.id),
              );
            }
          }}
          className={`flex aspect-square w-5 items-center justify-center rounded-md border text-white ${props.selected.filter((student) => props.ID == student.id).length > 0 && "bg-accent"} cursor-pointer`}
        >
          <IoCheckmarkOutline />
        </div>
      </td>
      <td>{student?.name}</td>
      <td>{student?.studentAddress}</td>
      <td>{Number(student?.age) || 0}</td>
      <td>{Number(student?.attendanceCount) || 0}</td>
      {props.Course.length > 0 && (
        <td>{student?.isRegistered ? "yes" : "no"}</td>
      )}
    </tr>
  );
};

export default StudentRow;
