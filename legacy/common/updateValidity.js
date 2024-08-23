const Equipo = require('../models/equipo');
const Material = require('../models/material');
const Pedido = require('../models/pedido');
const Reactivo = require('../models/reactivo');

const updateValidate = async () => {
    try {
        const today = new Date();
    
        // Encuentra todos los pedidos que aún están vigentes
        // const pedidos = await Pedido.find({ vigente: true });
        const pedidos = await Pedido.find();
    
        // Itera sobre cada pedido para verificar la antigüedad
        for (const pedido of pedidos) {
          const fechaUtilizacion = new Date(pedido.fecha_utilizacion);
          const diffInDays = Math.floor((today - fechaUtilizacion) / (1000 * 60 * 60 * 24));
    
          // Si la diferencia en días es mayor o igual a 10, marca el pedido como no vigente
          if (diffInDays >= 10) {
            pedido.vigente = false;
            await pedido.save(); // Guardar el pedido actualizado en la base de datos
          }
        }
        const materiales = await Material.find();
    
        // Itera sobre cada material para verificar la antigüedad
        for (const material of materiales) {
            // Si el material tiene el campo enUso y no está vacío
            if (material.enUso && material.enUso.length > 0) {
                // Filtrar los elementos de enUso que no superen los 10 días de antigüedad
                material.enUso = material.enUso.filter(item => {
                    const fechaUtilizacion = new Date(item.fecha_fin);
                    const diffInDays = Math.floor((today - fechaUtilizacion) / (1000 * 60 * 60 * 24));
                    return diffInDays < 10;
                });
                // Guardar el material actualizado en la base de datos
                await material.save();
            }
        }

        const equipos = await Equipo.find();
    
        // Itera sobre cada material para verificar la antigüedad
        for (const equipo of equipos) {
            // Si el equipo tiene el campo enUso y no está vacío
            if (equipo.enUso && equipo.enUso.length > 0) {
                // Filtrar los elementos de enUso que no superen los 10 días de antigüedad
                equipo.enUso = equipo.enUso.filter(item => {
                    const fechaUtilizacion = new Date(item.fecha_fin);
                    const diffInDays = Math.floor((today - fechaUtilizacion) / (1000 * 60 * 60 * 24));
                    return diffInDays < 10;
                });

                // Guardar el equipo actualizado en la base de datos
                await equipo.save();
            }
        }

        const reativos = await Reactivo.find();
    
        // Itera sobre cada material para verificar la antigüedad
        for (const reactivo of reativos) {
            // Si el reactivo tiene el campo enUso y no está vacío
            if (reactivo.enUso && reactivo.enUso.length > 0) {
                // Filtrar los elementos de enUso que no superen los 10 días de antigüedad
                reactivo.enUso = reactivo.enUso.filter(item => {
                    const fechaUtilizacion = new Date(item.fecha_fin);
                    const diffInDays = Math.floor((today - fechaUtilizacion) / (1000 * 60 * 60 * 24));
                    return diffInDays < 10;
                });

                // Guardar el reactivo actualizado en la base de datos
                await reactivo.save();
            }
        }
        console.log('Tarea programada de actualización automática completada.');
      } catch (error) {
        console.error('Error en la tarea programada:', error);
      }
}

module.exports = updateValidate;