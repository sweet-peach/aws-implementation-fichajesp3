import React, {FC, useState} from "react";
import {UserType} from "@/app/admin/dashboard/usuarios/UserType";
import UserSerivce from "@/app/service/UserSerivce";

interface PopUpEditarProps {
    user: UserType;
    onClose: () => void;
    onEdit: (username: string, name: string, email: string, enabled: boolean) => void;
}

const PopUpEditar: FC<PopUpEditarProps> = ({user, onClose, onEdit}) => {
    const [name, setName] = useState<string>(user.attributes.name);
    const [email, setEmail] = useState<string>(user.attributes.email);
    const [password, setPassword] = useState<string>("");
    const [status, setStatus] = useState<boolean>(user.enabled);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const handleEdit = async () => {
        setLoading(true);

        try {
            await UserSerivce.updateUser(user.username, name, email, password, status);
            onClose();
            onEdit(user.username, name, email, status);
        } catch (error: any) {
            setError(error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 text-gray-600"
             style={{backgroundColor: 'rgb(0, 0, 0, 0.8)'}}>
            <div className="bg-white p-6 rounded-xl w-96 relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-4 text-2xl font-bold text-gray-600"
                >
                    ×
                </button>
                <h3 className="text-lg font-semibold mb-4 text-center">
                    Editar los datos del usuario
                </h3>
                <div className="space-y-4 mb-4">
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="px-4 py-2 border rounded-xl"
                            placeholder="Nombre del usuario"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-4 py-2 border rounded-xl"
                            placeholder="Número de teléfono"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700">Nueva contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-4 py-2 border rounded-xl"
                            placeholder="Contraseña"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700">Estado</label>
                        <select
                            value={status.toString()}
                            onChange={(e) => setStatus(e.target.value.toLowerCase() === "true")}
                            className="px-4 py-2 border rounded-xl"
                        >
                            <option value="true">Activo</option>
                            <option value="false">Bloqueado</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleEdit}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                    >
                        Editar
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded-xl hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUpEditar;