import { Observable } from "rxjs"

export interface IBaseService<T> {
    GetAll()
    GetById()
    Insert(model: any)
    Update(model: any)
    Delete(id: number)
}
