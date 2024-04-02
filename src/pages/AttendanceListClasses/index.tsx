import React, { useEffect, useState } from "react";
import "./style.scss";
import { getAttendance, getEvents, getSelectedEvents, getLastSync } from "store/db";


const worker = new Worker(new URL("../../workers/thread.worker.ts", import.meta.url));

const AttendanceList = () => {
    const [showVerified, setShowVerified] = useState<boolean>(false);
    const [showCancelled, setShowCancelled] = useState<boolean>(false);
    const [countVerified, setCountVerified] = useState<number>();
    const [countPlanned, setCountPlanned] = useState<number>();
    const [countTotal, setCountTotal] = useState<number>();
    const [classesData, setClassesData] = useState<any>({});

    const getClassesInfo = (attendanceList:any[])=>{

        let classObject:any = {};
        let plannedCount = 0
        attendanceList.forEach((attendance:any)=>{
            let className= attendance.class_name
            let isVerified = attendance.verified === 1
            let isPlanned = attendance.verified === 0

            if(classObject.hasOwnProperty(className)){
                if(isVerified){
                    classObject[className].verifiedCount += 1
                }else if(isPlanned){
                    plannedCount  = plannedCount + 1
                    classObject[className].plannedCount += 1
                }
            }else{
                if(isVerified){
                    classObject[className] = {
                        verifiedCount : 1,
                        plannedCount : 0,
                    }
                }else if(isPlanned){
                    classObject[className] = {
                        verifiedCount : 0,
                        plannedCount : 1,
                    }
                }
            }
        })
        attendanceList.forEach((attendance:any)=>{
            if(attendance.verified === 0){
                plannedCount += 1
            }
        })
        setClassesData(classObject)
    }

    useEffect(() => {
        const getEventsDB = async () => {
            const att= await getAttendance();
            const selected = await getSelectedEvents();
            const selectedInt = selected?.map((ev) => parseInt(ev));
            const tempAtt = att.filter((attendance) => selectedInt?.includes(attendance.attendance_id));
            const sortedAtt = tempAtt.sort((a, b) => a.full_name.localeCompare(b.full_name));
            const groupedById = sortedAtt.filter(
                (att, index, allAtt) => allAtt.findIndex((v2) => v2.qr_uuid === att.qr_uuid) === index,
            );
            getClassesInfo(groupedById)
            setCountTotal(groupedById.length)
            const filterVerified = groupedById.filter((att: any) => att.verified === 1);
            const filterPlanned = groupedById.filter((att: any) => att.verified == 0);
            setCountVerified(filterVerified.length);
            setCountPlanned(filterPlanned.length);
        };

        getEventsDB();
    }, [showVerified, showCancelled]);

    useEffect(() => {
        const listener = async ({ data }: { data: any }) => {
            if (data.type === "UPDATE_SUCCESS") {
                const att = await getAttendance();
                const selected = await getSelectedEvents();
                const selectedInt = selected?.map((ev) => parseInt(ev));
                const tempAtt = att.filter((attendance) => selectedInt?.includes(attendance.attendance_id));
                const sortedAtt = tempAtt.sort((a, b) => a.full_name.localeCompare(b.full_name));
                const groupedById = sortedAtt.filter(
                    (att, index, allAtt) => allAtt.findIndex((v2) => v2.qr_uuid === att.qr_uuid) === index,
                );
                getClassesInfo(groupedById)
                setCountTotal(groupedById.length)
                const filterPlanned = groupedById.filter((att: any) => att.verified == 0);
                setCountPlanned(filterPlanned.length);
            };
        };

        worker.addEventListener("message", listener);

        return () => worker.removeEventListener("message", listener);
    });

    useEffect(() => {
        const interval = setInterval(async () => {
            worker.postMessage({ type: "UPDATE" });
        }, 25000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={'attendance_list_classes_view'}>
            <div className="wrapper">
                <div className="content-wrapper header-content font-semibold">
                    <div className={'content'}>
                        <div className="title">Klase</div>
                    </div>
                    <div className={'content'}>
                        <div className="title">Plānoti</div>
                    </div>
                    <div className={'content'}>
                        <div className="title">Validēti</div>
                    </div>
                </div>
                <div className="content-wrapper header-content font-bold">
                    <div className={'content'}>
                        <div className="title">Kopā</div>
                    </div>
                    <div className={'content'}>
                        <div className="title">{countPlanned}</div>
                    </div>
                    <div className={'content'}>
                        <div className="title">{countVerified}</div>
                    </div>
                </div>
                {
                    Object.entries(classesData).map(([className,data]:any)=><div className="content-wrapper">
                        <div className="content-data">
                            {className}
                        </div>
                        <div className="content-data">
                            {data.plannedCount}
                        </div>
                        <div className="content-data">
                            {data.verifiedCount}
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default AttendanceList;
