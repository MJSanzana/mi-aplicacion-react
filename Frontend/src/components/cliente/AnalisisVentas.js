import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const datosVentasPorMes = [
  { mes: 'Enero', ventas: 65 },
  { mes: 'Febrero', ventas: 59 },
  { mes: 'Marzo', ventas: 80 },
  { mes: 'Abril', ventas: 81 },
  { mes: 'Mayo', ventas: 56 },
  { mes: 'Junio', ventas: 55 },
];

const AnalisisVentas = () => {
  return (
    <div>
      <h2>Analisis de Ventas</h2>
      <div>
        <h3>Ventas por Mes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosVentasPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ventas" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalisisVentas;


