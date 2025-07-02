import {readFile, writeFile} from "fs/promises"
import { json } from "stream/consumers"


export const readJSON = async (filePath)=>{
    const data = await readFile(filePath, "utf-8")

    return JSON.parse(data)
}


export const writeJSON = async (filePath, data)=>{
    await writeFile(filePath, JSON.stringify(data, null, 2))
}