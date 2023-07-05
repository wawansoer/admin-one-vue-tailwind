import axios from 'axios';
import swal from "sweetalert2";
import router from "../router";


var getToken = () => {
    if (localStorage.getItem('userInfo') === null) {
        return ""
    }
    if (JSON.parse(localStorage.getItem('userInfo')).access_token === undefined) {
        return ""
    }
    return `Bearer ${JSON.parse(localStorage.getItem('userInfo')).access_token.token}`;
};
var contentType = (type) => {
    axiosOBJ.interceptors.request.use(config => {
        config.headers["Content-Type"] = type
        return config
    })
}

var axiosOBJ = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Authorization: getToken()
    }
});

axiosOBJ.interceptors.request.use(req => {
    req.headers.Authorization = getToken();
    return req;
});

axiosOBJ.interceptors.response.use(res => {
    return Promise.resolve(res.data)
}, error => {
    console.log(error)
    if (error.message === 'Network Error') {
        swal.fire({
            type: 'error',
            title: 'Error',
            text: error.message,
            allowOutsideClick: false,
        })

        return false
    } else {
        if (error.response.status === 401) {
            swal.fire({
                type: 'error',
                title: 'Unauthorized',
                text: 'Access denied!',
                allowOutsideClick: false,
                onClose: () => {
                    localStorage.clear()
                    router.replace({
                        name: 'Login'
                    })
                }
            })
        } else if (error.response.status === 500) {
            swal.fire({
                type: 'error',
                title: 'Error',
                text: 'Internal server error!',
                allowOutsideClick: false,
            })

            return false
        } else if (error.response.status === 400) {
            error.response.data.notify = {
                title: 'Failed',
                text: error.response.data.message,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning',
                position: 'top-right'
            }
        } else if (error.response.status === 404) {
            error.response.data.notify = {
                title: 'Failed',
                text: error.response.data.message,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning',
                position: 'top-right'
            }
        } else {
            error.response.data.notify = {
                title: 'Failed',
                text: error.response.data.message,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning',
                position: 'top-right'
            }
        }
    }
    return Promise.reject(error)
})

class AxiosCall {

    static Post(path, payload) {
        contentType('application/json')
        return axiosOBJ.post(path, JSON.stringify(payload));
    }

    static PostUpload(path, formData) {
        contentType('application/x-www-form-urlencoded')
        return axiosOBJ.post(path, formData);
    }

    static Put(path, payload) {
        contentType('application/json')
        return axiosOBJ.put(path, JSON.stringify(payload));
    }

    static PutUpload(path, formData) {
        contentType('multipart/form-data')
        return axiosOBJ.put(path, formData);
    }

    static Get(path) {
        contentType('application/json')
        return axiosOBJ.get(path)
    }

    static Delete(url) {
        contentType('application/json')
        return axiosOBJ.delete(url);
    }

    static DownloadExcel(path, payload) {
        path = path.replace(/([^:]\/)\/+/g, "$1")
        axios({
            url: path,
            method: 'GET',
            responseType: 'blob', // important
            data: payload,
            headers: {
                'Authorization': getToken()
            }
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', payload.name); //or any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    }

    static DownloadFile(reqObj, payload) {
        let path = reqObj.path.replace(/([^:]\/)\/+/g, "$1")
        let reqOptions = {
            url: path,
            method: reqObj.method,
            responseType: 'blob', // important
            headers: {
                'Authorization': getToken()
            }
        }
        if (reqObj.method.toUpperCase() == 'POST' || reqObj.method.toUpperCase() == 'PUT') {
            reqOptions.data = payload
        }
        axios(reqOptions).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', payload.name); //or any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    }

    static GetUserFromToken(path, payload) {
        return axios.create({
            headers: {
                'Authorization': 'Bearer ' + payload.authToken
            }
        }).get(path)
    }

    static UploadDataForm(path, payload) {
        contentType('multipart/form-data')
        return axiosOBJ.post(path, payload)
    }
}

export default AxiosCall
