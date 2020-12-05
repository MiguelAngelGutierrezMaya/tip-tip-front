# TIP TOP

![](https://test.tiptopenglish.co/media/icon-tiptop.png)

**Tabla de contenido**

[TOC]

#Especificación técnica de variables
##Archivos de entorno
La configuración de las variables de entorno se explican a continuación:
- **REACT_APP_PUBLIC_URL**: Ruta de la aplicación pública
- **REACT_APP_TOKEN_KEY**: Token requerido para desencriptar datos de autenticación
- **REACT_APP_PAGE_SIZE**: Valor máximo por página para los datos paginados
- **REACT_APP_API_URL**: Ruta del backend tip top

#Proceso de instalación
Ejecutar el siguiente comando (tener en cuenta el entorno en el que se encuentra, desarrollo o producción):

`$ docker-compose -f docker-compose.production.yml up -d --build`