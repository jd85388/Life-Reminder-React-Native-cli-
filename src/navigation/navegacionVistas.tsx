import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import React from "react";

//Estas son las vistas publicas.
import Login from "../Screens/Lobby/Login";
import Recuperacion from "../Screens/Lobby/Recuperacion";
import Registro from "../Screens/Lobby/Registro";

//Estas son las vistas privadas que usan el AuthProvider para permitir el acceso a la app.
import Dashboard from "../Screens/Principal/Dashboard";
import ConfiguracionPerfil from "../Screens/Cuenta/Perfil";
import Home from "../Screens/Lobby/Home";
import Medicamentos from "../Screens/Principal/Medicamentos";
import Consultas from "../Screens/Principal/Consultas";
import Recordatorios from "../Screens/Principal/RecordatoriosScreen";
import Registros from "../Screens/Principal/RegistrosScreen";


export type RutasRootStackParamList = {
    Login: undefined;
    Registro: undefined;
    Recuperacion: undefined;
    Dashboard: undefined;
    ConfiguracionPerfil: undefined;
    Home: undefined;
    Medicamentos: undefined;
    Consultas: undefined;
    Recordatorios: undefined;
    Registros: undefined;
};

const Stack = createNativeStackNavigator<RutasRootStackParamList>();

const Rutas = () =>  {
    const { user } = useAuth();

    return(
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            { user ? (
                <>
                <Stack.Screen name="Dashboard" component={Dashboard}/>
                <Stack.Screen name="ConfiguracionPerfil" component={ConfiguracionPerfil} />
                <Stack.Screen name="Medicamentos" component={Medicamentos} />
                <Stack.Screen name="Consultas" component={Consultas}/>
                <Stack.Screen name="Recordatorios" component={Recordatorios}/>
                 <Stack.Screen name="Registros"  component={Registros}/>
                </>
            ) : (
                <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Registro" component={Registro} />
                <Stack.Screen name="Recuperacion" component={Recuperacion} />
                <Stack.Screen name="Home" component={Home} />
                
                </>
            )}
        </Stack.Navigator>
    );
};

export default Rutas;