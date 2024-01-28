import mysql from 'mysql'
import { connection, tryToConnect, tryToDisconnect } from './MySQLconnection.js'

// conexión a la base de datos
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'appchat'
// })

// obtenemos los chats de un usuario mediante su id y retornamos la lista de elementos
function getChats(id_usuario) {
    return new Promise((resolve, reject) => {
        tryToConnect()
        connection.query(`select id_chat, id_usuario from chat_usuario where id_usuario = '${id_usuario}'`,
            (error, results, fields) => {
                if (error) {
                    return reject(error)
                }
                return resolve([...results])
            })
    })
}

// obtenemos toda la información sobre los chats
export async function loadChats(id_usuario) {
    const chats = await getChats(id_usuario);

    const loadedChats = await Promise.all(chats.map((ch) => {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT
                    m.hora, 
                    COUNT(m.visto) as vistoCount,
                    (SELECT u.username
                    FROM usuario AS u
                    INNER JOIN chat_usuario AS cu ON u.id_usuario = cu.id_usuario
                    WHERE cu.id_chat = '${ch.id_chat}' AND u.id_usuario != '${ch.id_usuario}') as username,
                    (SELECT mensaje
                    FROM mensaje
                    WHERE id_chat = '${ch.id_chat}'
                    ORDER BY mensaje DESC
                    LIMIT 1) as lastMessage
                    FROM mensaje AS m
                    WHERE m.id_chat = '${ch.id_chat}';`,
                (error, results, fields) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results[0]);
                }
            );
        });
    }));
    tryToDisconnect()
    return loadedChats;
}
