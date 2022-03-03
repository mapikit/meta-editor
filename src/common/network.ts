import axios from "axios";
const mapikitServerUrl = "http://127.0.0.1:8080/"

export const mapikitServer = axios.create({ baseURL: mapikitServerUrl })
