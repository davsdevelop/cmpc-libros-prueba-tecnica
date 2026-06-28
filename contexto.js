const fs = require('fs');
const path = require('path');

const DIRECTORIO_RAIZ = '.';
const ARCHIVO_SALIDA = 'contexto_proyecto.txt';

// Filtros para mantener el archivo limpio
const EXCLUIR_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.vscode', '.idea', '.temp']);
const EXCLUIR_ARCHIVOS = new Set([
    'package-lock.json', 
    'yarn.lock', 
    'pnpm-lock.yaml', 
    '.DS_Store', 
    'contexto_proyecto.txt',
    'generar_contexto.js'
]);
const EXCLUIR_EXTENSIONES = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.zip', '.tar', '.gz']);

function generarContexto(directorioActual) {
    let contenidoFinal = '';
    const archivosYCarpetas = fs.readdirSync(directorioActual);

    for (const elemento of archivosYCarpetas) {
        const rutaCompleta = path.join(directorioActual, elemento);
        const stats = fs.statSync(rutaCompleta);

        if (stats.isDirectory()) {
            // Si es carpeta y no está en la lista negra, entra recursivamente
            if (!EXCLUIR_DIRS.has(elemento)) {
                contenidoFinal += generarContexto(rutaCompleta);
            }
        } else {
            const extension = path.extname(elemento).toLowerCase();
            
            // Ignorar archivos basura o binarios
            if (EXCLUIR_ARCHIVOS.has(elemento) || EXCLUIR_EXTENSIONES.has(extension)) {
                continue;
            }

            try {
                const contenido = fs.readFileSync(rutaCompleta, 'utf8');
                
                // Pequeña validación para evitar binarios (omite si tiene caracteres nulos)
                if (contenido.indexOf('\0') !== -1) continue;

                contenidoFinal += `--- ARCHIVO: ${rutaCompleta} ---\n\`\`\`\n${contenido}\n\`\`\`\n\n\n`;
            } catch (error) {
                console.log(`⚠️ Ignorando archivo conflictivo: ${rutaCompleta}`);
            }
        }
    }
    return contenidoFinal;
}

try {
    console.log('⏳ Generando contexto, por favor espera...');
    const resultado = generarContexto(DIRECTORIO_RAIZ);
    fs.writeFileSync(ARCHIVO_SALIDA, resultado, 'utf8');
    console.log(`✅ Contexto generado exitosamente en: ${ARCHIVO_SALIDA}`);
} catch (error) {
    console.error('❌ Error al generar el contexto:', error);
}