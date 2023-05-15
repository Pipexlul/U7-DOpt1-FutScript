# Unidad 7 - Desafio Opcional 1: Futscript

## Instrucciones

- Instalar dependencias:
  `npm i`

- Hacer una copia del archivo `.env.example` y nombrarla `.env`

- Editar el archivo `.env` y llenar los campos segun corresponda (En la mayoria de los casos, solo hay que llenar el campo `DB_PASSWORD` con su password de superuser)

- Correr el proyecto con el comando: <br/>
  `npm run start` <br/>
  <b>Esto hara que la base de datos se limpie (PERO NO SE BORRA) cada vez que se corra el comando. (Y vuelve a insertar ciertos datos requeridos)</b>

- Opcional: Correr el proyecto con el siguiente comando para evitar limpiar la base de datos: <br/>
  `npm run start:skip`

- Opcional: Correr el proyecto con el siguiente comando para forzar el delete de la base de datos (y luego todo se vuelve a crear normalmente) <br/>
  `npm run start:fullDel`

- Correr el siguiente comando para ejecutar las tests: <br/>
  `npm run test`

## Notas

- En el archivo .env, se puede modificar la cantidad de rondas para generar el salt de las claves.
- Si quieres generar un secret de JWT distinto al que se usa por defecto en este proyecto:
  - Recuerda hacer una copia de `.env.example` y llama a la copia `.env` la primera vez que corras este proyecto.
  - Corre el script `npm run genSecret`.
  - En la consola aparecerá un secret pseudo-random para llenar en el archivo `.env`, en la key `JWT_SECRET`.
  - Listo!
- La base de datos viene con dos cuentas por defecto: <br/>

  ### <b>Admin: (Tiene permisos para crear recursos usando las rutas POST)</b>

  ```
  username: admin
  password: 1234
  ```

  ### <b>User: (NO tiene permisos para crear recursos usando las rutas POST)</b>

  ```
  username: user
  password: abcd
  ```
