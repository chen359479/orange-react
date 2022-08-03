import axios from "../assets/js/request";

export function systemInfo(){
    return axios.get('api/systemInfo',)
}
