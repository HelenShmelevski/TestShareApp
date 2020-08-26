import axios from "axios";

export class ShareApiProvider {
    api = axios.create({
        baseURL: `http://localhost:8080/`
    });

    constructor() {
    }

    async get() {
        return this.api.get("/share/get");
    }

    async update(newData) {
        return this.api.patch("/share/update/" + newData.id, newData);
    }

    async create(newData) {
        return this.api.post("/share/create", newData);
    }

    async delete(oldData) {
        return this.api.delete("/share/delete/" + oldData.id);
    }


}
