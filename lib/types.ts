export type Personal = {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  pais: string;
  linkedin: string;
  web: string;
};

export type Experiencia = {
  id: number;
  empresa: string;
  cargo: string;
  inicio: string;
  fin: string;
  actual: boolean;
  descripcion: string;
};

export type Educacion = {
  id: number;
  institucion: string;
  titulo: string;
  inicio: string;
  fin: string;
  actual: boolean;
};

export type Idioma = {
  id: number;
  idioma: string;
  nivel: string;
};

export type Certificacion = {
  id: number;
  texto: string;
};

export type CVData = {
  personal: Personal;
  perfil: string;
  experiencias: Experiencia[];
  educacion: Educacion[];
  skills: string[];
  idiomas: Idioma[];
  certificaciones: Certificacion[];
};

export const NIVELES = ["Básico", "Intermedio", "Avanzado", "Nativo"];
