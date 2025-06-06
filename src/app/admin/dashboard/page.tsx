'use client';
import React, {FC, useEffect, useState} from 'react';
import EventosHoy from './admincomponents/EventosHoy';
import Solicitudes from './admincomponents/Solicitudes';
import AdminNav from './admincomponents/AdminNav';
import {TimeLogService} from "@/app/service/TimeLogService";
import {ModificationService} from "@/app/service/ModificationService";

const Dashboard: FC = () => {

    const [timeLogs, setTimeLogs] = useState([]);

    const [modifications, setModifications] = useState([]);

    async function getModifications() {
        try {
            const response = await ModificationService.getUsersModifications('pending');
            setModifications(response);
        } catch (error: any){
            alert(error.message)
        }
    }

    async function getTimeLogs() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        try {
            const data = await TimeLogService.getUsersTimeLogs(startOfDay.toISOString(), now.toISOString());
            setTimeLogs(data);
        } catch (error: any){
            alert(error.message)
        }
    }

    useEffect(() => {
        getModifications();
        getTimeLogs();
    }, [])

    return (
        <>
            <AdminNav/>
            <div className="bg-gray-100 min-h-screen flex flex-col">
                <div className="p-6 px-12">
                    <Solicitudes solicitudes={modifications} setModifications={setModifications}/>
                </div>
                <div className="p-6 px-12">
                    <EventosHoy eventos={timeLogs}/>
                </div>
            </div>
        </>
    );
};

export default Dashboard;