import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function ActualizarDatos() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    documento: "",
    fechaNacimiento: "1990-05-12", // Ejemplo; reemplaza con dato real
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validar = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "nombre":
        if (value.length < 2) error = "Nombre mínimo 2 caracteres";
        break;
      case "apellido":
        if (value.length < 2) error = "Apellido mínimo 2 caracteres";
        break;
      case "correo":
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = "Correo no válido";
        break;
      case "telefono":
        if (!/^\d{10}$/.test(value)) error = "Teléfono de 10 dígitos";
        break;
      case "documento":
        if (value.length < 5) error = "Documento demasiado corto";
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validar(name, value);
  };

  const InputCampo = ({
    name,
    placeholder,
    icon,
    editable = true,
  }: {
    name: keyof typeof form;
    placeholder: string;
    icon: string;
    editable?: boolean;
  }) => (
    <View style={{ marginBottom: 16 }}>
      <View style={styles.inputContainer}>
        <Icon name={icon} size={20} color="#555" style={{ marginRight: 8 }} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={styles.input}
          value={form[name]}
          editable={editable}
          onChangeText={(text) => editable && handleChange(name, text)}
        />
        {form[name] && !errors[name] && editable && (
          <Icon name="checkmark-circle" size={20} color="green" />
        )}
      </View>
      {errors[name] && <Text style={styles.error}>{errors[name]}</Text>}
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/imagen/fondo2.png")}
      style={styles.bg}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Actualizar Datos</Text>

        <InputCampo name="nombre" placeholder="Nombre" icon="person-outline" />
        <InputCampo name="apellido" placeholder="Apellido" icon="people-outline" />
        <InputCampo name="correo" placeholder="Correo" icon="mail-outline" />
        <InputCampo name="telefono" placeholder="Teléfono" icon="call-outline" />
        <InputCampo name="documento" placeholder="Documento" icon="document-text-outline" />

        {/* Campo visible pero no editable */}
        <InputCampo
          name="fechaNacimiento"
          placeholder="Fecha de nacimiento"
          icon="calendar-outline"
          editable={false}
        />

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>

        {/* Botón Cancelar */}
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: "90%",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  error: {
    marginTop: 4,
    fontSize: 14,
    color: "black",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 20,
    width: "90%",
  },
  buttonText: {
    color: "#1e3c72",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#333",
  },
});
